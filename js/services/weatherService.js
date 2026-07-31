/**
 * Weather Service
 * Fetches real-time weather from OpenWeatherMap API using async API key resolution
 */

import { CONFIG, getOpenWeatherApiKey } from '../config.js';

export async function fetchCurrentWeather(city = CONFIG.CITY) {
  const apiKey = await getOpenWeatherApiKey();

  if (!apiKey) {
    console.warn('[WeatherService] API Key missing in environment variables.');
    return {
      city: '서울 (API Key 필요)',
      temp: '--',
      feelsLike: '--',
      condition: 'Clear',
      humidity: '--',
      description: 'API Key를 불러올 수 없습니다. .env 또는 env.js 설정을 확인하세요.',
      icon: '⚠️'
    };
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
    return {
      city: '서울 (대한민국)',
      temp: '--',
      feelsLike: '--',
      condition: 'Clear',
      humidity: '--',
      description: `날씨 조회 실패: ${error.message}`,
      icon: '❌'
    };
  }
}
