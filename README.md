# PillSync (필싱크) 💊
> **식약처 고시 데이터 기반 건강기능식품 성분 매칭 및 분석 플랫폼**

### 🔗 [라이브 서비스 바로가기 (Live Demo Link)](https://pillsync-ten.vercel.app/)

PillSync는 대한민국 식품의약품안전처(MFDS)의 기능성 고시 데이터를 참조하여 사용자의 건강 고민에 맞는 최적의 영양소 정보를 매칭하고, 기저 질환 보유 여부에 따른 안전한 대안 성분을 안내하는 프리미엄 다크 모드 하이브리드 웹 애플리케이션입니다.

---

## 📸 서비스 화면 미리보기 (Service Previews)

<div align="center">
  <h3>1. 메인 및 건강 고민 카테고리 선택 화면</h3>
  <img src="./src/screenshot/main.png" width="85%" alt="PillSync Main Dashboard" />
  <p><em>피로 개선, 다이어트, 탈모 및 모발 건강 등 3대 건강 고민 카테고리 선택 및 서비스 핵심 메리트 안내 대시보드</em></p>
  
  <br/>
  
  <h3>2. 세부 증상 및 라이프스타일 설문 화면</h3>
  <img src="./src/screenshot/sub1.png" width="85%" alt="PillSync Survey Page" />
  <p><em>사용자별 구체적인 증상과 식습관, 운동 성향 등의 라이프스타일을 간편하게 다중 선택(Multi-select)할 수 있는 설문 페이지</em></p>
  
  <br/>
  
  <h3>3. 맞춤 성분 분석 및 복합 시너지 패키지 제안 화면</h3>
  <img src="./src/screenshot/sub2.png" width="85%" alt="PillSync Result Page" />
  <p><em>식약처 권장량 대비 충족 비율 게이지, 복용 메리트 및 부작용 가이드, 복수 증상 선택 시 자동 활성화되는 시너지 원료 조합 패키지 안내</em></p>
</div>

---

## 1. 주요 핵심 기능 (Key Features)

### 1) 식약처 고시 데이터 기반 성분 안내 (Nutrient Matching)
- **3대 주요 건강 카테고리**: 피로 개선(Purple), 다이어트(Green), 탈모 및 모발 건강(Blue) 맞춤 정보 제공.
- **식약처 기능성 요약**: 고시된 공식 기능성 설명, 하루 권장 섭취량, 일반적인 제품 기준 고함량 충족 비율 게이지 실시간 표출.
- **섭취 메리트 & 부작용 아코디언**: 복용 팁 및 고함량 복용 시의 메리트와 과다 복용 시 주의해야 할 부작용 정보 내장.

### 2) 복합 성분 참고 시너지 (Synergy Combinations)
- 설문 중 연관된 다수의 불편 증상을 동시에 선택할 시, 식약처 고시에 기반하여 복합 섭취하면 기전 시너지가 발생하는 조합 패키지(예: 활력 부스터, 모근 밀착 방어 등)를 자동으로 추출하여 안내합니다.

### 3) 기저질환자용 대안 성분 실시간 스왑 (Alternative Ingredient Swap)
- 사용자가 기저 상태(고혈압, 통풍 기왕력, 지성 여드름 피부, 위장 과민 등) 체크박스를 선택하면, 부작용 위험이 있는 기존 추천 성분 대신 **부작용이 없고 안전하게 기능을 대체할 수 있는 대안 성분으로 실시간 스왑(Swap)**하고 상세 추천 사유를 안내합니다.

### 4) 실시간 쿠팡 파트너스 연동 및 Direct 이동
- 추천 성분에 맞는 최적의 쿠팡 파트너스 딥링크(`coupang_link`)가 적용되어 즉시 다이렉트로 연결됩니다.
- 전자상거래법 및 표시광고법을 엄격히 준수하기 위해 상품 정보의 가격·리뷰 수 등이 예시 데이터임을 고지하고, 파트너스 수수료 고지 문구를 하단 배너에 통합하여 1회 노출합니다.

