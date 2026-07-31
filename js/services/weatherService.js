/**
 * Weather Service
 * Fetches real-time weather from OpenWeatherMap API
 */

import { CONFIG, MOCK_DATA } from '../config.js';

export async function fetchCurrentWeather(city = CONFIG.CITY) {
  const apiKey = CONFIG.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.warn('[WeatherService] API Key missing in environment variables. Using Mock Data.');
    return MOCK_DATA.WEATHER;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${CONFIG.COUNTRY_CODE}&appid=${apiKey}&units=metric&lang=kr`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error status: ${response.status}`);
    }

    const data = await response.json();
    const weatherCondition = data.weather[0].main; // Clear, Rain, Clouds, Snow, etc.
    
    let icon = '☀️';
    if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') icon = '🌧️';
    else if (weatherCondition === 'Clouds') icon = '☁️';
    else if (weatherCondition === 'Snow') icon = '❄️';
    else if (weatherCondition === 'Thunderstorm') icon = '⛈️';
    else if (weatherCondition === 'Mist' || weatherCondition === 'Fog') icon = '🌫️';

    return {
      city: `${data.name} (대한민국)`,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: weatherCondition,
      humidity: data.main.humidity,
      description: data.weather[0].description || '맑음',
      icon: icon
    };
  } catch (error) {
    console.error('[WeatherService] Failed to fetch live weather:', error);
    return MOCK_DATA.WEATHER;
  }
}
