/**
 * Config & Environment Settings
 * Resolves OpenWeatherMap API Key & Gemini API Key from Vite import.meta.env, window.ENV, or local .env
 */

export async function getOpenWeatherApiKey() {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_OPENWEATHER_API_KEY) {
      return import.meta.env.VITE_OPENWEATHER_API_KEY;
    }
  } catch (e) {}

  if (window.ENV?.VITE_OPENWEATHER_API_KEY) return window.ENV.VITE_OPENWEATHER_API_KEY;
  if (window.ENV?.OPENWEATHER_API_KEY) return window.ENV.OPENWEATHER_API_KEY;

  try {
    const res = await fetch('.env');
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/VITE_OPENWEATHER_API_KEY\s*=\s*(.*)/);
      if (match && match[1]) return match[1].trim();
    }
  } catch (e) {}

  return '';
}

export async function getGeminiApiKey() {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {}

  if (window.ENV?.VITE_GEMINI_API_KEY) return window.ENV.VITE_GEMINI_API_KEY;
  if (window.ENV?.GEMINI_API_KEY) return window.ENV.GEMINI_API_KEY;

  try {
    const res = await fetch('.env');
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/VITE_GEMINI_API_KEY\s*=\s*(.*)/);
      if (match && match[1]) return match[1].trim();
    }
  } catch (e) {}

  return '';
}

export const CONFIG = {
  CITY: 'Seoul',
  COUNTRY_CODE: 'KR'
};
