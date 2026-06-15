import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// ==========================================================
// Offline Local Mock DB Fallback Data (식약처 공인 15종 성분)
// ==========================================================
const localCategories = [
  { id: 1, name: "피로 개선", desc: "만성 피로와 활력 저하로 고민하는 직장인 맞춤형", icon: "fa-battery-three-quarters", class: "cat-fatigue" },
  { id: 2, name: "다이어트", desc: "체지방 감소와 탄수화물 컷팅이 필요한 분을 위한 맞춤형", icon: "fa-person-running", class: "cat-diet" },
  { id: 3, name: "탈모 & 모발 건강", desc: "모근 약화와 머리숱 감소가 절박한 분들을 위한 맞춤형", icon: "fa-feather", class: "cat-hair" }
];

const localSymptoms = [
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
  { id: 305, category_id: 3, text: "두피가 붉게 올라오고 모근의 탄력과 힘이 약해진 것 같아요", ingredient_id: "판토텐산" }
];

const localIngredientsMapping = {
  "밀크씨슬": {
    name: "밀크씨슬 추출물 (실리마린)",
    desc: "실리마린 성분이 간 세포막을 보호하고 항산화 작용을 돕고 피로 회복을 위한 간 건강 기능성을 식약처가 고시함",
    keyword: "밀크씨슬 실리마린 직구",
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
    kfda_daily_intake: "비타민B1 기준 1.2 mg",
    high_dose_ratio: "100 mg (8,333% 충족)",
    high_dose_effect: "체내 대사를 급격히 가속화하여 즉각적인 활력을 불어넣고 젖산 축적을 억제하여 만성 피로 회복",
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
    kfda_daily_intake: "진세노사이드 기준 3 mg",
    high_dose_ratio: "15 mg (500% 충족)",
    high_dose_effect: "혈소판 응집 억제를 통한 혈액 흐름 개선, 기력 증진 및 면역 세포 활성화로 면역 증진 가속",
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
    kfda_daily_intake: "카테킨 기준 300~500 mg",
    high_dose_ratio: "400 mg (100% 충족)",
    high_dose_effect: "체지방 강제 연소를 촉진하고 활성산소를 억제하는 강력한 항산화 및 콜레스테롤 저하 효과",
    side_effects: "카페인 함유로 불면, 두근거림이 유발될 수 있고, 공복 섭취 시 위장 장애나 간 독성 우려가 있습니다.",
    intake_tip: "위장 자극을 최소화하고 식후 대사를 돕도록 식사 직후 30분 이내 복용을 강력히 권장합니다.",
    warning_trigger_text: "카페인에 극도로 예민하여 커피를 마시면 불면증이나 두근거림이 있습니다.",
    alternative_ingredient_id: "콜레우스포스콜리",
    alternative_reason: "녹차카테킨 제품은 녹차 유래 천연 카페인을 소량 함유하고 있어 민감한 분들께 심장 두근거림이나 불면증을 악화시킬 수 있습니다. 대신 천연 무카페인 성분으로 기초 대사를 안전하게 끌어올려주는 콜레우스포스콜리를 적극 권장합니다."
  },
  "콜레우스포스콜리": {
    name: "콜레우스 포스콜리 추출물",
    desc: "인도 전통 약재식물 추출물로 제지방량(근육량)은 보존하고 체지방을 감소시키는 기능성을 개별인정받은 원료",
    keyword: "콜레우스 포스콜리 포스콜린",
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
    desc: "열대 아시아 자생 식물로 리파아제 활성을 억제하여식사량 조절 및 체지방 감소 기능성을 인정받은 개별인정형 성분",
    keyword: "시서스 가루 다이어트 캡슐",
    kfda_daily_intake: "시서스 추출물 기준 300 mg",
    high_dose_ratio: "300 mg (100% 충족)",
    high_dose_effect: "지방 소화 효소인 리파아제를 방해하여 지방 흡수율을 낮추고 식욕 억제 호르몬 분비 촉진",
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
    kfda_daily_intake: "30 mcg",
    high_dose_ratio: "5,000 mcg (16,666% 충족)",
    high_dose_effect: "두피 모낭 세포의 케라틴 단백질 합성을 급격히 끌어올려 모발 성장 속도를 가속합니다.",
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
    kfda_daily_intake: "건조 맥주효모 기준 3,000 mg",
    high_dose_ratio: "3,000 mg (100% 충족)",
    high_dose_effect: "모발 케라틴을 만드는 18종의 아미노산 원료를 혈액에 대량 공급하여 가늘어짐 and 탈모 방어",
    side_effects: "퓨린 함량이 매우 높으므로 통풍 기왕력이 있거나 요산 수치가 높은 분은 관절 통증을 발현합니다.",
    intake_tip: "자연식품에 가까워 소화가 용이하나, 가스나 속 더부룩함을 느낀다면식사 직후 복용하세요.",
    warning_trigger_text: "통풍 기왕력이 있거나 요산 수치가 높아 관절이 자주 붓고 아픕니다.",
    alternative_ingredient_id: "판토텐산",
    alternative_reason: "맥주효모는 세포 증식을 돕는 퓨린(Purine) 함량이 극도로 높아 통풍 환자에게 급성 발작을 유발할 수 있습니다. 대신 퓨린 걱정이 전혀 없으면서 두피 모근 세포의 재생과 영양을 채워주는 판토텐산을 안전한 대안으로 권장합니다."
  },
  "아연": {
    name: "아연 (Zinc)",
    desc: "정상적인 면역기능과 세포분열에 필수적이며 모낭 세포의 성장을 돕고 탈모 완화 영양소 공급에 중요역할을 함",
    keyword: "아연 영양제 징크",
    kfda_daily_intake: "8.5 mg",
    high_dose_ratio: "50 mg (588% 충족)",
    high_dose_effect: "체내 활성 산소를 제거하고 두피 세포막 면역력을 높여 환절기 비듬 및 급성 탈모를 방어합니다.",
    side_effects: "일일 상한 섭취량인 35mg 이상 장기 복용 시 메스꺼움이나 구토를 일으키며 구리 흡수를 저해할 수 있습니다.",
    intake_tip: "아연은 위장벽 자극이 심한 편이므로 반드시 식후에 충분한 물과 함께 섭취하세요.",
    warning_trigger_text: "평소 만성 위염이 있거나 속 쓰림, 소화불량 및 메스꺼움을 잘 느낍니다.",
    alternative_ingredient_id: "맥주효모",
    alternative_reason: "아연은 위장 점막을 직접적으로 강하게 자극하여 고함량 섭취 시 극심한 메스꺼움이나 쓰림을 유발하기 쉽습니다. 위장에 전혀 부담을 주지 않으면서 천연 아미노산 단백질 공급원이 되는 맥주효모를 대안으로 추천합니다."
  },
  "L-시스틴": {
    name: "L-시스틴 (L-Cystine)",
    desc: "모발 단백질인 케라틴의 구조를 형성하는 황 함유 아미노산으로 가늘어진 모발을 강화하고 끊어짐 방지에 기여함",
    keyword: "L시스테인 500mg 직구",
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
    kfda_daily_intake: "5 mg",
    high_dose_ratio: "550 mg (11,000% 충족)",
    high_dose_effect: "피지 과잉 분비를 정상화하여 탈모성 지루성 두피염을 완화하고 모근 세포 재생 주기 단축",
    side_effects: "수용성 비타민으로 체내 축적이 없고 부작용이 거의 없으나 간혹 가벼운 복통이 생길 수 있습니다.",
    intake_tip: "활력 비타민 계열이므로 가급적 낮 시간대(아침 또는 점심) 식후 섭취를 추천합니다.",
    warning_trigger_text: null,
    alternative_ingredient_id: null,
    alternative_reason: null
  }
};

