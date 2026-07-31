/**
 * Header Component
 * Renders digital clock, location, and current weather widget
 */

export class HeaderComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.clockInterval = null;
  }

  render(weatherData) {
    if (!this.container) return;

    this.container.innerHTML = `
      <header class="header-container glass-panel">
        <!-- Digital Clock & City -->
        <div>
          <div class="clock-display" id="mirrorClock">00:00:00</div>
          <div style="font-size: 0.875rem; color: var(--color-text-muted); margin-top: 0.25rem;">
            📍 <span id="mirrorCity">${weatherData ? weatherData.city : '위치 로딩 중...'}</span>
          </div>
        </div>

        <!-- Weather Widget -->
        <div class="weather-widget">
          <div class="weather-icon-badge" id="mirrorWeatherIcon">
            ${weatherData ? weatherData.icon : '☀️'}
          </div>
          <div>
            <div class="weather-temp" id="mirrorTemp">
              ${weatherData ? `${weatherData.temp}°C` : '--°C'}
            </div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono);">
              체감: <span id="mirrorFeelsLike">${weatherData ? weatherData.feelsLike : '--'}</span>°C | 
              습도: <span id="mirrorHumidity">${weatherData ? weatherData.humidity : '--'}</span>%
            </div>
          </div>
        </div>
      </header>
    `;

    this.startClock();
  }

  updateWeather(weatherData) {
    const cityEl = document.getElementById('mirrorCity');
    const iconEl = document.getElementById('mirrorWeatherIcon');
    const tempEl = document.getElementById('mirrorTemp');
    const feelsEl = document.getElementById('mirrorFeelsLike');
    const humidityEl = document.getElementById('mirrorHumidity');

    if (cityEl) cityEl.textContent = weatherData.city;
    if (iconEl) iconEl.textContent = weatherData.icon;
    if (tempEl) tempEl.textContent = `${weatherData.temp}°C`;
    if (feelsEl) feelsEl.textContent = weatherData.feelsLike;
    if (humidityEl) humidityEl.textContent = weatherData.humidity;
  }

  startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);

    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const clockEl = document.getElementById('mirrorClock');
      if (clockEl) {
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
      }
    };

    updateTime();
    this.clockInterval = setInterval(updateTime, 1000);
  }

  destroy() {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }
}
