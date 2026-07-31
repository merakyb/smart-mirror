/**
 * Weather Service
 * Fetches current weather data from OpenWeatherMap API or returns fallback mock data
 */

import { CONFIG, MOCK_DATA } from '../config.js';

export async function fetchCurrentWeather() {
  if (!CONFIG.OPENWEATHER_API_KEY) {
    console.log('[WeatherService] API Key missing. Using Fallback Mock Weather Data.');
    return MOCK_DATA.WEATHER;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CONFIG.CITY},${CONFIG.COUNTRY_CODE}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=kr`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather API Error: ${response.statusText}`);
    
    const data = await response.json();
    const weatherCondition = data.weather[0].main; // Clear, Rain, Clouds, Snow
    let icon = '☀️';
    if (weatherCondition === 'Rain') icon = '🌧️';
    else if (weatherCondition === 'Clouds') icon = '☁️';
    else if (weatherCondition === 'Snow') icon = '❄️';
    else if (weatherCondition === 'Thunderstorm') icon = '⛈️';

    return {
      city: `${data.name} (${CONFIG.COUNTRY_CODE})`,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: weatherCondition,
      humidity: data.main.humidity,
      description: `${data.weather[0].description}`,
      icon: icon
    };
  } catch (error) {
    console.warn('[WeatherService] Failed to fetch weather:', error);
    return MOCK_DATA.WEATHER;
  }
}
