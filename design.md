# 🎨 스마트 거울 비서 (Smart Mirror Assistant) 상세 UI/UX 디자인 가이드

> **작성자**: UI/UX 디자인 전문가 & 프론트엔드 아키텍트  
> **버전**: v1.1 (화면별 디자인 및 애니메이션 가이드 보강)  
> **최종 수정일**: 2026-07-31  
> **관련 문서**: [PRD (prd.md)](file:///c:/Users/hun95/.gemini/antigravity-ide/scratch/smart-mirror/prd.md)  

---

## 1. 디자인 컨셉 및 원칙 (Design Concept & Principles)

### 1.1 디자인 컨셉: **"Obsidian Smart Glass & High-Contrast Mirror"**
실제 은경(스마트 거울) 위에 디지털 HUD(Head-Up Display) 정보가 띄워진 듯한 **딥 다크 글래스모피즘(Dark Glassmorphism)**과 **고대비 시각적 요소**를 결합한 미래지향적 인터페이스입니다.

### 1.2 핵심 UX 원칙
1. **높은 시인성 (High Visibility)**: 어두운 거울 배경 위에서도 한눈에 기온, 옷차림 피드백, 색상 칩을 볼 수 있는 고대비 타이포그래피 및 네온 아웃라인 적용.
2. **시각적 몰입감 (Visual Immersion)**: 9:16 세로형 프레임 비율을 활용하여 사용자가 거울 앞에 서 있는 느낌 제공.
3. **직관적인 하드웨어 피드백 (Virtual Hardware Feedback)**: 화면 우측 상단에 가상 도트매트릭스/네오픽셀 LED 바를 배치하여 하드웨어 상태를 시각적으로 실시간 모니터링.

---

## 2. 컬러 시스템 & 디자인 토큰 (Color Tokens)

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
/* Typography Scale Token */
--font-display: bold 2.5rem / 1.2 'Roboto Mono', 'Noto Sans KR'; /* 대형 디지털 시계 / 기온 */
--font-h1: bold 1.75rem / 1.3 'Noto Sans KR';                     /* 카드 타이틀 */
--font-h2: 600 1.25rem / 1.4 'Noto Sans KR';                       /* 세부 섹션 헤더 */
--font-body-lg: 500 1rem / 1.6 'Noto Sans KR';                     /* AI 피드백 텍스트 */
--font-body-sm: 400 0.875rem / 1.5 'Noto Sans KR';                 /* 서브 설명 및 라벨 */
--font-caption: 400 0.75rem / 1.4 'Roboto Mono';                   /* 하드웨어 상태 / 타임스탬프 */
```

---

## 4. 전체 레이아웃 & 그리드 구조 (Grid & Layout)

### 4.1 9:16 세로형 거울 구조
```
+-------------------------------------------------------------------------+
| [Header Area]                                                           |
| 🕒 14:30:00 (Digital Clock)          🌤️ 서울 24°C (Weather Widget)    |
| 🔌 Web Serial: Connected            📟 LED Bar (Virtual Dot/Neopixel) |
+------------------------------------+------------------------------------+
|                                    |                                    |
| [Section A: Webcam Viewfinder]     | [Section B: AI Diagnosis Panel]    |
|                                    |                                    |
|  +------------------------------+  |  +------------------------------+  |
|  |  Live Camera Stream          |  |  | 🟢 [Good] 적절한 옷차림      |  |
|  |  (Target Alignment Guide)    |  |  |                              |  |
|  |                              |  |  | "오늘 날씨에 얇은 셔츠가     |  |
|  +------------------------------+  |  |  아주 잘 어울립니다."        |  |
|                                    |  +------------------------------+  |
|  [ 📸 옷차림 스캔/촬영 버튼 ]      |                                    |
|                                    |  🎨 추천 코디 4색 Palette Chip     |
|                                    |  [外] #1E293B  [上] #F8FAFC        |
|                                    |  [下] #334155  [鞋] #0F172A        |
+------------------------------------+------------------------------------+
| [Section C: Recommended Outfit Gallery]                                 |
| +-------------------+  +-------------------+  +-------------------+     |
| | Style Card 1      |  | Style Card 2      |  | Style Card 3      |     |
| +-------------------+  +-------------------+  +-------------------+     |
+-------------------------------------------------------------------------+
```

---

## 5. 화면별 세부 디자인 가이드 (Screen Detailed Guides)

### 5.1 날씨 정보 화면 (Weather Information Screen / Header Widget)
- **목표**: 상단 거울 헤더 영역에서 실시간 지역 날씨, 기온, 습도, 시계 및 위젯을 고대비로 표시.
- **디자인 구성요소**:
  - **디지털 시계**: HH:mm:ss 형태의 Monospace 폰트, 네온 블루 글로우 적용
  - **기온 위젯**: `24°C` (대형 폰트), 체감온도 `(26°C)`, 습도 `60%`
  - **날씨 상태 아이콘**: 맑음(☀️), 구름(☁️), 비(🌧️), 눈(❄️) 등의 동적 애니메이션 아이콘
  - **날씨 상태 뱃지**: `[맑음 - 외출하기 좋은 날]` (그린 뱃지)
- **UI 코드 스타일 가이드**:
  ```css
  .weather-widget {
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .temp-display {
    font-family: 'Roboto Mono', monospace;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-primary);
    text-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
  }
  ```

---

### 5.2 웹캠 촬영 및 옷차림 분석 화면 (Webcam Shooting & Analysis Screen)
- **목표**: 거울 중앙 화면에서 실시간 웹캠 비디오를 보며 촬영하고, AI 분석 진행 상태를 피드백함.
- **디자인 구성요소**:
  - **거울 뷰파인더 (Viewfinder)**: 4:3 또는 세로 9:16 비율, 네온 코너 가이드라인 렌더링
  - **스캔 가이드 레이어**: 상반신/전신 영역 가이드 점선 가이드 링 (`rgba(56, 189, 248, 0.3)`)
  - **메인 캡처 버튼**: 네온 글로우 펄스 효과가 있는 둥근 알약(Pill) 모양 버튼 (`📸 옷차림 스캔 / 촬영`)
  - **촬영 동작 UX**:
    1. **Idle**: 웹캠 스트림 라이브 표시 & 버튼 활성화
    2. **Countdown**: 버튼 클릭 시 3, 2, 1 카운트다운 숫자가 뷰파인더 중앙에 대형으로 표시
    3. **Flash**: 캡처 순간 0.2초간 전체 화면 백색 플래시 오버레이
    4. **AI Analyzing Loading**: 뷰파인더 중앙에 네온 블루 링 스피너 회전 & `"Gemini API 옷차림 분석 중..."` 텍스트
- **UI 코드 스타일 가이드**:
  ```css
  .webcam-container {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    border: 2px solid rgba(56, 189, 248, 0.3);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
  }
  .webcam-guide-overlay {
    position: absolute;
    inset: 0;
    border: 1px dashed rgba(56, 189, 248, 0.5);
    margin: 20px;
    border-radius: 12px;
    pointer-events: none;
  }
  ```

---

### 5.3 추천 코디 및 진단 화면 (Outfit Recommendation & Diagnosis Screen)
- **목표**: Gemini API 분석 결과를 받아 적합도 뱃지, 피드백, 4개 아이템 대표 색상 칩, 이미지 갤러리로 제공.
- **디자인 구성요소**:
  - **적합도 판정 뱃지 (Pill Badge)**:
    - 🟢 `[Good] 적절한 옷차림` (에메랄드 그린, `#10B981`)
    - 🔴 `[Warning] 날씨 대비 얇음/두꺼움` (네온 로즈, `#F43F5E`)
  - **AI 평가 피드백 카드**: 반투명 글래스 패널 위 깔끔한 typography 서술 ("현재 28°C 폭염 날씨에 두꺼운 니트는 열사병 위험이 있습니다. 얇은 반팔 티셔츠를 추천합니다.")
  - **4-Color Palette Swatch**:
    - `외투`: `#1E293B` (자켓) | `상의`: `#F8FAFC` (티셔츠)
    - `하의`: `#334155` (슬랙스) | `신발`: `#0F172A` (스니커즈)
    - 각 색상 칩 클릭 시 Hex 코드 복사 툴팁 제공
  - **추천 코디 이미지 갤러리**: 3~4개의 타일형 카드. 호버 시 Zoom 인 및 추천 스타일 명칭 표기
- **UI 코드 스타일 가이드**:
  ```css
  .color-chip-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-top: 1rem;
  }
  .color-chip-item {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 0.75rem;
    text-align: center;
  }
  .color-swatch-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin: 0 auto 0.5rem auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  ```

---

## 6. 가상 아두이노 하드웨어 인디케이터 디자인

화면 우측 상단에 물리 아두이노 부품 연결 상태 및 렌더링을 시각적 미니 위젯으로 배치합니다.

- **가상 도트매트릭스 (8x8 LED Grid)**:
  - 맑음(☀️), 흐림(☁️), 비(🌧️), 눈(❄️)에 맞춰 8x8 픽셀 LED 사각형이 노란색/푸른색/백색으로 발광
- **가상 네오픽셀 바 (4-Segment LED Bar)**:
  - 추천 코디 4색이 결정되면 실시간으로 4개의 동그란 원형 LED 서클이 각 Hex 코드로 발광하며 `box-shadow` 글로우 전산화
- **가상 피에조 부저 팝업 (Web Audio Notification)**:
  - Warning 상태 발생 시 화면 하단에 음파 파동 애니메이션(Sound Wave)과 함께 주의 레드 팝업 출력

---

## 7. 마이크로 인터랙션 & 애니메이션 가이드 (Animations)

### 7.1 주요 애니메이션 및 CSS Keyframes 코드

#### 1) 📸 카메라 캡처 플래시 애니메이션 (Camera Flash)
```css
@keyframes cameraFlash {
  0% { opacity: 0; }
  20% { opacity: 0.95; background-color: #ffffff; }
  100% { opacity: 0; }
}
.flash-effect {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  animation: cameraFlash 0.3s ease-out forwards;
}
```

#### 2) 🔮 AI 스캔 펄스 애니메이션 (Scanline Pulse)
```css
@keyframes scanlineMove {
  0% { top: 0%; opacity: 0.8; }
  50% { opacity: 1; }
  100% { top: 100%; opacity: 0.2; }
}
.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  box-shadow: 0 0 15px var(--color-primary);
  animation: scanlineMove 2s ease-in-out infinite;
}
```

#### 3) 🟢 결과 카드 페이드인 업 (Card Fade-In Up)
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

#### 4) 📟 가상 네오픽셀 LED 발광 글로우 (Neopixel Glow Pulse)
```css
@keyframes ledGlow {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.08); filter: brightness(1.3); }
}
.neopixel-led-active {
  animation: ledGlow 1.5s ease-in-out infinite;
}
```
