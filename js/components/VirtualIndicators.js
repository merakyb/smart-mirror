/**
 * Virtual Hardware Indicators Component (Step 2)
 * Renders 8x8 LED Dot Matrix Weather Pixel Art AND 4-Segment Neopixel LED Bar
 */

export class VirtualIndicatorsComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(condition = 'Clear', colors = null) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="glass-card virtual-indicator-panel animate-fade-in" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <!-- Left: 8x8 LED Dot Matrix -->
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div class="dot-matrix-grid" id="dotMatrixGrid">
            ${Array(64).fill(0).map(() => `<div class="dot-pixel"></div>`).join('')}
          </div>
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary);">
              📟 8x8 LED 도트매트릭스 (날씨 상태)
            </div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-top: 0.2rem;">
              현재 기상 프로토콜: <span id="dotMatrixStatus" style="color: var(--color-text-main);">${condition}</span>
            </div>
          </div>
        </div>

        <!-- Right: 4-Segment Neopixel LED Bar -->
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div style="text-align: right;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-secondary);">
              🌈 4-세그먼트 네오픽셀 LED 바 (코디 색상)
            </div>
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
    if (colors) {
      this.updateNeopixel(colors);
    }
  }

  updateDotMatrix(condition) {
    const grid = document.getElementById('dotMatrixGrid');
    const statusEl = document.getElementById('dotMatrixStatus');
    if (!grid) return;

    if (statusEl) statusEl.textContent = condition;

    const pixels = grid.querySelectorAll('.dot-pixel');
    pixels.forEach(p => p.className = 'dot-pixel');

    if (condition === 'Rain' || condition === 'Drizzle') {
      // Rain pixel pattern
      [2, 10, 18, 26, 34, 42, 50, 58, 5, 13, 21, 29, 37, 45, 53, 61].forEach(idx => {
        if (pixels[idx]) pixels[idx].classList.add('active-rain');
      });
    } else {
      // Sun pixel pattern for Clear/Clouds
      [18, 19, 20, 21, 26, 27, 28, 29, 34, 35, 36, 37, 42, 43, 44, 45].forEach(idx => {
        if (pixels[idx]) pixels[idx].classList.add('active-sun');
      });
    }
  }

  updateNeopixel(colors) {
    if (!colors) return;
    const coatLed = document.getElementById('neoCoat');
    const topLed = document.getElementById('neoTop');
    const bottomLed = document.getElementById('neoBottom');
    const shoesLed = document.getElementById('neoShoes');

    const applyLedStyle = (led, colorHex) => {
      if (!led || !colorHex) return;
      led.style.backgroundColor = colorHex;
      led.style.boxShadow = `0 0 14px ${colorHex}`;
      led.classList.add('neopixel-led-active');
    };

    applyLedStyle(coatLed, colors.coat);
    applyLedStyle(topLed, colors.top);
    applyLedStyle(bottomLed, colors.bottom);
    applyLedStyle(shoesLed, colors.shoes);

    const statusEl = document.getElementById('neopixelStatus');
    if (statusEl) {
      statusEl.textContent = `LED 발광 활성화 (${colors.coat}, ${colors.top}, ${colors.bottom}, ${colors.shoes})`;
    }
  }
}
