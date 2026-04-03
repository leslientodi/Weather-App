import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);

  const handleInputChange = (event) => {
    setLocation(event.target.value);
  };

  const fetchWeatherData = async () => {
    const apiKey = "b02171b95d6fe06d1c07da04da6a707a";
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`
      );
      console.log(response.data); // Log the response

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0]; // Get coordinates from the first result
        fetchWeatherDataByCoords(lat, lon); // Fetch weather data using these coordinates
      } else {
        console.error("No results found for the location.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchWeatherDataByCoords = async (lat, lon) => {
    const apiKey = "b02171b95d6fe06d1c07da04da6a707a";
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${apiKey}`
      );
      setWeather(response.data);
      console.log(response.data); // Log the forecast data
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  return (
    <div className="App">
      <h1>Weather App</h1>
      <input
        type="text"
        value={location}
        onChange={handleInputChange}
        placeholder="Enter location"
      />
      <button onClick={fetchWeatherData}>Get Weather</button>
      <button onClick={getCurrentLocation}>Get Current Location Weather</button>
      {weather && weather.current && (
        <div>
          <h2>{weather.current.weather[0].description}</h2>
          <p>Temperature: {Math.round(weather.current.temp - 273.15)}°C</p>
          <p>Humidity: {weather.current.humidity}%</p>
        </div>
      )}
      {weather && weather.daily && (
        <div className="forecast">
          <h3>8-Day Forecast:</h3>
          {weather.daily.map((day, index) => (
            <div key={index}>
              <h4>{new Date(day.dt * 1000).toLocaleDateString()}</h4>
              <p>Temperature: {Math.round(day.temp.day - 273.15)}°C</p>
              <p>Weather: {day.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
