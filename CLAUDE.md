# PillSync — 작업 규칙 (작업 시작 전 반드시 읽기)

> 이 저장소는 **여러 세션·사람이 동시에** 작업할 수 있습니다.
> 실제로, 한 작업이 빠르게 `git add` → commit → `main` 직접 push 되면서
> **다른 세션이 편집 중이던 미커밋 파일까지 함께 휩쓸려 올라간 사고**가 있었습니다.
> 아래 git 규칙은 그 재발을 막기 위한 것입니다. 예외 없이 지켜 주세요.

## 🚫 절대 규칙

1. **`main`에 직접 커밋·푸시하지 않는다.**
   작업은 항상 브랜치에서 시작: `git switch -c <type>/<짧은-설명>` (예: `fix/blank-screen`, `docs/readme`).

2. **`git add -A` / `git add .` 금지.**
   내가 의도적으로 바꾼 파일만 경로로 명시해서 stage 한다: `git add src/App.jsx`.
   → 전체 add는 다른 세션이 진행 중인 파일을 함께 커밋해 버리는 이번 사고의 직접 원인이다.

3. **커밋 직전 `git status`로 반드시 확인한다.**
   내가 만들지 않은 변경·untracked 파일이 보이면 **멈춘다.** 다른 작업이 진행 중일 수 있다.
   휩쓸어 커밋하지 말고, 무엇인지 먼저 확인한다.

4. **통합은 PR로.** `main`은 PR 머지로만 갱신한다. (force-push로 `main` 히스토리를 다시 쓰지 않는다 — Vercel 자동 배포가 `main`을 따른다.)

## ✅ 표준 작업 흐름

```bash
git switch -c fix/my-change          # 1. main에서 브랜치 분기
# ... 파일 편집 ...
git status                           # 2. 내 파일만 변경됐는지 확인
git add src/App.jsx                  # 3. 의도한 파일만 명시적 stage
git commit -m "fix: 설명"            # 4. 커밋
git push -u origin fix/my-change     # 5. 브랜치 푸시
# 6. GitHub에서 PR 생성 → 리뷰 후 머지
```

## 📦 프로젝트 메모

- **빌드:** `npm run build` · **린트:** `npm run lint` — 커밋 전 둘 다 통과해야 한다.
- **DB 시드 단일 진실 소스:** `src/data/seedData.js`.
  - 증상/카테고리 텍스트나 ID를 바꾸면 `node scripts/generate-supabase-seed.mjs`로 `supabase_schema.sql`을 **재생성**한다.
  - `supabase_schema.sql`은 자동 생성물 — **직접 편집 금지** (다음 생성 시 덮어써짐).
  - 증상 ID `101~605`는 **시드 예약 블록**이다. 관리자 신규 증상은 시퀀스가 발급하는 더 큰 ID를 받는다.
- **로컬 ↔ Supabase ID 정합성:** 로컬 시드와 클라우드의 증상 ID는 반드시 일치해야 한다(101, 102…). 어긋나면 결과 화면이 빈 화면으로 렌더된다.

자세한 배경과 이유는 [CONTRIBUTING.md](./CONTRIBUTING.md) 참고.
