/**
 * AI Diagnosis Panel Component
 * Displays outfit suitability status badge, Gemini feedback, and 4-color swatch chips
 */

export class DiagnosisPanelComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(diagnosisData) {
    if (!this.container) return;

    const data = diagnosisData || {
      status: 'good',
      badgeText: '🟢 [Good] 날씨 맞춤 적절한 옷차림',
      feedback: '스캔 버튼을 눌러 현재 옷차림을 촬영하면 Gemini AI가 날씨와 옷차림의 적합도를 평가합니다.',
      colors: { coat: '#1E293B', top: '#F8FAFC', bottom: '#38BDF8', shoes: '#0F172A' }
    };

    const isGood = data.status === 'good';

    this.container.innerHTML = `
      <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- Status Pill Badge -->
        <div>
          <span class="pill-badge ${isGood ? 'badge-good' : 'badge-warning'}">
            ${data.badgeText}
          </span>
        </div>

        <!-- AI Feedback Card -->
        <div class="glass-card">
          <div style="font-size: 0.8rem; color: var(--color-primary); font-family: var(--font-mono); margin-bottom: 0.5rem;">
            🤖 GEMINI AI 패션 진단
          </div>
          <p style="font-size: 0.95rem; line-height: 1.6; color: var(--color-text-main);">
            ${data.feedback}
          </p>
        </div>

        <!-- 4-Color Palette Swatch -->
        <div>
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.5rem;">
            🎨 추천 코디 4가지 대표 색상 칩
          </div>
          <div class="palette-grid">
            <div class="swatch-card">
              <div class="swatch-circle" style="background-color: ${data.colors.coat}; box-shadow: 0 0 10px ${data.colors.coat};"></div>
              <span class="swatch-label">외투</span>
              <span class="swatch-hex">${data.colors.coat}</span>
            </div>
            <div class="swatch-card">
              <div class="swatch-circle" style="background-color: ${data.colors.top}; box-shadow: 0 0 10px ${data.colors.top};"></div>
              <span class="swatch-label">상의</span>
              <span class="swatch-hex">${data.colors.top}</span>
            </div>
            <div class="swatch-card">
              <div class="swatch-circle" style="background-color: ${data.colors.bottom}; box-shadow: 0 0 10px ${data.colors.bottom};"></div>
              <span class="swatch-label">하의</span>
              <span class="swatch-hex">${data.colors.bottom}</span>
            </div>
            <div class="swatch-card">
              <div class="swatch-circle" style="background-color: ${data.colors.shoes}; box-shadow: 0 0 10px ${data.colors.shoes};"></div>
              <span class="swatch-label">신발</span>
              <span class="swatch-hex">${data.colors.shoes}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  update(diagnosisData) {
    this.render(diagnosisData);
  }
}
