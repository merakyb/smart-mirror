/**
 * Header Component (Step 1)
 * Renders real-time digital clock, location, and OpenWeatherMap weather display
 */

export class HeaderComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.clockInterval = null;
  }

  render(weatherData) {
    if (!this.container) return;

    const data = weatherData || {
      city: '서울 (대한민국)',
      temp: '--',
      feelsLike: '--',
      condition: 'Clear',
      humidity: '--',
      description: '날씨 정보를 불러오는 중...',
      icon: '🌤️'
    };

    this.container.innerHTML = `
      <header class="header-container glass-panel animate-fade-in">
        <!-- Left: Digital Clock & City -->
        <div>
          <div class="clock-display" id="mirrorClock">00:00:00</div>
          <div style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>📍</span> <span id="mirrorCity">${data.city}</span>
          </div>
        </div>

        <!-- Right: OpenWeatherMap Weather Display -->
        <div class="weather-widget">
          <div class="weather-icon-badge" id="mirrorWeatherIcon">
            ${data.icon}
          </div>
          <div>
            <div style="display: flex; align-items: baseline; gap: 0.75rem;">
              <span class="weather-temp" id="mirrorTemp">${data.temp}°C</span>
              <span class="pill-badge badge-good" id="mirrorWeatherDesc" style="font-size: 0.8rem;">
                ${data.description}
              </span>
            </div>
            <div style="font-size: 0.8rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-top: 0.25rem;">
              체감 온도: <span id="mirrorFeelsLike" style="color: var(--color-primary);">${data.feelsLike}</span>°C | 
              습도: <span id="mirrorHumidity" style="color: var(--color-secondary);">${data.humidity}</span>%
            </div>
          </div>
        </div>
      </header>
    `;

    this.startClock();
  }

  updateWeather(data) {
    if (!data) return;
    const cityEl = document.getElementById('mirrorCity');
    const iconEl = document.getElementById('mirrorWeatherIcon');
    const tempEl = document.getElementById('mirrorTemp');
    const descEl = document.getElementById('mirrorWeatherDesc');
    const feelsEl = document.getElementById('mirrorFeelsLike');
    const humidityEl = document.getElementById('mirrorHumidity');

    if (cityEl) cityEl.textContent = data.city;
    if (iconEl) iconEl.textContent = data.icon;
    if (tempEl) tempEl.textContent = `${data.temp}°C`;
    if (descEl) descEl.textContent = data.description;
    if (feelsEl) feelsEl.textContent = data.feelsLike;
    if (humidityEl) humidityEl.textContent = data.humidity;
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
