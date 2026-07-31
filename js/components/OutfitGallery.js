/**
 * Recommended Outfit Gallery Component
 * Renders recommended style cards with image hover zoom effects
 */

export class OutfitGalleryComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(outfits) {
    if (!this.container) return;

    const outfitList = outfits && outfits.length > 0 ? outfits : [];

    this.container.innerHTML = `
      <div class="glass-panel" style="padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary);">
            ✨ 오늘 날씨 추천 스타일 갤러리
          </h3>
          <span style="font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono);">
            CURATED OUTFIT RECOMMENDATIONS
          </span>
        </div>

        <div class="outfit-gallery-grid">
          ${outfitList.map(item => `
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
