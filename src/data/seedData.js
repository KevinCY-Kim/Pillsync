// ==========================================================
// PillSync Seed Data — 단일 진실 소스 (Single Source of Truth)
// ==========================================================
// 이 파일이 카테고리/증상/성분/시너지 텍스트의 유일한 원본입니다.
// - src/App.jsx는 이 데이터를 import해서 로컬 오프라인 폴백으로 사용합니다.
// - supabase_schema.sql은 scripts/generate-supabase-seed.mjs가 이 파일을 읽어
//   자동으로 생성합니다. supabase_schema.sql을 손으로 직접 고치지 마세요 —
//   다음에 자동 생성을 돌리면 덮어써집니다.
//
// 텍스트(카테고리 설명, 증상 문구, 성분 효과/부작용 등)를 수정할 때는
// 이 파일만 고친 뒤 `node scripts/generate-supabase-seed.mjs`를 실행해서
// supabase_schema.sql을 다시 생성하고, 그 결과를 Supabase SQL Editor에서
// 실행하세요. 로컬 화면과 Supabase 연동 화면의 텍스트가 항상 일치합니다.
// ==========================================================

export const localCategories = [
  { id: 1, name: "피로 개선", desc: "과로·번아웃으로 지친 분 맞춤형", icon: "fa-battery-three-quarters", class: "cat-fatigue" },
  { id: 2, name: "다이어트", desc: "체중·체지방이 고민인 분 맞춤형", icon: "fa-person-running", class: "cat-diet" },
  { id: 3, name: "탈모 & 모발 건강", desc: "머리숱·모근 약화가 걱정인 분 맞춤형", icon: "fa-feather", class: "cat-hair" },
  { id: 4, name: "눈 건강", desc: "화면 피로·눈 침침함이 고민인 분 맞춤형", icon: "fa-eye", class: "cat-eye" },
  { id: 5, name: "혈행 개선", desc: "혈액 순환·손발 냉감이 고민인 분 맞춤형", icon: "fa-heartbeat", class: "cat-blood" },
  { id: 6, name: "수면 & 스트레스", desc: "잠 못 드는 밤·긴장 완화가 필요한 분 맞춤형", icon: "fa-moon", class: "cat-sleep" }
];

export const localSymptoms = [
  // 피로 개선 증상 (5종)
  { id: 101, category_id: 1, text: "아침에 일어날 때 몸이 납덩이처럼 무거워요", ingredient_id: "밀크씨슬" },
  { id: 102, category_id: 1, text: "오후만 되면 집중력이 깨지고 쉽게 나른해져요", ingredient_id: "비타민B군" },
  { id: 103, category_id: 1, text: "업무/학업 스트레스로 인해 쉽게 지치고 기력이 없어요", ingredient_id: "홍경천 추출물" },
  { id: 104, category_id: 1, text: "만성적인 기력 저하가 있고 면역력이 쉽게 떨어져요", ingredient_id: "홍삼" },
  { id: 105, category_id: 1, text: "가슴이 답답하고 긴장되며 스트레스를 자주 받아요", ingredient_id: "L-테아닌" },

  // 다이어트 증상 (5종)
  { id: 201, category_id: 2, text: "밥, 빵, 면 등 탄수화물 위주의 식사를 즐겨 먹어요", ingredient_id: "가르시니아" },
  { id: 202, category_id: 2, text: "기름진 음식을 좋아하고 인바디 체지방률이 높게 나와요", ingredient_id: "녹차카테킨" },
  { id: 203, category_id: 2, text: "기초대사량이 낮아 살이 잘 찌고 운동 효과를 늘리고 싶어요", ingredient_id: "콜레우스포스콜리" },
  { id: 204, category_id: 2, text: "식사량 조절이 어렵고 뱃살 위주로 빠르게 체지방을 빼고 싶어요", ingredient_id: "시서스" },
  { id: 205, category_id: 2, text: "체지방 연소를 촉진하고 유산소 운동 수행 능력을 올리고 싶어요", ingredient_id: "L-카르니틴" },

  // 탈모 & 모발 건강 증상 (5종)
  { id: 301, category_id: 3, text: "머리카락이 가늘어지고 자고 일어나면 베개에 숱이 눈에 띄게 줄어요", ingredient_id: "비오틴" },
  { id: 302, category_id: 3, text: "두피 영양이 부족해 모발에 윤기가 없고 푸석푸석해요", ingredient_id: "맥주효모" },
  { id: 303, category_id: 3, text: "두피 각질이나 비듬이 늘어 두피 환경 및 면역을 케어하고 싶어요", ingredient_id: "아연" },
  { id: 304, category_id: 3, text: "머리카락이 쉽게 끊어지고 가늘어지는 연모화 현상이 느껴져요", ingredient_id: "L-시스틴" },
  { id: 305, category_id: 3, text: "두피가 붉게 올라오고 모근의 탄력과 힘이 약해진 것 같아요", ingredient_id: "판토텐산" },

  // 눈 건강 증상 (5종)
  { id: 401, category_id: 4, text: "스마트폰이나 모니터를 오래 보면 눈이 쉽게 피로하고 침침해요", ingredient_id: "헤마토코쿠스 추출물" },
  { id: 402, category_id: 4, text: "나이가 들면서 황반색소 밀도가 줄어 시야가 흐릿하고 침침해요", ingredient_id: "루테인지아잔틴" },
  { id: 403, category_id: 4, text: "어두운 곳에서 시각 적응이 어렵고 눈이 건조하고 뻑뻑해요", ingredient_id: "헤마토코쿠스 추출물" },
  { id: 404, category_id: 4, text: "야간 운전 시 빛 번짐이 심하고 초점 맞추기가 어려워요", ingredient_id: "루테인지아잔틴" },
  { id: 405, category_id: 4, text: "컴퓨터 작업 시 눈이 침침해서 자주 깜빡이고 피로감을 크게 느껴요", ingredient_id: "헤마토코쿠스 추출물" },

  // 혈행 개선 증상 (5종)
  { id: 501, category_id: 5, text: "평소 육류나 기름진 음식을 많이 섭취하여 혈중 중성지질이 신경 쓰여요", ingredient_id: "오메가3" },
  { id: 502, category_id: 5, text: "손발이 쉽게 차가워지고 전신 혈액 순환이 원활하지 않은 것 같아요", ingredient_id: "은행잎 추출물" },
  { id: 503, category_id: 5, text: "기억력이 최근 들어 예전 같지 않고 자꾸 깜빡깜빡 잊어버려요", ingredient_id: "은행잎 추출물" },
  { id: 504, category_id: 5, text: "인스턴트 식습관으로 혈관 건강 및 깨끗한 혈류를 관리하고 싶어요", ingredient_id: "오메가3" },
  { id: 505, category_id: 5, text: "두뇌 활동이 많아 뇌 혈류 공급을 늘리고 기억력을 개선하고 싶어요", ingredient_id: "은행잎 추출물" },

  // 수면 & 스트레스 증상 (5종)
  { id: 601, category_id: 6, text: "잠자리에 누워도 생각과 고민이 많아 쉽게 잠들기 어려워요", ingredient_id: "감태 추출물" },
  { id: 602, category_id: 6, text: "매일 밤 자다 깨다를 반복해서 깊은 잠(숙면)을 이루기 힘들어요", ingredient_id: "락티움" },
  { id: 603, category_id: 6, text: "일상이나 직장에서 만성적인 긴장 상태가 지속되어 릴렉스가 필요해요", ingredient_id: "L-테아닌" },
  { id: 604, category_id: 6, text: "아침에 깨어났을 때 개운하지 않고 수면 부족으로 온종일 멍해요", ingredient_id: "감태 추출물" },
  { id: 605, category_id: 6, text: "수면 시간이 불규칙하고 심신의 안정을 취하고 싶어요", ingredient_id: "락티움" }
];

