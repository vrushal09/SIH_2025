# Real-Time Public Transport Tracking for Small Cities 🚌📍

## A Submission for Smart India Hackathon 2025 🇮🇳🏆

This project is developed by **Team: The Helios** ☀️ for the Smart India Hackathon 2025.

-   **Team Name:** The Helios
-   **Team ID:** 54318
-   **Problem Statement ID:** SIH25013
-   **Problem Statement Title:** Real-Time Public Transport Tracking for Small Cities
-   **Theme:** Transportation & Logistics
-   **Category:** Software

---

## 1. Problem Statement 🤔

Traveling in a city using public transit is often a hassle with scattered maps, delays, and no unified system. Our solution is a mobile app that simplifies the transit experience by bringing everything into one platform.

## 2. Proposed Solution 💡

Our solution is a mobile application that builds a live transportation network by integrating official route and stop data with real-time GPS from the driver's phone. It offers a trip planner, traffic-aware ETAs, and smart disruption alerts for smoother travel.

The goal is to reduce user waiting times, improve reliability, generate data for better transport planning, enhance last-mile connectivity, and build commuter trust.

### Unique Features ⭐

Our solution is tailored for India with several unique features:
* 🏙️ **Tier-2/3 City Focus:** Designed for the evolving digital infrastructure of smaller Indian cities.
* 🗣️ **Multilingual Support:** To ensure accessibility for a diverse user base.
* 🎮 **Gamified Crowdsourcing:** An eco-friendly rewards system for user-reported data, such as crowd levels on buses.
* 💳 **Future UPI Integration:** Planned integration for seamless payments.
* 📱 **Zero-Hardware Approach:** The system leverages the driver's own smartphone for GPS tracking.

## 3. User Flow 🔄

The application consists of three primary user flows: Admin, Driver, and the Commuter (User).

1.  **👨‍💼 Admin Flow:** The admin is responsible for managing drivers and assigning them to specific buses and routes.
2.  **🧑‍✈️ Driver Flow:** The driver uses a dedicated interface to log in to their assigned route. The app then tracks the bus's live location via the driver's phone, allowing the system to analyze delays and other metrics.
3.  **🧍‍♀️ User Flow:** The commuter enters their destination to see all available public transit options. A smart workflow helps them select the best route based on factors like cost, speed, and delays. They can then track their transport in real-time and access additional info like timetables.

## 4. Technical Approach 💻

We will use a modern and scalable tech stack to build the application.

-   🎨 **UI/UX:** Figma
-   ⚛️ **Frontend:** React Native (Expo), Native Wind
-   🔥 **Backend & Database:** Firebase, Python, PostgreSQL + PostGIS
-   📊 **Data Sources:** Official websites of Ahmedabad's transport services (AMTS, BRTS, GMRC)

## 5. Feasibility and Viability ✅

### Challenges & Risks ⚠️
* Lack of reliable and accurate open-source data for public transport.
* Fragmented ticketing systems across different transport agencies.
* Potential hurdles in user adoption, especially in Tier-2/3 cities.

### Mitigation Strategies 🛡️
* Live bus location will be tracked directly through the driver's phone.
* Gamification and reward systems will be used to drive crowdsourcing participation.

## 6. Impact and Benefits 🚀

### Impact 🎯
* **For Commuters:** Provides reliable schedules, live tracking, and reduced waiting times.
* **For Operators:** Offers analytics on punctuality, passenger crowding, and route demand.
* **For Government:** Generates operational data for planning and policy-making.
* **Overall:** Builds public trust in transit systems and helps boost ridership.

### Benefits 🌱
* **Social:** Creates a safer, more accessible, and inclusive travel experience.
* **Economic:** Saves commuters time, increases productivity, and offers more revenue opportunities.
* **Environmental:** Helps reduce traffic congestion and lower emissions.
* **Governance:** Enables data-driven policies and more efficient urban planning.

## 7. Research and References 📚

Our approach is informed by existing systems and technologies, including:
* Global multimodal transit apps like Moovit and City Mapper.
* The Indian government's "One Nation, One Card" initiative (NCMC).
* Open-data mapping frameworks like OpenStreetMap and Mapbox APIs.
* Indian mapping services like Mappls.
* Local transit data prototypes available on Github.