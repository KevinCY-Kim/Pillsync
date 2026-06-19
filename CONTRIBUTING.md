# PillSync 기여 가이드

작업을 시작하기 전에 이 문서를 먼저 읽어 주세요. 특히 **git 워크플로** 섹션은 필수입니다.

---

## ⚠️ 왜 이 규칙이 생겼나 (배경)

이 저장소는 여러 작업자·세션이 동시에 만질 수 있습니다. 한 번은 이런 일이 있었습니다:

- A 세션이 코드 일부를 **편집 중**(아직 커밋 안 함)이었는데,
- B 작업자가 다른 간단한 작업을 끝내고 `git add` 로 **전체를 한꺼번에 stage** 한 뒤 곧장 `main`에 commit·push 했습니다.
- 그 결과 **A 세션의 미완성 파일까지 B의 커밋에 휩쓸려** `main`에 올라가고 원격까지 푸시됐습니다.

다행히 이번엔 내용이 정상이라 손해는 없었지만, 일반적으로는 미완성·충돌 코드가 배포 브랜치(`main`)에 들어가 사고로 이어집니다. 아래 규칙은 이 패턴을 막기 위한 것입니다.

---

## 🔧 git 워크플로 (필수)

### 절대 규칙

| # | 규칙 | 이유 |
|---|------|------|
| 1 | `main`에 **직접 커밋·푸시 금지**. 항상 브랜치부터. | `main`은 배포 브랜치(Vercel). 검증 안 된 코드가 바로 배포된다. |
| 2 | `git add -A` / `git add .` **금지**. 파일을 경로로 명시. | 진행 중인 남의 파일을 함께 커밋해 버린다 (위 사고의 직접 원인). |
| 3 | 커밋 전 **`git status` 확인**. 내가 안 만든 변경이 보이면 멈춘다. | 동시 작업 충돌을 커밋 전에 잡는다. |
| 4 | 통합은 **PR**로만. `main` force-push 금지. | 히스토리 보호 + 배포 안정성. |

### 표준 절차

```bash
# 1. 항상 최신 main에서 브랜치 분기
git switch main
git pull
git switch -c fix/내-작업-설명        # type: fix / feat / docs / chore

# 2. 편집 후, 내 파일만 변경됐는지 확인
git status

# 3. 의도한 파일만 명시적으로 stage (절대 -A 금지)
git add src/App.jsx scripts/generate-supabase-seed.mjs

# 4. 커밋
git commit -m "fix: 무엇을 왜 바꿨는지"

# 5. 브랜치 푸시 후 GitHub에서 PR 생성
git push -u origin fix/내-작업-설명
```

### 브랜치 이름 규칙

`<type>/<짧은-설명>` — `fix/blank-screen`, `feat/coupang-logging`, `docs/readme`, `chore/deps`

---

## 🏗️ 빌드 · 검증

커밋 전 아래 두 가지가 통과해야 합니다.

```bash
npm run build   # 빌드 (JSX/번들 오류 확인)
npm run lint    # ESLint
```

---

## 🗄️ 데이터베이스 시드 작업 시

- **단일 진실 소스는 `src/data/seedData.js`** 입니다. 증상·카테고리·성분 텍스트나 ID는 여기만 고칩니다.
- 고친 뒤 SQL을 **재생성**합니다:
  ```bash
  node scripts/generate-supabase-seed.mjs
  ```
- `supabase_schema.sql`은 위 스크립트의 **자동 생성물**입니다. 직접 편집하지 마세요(다음 생성 때 덮어써집니다).
- 증상 ID `101~605`는 **시드 예약 블록**입니다. Supabase의 증상 ID는 로컬 시드와 **반드시 일치**해야 하며, 어긋나면 결과 화면이 빈 화면으로 렌더됩니다.
- 시드 SQL은 멱등(idempotent)하게 설계되어 있어 여러 번 재실행해도 안전합니다.

---

## 🤖 AI 에이전트(Claude 등)로 작업하는 경우

저장소 루트의 [`CLAUDE.md`](./CLAUDE.md)에 동일한 규칙이 요약돼 있습니다. Claude Code 세션은 시작 시 이 파일을 자동으로 읽으므로, 에이전트도 같은 git 규칙을 따르게 됩니다.
