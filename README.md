# 💫 AI-Enhanced Weather Visualization: Interactive Global & Brazilian Forecast App

This weather application delivers an interactive weather experience with a special focus on Brazilian locations. **By default, the app uses simulated weather data for testing and demonstration purposes**, but we have now provided the **possibility to switch to real-time weather data** from the **OpenWeatherMap API**.

## 🌐 Technologies Used:

![Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) 
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 
![shadcn/ui](https://img.shields.io/badge/shadcn.ui-%2302569B.svg?style=for-the-badge&logo=shadcn&logoColor=white) 
![Canvas API](https://img.shields.io/badge/Canvas%20API-%23E10098.svg?style=for-the-badge&logo=html5&logoColor=white) 
![i18n](https://img.shields.io/badge/Internationalization-%23FF5733.svg?style=for-the-badge&logo=language&logoColor=white)

- **Next.js**: The application is built on Next.js, providing a robust React framework with server-side rendering capabilities for optimal performance.
- **React**: Used as the core UI library for building interactive components and managing state throughout the application.
- **Tailwind CSS**: Implemented for styling with a utility-first approach, enabling rapid UI development with consistent design patterns.
- **shadcn/ui**: Utilized for high-quality, accessible UI components that integrate seamlessly with Tailwind CSS.
- **AI-Powered Location Search**: The application features an intelligent search system that understands regional terms, alternative location names, and geographic categories, making it especially powerful for Brazilian locations.
- **Canvas API**: Used to create the various data visualization layers including temperature, precipitation, wind, and pressure.
- **Internationalization**: Full support for multiple languages including Portuguese (Brazil), English, Spanish, and French with dynamic text and date formatting.
- **Interactive Data Visualization**: Weather conditions are presented through dynamic charts, interactive maps, and visual indicators for metrics like air quality, UV index, and precipitation chance.
- **Weather Animations**: Custom-built weather animations bring forecasts to life with visual representations of different weather conditions.
- **Responsive Design**: The application is fully responsive, providing an optimal experience across mobile, tablet, and desktop devices.

## 📊 Features & Highlights:

- **Global and Brazilian Weather Forecasts**: Accurate forecasts for any location globally, with a special focus on Brazilian cities.
- **Interactive UI**: Dive into detailed weather data visualizations like temperature, wind speed, and precipitation through user-friendly charts and maps.
- **AI-Powered Search**: The intelligent search feature enhances usability by understanding Brazilian city names, regions, and local terms.
- **Responsive and Accessible Design**: Experience the app seamlessly across all devices and browsers, with a focus on accessibility and responsiveness.
- **Weather Animations**: Realistic animations for weather conditions enhance the forecast experience, making it both informative and engaging.

### **💡 From Random Data to Real Data:**

Until recently, this weather application **used simulated (random) data** for testing and demonstration purposes. This allowed us to showcase how the app works without needing a live connection to weather services. **However, we have now introduced the ability to switch to real-time weather data**, ensuring **accurate and up-to-date weather forecasts** for any location.

### **🔧 How to Switch to Real Weather Data:**

To switch to real-time data, you can now update the component **`realprevision.tsx`** in the `/app` folder. This component fetches **real weather data** from the **OpenWeatherMap API**, providing accurate forecasts based on latitude and longitude.

- **How It Works:**
    - **Simulated Data**: By default, weather data is simulated, which makes the app fast and perfect for testing.
    - **Real-Time Data**: You can switch to real-time weather by configuring your OpenWeatherMap API key in **`realprevision.tsx`**. Once set up, the app will fetch real weather data from the OpenWeatherMap API for more accurate and live forecasts.

## 🛠️ Getting Started:

To get a local copy of the project up and running on your machine, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Hoad3r/Weather-Forecast-Pro.git
2. Install the dependencies:
   ```bash
   cd weather-app
   npm install
3. Run the application locally:
   ```bash
   npm run dev
4. In case of error installing the dependencies try:
   ```bash
   npm install --legacy-peer-deps

4. Open your browser and navigate to http://localhost:3000

