# PillSync Design System Specification

## 1. 디자인 원칙 및 에스테틱 (Aesthetics)
PillSync의 비주얼 디자인은 **Rich Modern & Premium Futuristic CSS** 에스테틱을 따릅니다. 무겁고 어두운 백그라운드 톤 위에 비비드한 그라데이션 광원(Glow Orbs)과 반투명 글래스모피즘(Glassmorphism) 요소를 오버레이하여 깊이 있고 입체적인 디자인 감성을 선사합니다.

---

## 2. 컬러 토큰 (Color Palette)
전체 스타일은 Harmounious Dark Mode 테마를 기반으로 구성되었으며, 카테고리별 정체성을 강화하는 포인트 컬러가 할당되어 있습니다.

### 1) 테마 기본 컬러 (CSS Variables)
```css
:root {
  --color-bg: #0b0f19;          /* 깊은 네이비 계열 다크 배경 */
  --color-surface: #141c2f;     /* 컨테이너 및 카드 배경 */
  --color-surface-hover: #1e294b;/* 요소 호버 시 하이라이트 배경 */
  --color-primary: #8b5cf6;     /* 펄프/바이올렛 기본 포인트 */
  --color-secondary: #f43f5e;   /* 로즈/코랄 시너지 포인트 */
  --color-text: #f3f4f6;        /* 퓨어 화이트 텍스트 */
  --color-text-muted: #9ca3af;  /* 뮤트 그레이 부가 설명 텍스트 */
  --color-border: #1e293b;      /* 다크 테마 경계선 */
  --color-success: #10b981;    /* 녹색 성공/매칭 배지 */
}
```

### 2) 카테고리별 테마 테일러링 컬러
각 건강 고민 분류에 따라 맞춤 아이콘 및 테두리/텍스트 스타일링에 고유 클래스를 연동합니다.
* **피로 개선 (`.cat-fatigue`)**: 보라색 테마 (`#8b5cf6` 계열) - 피로 회복 및 집중력 회복의 에너지를 암시.
* **다이어트 (`.cat-diet`)**: 녹색 테마 (`#10b981` 계열) - 체지방 감소 및 헬시 다이어트의 웰빙을 암시.
* **탈모 & 모발 건강 (`.cat-hair`)**: 파란색 테마 (`#3b82f6` 계열) - 영양 공급과 두피 장벽 강화의 청량감을 암시.

---

## 3. 타이포그래피 (Typography)
기본 브라우저 폰트를 탈피하여 구글 폰트(Google Fonts)의 **Outfit**과 **Inter** 폰트를 조합하여 깔끔하고 신뢰도 높은 가독성을 유도합니다.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700;800&display=swap');
```
* **제목 및 하이라이트 배지**: `font-family: 'Outfit', sans-serif;`
  - 두껍고 기하학적인 프리미엄 폰트로 고급 브랜딩 효과 부여.
* **본문 및 설명 텍스트**: `font-family: 'Inter', sans-serif;`
  - 선명한 획과 글자 폭으로 좁은 모바일 화면에서도 뛰어난 정보 판독성 보장.

---

## 4. 글래스모피즘 & 레이아웃 요소 (UI Components)

### 1) 글래스모피즘 카드 스타일
카드 컴포넌트는 반투명 면적과 얇은 하이라이트 테두리, 그리고 배경 블러 처리를 적용해 어두운 공간에 떠 있는 듯한 고급 디자인 감성을 만듭니다.
```css
.card {
  background: rgba(20, 28, 47, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
```

### 2) 데스크톱 2열 레이아웃 & 모바일 대응 구조
PillSync의 화면 설계는 이중 구조를 채택하여 데스크톱 환경과 에뮬레이션 환경 모두를 최적으로 수용합니다.
* **데스크톱 뷰 (`.content-grid`)**:
  - **좌측 열 (Device Section)**: 실제 스마트폰 장치 프레임(`.mobile-frame`)을 모방한 에뮬레이터 뷰어로 모바일 앱 실행 환경을 시각적으로 고스란히 체감하게 설계.
  - **우측 열 (Admin Section)**: 관리자용 실시간 DB 스키마 및 신규 데이터 적재 패늘로 구성하여 백오피스 개발자 도구를 미려하게 렌더링.
* **모바일 장치 뷰 (`.is-mobile-device` / 미디어쿼리 768px 이하)**:
  - 데스크톱 프레임워크와 불필요한 우측 패널을 숨기고 오직 에뮬레이션되던 모바일 서비스 화면만 화면 가득 채워 반응형 최적화 실현.

---

## 5. 마이크로 인터랙션 & 애니메이션 (Animations)

### 1) 배경 그라데이션 브리딩 (Glow Orbs)
배경에 은은한 펄프 광원인 `glow-orb` 요소를 원형으로 띄우고 서서히 위치가 숨쉬듯 움직이는 애니메이션 효과를 주어 앱에 생동감을 부여합니다.
```css
@keyframes orbFloat {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -60px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
}
```

### 2) 화면 전환 및 렌더링 페이드인
사용자가 카테고리를 터치하거나 결과를 완료할 때 화면 내용이 튀지 않고 부드럽게 나타나도록 페이드인 트랜지션을 적용합니다.
```css
.animate-fade {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3) 버튼 및 대화형 카드 인터랙션
- **카테고리 카드 호버**: 카드 우측의 화살표 아이콘이 조금씩 이동하며 호버 상태를 피드백함.
- **체크박스 선택 및 스왑**: 부작용 위험 조건 체크박스를 활성화하면, 대안 대체 성분 영역이 밝아지며 실시간 대체(Swap) 연출을 자연스러운 크기 변화와 페이드인 효과로 안내함.
- **쿠팡 상품 카드**: 마우스 포인터를 올렸을 때 카드가 2px 들어 올려지며 미세하게 테두리 링에 조명이 들어와 클릭 가능 여부를 직관적으로 보여줌.
