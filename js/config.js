/**
 * Config & Environment Settings
 * Contains API configuration and Fallback Mock Data for OpenWeatherMap, Gemini API, and Unsplash
 */

export const CONFIG = {
  CITY: 'Seoul',
  COUNTRY_CODE: 'KR',
  DEFAULT_TEMP: 26,
  DEFAULT_WEATHER: 'Clear',
  
  // API Keys will be loaded from window.ENV or environment
  OPENWEATHER_API_KEY: window.ENV?.OPENWEATHER_API_KEY || '',
  GEMINI_API_KEY: window.ENV?.GEMINI_API_KEY || '',
  UNSPLASH_ACCESS_KEY: window.ENV?.UNSPLASH_ACCESS_KEY || ''
};

export const MOCK_DATA = {
  WEATHER: {
    city: '서울 (Seoul)',
    temp: 27,
    feelsLike: 29,
    condition: 'Clear', // Clear, Rain, Clouds, Snow
    humidity: 55,
    description: '맑음 - 야외 활동하기 좋은 날씨',
    icon: '☀️'
  },
  
  DIAGNOSIS_GOOD: {
    status: 'good',
    badgeText: '🟢 [Good] 날씨 맞춤 적절한 옷차림',
    feedback: '현재 27°C의 따뜻한 날씨에 얇은 린넨 셔츠와 반바지 조합이 매우 적절합니다! 체감 온도가 약간 높으므로 수분 섭취에 유의하세요.',
    colors: {
      coat: '#1E293B',
      top: '#F8FAFC',
      bottom: '#38BDF8',
      shoes: '#0F172A'
    }
  },

  DIAGNOSIS_WARNING: {
    status: 'warning',
    badgeText: '🔴 [Warning] 폭염 대비 두꺼운 옷차림',
    feedback: '현재 기온 33°C의 폭염 날씨에 가디건 및 두꺼운 하의는 온열 질환의 위험이 있습니다. 얇은 반팔 및 통기성이 좋은 옷으로 변경을 권장합니다.',
    colors: {
      coat: '#F43F5E',
      top: '#F8FAFC',
      bottom: '#0F172A',
      shoes: '#64748B'
    }
  },

  RECOMMENDED_OUTFITS: [
    {
      id: 1,
      title: '린넨 셔츠 & 슬랙스 코디',
      desc: '통기성이 우수하며 깔끔한 여름 데일리 룩',
      imgUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      title: '캐주얼 코튼 반팔 룩',
      desc: '자연스러운 시원함을 제공하는 스트릿 캐주얼',
      imgUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: '라이트 미니멀리스트 피팅',
      desc: '밝은 톤의 샌들 및 숏팬츠 매칭 스타일',
      imgUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80'
    }
  ]
};