const initialCoupangProducts = {
  "밀크씨슬 실리마린 직구": [
    { brand: "나우푸드 (Now Foods)", title: "실리마린 밀크씨슬 추출물 300mg, 200베지캡슐", price: 18450, rating: 4.8, reviews: 24502, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" }
  ],
  "고함량 비타민B 컴플렉스": [
    { brand: "솔가 (Solgar)", title: "B-콤플렉스 100 메가용량, 100식물성캡슐", price: 22400, rating: 4.9, reviews: 8402, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "홍경천 로디올라 스트레스": [
    { brand: "라이프 익스텐션", title: "로디올라 홍경천 추출물 250mg, 60베지캡슐", price: 15700, rating: 4.6, reviews: 3890, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "홍삼정 에브리타임 스틱": [
    { brand: "정관장", title: "홍삼정 에브리타임 스틱형 10ml x 30포", price: 74200, rating: 4.9, reviews: 12402, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" }
  ],
  "나우푸드 L테아닌 200mg": [
    { brand: "나우푸드 (Now Foods)", title: "L-테아닌 200mg 더블 스트렝스, 120베지캡슐", price: 21900, rating: 4.7, reviews: 5491, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "가르시니아 HCA 다이어트": [
    { brand: "에버비키니", title: "콜레올로지 컷팅 가르시니아 HCA 더블 112정 (4주분)", price: 26900, rating: 4.7, reviews: 14201, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150&auto=format&fit=crop&q=60" }
  ],
  "녹차카테킨 다이어트보조제": [
    { brand: "그린몬스터", title: "다이어트 스페셜 2인1 카테킨 플러스 90정 (30일분)", price: 13400, rating: 4.6, reviews: 9283, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150&auto=format&fit=crop&q=60" }
  ],
  "콜레우스 포스콜리 포스콜린": [
    { brand: "푸드올로지", title: "콜레올로지 빨간통 다이어트 콜레우스 포스콜리 60정", price: 35800, rating: 4.8, reviews: 45091, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "시서스 가루 다이어트 캡슐": [
    { brand: "해외직구", title: "시서스 추출물 1000mg 고농축 120캡슐", price: 28900, rating: 4.6, reviews: 3102, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150&auto=format&fit=crop&q=60" }
  ],
  "L카르니틴 1000mg 추천": [
    { brand: "나우푸드 (Now Foods)", title: "L-카르니틴 1000mg 고함량, 100타블렛", price: 23100, rating: 4.8, reviews: 9403, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "비오틴 5000mcg 고함량": [
    { brand: "솔가 (Solgar)", title: "고함량 비오틴 5000mcg, 100식물성캡슐", price: 16500, rating: 4.9, reviews: 19803, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" }
  ],
  "국산 맥주효모 환 대용량": [
    { brand: "자연의품격", title: "유기농 국산 맥주효모 환 3g x 30포", price: 14900, rating: 4.8, reviews: 4322, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "아연 영양제 징크": [
    { brand: "나우푸드 (Now Foods)", title: "글루코네이트 아연 50mg, 250정", price: 9800, rating: 4.8, reviews: 18239, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "L시스테인 500mg 직구": [
    { brand: "나우푸드 (Now Foods)", title: "L-시스테인 500mg (아미노산), 100정", price: 14500, rating: 4.7, reviews: 11094, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "판토텐산 550mg 추천": [
    { brand: "솔가 (Solgar)", title: "판토텐산 550mg 고함량 비타민B5, 100식물성캡슐", price: 18200, rating: 4.8, reviews: 6502, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ]
};

const defaultMockProducts = [
  { brand: "네이처스웨이", title: "눈건강 루테인지아잔틴 프리미엄 60소프트젤", price: 23900, rating: 4.8, reviews: 8109, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
  { brand: "나우푸드 (Now Foods)", title: "아스타잔틴 4mg 항산화 포뮬러, 90소프트젤", price: 19800, rating: 4.7, reviews: 4120, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
];

const localSynergyCombinations = [
  { 
    id: 1, 
    name: "활력 부스터 시너지 패키지", 
    synergy_effect: "해독 대사 촉진 및 신진대사 에너지 폭발", 
    recommendation_reason: "밀크씨슬이 간의 노폐물 분해(해독)를 처리하는 동안, 비타민B군이 해독 프로세스에 에너지를 공급하고 대사 효율을 극대화하여 만성 피로의 원인을 근본적으로 도려냅니다.",
    ingredients: ["비타민B군", "밀크씨슬"]
  },
  { 
    id: 2, 
    name: "부신 피로 리셋 패키지", 
    synergy_effect: "코르티솔 호르몬 조절 및 뇌파 긴장 완화", 
    recommendation_reason: "홍경천이 스트레스 호르몬인 코르티솔 분비를 억제하여 지친 부신 피로를 달래주고, 테아닌이 알파파를 활성화하여 긴장된 뇌 세포를 안정시켜 최적의 수면 질과 휴식 상태를 선사합니다.",
    ingredients: ["L-테아닌", "홍경천 추출물"]
  },
  { 
    id: 3, 
    name: "모근 밀착 방어 패키지", 
    synergy_effect: "모발 단백질 풍부한 원료 공급 ➔ 합성 가속 ➔ 모낭 세포분열 정상화", 
    recommendation_reason: "맥주효모가 모발 케라틴의 원료(아미노산 18종)를 대량으로 투입하고, 고함량 비오틴이 이 원료들을 모발 세포로 신속하게 합성하며, 아연이 모근 세포의 분열을 가속화해 숱이 비는 탈모를 3중으로 빈틈없이 차단합니다.",
    ingredients: ["비오틴", "맥주효모", "아연"]
  },
  { 
    id: 4, 
    name: "체지방 이중 컷팅 패키지", 
    synergy_effect: "신규 탄수화물 유입 차단 + 기존 축적 체지방 강제 연소", 
    recommendation_reason: "가르시니아가 밥/빵 등의 신규 탄수화물이 지방으로 변환되는 길목을 차단하고, 카테킨이 에피갈로카테킨 갈레이트(EGCG) 대사 작용을 자극하여 이미 축적된 내장지방과 피하지방의 연소를 활성화시킵니다.",
    ingredients: ["가르시니아", "녹차카테킨"]
  }
];

function App() {
  // DB States
  const [categories, setCategories] = useState(localCategories);
  const [symptoms, setSymptoms] = useState(localSymptoms);
  const [ingredientsMapping, setIngredientsMapping] = useState(localIngredientsMapping);
  const [coupangProducts, setCoupangProducts] = useState(initialCoupangProducts);
  const [synergyCombinations, setSynergyCombinations] = useState(localSynergyCombinations);

  // UI Interactive States
  const [openGuides, setOpenGuides] = useState({}); // { [ingredientId]: boolean }
  const [checkedWarnings, setCheckedWarnings] = useState({}); // { [ingredientId]: boolean }
  const [isKfdaModalOpen, setIsKfdaModalOpen] = useState(false);
  const [systemTime, setSystemTime] = useState("12:00");

  // Responsive device separation states
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdminQueryActive, setIsAdminQueryActive] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setSystemTime(`${hours}:${minutes}`);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 60000);

    const checkDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                       || window.innerWidth <= 768;
      setIsMobileDevice(isMobile);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);

    // URL 쿼리 파라미터 확인 (?admin=true 일 때만 어드민 패널 토글 노출 및 활성화)
    const params = new URLSearchParams(window.location.search);
    const isAdmin = params.get('admin') === 'true';
    setIsAdminQueryActive(isAdmin);
    if (isAdmin) {
      setShowAdminPanel(true);
    }

    return () => {
      window.removeEventListener('resize', checkDevice);
      clearInterval(clockInterval);
    };
  }, []);

  // Connection Mode State
  const [dbMode, setDbMode] = useState("Local DB");

  // Mobile App Navigation / Interaction State
  const [activeScreen, setActiveScreen] = useState('home'); // 'home' | 'survey' | 'result'
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);

  // Admin Panel Tab State
  const [activeAdminTab, setActiveAdminTab] = useState('db-view'); // 'db-view' | 'add-category'

  // Admin Portal form fields state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('fa-eye');
  const [newSymptomText, setNewSymptomText] = useState('');
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientDesc, setNewIngredientDesc] = useState('');
  const [newCoupangKeyword, setNewCoupangKeyword] = useState('');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle guide details for ingredients
  const toggleGuide = (ingId) => {
    setOpenGuides(prev => ({
      ...prev,
      [ingId]: !prev[ingId]
    }));
  };

  // Toggle between Local DB fallback and Supabase Connected mode for testing/development
  const toggleDbMode = () => {
    if (dbMode === "Supabase Connected") {
      setCategories(localCategories);
      setSymptoms(localSymptoms);
      setIngredientsMapping(localIngredientsMapping);
      setSynergyCombinations(localSynergyCombinations);
      setDbMode("Local DB (Forced)");
      showToast("로컬 오프라인 모드로 강제 전환되었습니다. (식약처 권장량/시너지가 정상 작동합니다)");
    } else {
      loadDatabase();
    }
  };

  // Load database from Supabase or Fallback
  const loadDatabase = async () => {
    if (!isSupabaseConfigured) {
      console.log("[PillSync] Supabase is not configured. Running in Local Offline Mode.");
      setDbMode("Local DB");
      return;
    }

    try {
      console.log("[PillSync] Attempting to fetch database records from Supabase...");

      // 1. Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('id');
      if (catError) throw catError;

      // 2. Fetch Symptoms
      const { data: symData, error: symError } = await supabase
        .from('symptoms')
        .select('*')
        .order('id');
      if (symError) throw symError;

      // 3. Fetch Ingredients Mapping (including newly added columns)
      const { data: ingData, error: ingError } = await supabase
        .from('ingredients_mapping')
        .select('*');
      if (ingError) throw ingError;

      // 4. Fetch Synergy Combinations
      let transformedSynergy = localSynergyCombinations;
      try {
        const { data: synData, error: synError } = await supabase
          .from('synergy_combinations')
          .select('*');
        
        if (!synError && synData) {
          const { data: synIngData, error: synIngError } = await supabase
            .from('synergy_ingredients')
            .select('*');

          if (!synIngError && synIngData) {
            transformedSynergy = synData.map(s => {
              const relatedIngredients = synIngData
                .filter(si => si.synergy_id === s.id)
                .map(si => si.ingredient_id);
              return {
                id: s.id,
                name: s.name,
                synergy_effect: s.synergy_effect,
                recommendation_reason: s.recommendation_reason,
                ingredients: relatedIngredients
              };
            });
          }
        }
      } catch (synErr) {
        console.warn("[PillSync] Failed to fetch synergy tables. Falling back to local synergy combinations.", synErr);
      }

      console.log("[PillSync] Supabase sync completed successfully!", { catData, symData, ingData });

      // Map Supabase 'categories' columns to frontend structure
      const transformedCategories = catData.map(c => ({
        id: c.id,
        name: c.name,
        desc: c.description || c.desc || "",
        icon: c.icon_class || c.icon || "fa-capsules",
        class: c.class || `cat-custom-${c.id}`
      }));

      // Map Supabase 'symptoms' columns to frontend structure
      const transformedSymptoms = symData.map(s => ({
        id: s.id,
        category_id: s.category_id,
        text: s.symptom_text || s.text || "",
        ingredient_id: s.matched_ingredient_id || s.ingredient_id || ""
      }));

      // Map Supabase 'ingredients_mapping' list to frontend lookup dict
      const transformedIngredientsMapping = {};
      ingData.forEach(i => {
        transformedIngredientsMapping[i.id] = {
          name: i.name,
          desc: i.fda_functional_summary || i.desc || "",
          keyword: i.coupang_search_keyword || i.keyword || "",
          kfda_daily_intake: i.kfda_daily_intake || "",
          high_dose_ratio: i.high_dose_ratio || "",
          high_dose_effect: i.high_dose_effect || "",
          side_effects: i.side_effects || "",
          intake_tip: i.intake_tip || "",
          warning_trigger_text: i.warning_trigger_text || null,
          alternative_ingredient_id: i.alternative_ingredient_id || null,
          alternative_reason: i.alternative_reason || null
        };
      });

      setCategories(transformedCategories);
      setSymptoms(transformedSymptoms);
      setIngredientsMapping(transformedIngredientsMapping);
      setSynergyCombinations(transformedSynergy);
      setDbMode("Supabase Connected");
      showToast("Supabase 클라우드 DB 연동 완료!");

    } catch (err) {
      console.warn("[PillSync] Supabase connection failed or tables missing. Falling back to Local Mock DB. Error details:", err.message || err);
      setCategories(localCategories);
      setSymptoms(localSymptoms);
      setIngredientsMapping(localIngredientsMapping);
      setSynergyCombinations(localSynergyCombinations);
      setDbMode("Local DB (Fallback)");
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Switch to category questionnaire
  const handleSelectCategory = (catId) => {
    setCurrentCategoryId(catId);
    setSelectedSymptomIds([]);
    setActiveScreen('survey');
  };

  // Toggle symptom selection checkbox
  const handleToggleSymptom = (symptomId) => {
    if (selectedSymptomIds.includes(symptomId)) {
      setSelectedSymptomIds(selectedSymptomIds.filter(id => id !== symptomId));
    } else {
      setSelectedSymptomIds([...selectedSymptomIds, symptomId]);
    }
  };

  const handleBack = () => {
    if (activeScreen === 'survey') {
      setActiveScreen('home');
      setCurrentCategoryId(null);
    } else if (activeScreen === 'result') {
      setActiveScreen('survey');
    }
  };

  const handleReset = () => {
    setActiveScreen('home');
    setCurrentCategoryId(null);
    setSelectedSymptomIds([]);
  };

  // Submit survey and calculate results
  const handleSubmitSurvey = () => {
    setActiveScreen('result');
  };

  // Form submission: Add a new custom category
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();

    const ingredientKey = newIngredientName.replace(/\s+/g, "");

    // 1. SUPABASE CONNECTION MODE
    if (dbMode === "Supabase Connected") {
      try {
        showToast("Supabase 클라우드에 저장하는 중...");

        // Insert new category (ID generated automatically by database serial)
        const { data: catInsert, error: catError } = await supabase
          .from('categories')
          .insert({
            name: newCatName,
            description: newCatDesc,
            icon_class: newCatIcon
          })
          .select();
        
        if (catError) throw catError;
        const createdCat = catInsert[0];

        // Insert new functional ingredient mapping
        const { error: ingError } = await supabase
          .from('ingredients_mapping')
          .insert({
            id: ingredientKey,
            name: newIngredientName,
            fda_functional_summary: newIngredientDesc,
            coupang_search_keyword: newCoupangKeyword
          });
        
        if (ingError) throw ingError;

        // Insert new symptom question linking them together
        const { error: symError } = await supabase
          .from('symptoms')
          .insert({
            category_id: createdCat.id,
            symptom_text: newSymptomText,
            matched_ingredient_id: ingredientKey
          });
        
        if (symError) throw symError;

        // If new Coupang Products are not present locally, register mock products for keyword
        if (!coupangProducts[newCoupangKeyword]) {
          const newProducts = [
            { brand: "네이처스웨이", title: `${newIngredientName} 프리미엄 골드 라벨`, price: 24500, rating: 4.8, reviews: 1024, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
            { brand: "나우푸드 (Now Foods)", title: `${newIngredientName} 고용량 식이보조제`, price: 17800, rating: 4.7, reviews: 3412, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
          ];
          setCoupangProducts({
            ...coupangProducts,
            [newCoupangKeyword]: newProducts
          });
        }

        showToast(`클라우드 DB 저장 완료! \n'${newCatName}' 카테고리가 Supabase에 동기화되었습니다.`);
        
        // Refetch to sync local state with Supabase
        await loadDatabase();

      } catch (err) {
        console.error("[PillSync] Supabase Insert Error:", err);
        alert(`Supabase 저장 중 오류가 발생했습니다. 자세한 정보: ${err.message || err}`);
      }

    // 2. LOCAL OFFLINE MODE
    } else {
      const newCatId = categories.length + 1;
      const newSymptomId = 100 * newCatId + 1;

      // Insert locally
      const newCategoryObj = {
        id: newCatId,
        name: newCatName,
        desc: newCatDesc,
        icon: newCatIcon,
        class: `cat-custom-${newCatId}`
      };
      setCategories([...categories, newCategoryObj]);

      const newIngredientObj = {
        name: newIngredientName,
        desc: newIngredientDesc,
        keyword: newCoupangKeyword
      };
      setIngredientsMapping({
        ...ingredientsMapping,
        [ingredientKey]: newIngredientObj
      });

      const newSymptomObj = {
        id: newSymptomId,
        category_id: newCatId,
        text: newSymptomText,
        ingredient_id: ingredientKey
      };
      setSymptoms([...symptoms, newSymptomObj]);

      if (!coupangProducts[newCoupangKeyword]) {
        const newProducts = [
          { brand: "네이처스웨이", title: `${newIngredientName} 프리미엄 골드 라벨`, price: 24500, rating: 4.8, reviews: 1024, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
          { brand: "나우푸드 (Now Foods)", title: `${newIngredientName} 고용량 식이보조제`, price: 17800, rating: 4.7, reviews: 3412, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
        ];
        setCoupangProducts({
          ...coupangProducts,
          [newCoupangKeyword]: newProducts
        });
      }

      showToast(`로컬 DB 저장 완료! \n카테고리 '${newCatName}' 및 식약처 성분 '${newIngredientName}'이 로컬에 추가되었습니다.`);
    }

    // Reset Form Fields
    setNewCatName('');
    setNewCatDesc('');
    setNewCatIcon('fa-eye');
    setNewSymptomText('');
    setNewIngredientName('');
    setNewIngredientDesc('');
    setNewCoupangKeyword('');

    // Switch view
    setActiveAdminTab('db-view');
    setActiveScreen('home');
    setCurrentCategoryId(null);
  };

  // Gather selected ingredients based on symptoms
  const getMatchedIngredients = () => {
    const matched = [];
    selectedSymptomIds.forEach(symId => {
      const symptom = symptoms.find(s => s.id === symId);
      if (symptom) {
        const ingId = symptom.ingredient_id;
        const ingData = ingredientsMapping[ingId];
        if (ingData && !matched.some(i => i.id === ingId)) {
          matched.push({ id: ingId, ...ingData });
        }
      }
    });
    return matched;
  };

  const selectedCategory = categories.find(c => c.id === currentCategoryId);
  const currentSymptoms = symptoms.filter(s => s.category_id === currentCategoryId);
  const matchedIngredientsList = getMatchedIngredients();

  // Calculate matching synergies based on user selections
  const activeSynergies = synergyCombinations.filter(syn => 
    syn.ingredients.every(ingId => matchedIngredientsList.some(m => m.id === ingId))
  );

  return (
    <div className={`app-container ${isMobileDevice ? 'is-mobile-device' : ''} ${!showAdminPanel ? 'hide-admin-layout' : ''}`}>
      {/* Background Orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      {/* Custom Reactive Toast */}
      {toastMessage && (
        <div className="custom-toast animate-fade">
          <div className="toast-header">
            <i className="fa-solid fa-circle-check"></i>
            <span>성공적으로 처리되었습니다</span>
          </div>
          <p style={{ whiteSpace: 'pre-line' }}>{toastMessage}</p>
        </div>
      )}

      {/* Main App Title Header */}
      {!isMobileDevice && (
        <header className="main-header">
          <div className="logo-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <i className="fa-solid fa-prescription-bottle-medical logo-icon"></i>
              <span className="brand-name">Pill<span>Sync</span></span>
              <span className="badge">v1.0.0 Live</span>
              <span 
                className={`badge ${dbMode.includes('Connected') ? 'badge-success' : 'badge-local'}`}
                onClick={toggleDbMode}
                style={{ cursor: 'pointer' }}
                title="클릭하여 로컬/Supabase 모드 강제 전환"
              >
                <i className={`fa-solid ${dbMode.includes('Connected') ? 'fa-cloud' : 'fa-database'}`} style={{ marginRight: '5px' }}></i>
                {dbMode}
              </span>
            </div>

            {/* 관리자 토글 스위치 (비밀 쿼리 스트링 ?admin=true 가 주소창에 있을 때만 노출) */}
            {isAdminQueryActive && (
              <div className="admin-toggle-wrapper animate-fade">
                <span className="admin-toggle-label">⚙️ 관리자 설정 패널</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={showAdminPanel} 
                    onChange={() => setShowAdminPanel(!showAdminPanel)} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            )}
          </div>
          <p className="subtitle">식약처 공인 건강 고민 맞춤 영양 매칭 및 분석 플랫폼</p>
        </header>
      )}

      {/* Dynamic Content Grid */}
      <main className={`content-grid ${!showAdminPanel || isMobileDevice ? 'single-column' : ''}`}>
        
        {/* LEFT: Simulated mobile preview */}
        <section className="device-section">
          <div className="section-title">
            <i className="fa-solid fa-mobile-screen-button"></i> 모바일 서비스 화면
          </div>

          <div className="mobile-frame">
            {/* System Status Bar - Render only on desktop emulator, not on real mobile devices */}
            {!isMobileDevice && (
              <div className="status-bar">
                <span className="time">{systemTime}</span>
                <div className="icons">
                  <i className="fa-solid fa-signal" style={{marginRight: '4px'}}></i>
                  <i className="fa-solid fa-wifi" style={{marginRight: '4px'}}></i>
                  <i className="fa-solid fa-battery-three-quarters"></i>
                </div>
              </div>
            )}

            {/* Simulated App Navigation Bar */}
            <div className="app-screen">
              <div className="app-nav">
                <button 
                  className="back-btn" 
                  onClick={handleBack} 
                  style={{ visibility: (activeScreen !== 'home') ? 'visible' : 'hidden' }}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="app-title">필싱크 (PillSync)</div>
                <div className="app-actions">
                  <i className="fa-regular fa-bell"></i>
                </div>
              </div>

              {/* Dynamic screen content routing based on state */}
              <div className="screen-content">
                
                {/* 1. HOME SCREEN */}
                {activeScreen === 'home' && (
                  <div className="animate-fade">
                    <div className="welcome-box">
                      <h2>나에게 딱 맞는<br/><span style={{ color: 'var(--color-primary)' }}>영양제 성분 조합</span> 찾기</h2>
                      <p>질병 진단이나 처방이 아닌, 식약처 기능성 고시 데이터에 기반하여 고민 해결에 최적화된 맞춤 성분을 30초 만에 추천합니다.</p>
                    </div>

                    <div className="section-tag">건강 고민 선택</div>
                    <div className="category-grid" style={{ marginTop: '12px' }}>
                      {categories.map(cat => (
                        <div 
                          key={cat.id} 
                          className={`category-card ${cat.class || ''}`} 
                          onClick={() => handleSelectCategory(cat.id)}
                        >
                          <div className="icon-wrapper">
                            <i className={`fa-solid ${cat.icon}`}></i>
                          </div>
                          <div className="info">
                            <h3>{cat.name}</h3>
                            <p>{cat.desc}</p>
                          </div>
                          <div className="arrow">
                            <i className="fa-solid fa-chevron-right"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. QUESTIONNAIRE SCREEN */}
                {activeScreen === 'survey' && selectedCategory && (
                  <div className="question-box">
                    <div className="section-tag">{selectedCategory.name} 분석</div>
                    <div className="question-title" style={{ marginTop: '8px' }}>
                      현재 몸에서 느껴지는 불편한 증상을 모두 선택해주세요. (중복 선택 가능)
                    </div>

                    <div className="options-list">
                      {currentSymptoms.map(sym => {
                        const isSelected = selectedSymptomIds.includes(sym.id);
                        return (
                          <div 
                            key={sym.id} 
                            className={`option-btn ${isSelected ? 'selected' : ''}`} 
                            onClick={() => handleToggleSymptom(sym.id)}
                          >
                            <span>{sym.text}</span>
                            <i className="fa-solid fa-check"></i>
                          </div>
                        );
                      })}
                    </div>

                    <button 
                      className="submit-survey-btn" 
                      disabled={selectedSymptomIds.length === 0} 
                      onClick={handleSubmitSurvey}
                      style={{ width: '100%' }}
                    >
                      맞춤 영양소 매칭 완료 <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </button>
                  </div>
                )}

                {/* 3. RESULT SCREEN */}
                {activeScreen === 'result' && selectedCategory && (
                  <div className="animate-fade">
                    <div className="result-header">
                      <div className="result-badge">식약처 고시 기반 매칭</div>
                      <h3>당신을 위한 맞춤 영양 조합</h3>
                      <p>{selectedCategory.name} 설문 기준 추천 성분입니다.</p>
                    </div>

                    <div className="section-tag">식약처 기능성 원료 분석</div>
                    <div className="ingredient-analysis-card" style={{ marginTop: '8px' }}>
                      {matchedIngredientsList.map(ing => {
                        const isWarningChecked = !!checkedWarnings[ing.id];
                        const hasAlternative = ing.alternative_ingredient_id && ingredientsMapping[ing.alternative_ingredient_id];
                        const targetIng = (isWarningChecked && hasAlternative) ? { id: ing.alternative_ingredient_id, ...ingredientsMapping[ing.alternative_ingredient_id] } : ing;

                        const isHighDose = targetIng.high_dose_ratio && !targetIng.high_dose_ratio.includes("100%");
                        const percentMatch = targetIng.high_dose_ratio ? targetIng.high_dose_ratio.match(/([\d,]+)%/) : null;
                        const rawPercent = percentMatch ? parseInt(percentMatch[1].replace(/,/g, ''), 10) : 100;
                        const displayPercent = Math.min(rawPercent, 100);
                        const isGuideOpen = !!openGuides[targetIng.id];

                        return (
                          <div key={ing.id} className="ingredient-item">
                            <div className="swapped-header">
                              <div className="ing-name">
                                <i className="fa-solid fa-capsules"></i> {targetIng.name}
                              </div>
                              {isWarningChecked && hasAlternative && (
                                <span className="badge-alternative animate-fade">
                                  <i className="fa-solid fa-triangle-exclamation"></i> 성분 대체 권장
                                </span>
                              )}
                            </div>
                            <div className="ing-desc">{targetIng.desc}</div>

                            {/* 식약처 일일 권장량 및 충족율 게이지 */}
                            {targetIng.kfda_daily_intake && (
                              <div className="intake-meta">
                                <div className="intake-row">
                                  <span className="intake-label">식약처 하루 권장량</span>
                                  <span className="intake-val">{targetIng.kfda_daily_intake}</span>
                                </div>
                                {targetIng.high_dose_ratio && (
                                  <>
                                    <div className="intake-row">
                                      <span className="intake-label">고함량 충족율</span>
                                      <span className={`intake-val ${isHighDose ? 'high-dose' : ''}`}>
                                        {targetIng.high_dose_ratio}
                                      </span>
                                    </div>
                                    <div className="progress-container">
                                      <div 
                                        className={`progress-bar ${isHighDose ? 'high-dose-fill' : ''}`} 
                                        style={{ width: `${displayPercent}%` }}
                                      ></div>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}

                            {/* 대안 추천 상세 사유 출력 */}
                            {isWarningChecked && hasAlternative && ing.alternative_reason && (
                              <div className="alternative-reason-box animate-fade">
                                <div className="alternative-reason-title">
                                  <i className="fa-solid fa-circle-info"></i> 대안 추천 가이드
                                </div>
                                <div className="alternative-reason-desc">{ing.alternative_reason}</div>
                              </div>
                            )}

                            {/* 고함량 메리트 & 부작용 사전 가이드 아코디언 */}
                            {(targetIng.high_dose_effect || targetIng.side_effects || targetIng.intake_tip) && (
                              <div className="details-toggle">
                                <button className="details-header" onClick={() => toggleGuide(targetIng.id)}>
                                  <span>섭취 메리트 & 부작용 가이드</span>
                                  <i className={`fa-solid ${isGuideOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                </button>
                                {isGuideOpen && (
                                  <div className="details-body animate-fade">
                                    {targetIng.high_dose_effect && (
                                      <div className="info-block">
                                        <div className="info-block-title benefit">
                                          <i className="fa-solid fa-circle-check"></i> 고함량 섭취 메리트
                                        </div>
                                        <p>{targetIng.high_dose_effect}</p>
                                      </div>
                                    )}
                                    {targetIng.side_effects && (
                                      <div className="info-block">
                                        <div className="info-block-title warning">
                                          <i className="fa-solid fa-triangle-exclamation"></i> 발생 가능한 부작용
                                        </div>
                                        <p>{targetIng.side_effects}</p>
                                      </div>
                                    )}
                                    {targetIng.intake_tip && (
                                      <div className="info-block">
                                        <div className="info-block-title tip">
                                          <i className="fa-solid fa-lightbulb"></i> 권장 복용 팁
                                        </div>
                                        <p>{targetIng.intake_tip}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 기저 질환 / 부작용 트리거 체크박스 */}
                            {ing.warning_trigger_text && (
                              <div 
                                className="alternative-trigger-box"
                                onClick={() => setCheckedWarnings(prev => ({ ...prev, [ing.id]: !prev[ing.id] }))}
                              >
                                <input 
                                  type="checkbox" 
                                  className="alternative-checkbox" 
                                  checked={isWarningChecked}
                                  onChange={() => {}}
                                />
                                <span className="alternative-label">{ing.warning_trigger_text}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* 3a. 식약처 고시 기반 시너지 추천 패키지 */}
                    {activeSynergies.length > 0 && (
                      <div className="animate-fade" style={{ marginTop: '16px' }}>
                        <div className="section-tag">🔥 식약처 고시 기반 시너지 추천</div>
                        <div className="synergy-list" style={{ marginTop: '8px' }}>
                          {activeSynergies.map(syn => (
                            <div key={syn.id} className="synergy-card">
                              <div className="synergy-glow"></div>
                              <div className="synergy-title-row">
                                <div className="synergy-title">
                                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                                  {syn.name}
                                </div>
                              </div>
                              <div className="synergy-badge-row">
                                {syn.ingredients.map(ingId => (
                                  <span key={ingId} className="synergy-ingredient-badge">
                                    💊 {ingId}
                                  </span>
                                ))}
                              </div>
                              <div className="synergy-desc-text" style={{ fontWeight: '700', color: 'var(--color-secondary)', marginBottom: '4px' }}>
                                시너지 효과: {syn.synergy_effect}
                              </div>
                              <div className="synergy-desc-text">
                                {syn.recommendation_reason}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="fda-box" style={{ marginTop: '16px' }}>
                      <i className="fa-solid fa-circle-info"></i>
                      <div>본 안내는 식약처 고시 데이터 기반 가이드이며, 약사법에 저촉되지 않는 단순 정보 매칭입니다. 특정 질병 치료는 전문의와 상담하십시오.</div>
                    </div>

                    <button 
                      className="kfda-open-btn animate-fade" 
                      onClick={() => setIsKfdaModalOpen(true)}
                    >
                      <i className="fa-solid fa-file-shield"></i> 식약처 공인 부작용 & 대안 매칭 가이드 보기
                    </button>

                    <div className="section-tag">쿠팡 최저가 딥링크 추천</div>
                    <div className="product-grid" style={{ marginTop: '8px' }}>
                      {matchedIngredientsList.map(ing => {
                        const isWarningChecked = !!checkedWarnings[ing.id];
                        const hasAlternative = ing.alternative_ingredient_id && ingredientsMapping[ing.alternative_ingredient_id];
                        const targetIng = (isWarningChecked && hasAlternative) ? { id: ing.alternative_ingredient_id, ...ingredientsMapping[ing.alternative_ingredient_id] } : ing;

                        const productsList = coupangProducts[targetIng.keyword] || defaultMockProducts;
                        return productsList.map((prod, idx) => {
                          const redirectUrl = `https://www.coupang.com/np/search?q=${encodeURIComponent(targetIng.keyword)}`;
                          return (
                            <a 
                              key={`${targetIng.id}-${idx}`}
                              href={redirectUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="product-card"
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`쿠팡 파트너스 딥링크 리다이렉션:\n[${prod.brand}] ${prod.title}\n\n클릭 시 본인의 파트너스 서브아이디 및 링크로 실제 쿠팡 앱이 자동 실행됩니다.`);
                                window.open(redirectUrl, '_blank');
                              }}
                            >
                              <div className="prod-img-box">
                                <img src={prod.img} alt={prod.title} />
                              </div>
                              <div className="prod-info">
                                <div>
                                  <span className="prod-brand">{prod.brand}</span>
                                  <div className="prod-title">{prod.title}</div>
                                  <div className="prod-meta">
                                    <span className="rating"><i className="fa-solid fa-star"></i> {prod.rating}</span>
                                    <span className="review-count">({prod.reviews.toLocaleString()}개 상품평)</span>
                                  </div>
                                </div>
                                <div className="price-row">
                                  <span className="prod-price">{prod.price.toLocaleString()}원</span>
                                  <span className="buy-btn">
                                    <i className="fa-solid fa-shopping-cart"></i> 쿠팡 최저가
                                  </span>
                                </div>
                              </div>
                            </a>
                          );
                        });
                      })}
                    </div>

                    <button className="reset-btn" onClick={handleReset} style={{ width: '100%' }}>
                      <i className="fa-solid fa-house"></i> 건강고민 다시 선택
                    </button>
                  </div>
                )}

              </div>

              {/* Bottom Sticky Banner (Coupang Disclaimer) */}
              {activeScreen === 'result' && (
                <div className="coupang-partners-disclaimer">
                  이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* RIGHT: Realtime Database administration view panel */}
        {!isMobileDevice && showAdminPanel && (
          <section className="admin-section animate-fade">
          <div className="section-title">
            <i className="fa-solid fa-database"></i> 실시간 DB & 관리자 설정 패널
          </div>

          <div className="admin-card">
            {/* Tab navigation */}
            <div className="tab-header">
              <button 
                className={`tab-btn ${activeAdminTab === 'db-view' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('db-view')}
              >
                <i className="fa-solid fa-table"></i> DB 스키마 뷰어
              </button>
              <button 
                className={`tab-btn ${activeAdminTab === 'add-category' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('add-category')}
              >
                <i className="fa-solid fa-plus-circle"></i> 신규 카테고리 추가
              </button>
            </div>

            {/* TAB 1: DB SCHEMA VIEWER */}
            {activeAdminTab === 'db-view' && (
              <div className="tab-content active">
                <div className="db-tables">
                  
                  {/* categories table */}
                  <div className="db-table-card">
                    <h4><i className="fa-solid fa-list"></i> Categories (대분류 테이블)</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>카테고리명</th>
                            <th>설명</th>
                            <th style={{ textAlign: 'center' }}>아이콘</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(cat => (
                            <tr key={cat.id}>
                              <td>{cat.id}</td>
                              <td><strong>{cat.name}</strong></td>
                              <td>{cat.desc}</td>
                              <td style={{ textAlign: 'center' }}><i className={`fa-solid ${cat.icon}`}></i></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* symptoms table */}
                  <div className="db-table-card">
                    <h4><i className="fa-solid fa-clipboard-question"></i> Symptoms (설문/선택지 테이블)</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Cat_ID</th>
                            <th>선택 항목</th>
                            <th>매칭 성분 키</th>
                          </tr>
                        </thead>
                        <tbody>
                          {symptoms.map(sym => (
                            <tr key={sym.id}>
                              <td>{sym.id}</td>
                              <td>{sym.category_id}</td>
                              <td>{sym.text}</td>
                              <td><span className="keyword-badge">{sym.ingredient_id}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ingredients_mapping table */}
                  <div className="db-table-card">
                    <h4><i className="fa-solid fa-flask"></i> Ingredients_Mapping (식약처 영양소 매칭)</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>성분 키</th>
                            <th>식약처 기능성 요약</th>
                            <th>일일 권장량</th>
                            <th>고함량 기준</th>
                            <th>주의 부작용</th>
                            <th>쿠팡 검색어</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(ingredientsMapping).map(key => {
                            const ing = ingredientsMapping[key];
                            return (
                              <tr key={key}>
                                <td><strong>{key}</strong></td>
                                <td>{ing.desc}</td>
                                <td>{ing.kfda_daily_intake || "-"}</td>
                                <td>{ing.high_dose_ratio || "-"}</td>
                                <td>{ing.side_effects ? ing.side_effects.substring(0, 30) + "..." : "-"}</td>
                                <td><span className="keyword-badge">{ing.keyword}</span></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* synergy_combinations table */}
                  <div className="db-table-card">
                    <h4><i className="fa-solid fa-wand-magic-sparkles"></i> Synergy_Combinations (추천 시너지 조합)</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>조합명</th>
                            <th>매칭 성분 목록</th>
                            <th>시너지 효과 요약</th>
                            <th>상세 추천 사유</th>
                          </tr>
                        </thead>
                        <tbody>
                          {synergyCombinations.map(syn => (
                            <tr key={syn.id}>
                              <td>{syn.id}</td>
                              <td><strong>{syn.name}</strong></td>
                              <td>
                                {syn.ingredients.map(ingId => (
                                  <span key={ingId} className="keyword-badge" style={{ marginRight: '4px' }}>
                                    {ingId}
                                  </span>
                                ))}
                              </td>
                              <td>{syn.synergy_effect}</td>
                              <td>{syn.recommendation_reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: ADD DYNAMIC CATEGORY & LINKINGS */}
            {activeAdminTab === 'add-category' && (
              <div className="tab-content active">
                <form className="admin-form" onSubmit={handleAddCategorySubmit}>
                  
                  <div className="form-group">
                    <label>새 카테고리 이름 (예: 눈 건강, 관절 건강, 숙취해소)</label>
                    <input 
                      type="text" 
                      placeholder="카테고리명을 입력하세요" 
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>설명</label>
                    <input 
                      type="text" 
                      placeholder="예: 건조하고 피로한 눈을 위한 맞춤 매칭" 
                      value={newCatDesc}
                      onChange={e => setNewCatDesc(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>아이콘 (FontAwesome 아이콘선택)</label>
                    <select 
                      value={newCatIcon}
                      onChange={e => setNewCatIcon(e.target.value)}
                    >
                      <option value="fa-eye">👁️ 눈 (fa-eye)</option>
                      <option value="fa-beer-mug-empty">🍺 술/간 (fa-beer-mug-empty)</option>
                      <option value="fa-brain">🧠 두뇌/기억력 (fa-brain)</option>
                      <option value="fa-heart">❤️ 심장/혈관 (fa-heart)</option>
                      <option value="fa-shield-halved">🛡️ 면역력 (fa-shield-halved)</option>
                      <option value="fa-bone">🦴 관절/뼈 (fa-bone)</option>
                    </select>
                  </div>

                  <div className="divider">설문 선택지 및 식약처 성분 연동 정보</div>

                  <div className="form-group">
                    <label>선택지 질문 (예: 건조하고 뻑뻑한 느낌이 자주 들어요)</label>
                    <input 
                      type="text" 
                      placeholder="설문 화면에 표시될 불편 증상 문구" 
                      value={newSymptomText}
                      onChange={e => setNewSymptomText(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>추천 영양소 (식약처 인정 원료)</label>
                    <input 
                      type="text" 
                      placeholder="예: 루테인 지아잔틴" 
                      value={newIngredientName}
                      onChange={e => setNewIngredientName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>식약처 고시 기능성 내용</label>
                    <textarea 
                      rows="3" 
                      placeholder="예: 황반색소밀도를 유지하여 눈 건강에 도움을 줄 수 있음" 
                      value={newIngredientDesc}
                      onChange={e => setNewIngredientDesc(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>쿠팡 검색 최적화 키워드 (딥링크 연동어)</label>
                    <input 
                      type="text" 
                      placeholder="예: 루테인지아잔틴 직구 추천" 
                      value={newCoupangKeyword}
                      onChange={e => setNewCoupangKeyword(e.target.value)}
                      required 
                    />
                  </div>

                  <button type="submit" className="submit-btn" style={{ width: '100%', marginTop: '16px' }}>
                    <i className="fa-solid fa-save"></i> DB 저장 및 모바일 즉시 반영
                  </button>

                </form>
              </div>
            )}

          </div>
        </section>
        )}
 
      </main>

      {/* Decorative page footer */}
      {!isMobileDevice && (
        <footer className="footer">
          <p>© 2026 PillSync. All Rights Reserved. 식약처 고시 건강기능식품 영양소 맞춤 매칭 서비스.</p>
        </footer>
      )}

      {/* KFDA Report Modal Dialog Overlay */}
      <KfdaReportModal 
        isOpen={isKfdaModalOpen} 
        onClose={() => setIsKfdaModalOpen(false)} 
        ingredientsMapping={ingredientsMapping} 
      />
    </div>
  );
}

function KfdaReportModal({ isOpen, onClose, ingredientsMapping }) {
  if (!isOpen) return null;

  const kfdaData = [
    {
      category: "피로 개선",
      items: [
        {
          key: "밀크씨슬",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "실리마린 기준 130 mg",
          warning: "이상사례 발생 시 섭취를 중단할 것. 위장장애, 설사가 있을 시 주의.",
          alternative: "홍경천 추출물",
          altReason: "밀크씨슬 추출물은 위와 장을 강하게 자극하여 소화기 통증이나 설사를 일으킬 수 있으므로, 부작용 없이 부신 활력을 회복하는 홍경천 추출물을 추천합니다."
        },
        {
          key: "비타민B군",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "비타민B1 기준 1.2 mg",
          warning: "고함량 섭취 시 소변이 형광 노란색으로 변하거나 일시적으로 불면증, 위장 장애가 발생할 수 있습니다.",
          alternative: null,
          altReason: null
        },
        {
          key: "홍경천 추출물",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "로디올라오사이드 기준 200 mg",
          warning: "임산부, 수유부, 영유아 및 어린이는 섭취에 주의할 것.",
          alternative: null,
          altReason: null
        },
        {
          key: "홍삼",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "진세노사이드 기준 3 mg",
          warning: "의약품(당뇨치료제, 혈액항응고제) 복용 시 섭취에 주의할 것. 교감신경 흥분 유발 가능.",
          alternative: "L-테아닌",
          altReason: "홍삼은 혈관을 이완시키나 체질에 따라 교감신경을 흥분시켜 혈압 상승 및 가슴 두근거림을 초래할 수 있습니다. 대신 뇌 세포를 안정시켜 스트레스 긴장을 부드럽게 이완해주는 L-테아닌을 권장합니다."
        },
        {
          key: "L-테아닌",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "L-테아닌으로서 200~250 mg",
          warning: "카페인 함유 음료(커피, 홍차, 녹차 등)와 병용 섭취에 주의할 것.",
          alternative: null,
          altReason: null
        }
      ]
    },
    {
      category: "다이어트",
      items: [
        {
          key: "가르시니아",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "HCA 기준 750~2,800 mg",
          warning: "어린이, 임산부 및 수유부는 섭취를 피할 것. 간·신장·심장질환, 알레르기 및 천식이 있거나 의약품 복용 시 전문가와 상담할 것.",
          alternative: "L-카르니틴",
          altReason: "가르시니아(HCA)는 드물게 호르몬 균형에 영향을 주어 생리불순이나 간독성을 유발할 수 있습니다. 대신 부작용 없이 체지방을 미토콘드리아로 유입하여 태우는 안전한 대사 촉진 성분인 L-카르니틴을 대안으로 추천합니다."
        },
        {
          key: "녹차카테킨",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "카테킨 기준 300~500 mg",
          warning: "카페인이 함유되어 있어 초조감, 불면 등을 나타낼 수 있음. 식사 후 섭취할 것. 간 질환이 있거나 의약품 복용 시 전문가와 상담할 것.",
          alternative: "콜레우스포스콜리",
          altReason: "녹차카테킨 제품은 녹차 유래 천연 카페인을 소량 함유하고 있어 민감한 분들께 심장 두근거림이나 불면증을 악화시킬 수 있습니다. 대신 천연 무카페인 성분으로 기초 대사를 안전하게 끌어올려주는 콜레우스포스콜리를 적극 권장합니다."
        },
        {
          key: "콜레우스포스콜리",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "포스콜린 기준 50 mg",
          warning: "임산부, 수유부, 영유아, 어린이 및 수술 전후 환자는 섭취를 피할 것. 항응고제 또는 혈압조절제를 복용하거나 혈압이 낮은 사람은 주의할 것.",
          alternative: null,
          altReason: null
        },
        {
          key: "시서스",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "시서스 추출물 기준 300 mg",
          warning: "영·유아, 어린이, 임산부 및 수유부는 섭취를 피할 것. 혈당강하제를 복용하는 사람은 전문가와 상담할 것.",
          alternative: null,
          altReason: null
        },
        {
          key: "L-카르니틴",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "L-카르니틴 타르트레이트 기준 2,000 mg",
          warning: "어린이, 임산부 및 수유부는 섭취를 피할 것. 특정 성분에 알레르기가 있는 사람은 주의할 것.",
          alternative: null,
          altReason: null
        }
      ]
    },
    {
      category: "탈모 & 모발 건강",
      items: [
        {
          key: "비오틴",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "에너지 생성 필수량 30 mcg",
          warning: "과량의 비오틴 섭취 시 피지 분비가 폭발하여 여드름이나 뾰루지 등 트러블이 올라올 수 있습니다.",
          alternative: "L-시스틴",
          altReason: "초고함량 비오틴은 지성 피부군에서 피지선을 과자극하여 모낭 트러블이나 뾰루지를 유발할 수 있습니다. 모발 단백질의 핵심 원료 구조를 튼튼하게 강화해주면서 피지 조절을 돕는 L-시스틴을 훌륭한 대안으로 추천합니다."
        },
        {
          key: "맥주효모",
          type: "gosi",
          typeName: "일반식품 원료",
          daily: "건조 맥주효모 기준 3,000 mg",
          warning: "퓨린 함량이 매우 높으므로 통풍 기왕력이 있거나 요산 수치가 높은 분은 관절 통증을 발현합니다.",
          alternative: "판토텐산",
          altReason: "맥주효모는 세포 증식을 돕는 퓨린(Purine) 함량이 극도로 높아 통풍 환자에게 급성 발작을 유발할 수 있습니다. 대신 퓨린 걱정이 전혀 없으면서 두피 모근 세포의 재생과 영양을 채워주는 판토텐산을 안전한 대안으로 권장합니다."
        },
        {
          key: "아연",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "세포분열 필수량 8.5 mg",
          warning: "아연은 위장벽 자극이 심한 편이므로 반드시 식후에 충분한 물과 함께 섭취하세요.",
          alternative: "맥주효모",
          altReason: "아연은 위장 점막을 직접적으로 강하게 자극하여 고함량 섭취 시 극심한 메스꺼움이나 쓰림을 유발하기 쉽습니다. 위장에 전혀 부담을 주지 않으면서 천연 아미노산 단백질 공급원이 되는 맥주효모를 대안으로 추천합니다."
        },
        {
          key: "L-시스틴",
          type: "gosi",
          typeName: "아미노산 원료",
          daily: "L-시스틴 기준 500 mg",
          warning: "위장 장애 및 기관지 분비액 유발 우려가 있으므로 만성 천식 환자는 의사 상담이 권고됩니다.",
          alternative: null,
          altReason: null
        },
        {
          key: "판토텐산",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "판토텐산 기준 5 mg",
          warning: "수용성 비타민으로 체내 축적이 없고 부작용이 거의 없으나 간혹 가벼운 복통이 생길 수 있습니다.",
          alternative: null,
          altReason: null
        }
      ]
    }
  ];

  return (
    <div className="kfda-modal-overlay" onClick={onClose}>
      <div className="kfda-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="kfda-modal-header">
          <div className="kfda-modal-title">
            <i className="fa-solid fa-file-shield"></i> 식약처 공인 부작용 & 대안 매칭 가이드
          </div>
          <button className="kfda-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="kfda-modal-body">
          <div className="kfda-modal-disclaimer">
            <strong>[법적 면책 고지]</strong><br />
            본 정보는 대한민국 식품의약품안전처(MFDS)의 기능성 원료 고시 및 건강기능식품 공전을 기반으로 작성된 학술 참고 자료입니다. 특정 질병의 진단 및 치료를 대체할 수 없으며, 의약품을 복용 중이거나 치료를 요하는 경우 반드시 전문 의료인과 상담하시기 바랍니다.
          </div>

          <div className="kfda-law-links">
            <a href="https://www.law.go.kr/행정규칙/건강기능식품의기준및규격" target="_blank" rel="noopener noreferrer" className="kfda-law-link-item">
              <span>⚖️ 식약처 건강기능식품 기준 및 규격 고시 전문</span>
              <i className="fa-solid fa-up-right-from-square"></i>
            </a>
            <a href="https://www.foodsafetykorea.go.kr" target="_blank" rel="noopener noreferrer" className="kfda-law-link-item">
              <span>🌐 식품안전나라 공식 홈페이지</span>
              <i className="fa-solid fa-up-right-from-square"></i>
            </a>
          </div>

          {kfdaData.map((cat, cIdx) => (
            <div key={cIdx} className="kfda-category-section">
              <div className="kfda-category-title">
                <i className="fa-solid fa-circle-chevron-right"></i> {cat.category}
              </div>
              {cat.items.map((item, iIdx) => {
                const ingData = ingredientsMapping[item.key] || {};
                return (
                  <div key={iIdx} className="kfda-ingredient-card">
                    <div className="kfda-ing-header">
                      <span className="kfda-ing-name">{item.key} ({ingData.name || item.key})</span>
                      <span className={`kfda-ing-badge ${item.type === 'gosi' ? 'kfda-badge-gosi' : 'kfda-badge-gaebel'}`}>
                        {item.typeName}
                      </span>
                    </div>
                    <div className="kfda-ing-details">
                      <div className="kfda-ing-detail-row">
                        <span className="kfda-ing-detail-label">식약처 공인 기능성</span>
                        <span className="kfda-ing-detail-value">{ingData.desc || "에너지 대사 및 건강 증진 도움"}</span>
                      </div>
                      <div className="kfda-ing-detail-row">
                        <span className="kfda-ing-detail-label">일일 권장 섭취량</span>
                        <span className="kfda-ing-detail-value">{item.daily}</span>
                      </div>
                      <div className="kfda-ing-detail-row">
                        <span className="kfda-ing-detail-label">섭취 시 주의사항 (부작용)</span>
                        <span className="kfda-ing-detail-value" style={{ color: '#F87171' }}>{item.warning}</span>
                      </div>
                      {item.alternative && (
                        <div className="kfda-ing-detail-row" style={{ marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '4px' }}>
                          <span className="kfda-ing-detail-label" style={{ color: '#FB923C' }}>💡 부작용 예방 대안 성분</span>
                          <span className="kfda-ing-detail-value">
                            <strong>{item.alternative}</strong> 로의 스왑 추천
                          </span>
                          <span className="kfda-ing-detail-value" style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '2px' }}>
                            {item.altReason}
                          </span>
                        </div>
                      )}
                      <div className="kfda-ing-link-row">
                        <a 
                          href="https://www.foodsafetykorea.go.kr" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="kfda-ing-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`식품안전나라 사이트로 이동합니다.\n상단 메뉴 [식품·안전 > 건강기능식품 > 건강기능식품 원료별 정보]에서 '${item.key}'를 직접 검색하시면 세션 만료 에러 없이 고시 요약본 조회가 가능합니다.`);
                          }}
                        >
                          식품안전나라 원료 검색 가이드 ➔
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
