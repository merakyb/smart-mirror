/**
 * Virtual Indicators Component (Step 1)
 * Renders 8x8 LED Dot Matrix Weather Pixel Art
 */

export class VirtualIndicatorsComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(condition = 'Clear') {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="glass-card virtual-indicator-panel animate-fade-in" style="justify-content: space-between;">
        <!-- Left: Dot Matrix Info -->
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div class="dot-matrix-grid" id="dotMatrixGrid">
            ${Array(64).fill(0).map(() => `<div class="dot-pixel"></div>`).join('')}
          </div>
          <div>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--color-primary);">
              📟 8x8 LED 도트매트릭스 날씨 상태 디스플레이
            </div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-top: 0.2rem;">
              현재 기상 프로토콜: <span id="dotMatrixStatus" style="color: var(--color-text-main);">${condition}</span>
            </div>
          </div>
        </div>

        <!-- Right: Step 1 Mode Indicator -->
        <div class="pill-badge badge-good" style="font-size: 0.75rem;">
          ⚡ [1단계 모드] 날씨 API 연동 완료
        </div>
      </div>
    `;

    this.updateDotMatrix(condition);
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
}
