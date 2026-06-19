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

-- 2) RLS 활성화 + 익명(anon) 삽입/조회 허용 (기존 테이블과 동일 패턴)
ALTER TABLE click_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert access for click_logs" ON click_logs;
CREATE POLICY "Allow public insert access for click_logs" ON click_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access for click_logs" ON click_logs;
CREATE POLICY "Allow public read access for click_logs" ON click_logs FOR SELECT USING (true);

-- 3) [버그 보정] ingredients_mapping UPDATE 정책 누락 → 관리자 '링크/제품 관리'
--    탭의 링크 저장이 RLS에 막혀 실패하던 문제 수정. UPDATE 허용 추가.
DROP POLICY IF EXISTS "Allow public update access for ingredients_mapping" ON ingredients_mapping;
CREATE POLICY "Allow public update access for ingredients_mapping" ON ingredients_mapping FOR UPDATE USING (true) WITH CHECK (true);

-- 확인용: 최근 클릭 20건 조회
-- SELECT id, ingredient_id, is_in_app, created_at FROM click_logs ORDER BY id DESC LIMIT 20;
