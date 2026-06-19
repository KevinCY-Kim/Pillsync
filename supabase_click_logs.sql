-- ==========================================================
-- PillSync — 쿠팡 클릭 로그 테이블 + 권한 보정
-- Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 RUN 하세요.
-- 여러 번 재실행해도 에러 없이 동작합니다(IF NOT EXISTS / DROP IF EXISTS).
-- ==========================================================

-- 1) 클릭 로그 테이블 (Vercel Pro 없이도 우리 DB에서 직접 클릭 집계)
CREATE TABLE IF NOT EXISTS click_logs (
    id            BIGSERIAL PRIMARY KEY,
    ingredient_id VARCHAR(50),          -- 어떤 성분 카드를 눌렀는지
    coupang_link  TEXT,                 -- 실제 이동한 쿠팡 파트너스 링크
    is_in_app     BOOLEAN DEFAULT FALSE,-- 인앱 브라우저(쓰레드/인스타 등) 여부
    user_agent    TEXT,                 -- 디바이스/브라우저 식별용
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2) RLS 활성화: 익명(anon)은 클릭 기록(INSERT)만, 조회(SELECT)는 인증된 관리자만
ALTER TABLE click_logs ENABLE ROW LEVEL SECURITY;

-- 익명 클릭 기록은 그대로 허용(비로그인 사용자도 클릭 집계 대상).
DROP POLICY IF EXISTS "Allow public insert access for click_logs" ON click_logs;
CREATE POLICY "Allow public insert access for click_logs" ON click_logs FOR INSERT WITH CHECK (true);

-- [보안] 공개 SELECT 제거: 공개 읽기를 열어두면 누구나 모든 사용자의 user_agent·클릭 이력을
-- 읽을 수 있다. 집계 조회는 인증된 관리자(또는 대시보드/서비스 롤)에서만 가능하도록 제한한다.
DROP POLICY IF EXISTS "Allow public read access for click_logs" ON click_logs;
DROP POLICY IF EXISTS "Allow authenticated read access for click_logs" ON click_logs;
CREATE POLICY "Allow authenticated read access for click_logs" ON click_logs FOR SELECT TO authenticated USING (true);

-- 3) [보안] ingredients_mapping UPDATE는 인증된 관리자만(관리자 '링크/제품 관리' 탭).
--    과거의 공개 UPDATE 정책은 회수한다. (다른 테이블의 인증 쓰기 정책은 supabase_schema.sql에서 일괄 생성됨)
DROP POLICY IF EXISTS "Allow public update access for ingredients_mapping" ON ingredients_mapping;
DROP POLICY IF EXISTS "Allow authenticated update for ingredients_mapping" ON ingredients_mapping;
CREATE POLICY "Allow authenticated update for ingredients_mapping" ON ingredients_mapping FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 확인용: 최근 클릭 20건 조회
-- SELECT id, ingredient_id, is_in_app, created_at FROM click_logs ORDER BY id DESC LIMIT 20;