### 5) 법적 리스크 준수 (Legal Compliance)
- 의료법 제27조(무면허 의료행위) 및 표시광고법 위반 리스크를 원천 차단하기 위해 **"식약처 공인" 등의 주관적 단어를 배제**하고 **"식약처 고시 데이터 참조/기반"**으로 표현을 대대적으로 순화하였습니다.
- 민감 정보 수집 이슈 방지를 위해 수집된 데이터는 서버로 전송되지 않고 **브라우저 로컬 상태 내에서만 안전하게 일시 처리**된다는 안내 문구를 포함하고 있습니다.

### 6) 실시간 DB 및 관리자 설정 패널 (Developer Backoffice Admin Panel)
- 데스크톱 환경(주소창에 `?admin=true` 파라미터가 있을 때 작동)에서 에뮬레이팅된 모바일 화면 옆에 실시간 DB 스키마 뷰어 및 신규 카테고리/성분 추가 폼을 탑재하여 백오피스 관리가 가능합니다.
- 외부 제3자에 의한 데이터 위조 및 임의 변경을 방지하기 위해 **Supabase Auth 기반 관리자 로그인** 보안 레이어가 구축되어 있습니다. (로그인 시에만 데이터베이스 쓰기 및 수정 권한이 허용됩니다.)

### 7) 모바일 접근성 및 가독성 최적화 (Accessibility & Mobile UX)
- **타입 스케일 토큰화**: 화면 폰트 크기를 상대 단위(`rem`) 기반의 규격화된 CSS 토큰(`--fs-xs` ~ `--fs-xl`)으로 관리하여, 시니어 모드 활성화 시 전체 레이아웃이 유기적이고 일관되게 확대됩니다.
- **터치 타깃 영역 보장**: 모바일 상에서의 오클릭/오터치를 방지하기 위해 최소 터치 영역(`--touch-min`)을 모바일 디자인 표준에 부합하는 `44px` (시니어 모드 시 `48px`) 이상으로 넓혀 편의성을 극대화했습니다.
- **결과 페이지 정보 밀도 완화**: 분석 완료 화면 진입 시 발생할 수 있는 정보 피로감을 줄이기 위해 영양 성분별 상세 부작용/팁 아코디언 가이드를 기본 접힘(`default-collapsed`) 형태로 제공하여 가독성을 높였습니다.

---

## 2. 하이브리드 아키텍처 및 폴백 (Hybrid Architecture)
PillSync는 클라우드와 로컬 오프라인 환경 모두를 지원하는 하이브리드 설계로 구현되어 있습니다.

* **Supabase 클라우드 모드 (Default)**: Supabase에 구축된 SQL 테이블(`categories`, `symptoms`, `ingredients_mapping`, `synergy_combinations`, `synergy_ingredients`) 데이터를 실시간 비동기 연동하여 동작합니다.
* **로컬 오프라인 폴백 모드 (Local Fallback)**: 클라우드 접속 정보가 없거나 네트워크 통신 불가 등 예외 발생 시, 로컬 내장 모의 데이터 객체로 끊김 없이 자동 전환되어 앱 기능의 중단 없는 사용을 보장합니다.

---

## 3. 디렉토리 구조 (Directory Layout)
```
PillSync/
├── docs/                                 # 프로젝트 문서 보관 폴더
│   ├── specs/                            # 핵심 설계 및 디자인 시스템 명세서
│   │   ├── development_specification.md  # 기능 요구사항
│   │   ├── kfda_ingredient_spec.md       # 식약처 고시 원료 설명문 스펙
│   │   ├── system_architecture.md        # 시스템 흐름, DB 스키마 및 RLS 명세
│   │   └── design_system.md              # 컬러 토큰, 폰트 및 모바일 레이아웃 명세
│   └── daily_logs/
│       └── daily_log_20260615.md         # 일일 개발 및 버그 수정 로그
├── public/                               # 로고, 정적 리소스 자산
├── src/
│   ├── App.jsx                           # 메인 모바일 에뮬레이터 및 비즈니스 로직 컴포넌트
│   ├── index.css                         # UI 전반의 퓨처리즘 다크테마 CSS 스타일시트
│   ├── main.jsx                          # React 렌더링 엔트리
│   └── supabaseClient.js                 # Supabase SDK 연결 상태 감지 모듈
├── supabase_schema.sql                   # Supabase DB 이식용 SQL 백업 스크립트
├── package.json                          # 빌드 스크립트 및 모듈 의존성 정의
└── vite.config.js                        # Vite 컴파일러 환경 정의
```

