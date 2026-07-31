/**
 * Image Recommendation Service
 * Fetches recommended outfit cards or fallback curated images
 */

import { CONFIG, MOCK_DATA } from '../config.js';

export async function fetchRecommendedOutfits(weatherCondition, temp) {
  if (!CONFIG.UNSPLASH_ACCESS_KEY) {
    console.log('[ImageService] API Key missing. Returning Curated Outfit Cards.');
    return MOCK_DATA.RECOMMENDED_OUTFITS;
  }

  try {
    const query = temp > 24 ? 'summer outfit fashion' : 'winter coat fashion';
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&client_id=${CONFIG.UNSPLASH_ACCESS_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unsplash API Error: ${response.statusText}`);

    const data = await response.json();
    if (!data.results || data.results.length === 0) return MOCK_DATA.RECOMMENDED_OUTFITS;

    return data.results.map((item, idx) => ({
      id: item.id || idx,
      title: item.alt_description || `추천 스타일 ${idx + 1}`,
      desc: `날씨 기온(${temp}°C) 맞춤 큐레이션 코디`,
      imgUrl: item.urls.small
    }));
  } catch (error) {
    console.warn('[ImageService] Failed to fetch Unsplash images:', error);
    return MOCK_DATA.RECOMMENDED_OUTFITS;
  }
}