export const localIngredientsMapping = {
  "밀크씨슬": {
    name: "밀크씨슬 추출물 (실리마린)",
    desc: "실리마린 성분이 간 세포막을 보호하고 항산화 작용을 돕고 피로 회복을 위한 간 건강 기능성을 식약처가 고시함",
    keyword: "밀크씨슬 실리마린 직구",
    coupang_link: "https://link.coupang.com/a/eA5jqbcCGq",
    kfda_daily_intake: "실리마린 기준 130 mg",
    high_dose_ratio: "260 mg (200% 충족)",
    high_dose_effect: "만성 피로 해소 및 간 세포막 보호 작용을 신속히 활성화하여 과로로 인한 일시적 간 수치 개선에 기여",
    side_effects: "과다 복용 시 위장 장애(설사, 복통)가 발생할 수 있습니다.",
    intake_tip: "위장에 무리를 줄 수 있으므로 식사 직후 충분한 물과 함께 섭취하세요.",
    warning_trigger_text: "위장이 민감하여 평소 복통이나 설사가 자주 생깁니다.",
    alternative_ingredient_id: "홍경천 추출물",
    alternative_reason: "밀크씨슬 추출물은 위와 장을 강하게 자극하여 소화기 통증이나 설사를 일으킬 수 있으므로, 부작용 없이 부신 활력을 회복하는 홍경천 추출물을 안전한 피로 회복 대안으로 추천합니다."
  },
  "비타민B군": {
    name: "활성 비타민B 콤플렉스",
    desc: "수용성 비타민 B1, B2, B6, B12 복합체로 체내 에너지 생성 및 대사에 필수적이며 육체 피로 회복에 도움",
    keyword: "고함량 비타민B 컴플렉스",
    coupang_link: "https://link.coupang.com/a/eA5C8k5o9Q",
    kfda_daily_intake: "비타민B1 기준 1.2 mg",
    high_dose_ratio: "100 mg (8,333% 충족)",
    high_dose_effect: "체내 에너지 대사를 활성화하여 활력 회복을 돕고 젖산 축적을 줄이는 데 기여합니다.",
    side_effects: "고함량 섭취 시 소변이 형광 노란색으로 변하거나 일시적으로 불면증, 위장 장애가 발생할 수 있습니다.",
    intake_tip: "에너지 생성을 도우므로 밤늦은 시간보다는 아침이나 낮 시간대 복용을 권장합니다.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "홍경천 추출물": {
    name: "홍경천 추출물 (로디올라)",
    desc: "고산지대 자생 식물로 스트레스로 인한 피로를 개선하는 데 도움을 줄 수 있음을 식약처가 인정한 기능성 원료",
    keyword: "홍경천 로디올라 스트레스",
    coupang_link: "https://link.coupang.com/a/eA5HxP9cVo",
    kfda_daily_intake: "로디올라오사이드 기준 200 mg",
    high_dose_ratio: "200 mg (100% 충족)",
    high_dose_effect: "스트레스로 인한 피로 개선 및 가슴 두근거림 완화 효과",
    side_effects: "일부 두통 및 어지러움, 혈압에 일시적 변동이 올 수 있습니다.",
    intake_tip: "오전 또는 오후 섭취가 적당하며, 진정 성분이 있으므로 다른 약물과의 간섭에 주의하세요.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "홍삼": {
    name: "홍삼 (진세노사이드)",
    desc: "사포닌(Rg1, Rb1, Rg3) 성분이 함유되어 면역력 증진, 피로 개선, 항산화에 도움을 줄 수 있는 대표 고시형 원료",
    keyword: "홍삼정 에브리타임 스틱",
    coupang_link: "https://link.coupang.com/a/eA5Lf855Lo",
    kfda_daily_intake: "진세노사이드 기준 3 mg",
    high_dose_ratio: "15 mg (500% 충족)",
    high_dose_effect: "기력 증진과 면역력 향상에 도움을 줄 수 있으며, 항산화 작용을 통해 활력 회복을 지원합니다.",
    side_effects: "체질에 따라 열감, 두통, 불면이 생길 수 있으므로 혈압이 높으신 분은 복용에 주의해야 합니다.",
    intake_tip: "공복에 섭취 시 흡수율이 높아 아침 공복 복용을 권장하지만, 위가 약하면 식후에 드세요.",
    warning_trigger_text: "고혈압이 있거나 평소 몸에 열이 많고 가슴 두근거림이 잦습니다.",
    alternative_ingredient_id: "L-테아닌",
    alternative_reason: "홍삼은 혈관을 이완시키나 체질에 따라 교감신경을 흥분시켜 혈압 상승 및 가슴 두근거림을 초래할 수 있습니다. 대신 뇌 세포를 안정시켜 스트레스 긴장을 부드럽게 이완해주는 L-테아닌을 권장합니다."
  },
  "L-테아닌": {
    name: "L-테아닌 (L-Theanine)",
    desc: "녹차에 들어있는 아미노산의 일종으로 스트레스로 인한 긴장 완화에 도움을 줄 수 있음을 식약처가 인정한 성분",
    keyword: "나우푸드 L테아닌 200mg",
    coupang_link: "https://link.coupang.com/a/eBhysg0XQq",
    kfda_daily_intake: "200~250 mg",
    high_dose_ratio: "200 mg (100% 충족)",
    high_dose_effect: "뇌의 α파 생성을 촉진하여 과도한 긴장 상태를 완화하고 숙면 및 심신 안정을 유도",
    side_effects: "진정 효과가 강해 과량 복용 시 급격한 졸음이나 현기증을 느낄 수 있습니다.",
    intake_tip: "스트레스를 많이 받는 업무 시간 전이나 잠들기 1~2시간 전에 미온수와 복용하십시오.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "가르시니아": {
    name: "가르시니아 캄보지아 추출물 (HCA)",
    desc: "과피 추출물인 HCA가 탄수화물이 지방으로 합성되는 것을 억제하여 체지방 감소에 도움을 주는 고시형 다이어트 원료",
    keyword: "가르시니아 HCA 다이어트",
    coupang_link: "https://link.coupang.com/a/eBhBdKUhQi",
    kfda_daily_intake: "HCA 기준 750~2,800 mg",
    high_dose_ratio: "1,500 mg (100% 충족)",
    high_dose_effect: "탄수화물이 지방으로 변환되는 대사 경로를 차단하여, 섭취 후 체지방 축적률을 유의미하게 감소",
    side_effects: "과량 섭취 시 생리 주기가 불규칙해지거나 경미한 피부 가려움증, 두통이 발생할 수 있습니다. 간 손상 우려가 있는 경우 주의 필요.",
    intake_tip: "탄수화물 흡수가 시작되기 전인 식사 30분~1시간 전에 복용해야 최적의 효과를 냅니다.",
    warning_trigger_text: "생리 주기가 불규칙하거나 간 기능 우려가 있습니다.",
    alternative_ingredient_id: "L-카르니틴",
    alternative_reason: "가르시니아(HCA)는 드물게 호르몬 균형에 영향을 주어 생리불순이나 간독성을 유발할 수 있습니다. 대신 부작용 없이 체지방을 미토콘드리아로 유입하여 태우는 안전한 대사 촉진 성분인 L-카르니틴을 대안으로 추천합니다."
  },
  "녹차카테킨": {
    name: "녹차 추출물 (카테킨)",
    desc: "카테킨 성분이 항산화 작용을 돕고 체지방 감소 및 혈중 콜레스테롤 수치 개선에 도움을 줄 수 있는 식약처 인증 성분",
    keyword: "녹차카테킨 다이어트보조제",
    coupang_link: "https://link.coupang.com/a/eA52o5qJ6y",
    kfda_daily_intake: "카테킨 기준 300~500 mg",
    high_dose_ratio: "400 mg (100% 충족)",
    high_dose_effect: "체지방 감소와 항산화 작용을 돕고, 혈중 콜레스테롤 수치 개선에 기여할 수 있습니다.",
    side_effects: "카페인 함유로 불면, 두근거림이 유발될 수 있고, 공복 섭취 시 위장 장애나 간 독성 우려가 있습니다.",
    intake_tip: "위장 자극을 최소화하고 식후 대사를 돕도록 식사 직후 30분 이내 복용을 강력히 권장합니다.",
    warning_trigger_text: "카페인에 극도로 예민하여 커피를 마시면 불면증이나 두근거림이 있습니다.",
    alternative_ingredient_id: "콜레우스포스콜리",
    alternative_reason: "녹차카테킨 제품은 녹차 유래 천연 카페인을 소량 함유하고 있어 민감한 분들께 심장 두근거림이나 불면증을 악화시킬 수 있습니다. 대신 천연 무카페인 성분으로 기초 대사를 안전하게 끌어올려주는 콜레우스포스콜리를 적극 권장합니다."
  },
  "콜레우스포스콜리": {
    name: "콜레우스 포스콜리 추출물",
    desc: "제지방량(근육량)은 보존하고 체지방 감소에 도움을 줄 수 있는 개별인정형 기능성 원료",
    keyword: "콜레우스 포스콜리 포스콜린",
    coupang_link: "https://link.coupang.com/a/eA55qNL8eq",
    kfda_daily_intake: "포스콜린 기준 50 mg",
    high_dose_ratio: "50 mg (100% 충족)",
    high_dose_effect: "제지방(근육량)은 유지·보존하면서 순수 체지방의 연소와 대사율을 올려 기초대사량 증가 효과 유도",
    side_effects: "혈압을 낮추는 부작용이 있으므로 저혈압 환자나 항응고제 복용자는 주의가 필요합니다.",
    intake_tip: "신체 대사를 높이기 위해 오전 활동을 시작하기 전 또는 운동 1시간 전에 섭취하십시오.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "시서스": {
    name: "시서스 추출물 (Cissus)",
    desc: "리파아제 활성을 억제하여 식사량 조절 및 체지방 감소에 도움을 줄 수 있는 개별인정형 기능성 원료",
    keyword: "시서스 가루 다이어트 캡슐",
    coupang_link: "https://link.coupang.com/a/eA57rDuxUW",
    kfda_daily_intake: "시서스 추출물 기준 300 mg",
    high_dose_ratio: "300 mg (100% 충족)",
    high_dose_effect: "지방 소화 효소인 리파아제 활성을 억제하여 체지방 감소와 식사량 조절에 도움을 줄 수 있습니다.",
    side_effects: "우유, 밀, 계란, 조개류 성분 알레르기가 있는 사람은 두드러기 등 과민 반응이 올 수 있습니다.",
    intake_tip: "가루 형태인 경우 아침 또는 낮 시간에 따뜻한 물에 타서 물 대용으로 조금씩 복용하세요.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "L-카르니틴": {
    name: "L-카르니틴 타르트레이트",
    desc: "체내 지방산을 미토콘드리아로 운반하여 에너지로 연소시키는 과정을 활성화하고 체지방 감소에 도움을 주는 기능성 원료",
    keyword: "L카르니틴 1000mg 추천",
    coupang_link: "https://link.coupang.com/a/eA58XohllI",
    kfda_daily_intake: "L-카르니틴 타르트레이트 기준 2,000 mg",
    high_dose_ratio: "2,000 mg (100% 충족)",
    high_dose_effect: "체내 축적 지방산을 에너지를 만드는 세포(미토콘드리아)로 즉각 운반하여 운동 시 연소율 극대화",
    side_effects: "과량 복용 시 비린 맛의 땀 냄새가 나거나 메스꺼움, 소화불량 및 설사를 동반할 수 있습니다.",
    intake_tip: "유산소 및 근력 운동의 시너지를 위해 운동 30분~1시간 전에 드시는 것을 적극 추천합니다.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "비오틴": {
    name: "비오틴 (Biotin / 비타민B7)",
    desc: "지방, 탄수화물, 단백질 대사와 에너지 생성에 필수적이며 모발의 주 성분인 케라틴 단백질 합성을 촉진하는 성분",
    keyword: "비오틴 5000mcg 고함량",
    coupang_link: "https://link.coupang.com/a/eA6bJ34pa0",
    kfda_daily_intake: "30 mcg",
    high_dose_ratio: "5,000 mcg (16,666% 충족)",
    high_dose_effect: "두피 모낭의 케라틴 단백질 합성을 지원하여 모발 건강 개선에 도움을 줄 수 있습니다.",
    side_effects: "과량의 비오틴 섭취 시 피지 분비가 폭발하여 여드름이나 뾰루지 등 트러블이 올라올 수 있습니다.",
    intake_tip: "복용 시 물을 하루 1.5L 이상 섭취하여 수용성 비오틴 배출을 돕는 것이 좋습니다.",
    warning_trigger_text: "지성 피부라 평소 피지 분비가 많고 여드름이나 뾰루지가 잘 납니다.",
    alternative_ingredient_id: "L-시스틴",
    alternative_reason: "초고함량 비오틴은 지성 피부군에서 피지선을 과자극하여 모낭 트러블이나 뾰루지를 유발할 수 있습니다. 모발 단백질의 핵심 원료 구조를 튼튼하게 강화해주면서 피지 조절을 돕는 L-시스틴을 훌륭한 대안으로 추천합니다."
  },
  "맥주효모": {
    name: "건조 맥주효모 (Brewer's Yeast)",
    desc: "단백질(아미노산 18종), 비타민 B군, 셀레늄이 풍부하여 모발 및 두피에 영양을 직접 공급하고 모발 건강을 돕는 필수 원료",
    keyword: "국산 맥주효모 환 대용량",
    coupang_link: "https://link.coupang.com/a/eA6dOezLMa",
    kfda_daily_intake: "건조 맥주효모 기준 3,000 mg",
    high_dose_ratio: "3,000 mg (100% 충족)",
    high_dose_effect: "모발 케라틴의 원료인 아미노산 18종을 공급하여 모발 건강 전반을 지원합니다.",
    side_effects: "퓨린 함량이 매우 높으므로 통풍 기왕력이 있거나 요산 수치가 높은 분은 관절 통증을 발현합니다.",
    intake_tip: "자연식품에 가까워 소화가 용이하나, 가스나 속 더부룩함을 느낀다면 식사 직후 복용하세요.",
    warning_trigger_text: "통풍 기왕력이 있거나 요산 수치가 높아 관절이 자주 붓고 아픕니다.",
    alternative_ingredient_id: "판토텐산",
    alternative_reason: "맥주효모는 세포 증식을 돕는 퓨린(Purine) 함량이 극도로 높아 통풍 환자에게 급성 발작을 유발할 수 있습니다. 대신 퓨린 걱정이 전혀 없으면서 두피 모근 세포의 재생과 영양을 채워주는 판토텐산을 안전한 대안으로 권장합니다."
  },
  "아연": {
    name: "아연 (Zinc)",
    desc: "정상적인 면역기능과 세포분열에 필수적이며 모낭 세포의 성장을 돕고 탈모 완화 영양소 공급에 중요역할을 함",
    keyword: "아연 영양제 징크",
    coupang_link: "https://link.coupang.com/a/eA6fl2caya",
    kfda_daily_intake: "8.5 mg",
    high_dose_ratio: "50 mg (588% 충족)",
    high_dose_effect: "항산화 작용을 통해 두피 세포 건강을 지원하고 모낭 세포 성장에 도움을 줄 수 있습니다.",
    side_effects: "일일 상한 섭취량인 35mg 이상 장기 복용 시 메스꺼움이나 구토를 일으키며 구리 흡수를 저해할 수 있습니다.",
    intake_tip: "아연은 위장벽 자극이 심한 편이므로 반드시 식후에 충분한 물과 함께 섭취하세요.",
    warning_trigger_text: "평소 만성 위염이 있거나 속 쓰림, 소화불량 및 메스꺼움을 잘 느낍니다.",
    alternative_ingredient_id: "맥주효모",
    alternative_reason: "아연은 위장 점막을 직접적으로 강하게 자극하여 고함량 섭취 시 극심한 메스꺼움이나 쓰림을 유발하기 쉽습니다. 위장에 전혀 부담을 주지 않으면서 천연 아미노산 단백질 공급원이 되는 맥주효모를 대안으로 추천합니다."
  },
  "L-시스틴": {
    name: "L-시스틴 (L-Cystine)",
    desc: "모발 단백질인 케라틴의 구조를 형성하는 황 함유 아미노산으로 가늘어진 모발을 강화하고 끊어짐 방지에 기여함",
    keyword: "L시스틴 500mg 직구",
    coupang_link: "https://link.coupang.com/a/eA6gX6Bntk",
    kfda_daily_intake: "L-시스틴 기준 500 mg",
    high_dose_ratio: "500 mg (100% 충족)",
    high_dose_effect: "모발 강도를 유지하는 케라틴의 시스틴 황 결합 구조를 보강해 가늘어진 머리카락 끊어짐 방지",
    side_effects: "위장 장애 및 기관지 분비액 유발 우려가 있으므로 만성 천식 환자는 의사 상담이 권고됩니다.",
    intake_tip: "체내 흡수와 단백질 합성 효율을 배가시키려면 비타민 C와 아침 식후 함께 복용하십시오.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "판토텐산": {
    name: "판토텐산 (비타민B5)",
    desc: "코엔자임 A 합성에 관여하여 세포 재생을 돕고 두피 장벽 강화 및 모근의 탄력과 힘을 개선하는 에너지 대사 영양소",
    keyword: "판토텐산 550mg 추천",
    coupang_link: "https://link.coupang.com/a/eA6iR34jNA",
    kfda_daily_intake: "5 mg",
    high_dose_ratio: "550 mg (11,000% 충족)",
    high_dose_effect: "피지 분비 조절을 돕고 두피 환경 개선 및 모근 세포 재생에 기여할 수 있습니다.",
    side_effects: "수용성 비타민으로 체내 축적이 없고 부작용이 거의 없으나 간혹 가벼운 복통이 생길 수 있습니다.",
    intake_tip: "활력 비타민 계열이므로 가급적 낮 시간대(아침 또는 점심) 식후 섭취를 추천합니다.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "루테인지아잔틴": {
    name: "루테인지아잔틴 복합추출물",
    desc: "황반색소 밀도를 유지하여 노화로 인한 눈 건강 관리를 돕는 성분으로 식약처 기능성이 인정됨",
    keyword: "루테인지아잔틴 복합추출물 추천",
    coupang_link: "https://link.coupang.com/a/eCuMq6pJds",
    kfda_daily_intake: "루테인지아잔틴 단일/복합 기준 10~20 mg",
    high_dose_ratio: "20 mg (100% 충족)",
    high_dose_effect: "황반색소 밀도 유지를 도와 노화로 인한 눈 건강 관리에 기여할 수 있습니다.",
    side_effects: "과다 섭취 시 피부가 일시적으로 황색으로 변할 수 있습니다.",
    intake_tip: "지용성 성분이므로 식사 중 또는 식사 직후 복용해야 흡수가 잘 됩니다.",
    warning_trigger_text: "흡연자이거나 평소 황색 피부 변색 등의 피부 과민 반응이 잦습니다.",
    alternative_ingredient_id: "헤마토코쿠스 추출물",
    alternative_reason: "루테인지아잔틴은 카로티노이드 성분으로 장기 고함량 복용 시 일부 민감한 분들께 피부 황색 변색이 나타날 수 있습니다. 대신 눈의 피로도 개선에 도움을 줄 수 있는 헤마토코쿠스 추출물(아스타잔틴)을 대안으로 참고하실 수 있습니다."
  },
  "헤마토코쿠스 추출물": {
    name: "헤마토코쿠스 추출물 (아스타잔틴)",
    desc: "항산화 작용을 하는 카로티노이드 성분으로 눈의 피로도 개선에 도움을 줄 수 있음을 식약처가 인정한 기능성 원료",
    keyword: "아스타잔틴 헤마토코쿠스 눈피로",
    coupang_link: "https://link.coupang.com/a/eCuO6slpIa",
    kfda_daily_intake: "아스타잔틴 기준 4~12 mg",
    high_dose_ratio: "12 mg (100% 충족)",
    high_dose_effect: "강력한 항산화 작용을 바탕으로 눈의 피로도 개선에 도움을 줄 수 있습니다.",
    side_effects: "과량 섭취 시 일시적으로 대변 색이 붉게 변하거나 피부가 붉어질 수 있습니다.",
    intake_tip: "지용성이므로 식사 후에 섭취하는 것이 흡수율을 극대화합니다.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "오메가3": {
    name: "정제어유 (EPA 및 DHA 함유 유지)",
    desc: "혈중 중성지질 개선 및 혈행 개선에 도움을 줄 수 있는 식약처 고시 필수 불포화지방산",
    keyword: "rtg 오메가3 고함량",
    coupang_link: "https://link.coupang.com/a/eCuSvrXOAS",
    kfda_daily_intake: "EPA와 DHA의 합 기준 500~2,000 mg",
    high_dose_ratio: "1,000 mg (200% 충족)",
    high_dose_effect: "혈중 중성지질 개선 및 혈행 개선에 도움을 줄 수 있습니다.",
    side_effects: "어유 특유의 생선 비린내가 올라오거나 소화불량이 발생할 수 있으며, 혈액 응고를 방해하므로 수술을 앞둔 분은 주의해야 합니다.",
    intake_tip: "비린내와 위장 자극을 줄이기 위해 기름진 식사 직후 또는 도중에 복용하세요.",
    warning_trigger_text: "평소 비린내에 아주 민감하여 오메가3 복용 시 메스꺼움이나 트림으로 인한 구토감이 생깁니다.",
    alternative_ingredient_id: "은행잎 추출물",
    alternative_reason: "동물성 오메가3는 어유 특유의 어취나 소화 불량, 혹은 혈액 응고 지연으로 인한 멍 발생 등의 부작용을 일으킬 수 있습니다. 대신 냄새 부담이 없고 혈행 개선에 도움을 줄 수 있는 은행잎 추출물을 대안으로 참고하실 수 있습니다."
  },
  "은행잎 추출물": {
    name: "은행잎 추출물 (플라보놀 배당체)",
    desc: "혈행 개선 및 기억력 개선에 도움을 줄 수 있음을 식약처가 인정한 대표 허브 원료",
    keyword: "은행잎 추출물 징코 빌로바",
    coupang_link: "https://link.coupang.com/a/eCuVVZenOS",
    kfda_daily_intake: "플라보놀 배당체 기준 24~36 mg",
    high_dose_ratio: "36 mg (150% 충족)",
    high_dose_effect: "혈행 개선과 기억력 개선에 도움을 줄 수 있습니다.",
    side_effects: "일시적인 두통, 어지러움, 소화불량 및 출혈 경향이 증가할 수 있습니다.",
    intake_tip: "위장 장애를 줄이기 위해 식후 충분한 물과 섭취하시고, 수술 전후 3~4일 동안은 섭취를 중단하세요.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  },
  "감태 추출물": {
    name: "감태 추출물 (디엑콜)",
    desc: "감태에서 추출한 플로로탄닌 성분을 함유하여 수면의 질 개선에 도움을 줄 수 있는 개별인정형 기능성 원료",
    keyword: "감태추출물 수면 영양제",
    coupang_link: "https://link.coupang.com/a/eCuX301KE0",
    kfda_daily_intake: "디엑콜 기준 30 mg",
    high_dose_ratio: "30 mg (100% 충족)",
    high_dose_effect: "수면의 질 개선에 도움을 줄 수 있으며, 잠들기까지 걸리는 시간 감소에 기여할 수 있습니다.",
    side_effects: "과다 복용 시 다음날 오전까지 경미한 나른함이나 나른한 졸음이 지속될 수 있습니다.",
    intake_tip: "잠들기 30분~1시간 전에 따뜻한 물과 함께 복용하시는 것이 가장 이상적입니다.",
    warning_trigger_text: "평소 해조류 알레르기가 있거나 갑상선 질환(요오드 제한 필요)이 있습니다.",
    alternative_ingredient_id: "락티움",
    alternative_reason: "감태 추출물은 요오드 성분이 소량 함유되어 갑상선 항진증 환자 등에게 자극이 될 수 있고, 해조류 알레르기가 있는 분들께 가려움을 줄 수 있습니다. 우유 유래 단백질 분해물로 수면 리듬을 편안하게 조절해주는 락티움을 대안으로 권장합니다."
  },
  "락티움": {
    name: "유청단백가수분해물 (락티움)",
    desc: "우유 단백질을 미세 분해하여 스트레스로 인한 긴장 완화 및 수면 질 개선에 도움을 주는 성분",
    keyword: "락티움 수면제 대용 추천",
    coupang_link: "https://link.coupang.com/a/eCu0lvb4Me",
    kfda_daily_intake: "알파에스1카제인 기준 2.2~3.2 mg",
    high_dose_ratio: "300 mg (100% 충족)",
    high_dose_effect: "스트레스로 인한 긴장 완화와 수면의 질 개선에 도움을 줄 수 있습니다.",
    side_effects: "우유 알레르기가 있거나 유당불내증이 심한 경우 설사나 복통을 유발할 수 있습니다.",
    intake_tip: "신경 진정 작용이 뛰어나므로 저녁 식사 후 또는 취침 1시간 전 복용을 권장합니다.",
    warning_trigger_text: "유당불내증이 심하여 우유나 유제품을 먹으면 설사나 복통을 자주 겪습니다.",
    alternative_ingredient_id: "L-테아닌",
    alternative_reason: "락티움은 우유 단백질 가수분해물로서 심한 유당불내증이 있는 분들께 소화기 불편감을 유발할 수 있습니다. 대신 우유 유래 성분이 없으면서 긴장 완화에 도움을 줄 수 있는 L-테아닌을 대안으로 참고하실 수 있습니다."
  }
};

export const localSynergyCombinations = [
  {
    id: 1,
    name: "활력 부스터 시너지 패키지",
    synergy_effect: "간 건강 지원 + 에너지 대사 활성화",
    recommendation_reason: "밀크씨슬이 간 세포 보호와 항산화를 돕는 동안, 비타민B군이 체내 에너지 생성 대사를 지원하여 피로 회복에 함께 기여할 수 있는 조합입니다.",
    ingredients: ["비타민B군", "밀크씨슬"]
  },
  {
    id: 2,
    name: "부신 피로 리셋 패키지",
    synergy_effect: "스트레스로 인한 피로 개선 + 긴장 완화",
    recommendation_reason: "홍경천이 스트레스로 인한 피로 개선에 도움을 주고, L-테아닌이 긴장 완화에 기여하여 심신 안정을 함께 지원할 수 있는 조합입니다.",
    ingredients: ["L-테아닌", "홍경천 추출물"]
  },
  {
    id: 3,
    name: "모근 밀착 방어 패키지",
    synergy_effect: "모발 영양 공급 + 케라틴 합성 지원 + 두피 세포 건강",
    recommendation_reason: "맥주효모가 모발 케라틴의 원료인 아미노산 18종을 공급하고, 비오틴이 케라틴 단백질 합성을 지원하며, 아연이 모낭 세포의 정상적인 성장을 돕는 조합입니다. 모발 건강 전반을 함께 관리할 수 있습니다.",
    ingredients: ["비오틴", "맥주효모", "아연"]
  },
  {
    id: 4,
    name: "체지방 이중 컷팅 패키지",
    synergy_effect: "탄수화물의 지방 전환 억제 + 체지방 감소 지원",
    recommendation_reason: "가르시니아(HCA)가 탄수화물이 체지방으로 전환되는 과정을 억제하고, 카테킨(EGCG)이 체지방 감소와 항산화에 도움을 줄 수 있는 조합입니다. 식약처 고시 기능성 원료를 함께 활용하는 참고 정보입니다.",
    ingredients: ["가르시니아", "녹차카테킨"]
  },
  {
    id: 5,
    name: "스마트 기기 집중 케어 패키지",
    synergy_effect: "눈 피로 개선 + 활력 대사 증진",
    recommendation_reason: "헤마토코쿠스 추출물이 전자기기 사용으로 지친 눈의 피로도 개선을 돕고, 비타민B군이 에너지 생성과 피로 개선에 기여하여 시너지 효과를 줄 수 있는 조합입니다.",
    ingredients: ["비타민B군", "헤마토코쿠스 추출물"]
  },
  {
    id: 6,
    name: "혈행 & 순환 밸런스 패키지",
    synergy_effect: "혈액 순환 원활 + 혈중 중성지질 강하",
    recommendation_reason: "오메가3가 중성지질 개선과 혈행 개선에 도움을 주고, 은행잎 추출물이 말초 혈행 개선과 기억력 개선에 기여할 수 있는 조합입니다. 식약처 고시 기능성 원료를 함께 활용하는 참고 정보입니다.",
    ingredients: ["오메가3", "은행잎 추출물"]
  },
  {
    id: 7,
    name: "딥 슬립 스트레스 릴리프 패키지",
    synergy_effect: "수면 질 개선 + 신경 안정 및 긴장 완화",
    recommendation_reason: "락티움이 스트레스로 인한 긴장 완화와 수면의 질 개선에 도움을 주고, L-테아닌이 긴장 완화에 기여하여 심신 안정을 함께 지원할 수 있는 조합입니다.",
    ingredients: ["락티움", "L-테아닌"]
  },
  {
    id: 8,
    name: "대사 활성화 체지방 컷팅 패키지",
    synergy_effect: "지방산 연소 운반 활성화 + 근육 보존 기초대사 증가",
    recommendation_reason: "L-카르니틴이 체내 축적 지방산을 미토콘드리아로 직접 운반하여 에너지로 연소시키고, 콜레우스포스콜리가 제지방(근육량)은 보존하면서 기초대사량을 끌어올리는 무카페인·호르몬 부담 없는 대안 조합입니다. 두 원료 모두 식약처 기능성 인정 성분입니다.",
    ingredients: ["L-카르니틴", "콜레우스포스콜리"]
  },
  {
    id: 9,
    name: "무부담 체지방 연소 케어 패키지",
    synergy_effect: "지방산 미토콘드리아 운반 · 연소 + 항산화 체지방 감소 지원",
    recommendation_reason: "L-카르니틴이 체내 지방산을 에너지 생성 세포로 운반·연소하고, 녹차카테킨(EGCG)이 항산화 작용과 체지방 감소에 도움을 줄 수 있는 조합입니다. 가르시니아 대신 호르몬·간 부담 없는 성분을 활용하는 대안 참고 정보입니다.",
    ingredients: ["L-카르니틴", "녹차카테킨"]
  },
  {
    id: 10,
    name: "무카페인 탄수화물 차단 & 대사 패키지",
    synergy_effect: "탄수화물 지방 전환 억제 + 제지방 보존 체지방 대사 활성화",
    recommendation_reason: "가르시니아(HCA)가 탄수화물이 체지방으로 전환되는 경로를 차단하고, 콜레우스포스콜리가 근육량은 보존하면서 체지방 대사를 끌어올리는 카페인 없는 조합입니다. 카페인 예민 체질에 대한 대안 참고 정보입니다.",
    ingredients: ["가르시니아", "콜레우스포스콜리"]
  },
  {
    id: 11,
    name: "탄수화물 & 식욕 이중 차단 패키지",
    synergy_effect: "탄수화물 지방 전환 억제 + 식사량 조절 지원",
    recommendation_reason: "가르시니아(HCA)가 탄수화물이 체지방으로 전환되는 대사 경로를 차단하고, 시서스 추출물이 지방 소화 효소인 리파아제 활성을 억제하여 체지방 감소와 식사량 조절에 함께 도움을 줄 수 있는 식약처 기능성 원료 조합입니다.",
    ingredients: ["가르시니아", "시서스"]
  },
  {
    id: 12,
    name: "눈 건강 이중 방어 패키지",
    synergy_effect: "황반색소 밀도 유지 + 눈 피로도 개선",
    recommendation_reason: "루테인지아잔틴이 황반색소 밀도를 유지하여 노화로 인한 눈 건강 관리를 돕고, 헤마토코쿠스 추출물(아스타잔틴)이 전자기기 사용으로 누적된 눈의 피로도 개선에 기여할 수 있는 식약처 고시 기능성 원료 조합입니다.",
    ingredients: ["루테인지아잔틴", "헤마토코쿠스 추출물"]
  },
  {
    id: 13,
    name: "케라틴 구조 강화 패키지",
    synergy_effect: "케라틴 단백질 합성 촉진 + 모발 황 결합 구조 보강",
    recommendation_reason: "비오틴이 두피 모낭의 케라틴 단백질 합성을 지원하고, L-시스틴이 모발 단백질 케라틴의 황 결합 구조를 보강하여 모발 강도와 탄력을 함께 개선하는 데 도움을 줄 수 있는 조합입니다.",
    ingredients: ["비오틴", "L-시스틴"]
  },
  {
    id: 14,
    name: "수면 리듬 이중 케어 패키지",
    synergy_effect: "입면 시간 단축 + 스트레스 긴장 완화 숙면 지원",
    recommendation_reason: "감태 추출물의 디엑콜 성분이 잠들기까지 걸리는 시간을 줄이고, 락티움이 스트레스로 인한 긴장을 완화하여 깊은 숙면을 함께 지원할 수 있는 식약처 개별인정형 기능성 원료 조합입니다.",
    ingredients: ["감태 추출물", "락티움"]
  },
  {
    id: 15,
    name: "홍삼 활력 에너지 패키지",
    synergy_effect: "면역력 증진 + 피로 개선 + 에너지 대사 활성화",
    recommendation_reason: "홍삼의 진세노사이드가 면역력 증진과 피로 개선에 도움을 주고, 비타민B군이 체내 에너지 생성 대사를 활성화하여 활력 회복에 함께 기여할 수 있는 대표 식약처 고시 기능성 원료 조합입니다.",
    ingredients: ["홍삼", "비타민B군"]
  }
];
