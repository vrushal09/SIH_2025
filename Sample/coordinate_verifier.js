// Gujarat Transit Station Coordinate Verification Tool
// This script helps verify and validate station coordinates against multiple sources

class CoordinateVerifier {
    constructor() {
        this.googleMapsAPI = 'https://maps.googleapis.com/maps/api/geocode/json';
        this.verificationResults = new Map();
        this.suspiciousCoordinates = [];
    }

    // Verify coordinates against Google Maps Places API
    async verifyWithGooglePlaces(stationName, cityName, currentCoords) {
        const query = `${stationName} ${cityName} Gujarat India`;
        const response = await fetch(`${this.googleMapsAPI}?address=${encodeURIComponent(query)}&key=YOUR_API_KEY`);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            const googleCoords = data.results[0].geometry.location;
            const distance = this.calculateDistance(currentCoords, googleCoords);
            
            return {
                verified: distance < 2000, // Within 2km is considered accurate
                googleCoords,
                currentCoords,
                distance,
                accuracy: data.results[0].geometry.location_type
            };
        }
        
        return { verified: false, error: data.status };
    }

    // Calculate distance between two coordinates in meters
    calculateDistance(coord1, coord2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = this.toRad(coord2.lat - coord1.lat);
        const dLng = this.toRad(coord2.lng - coord1.lng);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.toRad(coord1.lat)) * Math.cos(this.toRad(coord2.lat)) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toRad(deg) {
        return deg * (Math.PI / 180);
    }

    // Verify all coordinates in the database
    async verifyAllCoordinates() {
        const results = [];
        
        // Ahmedabad stations
        const amdStations = {
            'Lal Darwaja': { lat: 23.0225, lng: 72.5847 },
            'Maninagar': { lat: 23.0158, lng: 72.6064 },
            'ISKCON': { lat: 23.0297, lng: 72.5547 },
            'Sabarmati': { lat: 23.0736, lng: 72.5806 },
            'Gujarat University': { lat: 23.0644, lng: 72.5464 }
        };

        for (const [station, coords] of Object.entries(amdStations)) {
            const verification = await this.verifyWithGooglePlaces(station, 'Ahmedabad', coords);
            results.push({
                station,
                city: 'Ahmedabad',
                ...verification
            });
        }

        return results;
    }

    // Generate verification report
    generateReport(verificationResults) {
        const report = {
            totalStations: verificationResults.length,
            verified: verificationResults.filter(r => r.verified).length,
            suspicious: verificationResults.filter(r => !r.verified).length,
            averageDistance: 0,
            recommendations: []
        };

        const distances = verificationResults
            .filter(r => r.distance)
            .map(r => r.distance);
        
        if (distances.length > 0) {
            report.averageDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
        }

        // Generate recommendations
        verificationResults.forEach(result => {
            if (!result.verified) {
                report.recommendations.push(
                    `Consider updating coordinates for ${result.station} in ${result.city} - Distance: ${Math.round(result.distance)}m`
                );
            }
        });

        return report;
    }

    // Check coordinate precision and format
    validateCoordinateFormat(coordinates) {
        const issues = [];
        
        for (const [name, coord] of Object.entries(coordinates)) {
            // Check precision (should have at least 4 decimal places for good accuracy)
            const latPrecision = (coord.lat.toString().split('.')[1] || '').length;
            const lngPrecision = (coord.lng.toString().split('.')[1] || '').length;
            
            if (latPrecision < 4 || lngPrecision < 4) {
                issues.push(`${name}: Low precision coordinates (${latPrecision}, ${lngPrecision} decimal places)`);
            }
            
            // Check if coordinates are within Gujarat bounds
            if (coord.lat < 20.0 || coord.lat > 25.0 || coord.lng < 68.0 || coord.lng > 75.0) {
                issues.push(`${name}: Coordinates outside Gujarat bounds`);
            }
            
            // Check for suspicious patterns (e.g., too many repeating digits)
            const latStr = coord.lat.toString();
            const lngStr = coord.lng.toString();
            
            if (this.hasRepeatingPattern(latStr) || this.hasRepeatingPattern(lngStr)) {
                issues.push(`${name}: Suspicious coordinate pattern detected`);
            }
        }
        
        return issues;
    }

    hasRepeatingPattern(str) {
        // Check for more than 2 consecutive identical digits
        return /(\d)\1{2,}/.test(str);
    }

    // Real-time coordinate validation during geocoding
    validateGecodingResult(result, stationName, cityCode) {
        const validation = {
            isValid: true,
            warnings: [],
            suggestions: []
        };

        // Check if result is within expected city bounds
        const cityBounds = {
            'amd': { minLat: 22.8, maxLat: 23.3, minLng: 72.3, maxLng: 72.8 },
            'rjkt': { minLat: 22.2, maxLat: 22.4, minLng: 70.6, maxLng: 70.9 },
            'srt': { minLat: 21.0, maxLat: 21.4, minLng: 72.6, maxLng: 73.0 }
        };

        const bounds = cityBounds[cityCode];
        if (bounds) {
            if (result.lat < bounds.minLat || result.lat > bounds.maxLat ||
                result.lng < bounds.minLng || result.lng > bounds.maxLng) {
                validation.warnings.push('Coordinates outside expected city bounds');
                validation.suggestions.push('Verify station name spelling and city');
            }
        }

        // Check geocoding accuracy
        if (result.accuracy && result.accuracy !== 'ROOFTOP') {
            validation.warnings.push(`Geocoding accuracy: ${result.accuracy}`);
            if (result.accuracy === 'APPROXIMATE') {
                validation.suggestions.push('Consider manual verification for better accuracy');
            }
        }

        return validation;
    }

    // Export coordinates in different formats
    exportCoordinates(format = 'json') {
        const coordinates = {
            ahmedabad: {
                'Lal Darwaja': { lat: 23.0225, lng: 72.5847 },
                'Maninagar': { lat: 23.0158, lng: 72.6064 },
                // ... more coordinates
            }
            // ... other cities
        };

        switch (format) {
            case 'csv':
                return this.toCsv(coordinates);
            case 'kml':
                return this.toKml(coordinates);
            case 'geojson':
                return this.toGeoJson(coordinates);
            default:
                return JSON.stringify(coordinates, null, 2);
        }
    }

    toCsv(coordinates) {
        let csv = 'City,Station,Latitude,Longitude,Source\n';
        Object.entries(coordinates).forEach(([city, stations]) => {
            Object.entries(stations).forEach(([station, coord]) => {
                csv += `${city},${station},${coord.lat},${coord.lng},Manual\n`;
            });
        });
        return csv;
    }

    toGeoJson(coordinates) {
        const features = [];
        Object.entries(coordinates).forEach(([city, stations]) => {
            Object.entries(stations).forEach(([station, coord]) => {
                features.push({
                    type: 'Feature',
                    properties: {
                        name: station,
                        city: city,
                        type: 'transit_station'
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [coord.lng, coord.lat]
                    }
                });
            });
        });

        return {
            type: 'FeatureCollection',
            features: features
        };
    }
}

// Usage example
const verifier = new CoordinateVerifier();

// To verify coordinates during development
async function runVerification() {
    console.log('Starting coordinate verification...');
    const results = await verifier.verifyAllCoordinates();
    const report = verifier.generateReport(results);
    
    console.log('Verification Report:', report);
    console.log('Export as CSV:', verifier.exportCoordinates('csv'));
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CoordinateVerifier };
} else if (typeof window !== 'undefined') {
    window.CoordinateVerifier = CoordinateVerifier;
}