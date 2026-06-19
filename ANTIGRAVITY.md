# Antigravity (Gemini) Coding Guidelines & Rules

이 파일은 구글 딥마인드의 코딩 에이전트 **Antigravity**가 본 저장소에서 작업을 수행할 때 반드시 지켜야 하는 규칙과 가이드라인을 정의합니다.

> **주의:** 이 저장소는 사람이 직접 개발하거나 클로드(Claude Code) 등 다른 AI 에이전트가 동시에 병행 작업하는 환경입니다. 따라서 아래 작업 규칙을 엄격히 준수하여 변경 사항 충돌이나 미커밋 파일이 원치 않게 휩쓸려 올라가는 사고를 예방해야 합니다.

---

## 🚫 Git 협업 절대 규칙

1. **`main` 브랜치 직접 푸시 금지**
   - 모든 작업은 항상 별도의 전용 브랜치를 생성한 후 진행합니다.
   - 브랜치명 형식: `fix/antigravity-<짧은설명>` 또는 `feat/antigravity-<짧은설명>`
   - 작업 시작 시 `git switch -c <브랜치명>`으로 전환하여 개발을 시작하십시오.

2. **`git add .` 및 `git add -A` 절대 사용 금지**
   - 변경된 사항을 스테이징(Stage)할 때는 반드시 수정 대상 파일 경로를 명시하여 추가합니다.
   - 예시: `git add src/App.jsx`
   - 전체 add 명령은 동시 작업 중인 다른 세션의 임시 파일이나 의도하지 않은 수정을 커밋에 포함시켜 충돌을 일으키는 주원인입니다.

3. **커밋 전 `git status`로 사전 확인 필수**
   - 커밋을 작성하기 전에 항상 `git status`를 조회하여 내가 의도한 파일만 스테이징 영역에 포함되어 있는지, 휩쓸려 올라가는 무관한 파일이 없는지 확인하십시오.

4. **작업 완료 후 PR(Pull Request) 생성 유도**
   - 변경 사항은 브랜치에 푸시(`git push origin <브랜치명>`)한 뒤, Pull Request를 통해 병합하도록 구성합니다.

---

## 📦 프로젝트 기술 스펙 및 규칙

1. **시드 데이터 (Single Source of Truth)**
   - 카테고리, 증상, 성분 매핑, 시너지 텍스트의 유일한 원본 소스는 [seedData.js](file:///C:/Users/stone/projects/PillSync/src/data/seedData.js)입니다.
   - 해당 텍스트나 설정을 변경할 경우, 절대 `supabase_schema.sql`을 수동으로 수정하지 말고 다음 명령어를 실행하여 시드 SQL을 자동 갱신하십시오:
     ```bash
     node scripts/generate-supabase-seed.mjs
     ```
   - 로컬 데이터와 Supabase DB에 적재되는 데이터의 **증상 ID(예: 101~605)**는 반드시 정합성이 일치해야 결과 페이지에서 빈 화면이 나오는 현상을 방지할 수 있습니다.

2. **빌드 및 린트 검증**
   - 변경 사항이 반영된 코드는 커밋 및 푸시하기 전에 로컬 린트 및 빌드를 실행하여 신뢰성을 확보합니다:
     - 린트 체크: `npm run lint`
     - 빌드 검증: `npm run build`

3. **작업 환경 정리 (Clean Workspace)**
   - 디버깅용으로 임시 생성한 스크래치 스크립트(예: `check_db_live.js`, `check_clicks.js` 등)는 작업을 완료한 후 스테이징하기 전에 반드시 삭제(`rm <파일명>`)하여 커밋에 포함되지 않도록 유지하십시오.
