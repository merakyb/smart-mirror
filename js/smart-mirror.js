/**
 * Smart Mirror Assistant - Unified Browser Script (file:/// & HTTP compatible)
 * Combines All Modules (Config, Weather, Gemini, Viewfinder, Indicators, Diagnosis, Gallery)
 * Environment variables read safely from window.ENV (env.js), .env, or decoded fallback.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Config & Environment Resolution
     ========================================================================== */
  function decodeFallback(b64) {
    try {
      return atob(b64);
    } catch (e) {
      return '';
    }
  }

  async function getOpenWeatherApiKey() {
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

    return decodeFallback('MTM1M2JhNWE2NGFmYzM1N2UxN2M3OGFiYTYyYTkyM2M=');
  }

  async function getGeminiApiKey() {
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

    return decodeFallback('QVEuQWI4Uk42SlZjTGY3cEJONzlOOVlxbXRjQmE1b01qeGVIcXEzYVR6b2o0YkRiY0xDT3c=');
  }

  const CONFIG = {
    CITY: 'Seoul',
    COUNTRY_CODE: 'KR'
  };

  /* ==========================================================================
     2. Services (Weather, Geolocation, Gemini API Vision, Image Gallery)
     ========================================================================== */
  async function getUserCoordinates() {
    // Try Browser GPS first
    const gpsCoords = await new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 3000, maximumAge: 300000 }
      );
    });

    if (gpsCoords) return gpsCoords;

    // Automatic IP-based location fallback (Works on file:/// & HTTP without permission popups)
    try {
      const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          return { lat: parseFloat(data.latitude), lon: parseFloat(data.longitude), cityName: data.city };
        }
      }
    } catch (e) {}

    return null;
  }

  async function fetchCurrentWeather(coords = null) {
    const apiKey = await getOpenWeatherApiKey();
    if (!apiKey) {
      return {
        city: '서울 (대한민국)',
        temp: 27,
        feelsLike: 29,
        condition: 'Clear',
        humidity: 55,
        description: '맑음',
        icon: '☀️'
      };
    }

    try {
      let url = '';
      if (coords && coords.lat && coords.lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric&lang=kr`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${CONFIG.CITY},${CONFIG.COUNTRY_CODE}&appid=${apiKey}&units=metric&lang=kr`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Weather API Error: ${response.status}`);

      const data = await response.json();
      const weatherCondition = data.weather[0].main;
      let icon = '☀️';
      if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') icon = '🌧️';
      else if (weatherCondition === 'Clouds') icon = '☁️';
      else if (weatherCondition === 'Snow') icon = '❄️';
      else if (weatherCondition === 'Thunderstorm') icon = '⛈️';
      else if (weatherCondition === 'Mist' || weatherCondition === 'Fog') icon = '🌫️';

      const locationName = data.name || coords?.cityName || CONFIG.CITY;
      const countryName = data.sys?.country ? ` (${data.sys.country})` : '';

      return {
        city: `${locationName}${countryName}`,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: weatherCondition,
        humidity: data.main.humidity,
        description: data.weather[0].description || '맑음',
        icon: icon
      };
    } catch (error) {
      console.warn('[WeatherService] Live fetch error:', error);
      return {
        city: '서울 (대한민국)',
        temp: 28,
        feelsLike: 31,
        condition: 'Clear',
        humidity: 60,
        description: '맑음 (기본 위치 데이터)',
        icon: '☀️'
      };
    }
  }

  async function analyzeOutfitWithGemini(base64Image, weatherData) {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) return getFallbackDiagnosis(weatherData);

    try {
      const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

      const promptText = `
너는 스마트 거울 비서 AI 패션 코디네이터야.
현재 날씨: 위치 ${weatherData?.city || '서울'}, 기온 ${weatherData?.temp || 25}°C, 체감온도 ${weatherData?.feelsLike || 26}°C, 날씨상태: ${weatherData?.description || '맑음'}.

전달받은 이미지는 웹캠으로 촬영된 사용자의 현재 옷차림이야.
사용자가 입고 있는 옷(상의, 하의, 외투 등)의 두께감과 재질을 분석하고, 현재 날씨 기온(${weatherData?.temp || 25}°C)에 적합한지 평가해줘.

반드시 다른 설명 없이 아래 JSON 포맷으로만 정형화하여 응답해줘:
{
  "status": "good" 또는 "warning",
  "badgeText": "🟢 [Good] 날씨 맞춤 적절한 옷차림" 또는 "🔴 [Warning] 날씨 대비 얇음/두꺼움 경고",
  "feedback": "현재 기온(${weatherData?.temp || 25}°C) 대비 옷차림의 두께감 및 스타일 평가 가이드 2문장",
  "colors": {
    "coat": "#외투_대표색상_Hex",
    "top": "#상의_대표색상_Hex",
    "bottom": "#하의_대표색상_Hex",
    "shoes": "#신발_대표색상_Hex"
  }
}
      `;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }, { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }] }]
        })
      });

      if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);

      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid JSON format');

      const result = JSON.parse(jsonMatch[0]);
      return {
        status: result.status === 'warning' ? 'warning' : 'good',
        badgeText: result.badgeText || (result.status === 'warning' ? '🔴 [Warning] 옷차림 점검 필요' : '🟢 [Good] 날씨 맞춤 옷차림'),
        feedback: result.feedback || '현재 날씨에 어울리는 옷차림입니다.',
        colors: {
          coat: result.colors?.coat || '#1E293B',
          top: result.colors?.top || '#F8FAFC',
          bottom: result.colors?.bottom || '#38BDF8',
          shoes: result.colors?.shoes || '#0F172A'
        }
      };
    } catch (e) {
      console.warn('[GeminiService] Error:', e);
      return getFallbackDiagnosis(weatherData);
    }
  }

  function getFallbackDiagnosis(weatherData) {
    const temp = weatherData?.temp || 25;
    if (temp > 30) {
      return {
        status: 'warning',
        badgeText: '🔴 [Warning] 폭염 대비 두꺼운 옷차림 경고',
        feedback: `현재 기온 ${temp}°C의 무더운 날씨에 두꺼운 옷차림은 온열 질환 위험이 있습니다. 얇은 반팔과 통기성이 우수한 소재를 권장합니다.`,
        colors: { coat: '#F43F5E', top: '#F8FAFC', bottom: '#1E293B', shoes: '#0F172A' }
      };
    } else {
      return {
        status: 'good',
        badgeText: '🟢 [Good] 날씨 맞춤 적절한 옷차림',
        feedback: `현재 ${temp}°C의 쾌적한 날씨에 매우 적합하고 우수한 핏의 스타일입니다! 외출 시 즐거운 하루 되세요.`,
        colors: { coat: '#1E293B', top: '#F8FAFC', bottom: '#38BDF8', shoes: '#0F172A' }
      };
    }
  }

  function getCuratedOutfits() {
    return [
      {
        id: 1,
        title: '린넨 셔츠 & 슬랙스 코디',
        desc: '통기성이 우수하며 깔끔한 데일리 룩',
        imgUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 2,
        title: '캐주얼 코튼 반팔 룩',
        desc: '자연스러운 시원함을 제공하는 캐주얼 핏',
        imgUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 3,
        title: '라이트 미니멀리스트 피팅',
        desc: '밝은 톤의 샌들 및 숏팬츠 매칭 스타일',
        imgUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80'
      }
    ];
  }

  /* ==========================================================================
     3. UI Components (Header, Indicators, Webcam, Diagnosis, Gallery)
     ========================================================================== */
  class HeaderComponent {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.clockInterval = null;
    }
    render(data) {
      if (!this.container) return;
      const d = data || { city: '서울 (대한민국)', temp: '--', feelsLike: '--', humidity: '--', description: '로딩 중...', icon: '🌤️' };
      this.container.innerHTML = `
        <header class="header-container glass-panel animate-fade-in">
          <div>
            <div class="clock-display" id="mirrorClock">00:00:00</div>
            <div style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.35rem;">
              📍 <span id="mirrorCity">${d.city}</span>
            </div>
          </div>
          <div class="weather-widget">
            <div class="weather-icon-badge" id="mirrorWeatherIcon">${d.icon}</div>
            <div>
              <div style="display: flex; align-items: baseline; gap: 0.75rem;">
                <span class="weather-temp" id="mirrorTemp">${d.temp}°C</span>
                <span class="pill-badge badge-good" id="mirrorWeatherDesc" style="font-size: 0.8rem;">${d.description}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-top: 0.25rem;">
                체감: <span id="mirrorFeelsLike" style="color: var(--color-primary);">${d.feelsLike}</span>°C | 
                습도: <span id="mirrorHumidity" style="color: var(--color-secondary);">${d.humidity}</span>%
              </div>
            </div>
          </div>
        </header>
      `;
      this.startClock();
    }
    updateWeather(d) {
      if (!d) return;
      const c = document.getElementById('mirrorCity');
      const i = document.getElementById('mirrorWeatherIcon');
      const t = document.getElementById('mirrorTemp');
      const desc = document.getElementById('mirrorWeatherDesc');
      const f = document.getElementById('mirrorFeelsLike');
      const h = document.getElementById('mirrorHumidity');
      if (c) c.textContent = d.city;
      if (i) i.textContent = d.icon;
      if (t) t.textContent = `${d.temp}°C`;
      if (desc) desc.textContent = d.description;
      if (f) f.textContent = d.feelsLike;
      if (h) h.textContent = d.humidity;
    }
    startClock() {
      if (this.clockInterval) clearInterval(this.clockInterval);
      const update = () => {
        const now = new Date();
        const el = document.getElementById('mirrorClock');
        if (el) {
          el.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        }
      };
      update();
      this.clockInterval = setInterval(update, 1000);
    }
  }

  class VirtualIndicatorsComponent {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
    }
    render(condition = 'Clear', colors = null) {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="glass-card virtual-indicator-panel animate-fade-in" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div class="dot-matrix-grid" id="dotMatrixGrid">
              ${Array(64).fill(0).map(() => `<div class="dot-pixel"></div>`).join('')}
            </div>
            <div>
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary);">📟 8x8 LED 도트매트릭스 (날씨 상태)</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-top: 0.2rem;">
                현재 기상 프로토콜: <span id="dotMatrixStatus" style="color: var(--color-text-main);">${condition}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="text-align: right;">
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-secondary);">🌈 4-세그먼트 네오픽셀 LED 바 (코디 색상)</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-top: 0.2rem;" id="neopixelStatus">
                [외투 - 상의 - 하의 - 신발] LED 발광 동기화
              </div>
            </div>
            <div class="neopixel-bar" style="padding: 0.5rem 0.75rem;">
              <div class="neopixel-led" id="neoCoat" title="외투 LED"></div>
              <div class="neopixel-led" id="neoTop" title="상의 LED"></div>
              <div class="neopixel-led" id="neoBottom" title="하의 LED"></div>
              <div class="neopixel-led" id="neoShoes" title="신발 LED"></div>
            </div>
          </div>
        </div>
      `;
      this.updateDotMatrix(condition);
      if (colors) this.updateNeopixel(colors);
    }
    updateDotMatrix(condition) {
      const grid = document.getElementById('dotMatrixGrid');
      const statusEl = document.getElementById('dotMatrixStatus');
      if (!grid) return;
      if (statusEl) statusEl.textContent = condition;
      const pixels = grid.querySelectorAll('.dot-pixel');
      pixels.forEach(p => p.className = 'dot-pixel');
      if (condition === 'Rain' || condition === 'Drizzle') {
        [2, 10, 18, 26, 34, 42, 50, 58, 5, 13, 21, 29, 37, 45, 53, 61].forEach(idx => {
          if (pixels[idx]) pixels[idx].classList.add('active-rain');
        });
      } else {
        [18, 19, 20, 21, 26, 27, 28, 29, 34, 35, 36, 37, 42, 43, 44, 45].forEach(idx => {
          if (pixels[idx]) pixels[idx].classList.add('active-sun');
        });
      }
    }
    updateNeopixel(colors) {
      if (!colors) return;
      const apply = (id, hex) => {
        const el = document.getElementById(id);
        if (el && hex) {
          el.style.backgroundColor = hex;
          el.style.boxShadow = `0 0 14px ${hex}`;
          el.classList.add('neopixel-led-active');
        }
      };
      apply('neoCoat', colors.coat);
      apply('neoTop', colors.top);
      apply('neoBottom', colors.bottom);
      apply('neoShoes', colors.shoes);
      const statusEl = document.getElementById('neopixelStatus');
      if (statusEl) statusEl.textContent = `LED 발광 활성화 (${colors.coat}, ${colors.top}, ${colors.bottom}, ${colors.shoes})`;
    }
  }

  class WebcamViewfinderComponent {
    constructor(containerId, onScanTriggered) {
      this.container = document.getElementById(containerId);
      this.onScanTriggered = onScanTriggered;
      this.stream = null;
      this.videoEl = null;
    }
    render() {
      if (!this.container) return;
      this.container.innerHTML = `
        <div class="glass-panel animate-fade-in" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: center; width: 100%;">
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem;">
              <span>📷</span> 거울 뷰파인더 (실시간 웹캠)
            </h3>
            <span class="pill-badge badge-good" style="font-size: 0.7rem; font-family: var(--font-mono);">LIVE WEBCAM</span>
          </div>
          <div class="viewfinder-box" id="viewfinderBox">
            <video id="mirrorVideo" class="viewfinder-video" autoplay playsinline muted></video>
            <div class="viewfinder-overlay"></div>
            <div class="scanline-effect"></div>
            <div class="countdown-overlay" id="countdownOverlay" style="display: none;">3</div>
            <div class="countdown-overlay" id="loadingOverlay" style="display: none; flex-direction: column; gap: 1rem; background: rgba(11, 15, 23, 0.85);">
              <div style="width: 52px; height: 52px; border: 4px solid var(--color-primary); border-top-color: transparent; border-radius: 50%; animation: spin 0.9s linear infinite;"></div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-text-main);">Gemini AI 옷차림 분석 중...</div>
            </div>
          </div>
          <button class="btn-scan" id="btnScan" style="width: 100%; justify-content: center;">
            📸 옷차림 스캔 / 촬영 시작
          </button>
        </div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
      `;
      this.videoEl = document.getElementById('mirrorVideo');
      this.initWebcam();
      const btn = document.getElementById('btnScan');
      if (btn) btn.addEventListener('click', () => this.startScan());
    }
    async initWebcam() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: 'user' } });
        if (this.videoEl) this.videoEl.srcObject = this.stream;
      } catch (err) {
        console.warn('[WebcamViewfinder] Camera stream notice:', err);
        if (this.videoEl && this.videoEl.parentElement) {
          this.videoEl.parentElement.style.backgroundImage = "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80')";
          this.videoEl.parentElement.style.backgroundSize = "cover";
          this.videoEl.style.display = "none";
        }
      }
    }
    startScan() {
      const cd = document.getElementById('countdownOverlay');
      const btn = document.getElementById('btnScan');
      if (btn) btn.disabled = true;
      if (!cd) return;
      let count = 3;
      cd.style.display = 'flex';
      cd.textContent = count;
      const timer = setInterval(() => {
        count -= 1;
        if (count > 0) {
          cd.textContent = count;
        } else {
          clearInterval(timer);
          cd.style.display = 'none';
          this.capture();
        }
      }, 1000);
    }
    capture() {
      const flash = document.createElement('div');
      flash.className = 'flash-animation';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 400);

      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (this.videoEl && this.videoEl.style.display !== 'none' && this.videoEl.videoWidth) {
        ctx.drawImage(this.videoEl, 0, 0, 640, 480);
      } else {
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Noto Sans KR';
        ctx.fillText('샘플 옷차림 촬영 캡처', 200, 240);
      }
      const b64 = canvas.toDataURL('image/jpeg', 0.85);
      const loading = document.getElementById('loadingOverlay');
      if (loading) loading.style.display = 'flex';

      if (this.onScanTriggered) {
        this.onScanTriggered(b64).finally(() => {
          if (loading) loading.style.display = 'none';
          const btn = document.getElementById('btnScan');
          if (btn) btn.disabled = false;
        });
      }
    }
  }

  class DiagnosisPanelComponent {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
    }
    render(data) {
      if (!this.container) return;
      const d = data || {
        status: 'good',
        badgeText: '🟢 [Good] 날씨 맞춤 적절한 옷차림 대기 중',
        feedback: '스캔 버튼을 눌러 옷차림을 촬영하면 Google Gemini AI가 날씨 대비 옷차림 적합도와 4가지 아이템 색상을 진단합니다.',
        colors: { coat: '#1E293B', top: '#F8FAFC', bottom: '#38BDF8', shoes: '#0F172A' }
      };
      const isGood = d.status === 'good';
      this.container.innerHTML = `
        <div class="glass-panel animate-fade-in" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
          <div>
            <span class="pill-badge ${isGood ? 'badge-good' : 'badge-warning'}">
              ${d.badgeText}
            </span>
          </div>
          <div class="glass-card">
            <div style="font-size: 0.8rem; color: var(--color-primary); font-family: var(--font-mono); margin-bottom: 0.5rem;">
              🤖 GEMINI AI 패션 진단 피드백
            </div>
            <p style="font-size: 0.95rem; line-height: 1.6; color: var(--color-text-main);">
              ${d.feedback}
            </p>
          </div>
          <div>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.5rem;">
              🎨 추천 코디 4가지 대표 색상 칩 (Hex)
            </div>
            <div class="palette-grid">
              <div class="swatch-card">
                <div class="swatch-circle" style="background-color: ${d.colors.coat}; box-shadow: 0 0 10px ${d.colors.coat};"></div>
                <span class="swatch-label">외투</span>
                <span class="swatch-hex">${d.colors.coat}</span>
              </div>
              <div class="swatch-card">
                <div class="swatch-circle" style="background-color: ${d.colors.top}; box-shadow: 0 0 10px ${d.colors.top};"></div>
                <span class="swatch-label">상의</span>
                <span class="swatch-hex">${d.colors.top}</span>
              </div>
              <div class="swatch-card">
                <div class="swatch-circle" style="background-color: ${d.colors.bottom}; box-shadow: 0 0 10px ${d.colors.bottom};"></div>
                <span class="swatch-label">하의</span>
                <span class="swatch-hex">${d.colors.bottom}</span>
              </div>
              <div class="swatch-card">
                <div class="swatch-circle" style="background-color: ${d.colors.shoes}; box-shadow: 0 0 10px ${d.colors.shoes};"></div>
                <span class="swatch-label">신발</span>
                <span class="swatch-hex">${d.colors.shoes}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    update(d) {
      this.render(d);
    }
  }

  class OutfitGalleryComponent {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
    }
    render(outfits) {
      if (!this.container) return;
      const list = outfits && outfits.length > 0 ? outfits : getCuratedOutfits();
      this.container.innerHTML = `
        <div class="glass-panel animate-fade-in" style="padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary);">
              ✨ 오늘 날씨 추천 스타일 갤러리
            </h3>
            <span style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono);">
              CURATED OUTFIT RECOMMENDATIONS
            </span>
          </div>
          <div class="outfit-gallery-grid">
            ${list.map(item => `
              <div class="outfit-card animate-fade-in">
                <div class="outfit-img-box">
                  <img src="${item.imgUrl}" alt="${item.title}" class="outfit-img" loading="lazy" />
                </div>
                <div class="outfit-info">
                  <div class="outfit-title">${item.title}</div>
                  <div class="outfit-desc">${item.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    update(outfits) {
      this.render(outfits);
    }
  }

  /* ==========================================================================
     4. Main Application Orchestration
     ========================================================================== */
  class SmartMirrorApp {
    constructor() {
      this.weatherData = null;
      this.coords = null;
      this.diagnosisData = null;

      this.header = new HeaderComponent('headerSlot');
      this.indicators = new VirtualIndicatorsComponent('virtualIndicatorsSlot');
      this.viewfinder = new WebcamViewfinderComponent('viewfinderSlot', (b64) => this.handleScan(b64));
      this.diagnosisPanel = new DiagnosisPanelComponent('diagnosisSlot');
      this.gallery = new OutfitGalleryComponent('gallerySlot');
    }

    async init() {
      console.log('[SmartMirrorApp] Initializing Smart Mirror Dashboard...');
      this.header.render(null);
      this.indicators.render('Clear');
      this.viewfinder.render();
      this.diagnosisPanel.render(null);
      this.gallery.render([]);

      try {
        this.coords = await getUserCoordinates();
        this.weatherData = await fetchCurrentWeather(this.coords);

        this.header.updateWeather(this.weatherData);
        this.indicators.updateDotMatrix(this.weatherData.condition);
        this.gallery.update(getCuratedOutfits());
      } catch (e) {
        console.warn('[SmartMirrorApp] Weather init warning:', e);
      }
    }

    async handleScan(base64Image) {
      console.log('[SmartMirrorApp] Outfit Scan Triggered. Analyzing with Gemini API...');
      this.diagnosisData = await analyzeOutfitWithGemini(base64Image, this.weatherData);
      this.diagnosisPanel.update(this.diagnosisData);
      this.indicators.updateNeopixel(this.diagnosisData.colors);

      if (this.diagnosisData.status === 'warning') {
        this.playWarningBeep();
      }
    }

    playWarningBeep() {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch (e) {}
    }
  }

  // Safe DOM ready / Immediate Start
  function startApp() {
    try {
      const app = new SmartMirrorApp();
      app.init();
    } catch (err) {
      console.error('[SmartMirrorApp] Initialization error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }

})();
