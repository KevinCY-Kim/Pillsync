-- ==========================================================
-- PillSync Supabase Database Schema & Seed Script
-- ==========================================================

-- 1. Clean up existing tables if they exist (Relational safety via CASCADE)
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
    id VARCHAR(50) PRIMARY KEY, -- Primary Key matching symptom matched_ingredient_id (e.g. 'biotin')
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
-- (This configuration is optimized for the sandbox dashboard. Modify for production access control list)
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
-- 6a. Ingredients
INSERT INTO ingredients_mapping (id, name, fda_functional_summary, coupang_search_keyword) VALUES
('밀크씨슬', '밀크씨슬 (실리마린)', '간 세포막을 보호하고 항산화 작용을 통해 간 건강에 도움을 줄 수 있음 (식약처 인정 기능성 원료)', '밀크씨슬 실리마린 직구'),
('비타민B군', '활성 비타민B 콤플렉스', '체내 에너지 생성 및 대사에 필수적인 영양소로 육체 피로 회복에 도움을 줄 수 있음', '고함량 비타민B 컴플렉스'),
('홍경천 추출물', '홍경천 추출물', '스트레스로 인한 피로 개선에 도움을 줄 수 있음 (식약처 기능성 고시 원료)', '홍경천 로디올라 스트레스'),
('가르시니아', '가르시니아 캄보지아 추출물 (HCA)', '탄수화물이 지방으로 합성되는 것을 억제하여 체지방 감소에 도움을 줄 수 있음', '가르시니아 HCA 다이어트'),
('녹차카테킨', '녹차 추출물 (카테킨)', '항산화, 체지방 감소, 혈중 콜레스테롤 개선에 도움을 줄 수 있음', '녹차카테킨 다이어트보조제'),
('콜레우스포스콜리', '콜레우스 포스콜리 추출물', '체지방 감소에 도움을 줄 수 있음 (개별인정형 원료)', '콜레우스 포스콜리 포스콜린'),
('비오틴', '비오틴 (Biotin / 비타민B7)', '지방, 탄수화물, 단백질 대사와 에너지 생성에 필요하며 모발 수치 활성화에 관여함', '비오틴 5000mcg 고함량'),
('맥주효모', '맥주효모 (Brewer''s Yeast)', '모발의 구성 성분인 아미노산과 단백질이 풍부하여 두피 영양 공급 및 모발 탄력 유지에 도움', '맥주효모 환 분말 대용량'),
('아연', '아연 (Zinc)', '정상적인 면역 기능과 세포 분열에 필수적이며 모낭 세포 증식에 관여함', '아연 영양제 징크');

-- 6b. Categories
INSERT INTO categories (id, name, description, icon_class) VALUES
(1, '피로 개선', '만성 피로와 활력 저하로 고민하는 직장인 맞춤형', 'fa-battery-three-quarters'),
(2, '다이어트', '체지방 감소와 탄수화물 컷팅이 필요한 분을 위한 맞춤형', 'fa-person-running'),
(3, '탈모 & 모발 건강', '모근 약화와 머리숱 감소가 절박한 분들을 위한 맞춤형', 'fa-feather');

-- Reset Serial sequence for auto-increment to continue correctly after manual IDs insertion
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 6c. Symptoms
INSERT INTO symptoms (category_id, symptom_text, matched_ingredient_id) VALUES
(1, '아침에 일어날 때 몸이 납덩이처럼 무거워요', '밀크씨슬'),
(1, '오후만 되면 집중력이 깨지고 쉽게 나른해져요', '비타민B군'),
(1, '업무/학업 스트레스로 인해 가슴이 답답하고 지쳐요', '홍경천 추출물'),
(2, '밥, 빵, 면 등 탄수화물 섭취가 너무 많아요', '가르시니아'),
(2, '기름진 음식을 좋아하고 체지방률이 높아요', '녹차카테킨'),
(2, '다이어트 시 운동 수행 능력 및 기초대사량을 늘리고 싶어요', '콜레우스포스콜리'),
(3, '머리카락이 가늘어지고 자고 일어나면 베개에 많이 빠져요', '비오틴'),
(3, '두피가 건조하고 가려우며 모발 윤기가 없어요', '맥주효모'),
(3, '모발 강도와 손톱 끝이 쉽게 갈라져 영양이 부족해요', '아연');
