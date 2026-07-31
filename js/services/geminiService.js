/**
 * Gemini Vision Service
 * Analyzes captured webcam image base64 and current weather to evaluate outfit suitability
 */

import { CONFIG, MOCK_DATA } from '../config.js';

export async function analyzeOutfitWithGemini(base64Image, weatherData) {
  if (!CONFIG.GEMINI_API_KEY) {
    console.log('[GeminiService] API Key missing. Returning Mock Diagnosis Data.');
    // Return simulated diagnosis based on current temperature
    return weatherData.temp > 30 ? MOCK_DATA.DIAGNOSIS_WARNING : MOCK_DATA.DIAGNOSIS_GOOD;
  }

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`;
    
    const prompt = `
      너는 스마트 거울 비서 AI 패션 코디네이터야.
      현재 날씨: ${weatherData.city}, 기온: ${weatherData.temp}°C, 상태: ${weatherData.condition} (${weatherData.description}).
      
      전달받은 이미지는 사용자가 웹캠으로 촬영한 현재 옷차림이야.
      아래 JSON 형식으로 정확히 답변해줘:
      {
        "status": "good" 또는 "warning",
        "badgeText": "🟢 [Good] ..." 또는 "🔴 [Warning] ...",
        "feedback": "사용자의 옷차림이 현재 날씨(${weatherData.temp}°C)에 적합한지 평가하고, 어울리는 가이드 2-3문장 작성",
        "colors": {
          "coat": "#HexCode",
          "top": "#HexCode",
          "bottom": "#HexCode",
          "shoes": "#HexCode"
        }
      }
    `;

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          }
        ]
      }],
      generationConfig: { responseMimeType: 'application/json' }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error(`Gemini API Error: ${response.statusText}`);

    const data = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text;
    const result = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.warn('[GeminiService] Failed to analyze image with Gemini:', error);
    return weatherData.temp > 30 ? MOCK_DATA.DIAGNOSIS_WARNING : MOCK_DATA.DIAGNOSIS_GOOD;
  }
}
