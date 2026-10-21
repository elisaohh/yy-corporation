# 관리 화면 · 문의 메일 안내

사이트 주소 뒤에 `/admin`을 붙이면 관리 화면이 열립니다(예: `https://yy-corporation.vercel.app/admin`).
서버 · 데이터베이스 없이 동작합니다. 관리 화면에서 저장하면 GitHub 저장소에 바로 기록되고, Vercel이 사이트를 다시 만들어 **1~2분 뒤** 반영됩니다.

| 할 수 있는 것 | 관리 화면 메뉴 |
|---|---|
| 제품 올리기 · 고치기 · 지우기, 사진 올리기, 순서 바꾸기(끌어서) | PRODUCT 제품 → 제품 목록 |
| 홈 PRODUCT에 보일 제품 고르기 | 제품마다 "홈에 보이기" 켜기 · 끄기(순서 = 목록 순서) |
| 뉴스레터 올리기 · 숨기기 · 지우기 | STORY 뉴스레터 → 새 뉴스레터 |

문의 폼(CONTACT)은 보내기를 누르면 회사 메일로 전달됩니다(아래 3장 설정 필요).

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

### 제품

1. 관리 화면 → **PRODUCT 제품 → 제품 목록**
2. **제품 추가 +** → 제품 코드 · 종류 · 용량 · 사이즈 · 재질 · 병목 규격 입력
3. **사진 추가 +** → 사진 올리기. 첫 번째 = 대표 사진, 두 번째 = 마우스를 올렸을 때 사진
   - 정사각형 · 흰 배경 · 600px 이상 권장. 파일 이름은 `코드_01.png`처럼(다른 제품과 이름이 겹치지 않게)
4. 홈에 보이려면 **홈에 보이기** 켜기 — 넓은 화면에서 한 줄 5개라 5개(또는 10개)가 보기 좋습니다
5. 위쪽 **게시 → 지금 게시** → 1~2분 뒤 사이트 반영

- 순서는 항목 위의 `=` 손잡이를 끌어서 바꿉니다(목록 순서 = 화면 순서).
- **내부 제품명은 넣지 마세요.** 화면에는 코드만 나옵니다.

### 뉴스레터(STORY)

1. 관리 화면 → **STORY 뉴스레터 → + 뉴스레터**
2. **호수**(숫자) 입력 → **뉴스레터 HTML 파일**에 메일 발송에 쓴 `.html` 파일 올리기
3. **게시 → 지금 게시**

- 카드의 제목 · 요약 · 발행 시기 · 대표 사진은 HTML에서 자동으로 읽습니다. 메일 하단(회사 정보 · 수신거부)은 자동으로 숨겨집니다.
- 잠시 내리려면 **사이트에 공개**를 끄고 게시합니다.

---

## 3. 개발자 참고

| 항목 | 위치 |
|---|---|
| 관리 화면 설정(항목 · 저장 위치) | `src/lib/cms.ts` |
| 관리 화면 페이지 · 로그인 | `src/app/admin/route.ts`, `src/app/api/decap/*` |
| 제품 데이터 | `content/products.json` → `src/data/products.ts` |
| 제품 사진 | `public/assets/products/` |
| 뉴스레터 | `content/story/vol-NN.json` + `content/story/files/*.html` → `src/lib/newsletter.ts` |
| 문의 메일 | `src/app/api/inquiry/route.ts`, 검사 규칙 `src/lib/inquiry.ts` |

- 관리 화면 프로그램: [Decap CMS](https://decapcms.org) 3.16.3(무료 · 오픈소스, unpkg에서 불러옴).
- **내 컴퓨터에서 시험**: `npm run dev`와 `npm run cms`를 함께 켜고 `http://localhost:3000/admin` → 로그인 없이 내 컴퓨터 파일에 바로 저장됩니다(GitHub에는 직접 올려야 함).
- 저장하는 브랜치: Vercel이 배포 중인 브랜치(`VERCEL_GIT_COMMIT_REF`), 없으면 `main`.
- 이전 상태(관리 화면 없는 버전)는 태그 `v1-before-admin`.
