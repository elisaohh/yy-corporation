# 사이트 편집 · 문의 메일 안내

사이트 주소 뒤에 `/admin`을 붙여 로그인하면(예: `https://yy-corporation.vercel.app/admin`) **사이트 화면 그대로** 곳곳에 편집 버튼이 생깁니다.
서버 · 데이터베이스 없이 동작합니다. 저장하면 GitHub 저장소에 바로 기록되고, Vercel이 사이트를 다시 만들어 **1~2분 뒤** 반영됩니다(화면 아래 편집 막대에 "반영 중 → 반영되었습니다"가 보임).

| 어디서 | 버튼 | 할 수 있는 것 |
|---|---|---|
| PRODUCT 목록 | + 제품 추가 · 순서 · 홈 노출 · 카드마다 "수정" | 제품 추가 · 수정 · 삭제, 사진 올리기 · 순서 · 빼기, 목록 순서 |
| 제품 상세 | 이 제품 수정 | 위와 같음 |
| HOME PRODUCT | 홈 제품 고르기 · 순서 · + 제품 추가 | 홈에 보일 제품 고르기(순서 = 목록 순서) |
| STORY 목록 | + 뉴스레터 올리기 · 숨긴 글 · 전체 관리 · 카드마다 "수정" | 뉴스레터 올리기(미리보기), 숨기기 · 다시 공개, 파일 바꾸기, 삭제 |
| STORY 글 | 이 뉴스레터 수정 | 위와 같음 |

- 방문자에게는 편집 버튼이 보이지 않고, 편집 화면 코드도 내려받지 않습니다.
- 로그인은 그 브라우저 탭에서만 유지되고, 탭을 닫으면 로그아웃됩니다.
- 예비 관리 화면(Decap CMS)도 `/admin/cms`에 남아 있습니다(같은 GitHub 로그인).

문의 폼(CONTACT)은 보내기를 누르면 회사 메일로 전달됩니다(아래 1-2 설정 필요).

---

## 1. 처음 한 번만 — 설정

### 1-1. 관리 화면 로그인 연결 (GitHub)

관리 화면은 GitHub 계정으로 로그인합니다. **이 저장소에 쓰기 권한이 있는 사람만** 들어올 수 있습니다.

1. GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**
   - Application name: `YY CORPORATION 관리`
   - Homepage URL: `https://yy-corporation.vercel.app`
   - Authorization callback URL: `https://yy-corporation.vercel.app/api/decap/callback`
2. 만들어진 화면에서 **Client ID**를 복사하고, **Generate a new client secret**을 눌러 Secret을 복사합니다.
3. Vercel → 프로젝트 → Settings → **Environment Variables**에 넣습니다.

| 이름 | 값 |
|---|---|
| `GITHUB_OAUTH_ID` | Client ID |
| `GITHUB_OAUTH_SECRET` | Client Secret |

4. 담당자 추가: GitHub 저장소 → Settings → Collaborators → 담당자 GitHub 계정 초대(쓰기 권한).

> 회사 도메인으로 바꾸면 1번의 두 주소도 새 도메인으로 바꿔 주세요.
> 미리보기 주소(브랜치 배포)에서 관리 화면을 쓰려면 `DECAP_AUTH_URL`에 `https://yy-corporation.vercel.app`을 넣습니다(로그인 창은 등록한 주소에서만 열림).

### 1-2. 문의 메일 (Resend — 무료 한도: 하루 100통 · 월 3,000통 정도)

