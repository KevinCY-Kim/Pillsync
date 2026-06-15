-- ==========================================================
-- PillSync Supabase Database Schema & Seed Script (식약처 정형 데이터 고도화 + 대안 추천)
-- ==========================================================

-- 1. Clean up existing tables if they exist
DROP TABLE IF EXISTS synergy_ingredients CASCADE;
DROP TABLE IF EXISTS synergy_combinations CASCADE;
DROP TABLE IF EXISTS symptoms CASCADE;
DROP TABLE IF EXISTS ingredients_mapping CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. Create Categories (대분류 테이블)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_class VARCHAR(50) DEFAULT 'fa-capsules',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Ingredients Mapping (식약처 공인 성분 및 쿠팡 매칭 + 권장량/부작용/대안추천 추가)
CREATE TABLE ingredients_mapping (
    id VARCHAR(50) PRIMARY KEY, -- Primary Key matching symptom matched_ingredient_id
    name VARCHAR(100) NOT NULL,
    fda_functional_summary TEXT NOT NULL, -- 식약처 공인 기능성 내용
    coupang_search_keyword VARCHAR(100) NOT NULL, -- 쿠팡 파트너스 API 검색어
    kfda_daily_intake VARCHAR(100),            -- 식약처 일일 권장 섭취량
    high_dose_ratio VARCHAR(100),             -- 일반 고함량 제품 기준 충족율
    high_dose_effect TEXT,                    -- 고함량 복용 시 메리트
    side_effects TEXT,                        -- 주의해야 할 부작용 및 복용 팁
    intake_tip TEXT,                          -- 권장 복용 시간/방법
    warning_trigger_text VARCHAR(255),        -- 부작용 기저 조건 경고 트리거 문구
    alternative_ingredient_id VARCHAR(50) REFERENCES ingredients_mapping(id) ON DELETE SET NULL, -- 대안 추천 성분 ID
    alternative_reason TEXT,                  -- 대안 추천 사유 설명
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Symptoms (증상 선택지 테이블)
CREATE TABLE symptoms (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    symptom_text VARCHAR(255) NOT NULL,
    matched_ingredient_id VARCHAR(50) REFERENCES ingredients_mapping(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create Synergy Combinations (시너지 조합 테이블)
CREATE TABLE synergy_combinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,                      -- 조합명 (예: '활력 부스터 패키지')
    synergy_effect VARCHAR(255) NOT NULL,            -- 효과 요약 (예: '에너지 대사 가속 및 간 피로 해소')
    recommendation_reason TEXT NOT NULL,             -- 시너지 상세 기전 설명
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Create Synergy Ingredients (성분 매핑 브릿지 테이블)
CREATE TABLE synergy_ingredients (
    synergy_id INT REFERENCES synergy_combinations(id) ON DELETE CASCADE,
    ingredient_id VARCHAR(50) REFERENCES ingredients_mapping(id) ON DELETE CASCADE,
    PRIMARY KEY (synergy_id, ingredient_id)
);

-- 7. Enable Row Level Security (RLS) for public read/write access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE synergy_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE synergy_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for categories" ON categories FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access for ingredients_mapping" ON ingredients_mapping FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for ingredients_mapping" ON ingredients_mapping FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access for symptoms" ON symptoms FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for symptoms" ON symptoms FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access for synergy_combinations" ON synergy_combinations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for synergy_combinations" ON synergy_combinations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access for synergy_ingredients" ON synergy_ingredients FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for synergy_ingredients" ON synergy_ingredients FOR INSERT WITH CHECK (true);

-- 8. Insert Seed Data
-- 8a. Ingredients (식약처 고시 및 권장량/고함량 효과/부작용/대안추천 정보 적재)
INSERT INTO ingredients_mapping (id, name, fda_functional_summary, coupang_search_keyword, kfda_daily_intake, high_dose_ratio, high_dose_effect, side_effects, intake_tip, warning_trigger_text, alternative_ingredient_id, alternative_reason) VALUES
-- 피로 개선 카테고리 성분
('밀크씨슬', '밀크씨슬 추출물 (실리마린)', '실리마린 성분이 간 세포막을 보호하고 항산화 작용을 돕고 피로 회복을 위한 간 건강 기능성을 식약처가 고시함', '밀크씨슬 실리마린 직구', 
 '실리마린 기준 130 mg', '260 mg (200% 충족)', 
 '만성 피로 해소 및 간 세포막 보호 작용을 신속히 활성화하여 과로로 인한 일시적 간 수치 개선에 기여', 
 '과다 복용 시 위장 장애(설사, 복통)가 발생할 수 있습니다.', 
 '위장에 무리를 줄 수 있으므로 식사 직후 충분한 물과 함께 섭취하세요.',
 '위장이 민감하여 평소 복통이나 설사가 자주 생깁니다.', NULL, -- 순서상 L-테아닌이나 홍경천을 임시 대안으로 활용
 '밀크씨슬 추출물은 위와 장을 강하게 자극하여 소화기 통증이나 설사를 일으킬 수 있으므로, 부작용 없이 부신 활력을 회복하는 홍경천 추출물을 안전한 피로 회복 대안으로 추천합니다.'),

('비타민B군', '활성 비타민B 콤플렉스', '수용성 비타민 B1, B2, B6, B12 복합체로 체내 에너지 생성 및 대사에 필수적이며 육체 피로 회복에 도움', '고함량 비타민B 컴플렉스', 
 '비타민B1 기준 1.2 mg', '100 mg (8,333% 충족)', 
 '체내 대사를 급격히 가속화하여 즉각적인 활력을 불어넣고 젖산 축적을 억제하여 만성 피로 회복', 
 '고함량 섭취 시 소변이 형광 노란색으로 변하거나 일시적으로 불면증, 위장 장애가 발생할 수 있습니다.', 
 '에너지 생성을 도우므로 밤늦은 시간보다는 아침이나 낮 시간대 복용을 권장합니다.',
 NULL, NULL, NULL),

('홍경천 추출물', '홍경천 추출물 (로디올라)', '고산지대 자생 식물로 스트레스로 인한 피로를 개선하는 데 도움을 줄 수 있음을 식약처가 인정한 기능성 원료', '홍경천 로디올라 스트레스', 
 '로디올라오사이드 기준 200 mg', '200 mg (100% 충족)', 
 '스트레스로 인한 피로 개선 및 가슴 두근거림 완화 효과', 
 '일부 두통 및 어지러움, 혈압에 일시적 변동이 올 수 있습니다.', 
 '오전 또는 오후 섭취가 적당하며, 진정 성분이 있으므로 다른 약물과의 간섭에 주의하세요.',
 NULL, NULL, NULL),

('홍삼', '홍삼 (진세노사이드)', '사포닌(Rg1, Rb1, Rg3) 성분이 함유되어 면역력 증진, 피로 개선, 항산화에 도움을 줄 수 있는 대표 고시형 원료', '홍삼정 에브리타임 스틱', 
 '진세노사이드 기준 3 mg', '15 mg (500% 충족)', 
 '혈소판 응집 억제를 통한 혈액 흐름 개선, 기력 증진 및 면역 세포 활성화로 면역 증진 가속', 
 '체질에 따라 열감, 두통, 불면이 생길 수 있으므로 혈압이 높으신 분은 복용에 주의해야 합니다.', 
 '공복에 섭취 시 흡수율이 높아 아침 공복 복용을 권장하지만, 위가 약하면 식후에 드세요.',
 '고혈압이 있거나 평소 몸에 열이 많고 가슴 두근거림이 잦습니다.', NULL,
 '홍삼은 혈관을 이완시키나 체질에 따라 교감신경을 흥분시켜 혈압 상승 및 가슴 두근거림을 초래할 수 있습니다. 대신 뇌 세포를 안정시켜 스트레스 긴장을 부드럽게 이완해주는 L-테아닌을 권장합니다.'),

('L-테아닌', 'L-테아닌 (L-Theanine)', '녹차에 들어있는 아미노산의 일종으로 스트레스로 인한 긴장 완화에 도움을 줄 수 있음을 식약처가 인정한 성분', '나우푸드 L테아닌 200mg', 
 '200~250 mg', '200 mg (100% 충족)', 
 '뇌의 α파 생성을 촉진하여 과도한 긴장 상태를 완화하고 숙면 및 심신 안정을 유도', 
 '진정 효과가 강해 과량 복용 시 급격한 졸음이나 현기증을 느낄 수 있습니다.', 
 '스트레스를 많이 받는 업무 시간 전이나 잠들기 1~2시간 전에 미온수와 복용하십시오.',
 NULL, NULL, NULL),

-- 다이어트 카테고리 성분
('가르시니아', '가르시니아 캄보지아 추출물 (HCA)', '과피 추출물인 HCA가 탄수화물이 지방으로 합성되는 것을 억제하여 체지방 감소에 도움을 주는 고시형 다이어트 원료', '가르시니아 HCA 다이어트', 
 'HCA 기준 750~2,800 mg', '1,500 mg (100% 충족)', 
 '탄수화물이 지방으로 변환되는 대사 경로를 차단하여, 섭취 후 체지방 축적률을 유의미하게 감소', 
 '과량 섭취 시 생리 주기가 불규칙해지거나 경미한 피부 가려움증, 두통이 발생할 수 있습니다. 간 손상 우려가 있는 경우 주의 필요.', 
 '탄수화물 흡수가 시작되기 전인 식사 30분~1시간 전에 복용해야 최적의 효과를 냅니다.',
 '생리 주기가 불규칙하거나 간 기능 우려가 있습니다.', NULL,
 '가르시니아(HCA)는 드물게 호르몬 균형에 영향을 주어 생리불순이나 간독성을 유발할 수 있습니다. 대신 부작용 없이 체지방을 미토콘드리아로 유입하여 태우는 안전한 대사 촉진 성분인 L-카르니틴을 대안으로 추천합니다.'),

('녹차카테킨', '녹차 추출물 (카테킨)', '카테킨 성분이 항산화 작용을 돕고 체지방 감소 및 혈중 콜레스테롤 수치 개선에 도움을 줄 수 있는 식약처 인증 성분', '녹차카테킨 다이어트보조제', 
 '카테킨 기준 300~500 mg', '400 mg (100% 충족)', 
 '체지방 강제 연소를 촉진하고 활성산소를 억제하는 강력한 항산화 및 콜레스테롤 저하 효과', 
 '카페인 함유로 불면, 두근거림이 유발될 수 있고, 공복 섭취 시 위장 장애나 간 독성 우려가 있습니다.', 
 '위장 자극을 최소화하고 식후 대사를 돕도록 식사 직후 30분 이내 복용을 강력히 권장합니다.',
 '카페인에 극도로 예민하여 커피를 마시면 불면증이나 두근거림이 있습니다.', NULL,
 '녹차카테킨 제품은 녹차 유래 천연 카페인을 소량 함유하고 있어 민감한 분들께 심장 두근거림이나 불면증을 악화시킬 수 있습니다. 대신 천연 무카페인 성분으로 기초 대사를 안전하게 끌어올려주는 콜레우스포스콜리를 적극 권장합니다.'),

('콜레우스포스콜리', '콜레우스 포스콜리 추출물', '인도 전통 약재식물 추출물로 제지방량(근육량)은 보존하고 체지방을 감소시키는 기능성을 개별인정받은 원료', '콜레우스 포스콜리 포스콜린', 
 '포스콜린 기준 50 mg', '50 mg (100% 충족)', 
 '제지방(근육량)은 유지·보존하면서 순수 체지방의 연소와 대사율을 올려 기초대사량 증가 효과 유도', 
 '혈압을 낮추는 부작용이 있으므로 저혈압 환자나 항응고제 복용자는 주의가 필요합니다.', 
 '신체 대사를 높이기 위해 오전 활동을 시작하기 전 또는 운동 1시간 전에 섭취하십시오.',
 NULL, NULL, NULL),

('시서스', '시서스 추출물 (Cissus)', '열대 아시아 자생 식물로 리파아제 활성을 억제하여 식사량 조절 및 체지방 감소 기능성을 인정받은 개별인정형 성분', '시서스 가루 다이어트 캡슐', 
 '시서스 추출물 기준 300 mg', '300 mg (100% 충족)', 
 '지방 소화 효소인 리파아제를 방해하여 지방 흡수율을 낮추고 식욕 억제 호르몬 분비 촉진', 
 '우유, 밀, 계란, 조개류 성분 알레르기가 있는 사람은 두드러기 등 과민 반응이 올 수 있습니다.', 
 '가루 형태인 경우 아침 또는 낮 시간에 따뜻한 물에 타서 물 대용으로 조금씩 복용하세요.',
 NULL, NULL, NULL),

('L-카르니틴', 'L-카르니틴 타르트레이트', '체내 지방산을 미토콘드리아로 운반하여 에너지로 연소시키는 과정을 활성화하고 체지방 감소에 도움을 주는 기능성 원료', 'L카르니틴 1000mg 추천', 
 'L-카르니틴 타르트레이트 기준 2,000 mg', '2,000 mg (100% 충족)', 
 '체내 축적 지방산을 에너지를 만드는 세포(미토콘드리아)로 즉각 운반하여 운동 시 연소율 극대화', 
 '과량 복용 시 비린 맛의 땀 냄새가 나거나 메스꺼움, 소화불량 및 설사를 동반할 수 있습니다.', 
 '유산소 및 근력 운동의 시너지를 위해 운동 30분~1시간 전에 드시는 것을 적극 추천합니다.',
 NULL, NULL, NULL),

-- 탈모 & 모발 건강 카테고리 성분
('비오틴', '비오틴 (Biotin / 비타민B7)', '지방, 탄수화물, 단백질 대사와 에너지 생성에 필수적이며 모발의 주 성분인 케라틴 단백질 합성을 촉진하는 성분', '비오틴 5000mcg 고함량', 
 '30 mcg', '5,000 mcg (16,666% 충족)', 
 '두피 모낭 세포의 케라틴 단백질 합성을 급격히 끌어올려 모발 성장 속도를 가속합니다.', 
 '과량의 비오틴 섭취 시 피지 분비가 폭발하여 여드름이나 뾰루지 등 트러블이 올라올 수 있습니다.', 
 '복용 시 물을 하루 1.5L 이상 섭취하여 수용성 비오틴 배출을 돕는 것이 좋습니다.',
 '지성 피부라 평소 피지 분비가 많고 여드름이나 뾰루지가 잘 납니다.', NULL,
 '초고함량 비오틴은 지성 피부군에서 피지선을 과자극하여 모낭 트러블이나 뾰루지를 유발할 수 있습니다. 모발 단백질의 핵심 원료 구조를 튼튼하게 강화해주면서 피지 조절을 돕는 L-시스틴을 훌륭한 대안으로 추천합니다.'),

('맥주효모', '건조 맥주효모 (Brewer''s Yeast)', '단백질(아미노산 18종), 비타민 B군, 셀레늄이 풍부하여 모발 및 두피에 영양을 직접 공급하고 모발 건강을 돕는 필수 원료', '국산 맥주효모 환 대용량', 
 '건조 맥주효모 기준 3,000 mg', '3,000 mg (100% 충족)', 
 '모발 케라틴을 만드는 18종의 아미노산 원료를 혈액에 대량 공급하여 가늘어짐 and 탈모 방어', 
 '퓨린 함량이 매우 높으므로 통풍 기왕력이 있거나 요산 수치가 높은 분은 관절 통증을 발현합니다.', 
 '자연식품에 가까워 소화가 용이하나, 가스나 속 더부룩함을 느낀다면 식사 직후 복용하세요.',
 '통풍 기왕력이 있거나 요산 수치가 높아 관절이 자주 붓고 아픕니다.', NULL,
 '맥주효모는 세포 증식을 돕는 퓨린(Purine) 함량이 극도로 높아 통풍 환자에게 급성 발작을 유발할 수 있습니다. 대신 퓨린 걱정이 전혀 없으면서 두피 모근 세포의 재생과 영양을 채워주는 판토텐산을 안전한 대안으로 권장합니다.'),

('아연', '아연 (Zinc)', '정상적인 면역기능 and 세포분열에 필수적이며 모낭 세포의 성장을 돕고 탈모 완화 영양소 공급에 중요역할을 함', '아연 영양제 징크', 
 '8.5 mg', '50 mg (588% 충족)', 
 '체내 활성 산소를 제거하고 두피 세포막 면역력을 높여 환절기 비듬 및 급성 탈모를 방어합니다.', 
 '일일 상한 섭취량인 35mg 이상 장기 복용 시 메스꺼움이나 구토를 일으키며 구리 흡수를 저해할 수 있습니다.', 
 '아연은 위장벽 자극이 심한 편이므로 반드시 식후에 충분한 물과 함께 섭취하세요.',
 '평소 만성 위염이 있거나 속 쓰림, 소화불량 및 메스꺼움을 잘 느낍니다.', NULL,
 '아연은 위장 점막을 직접적으로 강하게 자극하여 고함량 섭취 시 극심한 메스꺼움이나 쓰림을 유발하기 쉽습니다. 위장에 전혀 부담을 주지 않으면서 천연 아미노산 단백질 공급원이 되는 맥주효모를 대안으로 추천합니다.'),

('L-시스틴', 'L-시스틴 (L-Cystine)', '모발 단백질인 케라틴의 구조를 형성하는 황 함유 아미노산으로 가늘어진 모발을 강화하고 끊어짐 방지에 기여함', 'L시스테인 500mg 직구', 
 'L-시스틴 기준 500 mg', '500 mg (100% 충족)', 
 '모발 강도를 유지하는 케라틴의 시스틴 황 결합 구조를 보강해 가늘어진 머리카락 끊어짐 방지', 
 '위장 장애 및 기관지 분비액 유발 우려가 있으므로 만성 천식 환자는 의사 상담이 권고됩니다.', 
 '체내 흡수와 단백질 합성 효율을 배가시키려면 비타민 C와 아침 식후 함께 복용하십시오.',
 NULL, NULL, NULL),

('판토텐산', '판토텐산 (비타민B5)', '코엔자임 A 합성에 관여하여 세포 재생을 돕고 두피 장벽 강화 및 모근의 탄력과 힘을 개선하는 에너지 대사 영양소', '판토텐산 550mg 추천', 
 '5 mg', '550 mg (11,000% 충족)', 
 '피지 과잉 분비를 정상화하여 탈모성 지루성 두피염을 완화하고 모근 세포 재생 주기 단축', 
 '수용성 비타민으로 체내 축적이 없고 부작용이 거의 없으나 간혹 가벼운 복통이 생길 수 있습니다.', 
 '활력 비타민 계열이므로 가급적 낮 시간대(아침 또는 점심) 식후 섭취를 추천합니다.',
 NULL, NULL, NULL);

-- 8b. Update referencing columns for alternatives (Self-referencing Foreign Key Mapping)
UPDATE ingredients_mapping SET alternative_ingredient_id = '홍경천 추출물' WHERE id = '밀크씨슬';
UPDATE ingredients_mapping SET alternative_ingredient_id = 'L-테아닌' WHERE id = '홍삼';
UPDATE ingredients_mapping SET alternative_ingredient_id = 'L-카르니틴' WHERE id = '가르시니아';
UPDATE ingredients_mapping SET alternative_ingredient_id = '콜레우스포스콜리' WHERE id = '녹차카테킨';
UPDATE ingredients_mapping SET alternative_ingredient_id = 'L-시스틴' WHERE id = '비오틴';
UPDATE ingredients_mapping SET alternative_ingredient_id = '판토텐산' WHERE id = '맥주효모';
UPDATE ingredients_mapping SET alternative_ingredient_id = '맥주효모' WHERE id = '아연';

-- 8c. Categories
INSERT INTO categories (id, name, description, icon_class) VALUES
(1, '피로 개선', '만성 피로와 활력 저하로 고민하는 직장인 맞춤형', 'fa-battery-three-quarters'),
(2, '다이어트', '체지방 감소 and 탄수화물 컷팅이 필요한 분을 위한 맞춤형', 'fa-person-running'),
(3, '탈모 & 모발 건강', '모근 약화와 머리숱 감소가 절박한 분들을 위한 맞춤형', 'fa-feather');

-- Reset Serial sequence for auto-increment to continue correctly after manual IDs insertion
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 8d. Symptoms
INSERT INTO symptoms (category_id, symptom_text, matched_ingredient_id) VALUES
-- 피로 개선 증상 (5종)
(1, '아침에 일어날 때 몸이 납덩이처럼 무겁고 피로해요', '밀크씨슬'),
(1, '오후만 되면 집중력이 깨지고 쉽게 나른해져요', '비타민B군'),
(1, '업무/학업 스트레스로 인해 쉽게 지치고 기력이 없어요', '홍경천 추출물'),
(1, '만성적인 기력 저하가 있고 면역력이 쉽게 떨어져요', '홍삼'),
(1, '가슴이 답답하고 긴장되며 스트레스를 자주 받아요', 'L-테아닌'),

-- 다이어트 증상 (5종)
(2, '밥, 빵, 면 등 탄수화물 위주의 식사를 즐겨 먹어요', '가르시니아'),
(2, '기름진 음식을 좋아하고 인바디 체지방률이 높게 나와요', '녹차카테킨'),
(2, '기초대사량이 낮아 살이 잘 찌고 운동 효과를 늘리고 싶어요', '콜레우스포스콜리'),
(2, '식사량 조절이 어렵고 뱃살 위주로 빠르게 체지방을 빼고 싶어요', '시서스'),
(2, '체지방 연소를 촉진하고 유산소 운동 수행 능력을 올리고 싶어요', 'L-카르니틴'),

-- 탈모 & 모발 건강 증상 (5종)
(3, '머리카락이 가늘어지고 자고 일어나면 베개에 숱이 눈에 띄게 줄어요', '비오틴'),
(3, '두피 영양이 부족해 모발에 윤기가 없고 푸석푸석해요', '맥주효모'),
(3, '두피 각질이나 비듬이 늘어 두피 환경 및 면역을 케어하고 싶어요', '아연'),
(3, '머리카락이 쉽게 끊어지고 가늘어지는 연모화 현상이 느껴져요', 'L-시스틴'),
(3, '두피가 붉게 올라오고 모근의 탄력과 힘이 약해진 것 같아요', '판토텐산');

-- 8e. Synergy Combinations (추천 시너지 조합 패키지)
INSERT INTO synergy_combinations (id, name, synergy_effect, recommendation_reason) VALUES
(1, '활력 부스터 시너지 패키지', '해독 대사 촉진 및 신진대사 에너지 폭발', 
 '밀크씨슬이 간의 노폐물 분해(해독)를 처리하는 동안, 비타민B군이 해독 프로세스에 에너지를 공급하고 대사 효율을 극대화하여 만성 피로의 원인을 근본적으로 도려냅니다.'),
(2, '부신 피로 리셋 패키지', '코르티솔 호르몬 조절 및 뇌파 긴장 완화', 
 '홍경천이 스트레스 호르몬인 코르티솔 분비를 억제하여 지친 부신 피로를 달래주고, 테아닌이 알파파를 활성화하여 긴장된 뇌 세포를 안정시켜 최적의 수면 질과 휴식 상태를 선사합니다.'),
(3, '모근 밀착 방어 패키지', '모발 단백질 풍부한 원료 공급 ➔ 합성 가속 ➔ 모낭 세포분열 정상화', 
 '맥주효모가 모발 케라틴의 원료(아미노산 18종)를 대량으로 투입하고, 고함량 비오틴이 이 원료들을 모발 세포로 신속하게 합성하며, 아연이 모근 세포의 분열을 가속화해 숱이 비는 탈모를 3중으로 빈틈없이 차단합니다.'),
(4, '체지방 이중 컷팅 패키지', '신규 탄수화물 유입 차단 + 기존 축적 체지방 강제 연소', 
 '가르시니아가 밥/빵 등의 신규 탄수화물이 지방으로 변환되는 길목을 차단하고, 카테킨이 에피갈로카테킨 갈레이트(EGCG) 대사 작용을 자극하여 이미 축적된 내장지방 and 피하지방의 연소를 활성화시킵니다.');

-- Reset Serial sequence for auto-increment to continue correctly
SELECT setval('synergy_combinations_id_seq', (SELECT MAX(id) FROM synergy_combinations));

-- 8f. Synergy Ingredients Mapping (시너지 매핑 브릿지 데이터)
INSERT INTO synergy_ingredients (synergy_id, ingredient_id) VALUES
(1, '비타민B군'),
(1, '밀크씨슬'),
(2, 'L-테아닌'),
(2, '홍경천 추출물'),
(3, '비오틴'),
(3, '맥주효모'),
(3, '아연'),
(4, '가르시니아'),
(4, '녹차카테킨');
