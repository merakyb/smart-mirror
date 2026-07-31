/**
 * Config & Environment Settings
 * Resolves OpenWeatherMap API Key from Vite import.meta.env, window.ENV, or local .env
 */

export async function getOpenWeatherApiKey() {
  // 1. Vite / Vercel Environment Variable
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_OPENWEATHER_API_KEY) {
      return import.meta.env.VITE_OPENWEATHER_API_KEY;
    }
  } catch (e) {}

  // 2. Global window.ENV (loaded from local env.js)
  if (window.ENV?.VITE_OPENWEATHER_API_KEY) {
    return window.ENV.VITE_OPENWEATHER_API_KEY;
  }

  if (window.ENV?.OPENWEATHER_API_KEY) {
    return window.ENV.OPENWEATHER_API_KEY;
  }

  // 3. Dynamic fetch of .env for static local servers
  try {
    const res = await fetch('.env');
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/VITE_OPENWEATHER_API_KEY\s*=\s*(.*)/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch (e) {}

  return '';
}

export const CONFIG = {
  CITY: 'Seoul',
  COUNTRY_CODE: 'KR'
};
