# 🎨 스마트 거울 비서 (Smart Mirror Assistant) UI/UX 디자인 가이드

> **작성자**: UI/UX 디자인 전문가 & 프론트엔드 아키텍트  
> **버전**: v1.0  
> **최종 수정일**: 2026-07-31  
> **관련 문서**: [PRD (prd.md)](file:///c:/Users/hun95/.gemini/antigravity-ide/scratch/smart-mirror/prd.md)  

---

## 1. 디자인 컨셉 및 디자인 원칙 (Design Concept)

### 1.1 디자인 컨셉: **"Obsidian Smart Glass & High-Contrast Mirror"**
실제 은경(스마트 거울) 위에 디지털 HUD(Head-Up Display) 정보가 띄워진 듯한 **딥 다크 글래스모피즘(Dark Glassmorphism)**과 **고대비 시각적 요소**를 결합한 미래지향적 인터페이스입니다.

### 1.2 핵심 UX 원칙
1. **높은 시인성 (High Visibility)**: 어두운 거울 배경 위에서도 한눈에 기온, 옷차림 피드백, 색상 칩을 볼 수 있는 고대비 타이포그래피 및 네온 아웃라인 적용.
2. **시각적 몰입감 (Visual Immersion)**: 9:16 세로형 프레임 비율을 활용하여 사용자가 거울 앞에 서 있는 느낌 제공.
3. **직관적인 하드웨어 피드백 (Virtual Hardware Feedback)**: 우측 상단에 가상 도트매트릭스/네오픽셀 LED 바를 배치하여 하드웨어 상태를 시각적으로 실시간 모니터링.

---

## 2. 컬러 팔레트 & 디자인 토큰 (Color Tokens)

### 2.1 메인 테마 컬러 (Background & Surface)
| 토큰명 | CSS 변수 | Color Hex / RGBA | 사용처 |
| :--- | :--- | :--- | :--- |
| **Mirror Base** | `--color-bg-base` | `#0B0F17` | 스마트 거울 메인 딥 흑색 배경 |
| **Glass Surface** | `--color-glass-bg` | `rgba(15, 23, 42, 0.65)` | 모든 정보 카드 & 오버레이 패널 |
| **Glass Border** | `--color-glass-border` | `rgba(255, 255, 255, 0.12)` | 카드의 반투명 은은한 테두리 |
| **Glass Hover** | `--color-glass-hover` | `rgba(30, 41, 59, 0.85)` | 인터랙션 시 카드 강조 배경 |

### 2.2 브랜드 & 포인트 컬러 (Accent Colors)
| 토큰명 | CSS 변수 | Color Hex | 사용처 |
| :--- | :--- | :--- | :--- |
| **Primary Cyan Glow** | `--color-primary` | `#38BDF8` | 메인 촬영 버튼, 강조 텍스트, 포커스 링 |
| **Secondary Ice Blue**| `--color-secondary` | `#60A5FA` | 서브 타이틀, 기온 디스플레이 강조 |
| **Neon Purple Accent** | `--color-accent` | `#A855F7` | AI 분석 진행 중 가이드 링 |

### 2.3 피드백 & 상태 컬러 (Semantic Colors)
| 상태 | 토큰명 | Color Hex | 디자인 가이드 |
| :--- | :--- | :--- | :--- |
| **Good (적절)** | `--color-success` | `#10B981` | 에메랄드 그린 - 날씨 적합 뱃지 및 OK 모드 |
| **Warning (경고)** | `--color-warning` | `#F43F5E` | 네온 로즈/레드 - 부적절 옷차림 경고 팝업 및 부저 |
| **Notice (주의)** | `--color-notice` | `#F59E0B` | 엠버 옐로우 - 악천후(비/눈) 주의 알림 |

---

## 3. 타이포그래피 시스템 (Typography)

### 3.1 폰트 패밀리 지정
- **기본 본문 & UI (국문/영문)**: `'Noto Sans KR'`, `'Roboto'`, sans-serif
- **시계 & 디지털 데이터 (Monospace)**: `'Roboto Mono'`, `'Courier New'`, monospace (스마트 디스플레이 숫자 시인성 확보)

### 3.2 폰트 스케일 명세
```css
/* Typography Scale */
--font-display: bold 2.5rem / 1.2 'Roboto Mono', 'Noto Sans KR'; /* 대형 디지털 시계 / 기온 */
--font-h1: bold 1.75rem / 1.3 'Noto Sans KR';                     /* 카드 타이틀 */
--font-h2: 600 1.25rem / 1.4 'Noto Sans KR';                       /* 세부 섹션 헤더 */
--font-body-lg: 500 1rem / 1.6 'Noto Sans KR';                     /* AI 피드백 텍스트 */
--font-body-sm: 400 0.875rem / 1.5 'Noto Sans KR';                 /* 서브 설명 및 라벨 */
--font-caption: 400 0.75rem / 1.4 'Roboto Mono';                   /* 하드웨어 상태 / 타임스탬프 */
```

---

## 4. 레이아웃 & 그리드 구조 (Grid & Layout)

### 4.1 전체 프레임 비율: **9:16 스마트 거울 아키텍처**
- 전체 레이아웃은 세로형 9:16 비율(또는 데스크톱 모니터 반응형 중앙 정렬)의 거울 프레임을 기본으로 합니다.

```
+-------------------------------------------------------------------------+
| [Header] 🕒 14:30:00 (Digital Clock)     🌤️ 서울 24°C (Weather Widget)  |
|          🔌 Serial: Connected | 📟 LED Bar (Virtual Neopixel/Dot)     |
+------------------------------------+------------------------------------+
|                                    |                                    |
|  [Left Panel: Mirror Viewfinder]   |  [Right Panel: AI Diagnosis]       |
|                                    |                                    |
|   +----------------------------+   |   +----------------------------+   |
|   |                            |   |   | 🟢 [Good] 적절한 옷차림    |   |
|   |     Live Webcam View       |   |   |                            |   |
|   |     (Base64 Capture Frame) |   |   | "오늘 날씨에 얇은 셔츠가   |   |
|   |                            |   |   |  아주 잘 어울립니다."      |   |
|   +----------------------------+   |   +----------------------------+   |
|                                    |                                    |
|   [ 📸 옷차림 스캔 / 촬영 버튼 ]   |   🎨 추천 코디 4색 Palette Chip    |
|                                    |   [外] #1E293B  [上] #F8FAFC       |
|                                    |   [下] #334155  [鞋] #0F172A       |
+------------------------------------+------------------------------------+
| [Bottom Panel: Recommended Outfit Gallery]                              |
|  +----------------+  +----------------+  +----------------+             |
|  | Style Card 1   |  | Style Card 2   |  | Style Card 3   |             |
|  +----------------+  +----------------+  +----------------+             |
+-------------------------------------------------------------------------+
```

---

## 5. 가상 아두이노 하드웨어 인디케이터 UI 명세

Web Serial 아두이노 연결 상태와 부품 동작(도트매트릭스, 네오픽셀, 피에조 부저)을 화면 우측 상단에 시각적 가상 인디케이터로 노출합니다.

### 5.1 가상 도트매트릭스 (Virtual Dot Matrix)
- **디자인**: 8x8 그리드 픽셀 아트 LED 뱃지
- **상태 애니메이션**:
  - `맑음`: 중앙 노란색/주황색 LED 점등 (8x8 태양 모양)
  - `비`: 푸른색 LED 픽셀 아래로 흐르는 빗물 애니메이션
  - `눈`: 백색 LED 픽셀 반짝임 애니메이션

### 5.2 가상 네오픽셀 바 (Virtual Neopixel Bar)
- **디자인**: 4개의 네온 글로우 원형 LED 서클 (외투 - 상의 - 하의 - 신발)
- **동작**: Gemini API가 추천한 4개 Hex Color 코드가 전달되면 각 서클이 해당 색상으로 발광하며 CSS `box-shadow: 0 0 12px {color}` 글로우 효과 적용.

### 5.3 가상 피에조 부저 알림 팝업 (Virtual Piezo Alert)
- **디자인**: 경고(Warning) 발생 시 화면 중앙 하단에 파동(Sound Wave) 애니메이션 뱃지 및 빨간색 글래스 모달 팝업 표시.

---

## 6. 주요 UI 컴포넌트 명세 (Component Details)

### 6.1 메인 스캔 버튼 (Primary Neon Action Button)
- **CSS 스타일**:
  ```css
  .btn-scan {
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(96, 165, 250, 0.3));
    border: 1px solid var(--color-primary);
    color: #FFFFFF;
    font-family: 'Noto Sans KR', sans-serif;
    font-weight: 700;
    padding: 0.875rem 2rem;
    border-radius: 9999px; /* Pill Shape */
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .btn-scan:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px rgba(56, 189, 248, 0.6);
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.4), rgba(96, 165, 250, 0.5));
  }
  ```

### 6.2 대표 색상 칩 (Color Palette Swatch)
- **디자인**: 4개 영역(외투/상의/하의/신발)의 색상을 보여주는 라운드 칩 카드
- **구조**:
  - `[외투]` ⬛ `#1E293B`
  - `[상의]` ⬜ `#F8FAFC`
  - `[하의]` 🟦 `#3B82F6`
  - `[신발]` ⬛ `#0F172A`

### 6.3 코디 추천 이미지 카드 (Recommendation Card)
- **CSS 스타일**:
  - `border-radius: 16px;`
  - `overflow: hidden;`
  - `border: 1px solid rgba(255, 255, 255, 0.1);`
  - Image Hover 시 `scale(1.05)` 줌 효과 및 그라데이션 오버레이 텍스트 표기.

---

## 7. 인터랙션 & 애니메이션 효과 (Micro-Interactions)

1. **카운트다운 & 스캔 플래시 (Scan Pulse Flash)**:
   - 버튼 클릭 시 3초 카운트다운 숫자 디스플레이 ➡️ 캡처 직전 0.2초간 흰색 펄스 오버레이로 촬영 효과 전달.
2. **AI 분석 로딩 스피너 (Glass Pulse Spinner)**:
   - Gemini API 호출 중 거울 라이브 뷰어 중앙에 회전하는 네온 블루 링 스피너 노출.
3. **결과 카드 페이드인 (Fade-In Up Slide)**:
   - 분석 완료 시 결과 카드 및 추천 갤러리가 아래에서 위로 부드럽게 감속(Cubic-bezier)하며 등판.
