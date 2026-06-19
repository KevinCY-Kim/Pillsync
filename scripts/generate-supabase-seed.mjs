// ==========================================================
// supabase_schema.sql 자동 생성기
// ==========================================================
// src/data/seedData.js (단일 진실 소스)를 읽어 supabase_schema.sql 전체를 생성합니다.
// 텍스트를 고치고 싶다면 src/data/seedData.js만 수정한 뒤 아래 명령으로 재생성하세요:
//
//   node scripts/generate-supabase-seed.mjs
//
// 그 다음 생성된 supabase_schema.sql 내용을 Supabase SQL Editor에서 실행하면
// 로컬 화면과 Supabase 연동 화면의 텍스트가 항상 일치합니다.
// supabase_schema.sql을 손으로 직접 고치지 마세요 — 다음 재생성 때 덮어써집니다.
// ==========================================================

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import {
  localCategories,
  localSymptoms,
  localIngredientsMapping,
  localSynergyCombinations,
} from '../src/data/seedData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../supabase_schema.sql');

// SQL 문자열 리터럴로 안전하게 변환 (null -> SQL NULL, 단일 인용부호 escape)
function sqlStr(value) {
  if (value === null || value === undefined) return 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildIngredientsInsert() {
  const rows = Object.entries(localIngredientsMapping).map(([id, ing]) => {
    return `(${sqlStr(id)}, ${sqlStr(ing.name)}, ${sqlStr(ing.desc)}, ${sqlStr(ing.keyword)}, ${sqlStr(ing.coupang_link)},\n` +
      ` ${sqlStr(ing.kfda_daily_intake)}, ${sqlStr(ing.high_dose_ratio)},\n` +
      ` ${sqlStr(ing.high_dose_effect)},\n` +
      ` ${sqlStr(ing.side_effects)},\n` +
      ` ${sqlStr(ing.intake_tip)},\n` +
      ` ${sqlStr(ing.warning_trigger_text)}, NULL,\n` +
      ` ${sqlStr(ing.alternative_reason)})`;
  });

  const updates = Object.entries(localIngredientsMapping)
    .filter(([, ing]) => ing.alternative_ingredient_id)
    .map(([id, ing]) => `UPDATE ingredients_mapping SET alternative_ingredient_id = ${sqlStr(ing.alternative_ingredient_id)} WHERE id = ${sqlStr(id)};`)
    .join('\n');

  return { rows, updates };
}

function buildCategoriesInsert() {
  return localCategories
    .map((c) => `(${c.id}, ${sqlStr(c.name)}, ${sqlStr(c.desc)}, ${sqlStr(c.icon)})`)
    .join(',\n');
}

function buildSymptomsInsert() {
  return localSymptoms
    .map((s) => `(${s.id}, ${s.category_id}, ${sqlStr(s.text)}, ${sqlStr(s.ingredient_id)})`)
    .join(',\n');
}

function buildSynergyCombinationsInsert() {
  return localSynergyCombinations
    .map((s) => `(${s.id}, ${sqlStr(s.name)}, ${sqlStr(s.synergy_effect)},\n ${sqlStr(s.recommendation_reason)})`)
    .join(',\n');
}

function buildSynergyIngredientsInsert() {
  const pairs = [];
  localSynergyCombinations.forEach((s) => {
    s.ingredients.forEach((ingId) => pairs.push(`(${s.id}, ${sqlStr(ingId)})`));
  });
  return pairs.join(',\n');
}

const categoryIds = localCategories.map((c) => c.id).join(', ');
const synergyIds = localSynergyCombinations.map((s) => s.id).join(', ');

const { rows: ingredientRows, updates: ingredientUpdates } = buildIngredientsInsert();

const sql = `-- ==========================================================
-- PillSync Supabase Database Schema & Seed Script (식약처 정형 데이터 고도화 + 대안 추천)
-- ※ 이 파일은 scripts/generate-supabase-seed.mjs 가 src/data/seedData.js 로부터
--    자동 생성합니다. 손으로 직접 편집하지 마세요 — 다음 생성 시 덮어써집니다.
--    텍스트를 고치려면 src/data/seedData.js를 수정한 뒤
--    \`node scripts/generate-supabase-seed.mjs\` 를 실행하세요.
-- ※ 이 스크립트는 몇 번을 재실행해도 안전합니다 (idempotent / UPSERT 방식).
--    - 테이블이 이미 있으면 건드리지 않고, 없을 때만 생성합니다.
--    - 시드 데이터는 같은 id가 있으면 갱신(UPDATE), 없으면 추가(INSERT)됩니다.
--    - 관리자 패널(App.jsx)에서 추가한 카테고리/성분 데이터는 삭제되지 않습니다.
-- ==========================================================

-- 1. Create Tables (이미 존재하면 스킵)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_class VARCHAR(50) DEFAULT 'fa-capsules',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS ingredients_mapping (
    id VARCHAR(50) PRIMARY KEY, -- Primary Key matching symptom matched_ingredient_id
    name VARCHAR(100) NOT NULL,
    fda_functional_summary TEXT NOT NULL, -- 식약처 공인 기능성 내용
    coupang_search_keyword VARCHAR(100) NOT NULL, -- 쿠팡 파트너스 API 검색어
    coupang_link VARCHAR(255),                 -- 쿠팡 파트너스 수익화 링크
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

CREATE TABLE IF NOT EXISTS symptoms (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    symptom_text VARCHAR(255) NOT NULL,
    matched_ingredient_id VARCHAR(50) REFERENCES ingredients_mapping(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS synergy_combinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,                      -- 조합명 (예: '활력 부스터 패키지')
    synergy_effect VARCHAR(255) NOT NULL,            -- 효과 요약 (예: '에너지 대사 가속 및 간 피로 해소')
    recommendation_reason TEXT NOT NULL,             -- 시너지 상세 기전 설명
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS synergy_ingredients (
    synergy_id INT REFERENCES synergy_combinations(id) ON DELETE CASCADE,
    ingredient_id VARCHAR(50) REFERENCES ingredients_mapping(id) ON DELETE CASCADE,
    PRIMARY KEY (synergy_id, ingredient_id)
);

-- 2. Enable Row Level Security (RLS) for public read/write access
-- ALTER TABLE ... ENABLE ROW LEVEL SECURITY는 이미 활성화된 상태에서 재실행해도 에러가 나지 않습니다.
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE synergy_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE synergy_ingredients ENABLE ROW LEVEL SECURITY;

-- 정책은 DROP POLICY IF EXISTS 후 재생성하여 "policy already exists" 에러 없이 재실행 가능하게 합니다.
DROP POLICY IF EXISTS "Allow public read access for categories" ON categories;
CREATE POLICY "Allow public read access for categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert access for categories" ON categories;
CREATE POLICY "Allow public insert access for categories" ON categories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access for ingredients_mapping" ON ingredients_mapping;
CREATE POLICY "Allow public read access for ingredients_mapping" ON ingredients_mapping FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert access for ingredients_mapping" ON ingredients_mapping;
CREATE POLICY "Allow public insert access for ingredients_mapping" ON ingredients_mapping FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access for symptoms" ON symptoms;
CREATE POLICY "Allow public read access for symptoms" ON symptoms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert access for symptoms" ON symptoms;
CREATE POLICY "Allow public insert access for symptoms" ON symptoms FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access for synergy_combinations" ON synergy_combinations;
CREATE POLICY "Allow public read access for synergy_combinations" ON synergy_combinations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert access for synergy_combinations" ON synergy_combinations;
CREATE POLICY "Allow public insert access for synergy_combinations" ON synergy_combinations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access for synergy_ingredients" ON synergy_ingredients;
CREATE POLICY "Allow public read access for synergy_ingredients" ON synergy_ingredients FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert access for synergy_ingredients" ON synergy_ingredients;
CREATE POLICY "Allow public insert access for synergy_ingredients" ON synergy_ingredients FOR INSERT WITH CHECK (true);

-- 3. Upsert Seed Data (src/data/seedData.js 에서 자동 생성됨)
-- 3a. Ingredients
INSERT INTO ingredients_mapping (id, name, fda_functional_summary, coupang_search_keyword, coupang_link, kfda_daily_intake, high_dose_ratio, high_dose_effect, side_effects, intake_tip, warning_trigger_text, alternative_ingredient_id, alternative_reason) VALUES
${ingredientRows.join(',\n\n')}

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  fda_functional_summary = EXCLUDED.fda_functional_summary,
  coupang_search_keyword = EXCLUDED.coupang_search_keyword,
  coupang_link = EXCLUDED.coupang_link,
  kfda_daily_intake = EXCLUDED.kfda_daily_intake,
  high_dose_ratio = EXCLUDED.high_dose_ratio,
  high_dose_effect = EXCLUDED.high_dose_effect,
  side_effects = EXCLUDED.side_effects,
  intake_tip = EXCLUDED.intake_tip,
  warning_trigger_text = EXCLUDED.warning_trigger_text,
  alternative_reason = EXCLUDED.alternative_reason;
  -- alternative_ingredient_id는 아래 3b 단계에서 일괄 재설정하므로 여기서는 갱신하지 않습니다.

-- 3b. Update referencing columns for alternatives (Self-referencing Foreign Key Mapping)
-- UPDATE는 항상 같은 결과로 수렴하므로 그대로 재실행해도 안전합니다.
${ingredientUpdates}

-- 3c. Categories
INSERT INTO categories (id, name, description, icon_class) VALUES
${buildCategoriesInsert()}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_class = EXCLUDED.icon_class;

-- Reset Serial sequence for auto-increment to continue correctly after manual IDs insertion
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 3d. Symptoms
-- symptoms는 자연키가 없어 ON CONFLICT를 쓸 수 없으므로, 이 시드가 관리하는 카테고리(${categoryIds})의
-- 증상만 삭제 후 재삽입합니다. 관리자 패널에서 추가한 다른 카테고리의 증상은 영향받지 않습니다.
DELETE FROM symptoms WHERE category_id IN (${categoryIds});

INSERT INTO symptoms (id, category_id, symptom_text, matched_ingredient_id) VALUES
${buildSymptomsInsert()};

-- Reset Serial sequence for auto-increment to continue correctly after manual IDs insertion
SELECT setval('symptoms_id_seq', (SELECT MAX(id) FROM symptoms));

-- 3e. Synergy Combinations
INSERT INTO synergy_combinations (id, name, synergy_effect, recommendation_reason) VALUES
${buildSynergyCombinationsInsert()}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  synergy_effect = EXCLUDED.synergy_effect,
  recommendation_reason = EXCLUDED.recommendation_reason;

-- Reset Serial sequence for auto-increment to continue correctly
SELECT setval('synergy_combinations_id_seq', (SELECT MAX(id) FROM synergy_combinations));

-- 3f. Synergy Ingredients Mapping
-- 이 시드가 관리하는 시너지(${synergyIds})의 매핑만 삭제 후 재삽입하여, 구성 성분이 바뀌어도 깨끗하게 갱신됩니다.
DELETE FROM synergy_ingredients WHERE synergy_id IN (${synergyIds});

INSERT INTO synergy_ingredients (synergy_id, ingredient_id) VALUES
${buildSynergyIngredientsInsert()};
`;

writeFileSync(OUTPUT_PATH, sql, 'utf-8');
console.log(`✅ supabase_schema.sql generated from src/data/seedData.js (${OUTPUT_PATH})`);