1. [resend.com](https://resend.com) 가입 → **API Keys → Create API Key**
2. Vercel 환경 변수에 넣습니다.

| 이름 | 값 |
|---|---|
| `RESEND_API_KEY` | 만든 API 키 |
| `INQUIRY_TO` | 문의를 받을 주소(여러 개면 쉼표로). 예: `sales@yycorp.co.kr` |
| `INQUIRY_FROM` | 보내는 사람 표시. 도메인 인증 후 예: `YY CORPORATION 홈페이지 <no-reply@yycorp.co.kr>` |

3. **회사 도메인 인증(권장)**: Resend → Domains → `yycorp.co.kr` 추가 → 안내되는 DNS 값 몇 줄을 도메인 관리 화면에 입력.
   - 인증 전에는 `INQUIRY_FROM`을 비워 두면 `onboarding@resend.dev`로 보내지는데, 이때는 **Resend 가입 메일 주소로만** 받을 수 있습니다(시험용).
4. 환경 변수를 넣거나 바꾼 뒤에는 Vercel → Deployments → 최신 배포 → **Redeploy**를 한 번 눌러야 적용됩니다.

- 받은 문의 메일에 **답장하면 문의하신 분께 바로** 갑니다.
- 설정 전에는 문의를 보내면 "문의를 보내지 못했습니다" 안내가 나옵니다.
- 사람에게 보이지 않는 칸(자동 프로그램 걸러내기)과 같은 곳에서 10분에 5번 넘게 보내기 막기가 들어 있습니다.
- ⚠ 개인정보 처리방침 제5조(위탁)에 메일 발송 업체(Resend)를 적어 주세요(`src/data/privacy.ts`).

---

## 2. 쓰는 방법

### 로그인

1. `사이트주소/admin` → **GitHub 계정으로 로그인** → 뜨는 창에서 GitHub 로그인 · 허용
2. 저장소에 초대된 계정이면 홈으로 이동하고, 화면 아래에 검은 **편집 모드** 막대가 생깁니다.
   - 권한이 없는 계정이면 "편집 권한이 없습니다"가 나옵니다.
   - 팝업이 막혔다는 안내가 나오면 주소창의 팝업 차단을 풀어 주세요.

### 제품

- **추가**: PRODUCT(또는 홈 PRODUCT)의 **+ 제품 추가** → 코드 · 종류 · 용량 · 사이즈 · 재질 · 병목 규격 · 설명 입력 → **사진 올리기**(여러 장 한꺼번에) → 저장
  - 사진은 올릴 때 자동으로 가볍게(webp, 최대 1600px) 바뀝니다. 정사각형 · 흰 배경 권장.
  - 첫 번째 = 대표 사진, 두 번째 = 마우스를 올렸을 때 사진. ← → 버튼으로 순서, 휴지통으로 빼기.
- **수정 · 삭제**: 카드의 **수정** 또는 제품 상세의 **이 제품 수정** → 고치고 저장 / 아래 **제품 삭제**(사진 파일도 함께 지워짐)
- **순서 · 홈 노출**: **순서 · 홈 노출**(홈에서는 **홈 제품 고르기 · 순서**) → 체크 = 홈에 보임, ↑ ↓ 로 순서 → 저장
  - 넓은 화면에서 홈은 한 줄에 5개라 5개(또는 10개)가 보기 좋습니다.
- **내부 제품명은 넣지 마세요.** 화면에는 코드만 나옵니다.

### 뉴스레터(STORY)

- **올리기**: STORY의 **+ 뉴스레터 올리기** → 호수(다음 번호가 자동으로 들어감) 확인 → 메일 발송에 쓴 **.html 파일 고르기** → 카드에 들어갈 제목 · 요약 · 발행 시기와 **미리보기** 확인 → 올리기
  - 메일 하단(회사 정보 · 수신거부)은 자동으로 숨겨집니다. 못 찾으면 미리보기 위에 안내가 나옵니다.
- **숨기기 · 다시 공개**: 카드의 **수정** → "사이트에 공개" 끄기/켜기 → 저장. 숨긴 글은 **숨긴 글 · 전체 관리**에서 찾습니다.
- **파일 바꾸기 · 삭제**: **수정** → 파일 바꾸기 / 아래 **뉴스레터 삭제**

### 저장한 뒤

화면 아래 막대에 "사이트에 반영 중(1~2분)" → "반영되었습니다 · 새로고침"이 나옵니다. **새로고침**을 누르면 바뀐 화면이 보입니다.
반영이 늦어지거나 실패하면 막대에 안내가 나옵니다(Vercel → Deployments에서 확인).

---

## 3. 개발자 참고

| 항목 | 위치 |
|---|---|
| 사이트 위 편집(버튼 · 편집 창 · 편집 막대) | `src/components/edit/*` (방문자에게는 불러오지 않음) |
| 편집 저장(GitHub 커밋 하나로 여러 파일) · 반영 상태 확인 | `src/lib/edit/repo.ts`, 데이터 바꾸기 `src/lib/edit/content.ts` |
| 로그인 페이지 · GitHub 로그인 연결 | `src/app/admin/page.tsx`, `src/app/api/decap/*` |
| 예비 관리 화면(Decap CMS) | `src/app/admin/cms/route.ts`, 설정 `src/lib/cms.ts` |
| 제품 데이터 | `content/products.json` → `src/data/products.ts` |
| 제품 사진 | `public/assets/products/` |
| 뉴스레터 | `content/story/vol-NN.json` + `content/story/files/*.html` → `src/lib/newsletter.ts` |
| 문의 메일 | `src/app/api/inquiry/route.ts`, 검사 규칙 `src/lib/inquiry.ts` |

- **내 컴퓨터에서 시험**: `npm run dev` → `http://localhost:3000/admin` → **내 컴퓨터에서 편집(개발용)** → 내 컴퓨터 파일에 바로 저장(`/api/edit-local`, 운영에서는 꺼져 있음). GitHub에는 직접 올려야 합니다.
- 예비 관리 화면을 내 컴퓨터에서 쓸 때는 `npm run cms`를 함께 켜고 `/admin/cms`.
- 저장할 때마다 저장소의 최신 내용을 다시 읽어 그 위에 바꿉니다(두 사람이 동시에 고쳐도 덮어쓰지 않음).
- 저장하는 브랜치: Vercel이 배포 중인 브랜치(`VERCEL_GIT_COMMIT_REF`), 없으면 `main`.
- 이전 상태(관리 화면 없는 버전)는 태그 `v1-before-admin`.
