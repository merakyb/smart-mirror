/**
 * Virtual Hardware Indicators Component
 * Simulates 8x8 Dot Matrix Weather Icon & 4-Segment Neopixel LED Bar
 */

export class VirtualIndicatorsComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="glass-card virtual-indicator-panel">
        <!-- 8x8 Dot Matrix -->
        <div>
          <div style="font-size: 0.7rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-bottom: 0.25rem;">
            📟 가상 도트매트릭스 (LED)
          </div>
          <div class="dot-matrix-grid" id="dotMatrixGrid">
            ${Array(64).fill(0).map(() => `<div class="dot-pixel"></div>`).join('')}
          </div>
        </div>

        <!-- 4-Segment Neopixel LED Bar -->
        <div>
          <div style="font-size: 0.7rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-bottom: 0.25rem;">
            🌈 가상 네오픽셀 LED 바 (코디 4색)
          </div>
          <div class="neopixel-bar">
            <div class="neopixel-led" id="neoCoat" title="외투 LED"></div>
            <div class="neopixel-led" id="neoTop" title="상의 LED"></div>
            <div class="neopixel-led" id="neoBottom" title="하의 LED"></div>
            <div class="neopixel-led" id="neoShoes" title="신발 LED"></div>
          </div>
        </div>
      </div>
    `;
  }

  updateDotMatrix(condition) {
    const grid = document.getElementById('dotMatrixGrid');
    if (!grid) return;

    const pixels = grid.querySelectorAll('.dot-pixel');
    pixels.forEach(p => p.className = 'dot-pixel');

    if (condition === 'Rain') {
      // Light up rain columns
      [2, 10, 18, 26, 34, 42, 50, 58, 5, 13, 21, 29, 37, 45, 53, 61].forEach(idx => {
        if (pixels[idx]) pixels[idx].classList.add('active-rain');
      });
    } else {
      // Default Sun pattern
      [18, 19, 20, 21, 26, 27, 28, 29, 34, 35, 36, 37, 42, 43, 44, 45].forEach(idx => {
        if (pixels[idx]) pixels[idx].classList.add('active-sun');
      });
    }
  }

  updateNeopixel(colors) {
    const coatLed = document.getElementById('neoCoat');
    const topLed = document.getElementById('neoTop');
    const bottomLed = document.getElementById('neoBottom');
    const shoesLed = document.getElementById('neoShoes');

    const applyLedStyle = (led, colorHex) => {
      if (!led || !colorHex) return;
      led.style.backgroundColor = colorHex;
      led.style.boxShadow = `0 0 12px ${colorHex}`;
      led.classList.add('neopixel-led-active');
    };

    if (colors) {
      applyLedStyle(coatLed, colors.coat);
      applyLedStyle(topLed, colors.top);
      applyLedStyle(bottomLed, colors.bottom);
      applyLedStyle(shoesLed, colors.shoes);
    }
  }
}
