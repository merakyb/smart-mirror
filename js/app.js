/**
 * Smart Mirror Assistant - Step 1 Main Application Entry
 * Fetches OpenWeatherMap API data based on current Geolocation or fallback city
 * and renders Header, Dot Matrix Indicator, and Weather Summary Report.
 */

import { fetchCurrentWeather, getUserCoordinates } from './services/weatherService.js';
import { HeaderComponent } from './components/Header.js';
import { VirtualIndicatorsComponent } from './components/VirtualIndicators.js';

class SmartMirrorApp {
  constructor() {
    this.weatherData = null;
    this.coords = null;

    // Instantiate Step 1 Components
    this.header = new HeaderComponent('headerSlot');
    this.indicators = new VirtualIndicatorsComponent('virtualIndicatorsSlot');
  }

  async init() {
    console.log('[SmartMirrorApp] Initializing Step 1: Geolocation Weather Dashboard...');

    // 1. Initial Render with Placeholders
    this.header.render(null);
    this.indicators.render('Clear');

    // 2. Fetch User Geolocation Coordinates (if permission granted)
    this.coords = await getUserCoordinates();
    if (this.coords) {
      console.log(`[SmartMirrorApp] Detected User Coordinates: Lat ${this.coords.lat}, Lon ${this.coords.lon}`);
    } else {
      console.log('[SmartMirrorApp] Using Fallback City Location (Seoul)');
    }

    // 3. Fetch Weather Data for Coordinates
    await this.refreshWeather();

    // 4. Bind Refresh Button Event Handler
    const btnRefresh = document.getElementById('btnRefreshLocation');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', async () => {
        btnRefresh.disabled = true;
        btnRefresh.textContent = '🔄 위치 수신 중...';
        this.coords = await getUserCoordinates();
        await this.refreshWeather();
        btnRefresh.disabled = false;
        btnRefresh.textContent = '🎯 내 현재 위치 날씨 감지';
      });
    }
  }

  async refreshWeather() {
    this.weatherData = await fetchCurrentWeather(this.coords);
    
    // Update Header & Dot Matrix Indicators
    this.header.updateWeather(this.weatherData);
    this.indicators.updateDotMatrix(this.weatherData.condition);

    // Update Main Weather Detail Cards
    this.updateWeatherDetailCards(this.weatherData);
  }

  updateWeatherDetailCards(data) {
    if (!data) return;

    const summaryEl = document.getElementById('weatherSummaryText');
    const tempEl = document.getElementById('detailTemp');
    const feelsEl = document.getElementById('detailFeels');
    const humidityEl = document.getElementById('detailHumidity');
    const cityEl = document.getElementById('detailCityName');
    const updatedTimeEl = document.getElementById('lastUpdatedTime');

    if (summaryEl) {
      summaryEl.innerHTML = `
        현재 <strong>${data.city}</strong>의 날씨는 <strong>${data.icon} ${data.description}</strong> 상태입니다. 
        기온은 <strong>${data.temp}°C</strong>이며 체감 온도는 <strong>${data.feelsLike}°C</strong>로 느껴집니다.
      `;
    }

    if (tempEl) tempEl.textContent = `${data.temp}°C`;
    if (feelsEl) feelsEl.textContent = `${data.feelsLike}°C`;
    if (humidityEl) humidityEl.textContent = `${data.humidity}%`;
    if (cityEl) cityEl.textContent = data.city;

    if (updatedTimeEl) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      updatedTimeEl.textContent = `최근 업데이트: ${timeStr}`;
    }
  }
}

// Initialize Application on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new SmartMirrorApp();
  app.init();
});
