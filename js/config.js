/**
 * Config & Environment Settings
 * OpenWeatherMap API Configuration and Fallback Mock Data
 */

const getEnvKey = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENWEATHER_API_KEY) {
      return import.meta.env.VITE_OPENWEATHER_API_KEY;
    }
  } catch (e) {
    // Ignore error
  }
  return window.ENV?.VITE_OPENWEATHER_API_KEY || window.ENV?.OPENWEATHER_API_KEY || '';
};

export const CONFIG = {
  CITY: 'Seoul',
  COUNTRY_CODE: 'KR',
  DEFAULT_TEMP: 26,
  DEFAULT_WEATHER: 'Clear',
  
  OPENWEATHER_API_KEY: getEnvKey()
};

export const MOCK_DATA = {
  WEATHER: {
    city: '서울 (Seoul)',
    temp: 27,
    feelsLike: 29,
    condition: 'Clear',
    humidity: 55,
    description: '맑음 - 야외 활동하기 좋은 날씨',
    icon: '☀️'
  }
};
