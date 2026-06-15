-- ==========================================================
-- PillSync Supabase Database Schema & Seed Script (식약처 정형 데이터 정제)
-- ==========================================================

-- 1. Clean up existing tables if they exist
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

-- 3. Create Ingredients Mapping (식약처 공인 성분 및 쿠팡 매칭 테이블)
CREATE TABLE ingredients_mapping (
    id VARCHAR(50) PRIMARY KEY, -- Primary Key matching symptom matched_ingredient_id
    name VARCHAR(100) NOT NULL,
    fda_functional_summary TEXT NOT NULL, -- 식약처 공인 기능성 내용
    coupang_search_keyword VARCHAR(100) NOT NULL, -- 쿠팡 파트너스 API 검색어
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

-- 5. Enable Row Level Security (RLS) for public read/write access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for categories" ON categories FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access for ingredients_mapping" ON ingredients_mapping FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for ingredients_mapping" ON ingredients_mapping FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access for symptoms" ON symptoms FOR SELECT USING (true);
CREATE POLICY "Allow public insert access for symptoms" ON symptoms FOR INSERT WITH CHECK (true);

-- 6. Insert Seed Data
-- 6a. Ingredients (식약처 고시 피로개선/체지방감소/에너지대사 영양소 정형데이터)
INSERT INTO ingredients_mapping (id, name, fda_functional_summary, coupang_search_keyword) VALUES
-- 피로 개선 카테고리 성분
('밀크씨슬', '밀크씨슬 추출물 (실리마린)', '실리마린 성분이 간 세포막을 보호하고 항산화 작용을 돕고 피로 회복을 위한 간 건강 기능성을 식약처가 고시함', '밀크씨슬 실리마린 직구'),
('비타민B군', '활성 비타민B 콤플렉스', '수용성 비타민 B1, B2, B6, B12 복합체로 체내 에너지 생성 및 대사에 필수적이며 육체 피로 회복에 도움', '고함량 비타민B 컴플렉스'),
('홍경천 추출물', '홍경천 추출물 (로디올라)', '고산지대 자생 식물로 스트레스로 인한 피로를 개선하는 데 도움을 줄 수 있음을 식약처가 인정한 기능성 원료', '홍경천 로디올라 스트레스'),
('홍삼', '홍삼 (진세노사이드)', '사포닌(Rg1, Rb1, Rg3) 성분이 함유되어 면역력 증진, 피로 개선, 항산화에 도움을 줄 수 있는 대표 고시형 원료', '홍삼정 에브리타임 스틱'),
('L-테아닌', 'L-테아닌 (L-Theanine)', '녹차에 들어있는 아미노산의 일종으로 스트레스로 인한 긴장 완화에 도움을 줄 수 있음을 식약처가 인정한 성분', '나우푸드 L테아닌 200mg'),

-- 다이어트 카테고리 성분
('가르시니아', '가르시니아 캄보지아 추출물 (HCA)', '과피 추출물인 HCA가 탄수화물이 지방으로 합성되는 것을 억제하여 체지방 감소에 도움을 주는 고시형 다이어트 원료', '가르시니아 HCA 다이어트'),
('녹차카테킨', '녹차 추출물 (카테킨)', '카테킨 성분이 항산화 작용을 돕고 체지방 감소 및 혈중 콜레스테롤 수치 개선에 도움을 줄 수 있는 식약처 인증 성분', '녹차카테킨 다이어트보조제'),
('콜레우스포스콜리', '콜레우스 포스콜리 추출물', '인도 전통 약재식물 추출물로 제지방량(근육량)은 보존하고 체지방을 감소시키는 기능성을 개별인정받은 원료', '콜레우스 포스콜리 포스콜린'),
('시서스', '시서스 추출물 (Cissus)', '열대 아시아 자생 식물로 리파아제 활성을 억제하여 식사량 조절 및 체지방 감소 기능성을 인정받은 개별인정형 성분', '시서스 가루 다이어트 캡슐'),
('L-카르니틴', 'L-카르니틴 타르트레이트', '체내 지방산을 미토콘드리아로 운반하여 에너지로 연소시키는 과정을 활성화하고 체지방 감소에 도움을 주는 기능성 원료', 'L카르니틴 1000mg 추천'),

-- 탈모 & 모발 건강 카테고리 성분
('비오틴', '비오틴 (Biotin / 비타민B7)', '지방, 탄수화물, 단백질 대사와 에너지 생성에 필수적이며 모발의 주 성분인 케라틴 단백질 합성을 촉진하는 성분', '비오틴 5000mcg 고함량'),
('맥주효모', '건조 맥주효모 (Brewer''s Yeast)', '단백질(아미노산 18종), 비타민 B군, 셀레늄이 풍부하여 모발 및 두피에 영양을 직접 공급하고 모발 건강을 돕는 필수 원료', '국산 맥주효모 환 대용량'),
('아연', '아연 (Zinc)', '정상적인 면역기능과 세포분열에 필수적이며 모낭 세포의 성장을 돕고 탈모 완화 영양소 공급에 중요역할을 함', '아연 영양제 징크'),
('L-시스틴', 'L-시스틴 (L-Cystine)', '모발 단백질인 케라틴의 구조를 형성하는 황 함유 아미노산으로 가늘어진 모발을 강화하고 끊어짐 방지에 기여함', 'L시스테인 500mg 직구'),
('판토텐산', '판토텐산 (비타민B5)', '코엔자임 A 합성에 관여하여 세포 재생을 돕고 두피 장벽 강화 및 모근의 탄력과 힘을 개선하는 에너지 대사 영양소', '판토텐산 550mg 추천');

-- 6b. Categories
INSERT INTO categories (id, name, description, icon_class) VALUES
(1, '피로 개선', '만성 피로와 활력 저하로 고민하는 직장인 맞춤형', 'fa-battery-three-quarters'),
(2, '다이어트', '체지방 감소와 탄수화물 컷팅이 필요한 분을 위한 맞춤형', 'fa-person-running'),
(3, '탈모 & 모발 건강', '모근 약화와 머리숱 감소가 절박한 분들을 위한 맞춤형', 'fa-feather');

-- Reset Serial sequence for auto-increment to continue correctly after manual IDs insertion
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 6c. Symptoms (각 카테고리별 정제된 증상 문항 및 식약처 성분 일대일 매칭)
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
