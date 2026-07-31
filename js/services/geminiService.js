/**
 * Gemini Vision Service (Step 2)
 * Sends captured webcam frame base64 & current weather to Google Gemini API (gemini-flash-latest)
 * for visual outfit thickness/style evaluation, suitability diagnosis, and 4-color palette generation.
 */

import { getGeminiApiKey } from '../config.js';

export async function analyzeOutfitWithGemini(base64Image, weatherData) {
  const apiKey = await getGeminiApiKey();

  if (!apiKey) {
    console.warn('[GeminiService] API Key missing. Returning fallback simulated diagnosis.');
    return getFallbackDiagnosis(weatherData);
  }

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    // Using current official non-deprecated model alias 'gemini-flash-latest'
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

    const requestBody = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanBase64
              }
            }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON object from raw response text
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gemini API did not return valid JSON format.');
    }

    const result = JSON.parse(jsonMatch[0]);

    // Ensure fallback fields exist
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
  } catch (error) {
    console.error('[GeminiService] Failed to analyze image with Gemini API:', error);
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
  } else if (temp < 10) {
    return {
      status: 'warning',
      badgeText: '🔴 [Warning] 쌀쌀한 날씨 대비 얇은 옷차림 경고',
      feedback: `현재 기온 ${temp}°C의 쌀쌀한 날씨입니다. 체온 유지를 위해 보온성이 뛰어난 패딩이나 아우터를 챙기세요.`,
      colors: { coat: '#38BDF8', top: '#1E293B', bottom: '#334155', shoes: '#0F172A' }
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