---

## 4. 설치 및 실행 가이드 (Getting Started)

### 1) 로컬 패키지 설치
```bash
# 의존성 패키지 설치
npm install
```

### 2) 환경 변수 설정 (.env)
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 Supabase 연결 키를 입력합니다. (미설정 시 오프라인 로컬 목업 모드로 실행됩니다.)
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

### 3) 로컬 개발 서버 실행
```bash
# 개발 모드 기동 (http://localhost:5173/)
npm run dev
```

### 4) 어드민 패널 활성화 및 관리자 설정 (Developer Admin Panel)
PillSync는 실시간 DB 레코드 관리 및 쿠팡 파트너스 링크 수정 등을 위해 데스크톱 화면 전용 백오피스 어드민 패널을 내장하고 있습니다.

*   **접속 방법**: 서비스 도메인 또는 로컬 기동 주소 뒤에 쿼리 스트링 `?admin=true`를 붙여서 진입합니다.
    *   **로컬 개발 환경**: [http://localhost:5173/?admin=true](http://localhost:5173/?admin=true)
    *   **배포(프로덕션) 환경**: `https://[PillSync 배포 도메인]/?admin=true`
*   **접속 조건**: 화면 너비가 넓은 **PC(데스크톱/노트북) 브라우저**에서만 관리자 패널이 노출됩니다. (화면 너비 768px 이하 또는 모바일 기기로 접속 시에는 모바일 에뮬레이터 화면만 표시되고 패널은 자동으로 숨김 처리됩니다.)
*   **보안 및 인증 정책 (Row Level Security)**:
    - 외부 공격자에 의한 무단 DB 변조 및 쿠팡 링크 유출을 철저히 예방하기 위해, 모든 테이블의 쓰기(`INSERT/UPDATE/DELETE`) 동작은 **Supabase Auth로 로그인된 인증 유저(authenticated)**에게만 제한됩니다.
    - 배포 환경의 어드민 패널에서 쓰기 기능을 활성화하려면, Supabase 대시보드 `Authentication` -> `Users`에서 관리자 이메일 계정을 직접 생성하여 로그인해야 합니다.
    - 단, 로컬 오프라인 개발 모드(Supabase 미연결)에서는 테스트 편의를 위해 로그인 없이도 관리자 편집 폼이 동작합니다.
*   **주요 기능**:
    1.  **DB 스키마 뷰어**: Supabase의 주요 테이블(`categories`, `symptoms`, `ingredients_mapping`, `synergy_combinations`) 데이터 상태를 실시간 테이블로 시각화해 조회합니다.
    2.  **신규 카테고리 추가**: 새로운 건강 고민 카테고리, 설문 질문 문구, 매칭되는 신규 영양제 성분 정보를 폼 입력 한 번으로 데이터베이스에 동시 적재합니다. (로그인 후 사용 가능)
    3.  **링크/제품 관리**: 
        *   성분을 선택하여 개별 카드에 매핑된 쿠팡 파트너스 단축 링크(`https://link.coupang.com/a/...`)를 손쉽게 등록 및 수정할 수 있습니다. (로그인 후 사용 가능)
        *   입력된 링크는 Supabase `ingredients_mapping.coupang_link` 컬럼에 실시간으로 반영/저장되어 배포 서버에 즉시 업데이트됩니다.

### 5) 프로덕션 빌드
```bash
# 빌드 실행
npm run build
```

---

## 5. 데이터베이스 이식 방법 (Supabase DB Setup)
클라우드 데이터베이스 모드를 구동하기 위해 아래 가이드를 진행합니다.
1. Supabase 프로젝트의 **SQL Editor**로 이동합니다.
2. 새 쿼리창(New Query)을 엽니다.
3. 프로젝트 루트에 있는 [supabase_schema.sql](file:///c:/Users/stone/projects/PillSync/supabase_schema.sql) 파일의 전체 내용을 복사하여 붙여넣습니다.
4. **Run** 버튼을 눌러 테이블 생성, 보안 정책(RLS) 주입 및 초기 시드 데이터를 적재합니다.
