# Cloudflare Pages로 옮기기 (무료 · 상업용 가능)

지금 사이트(화면 · 모션 · 사이트 위 편집 `/admin`)를 그대로 Cloudflare Pages에서 운영하는 방법입니다.
코드는 준비되어 있습니다. 아래 순서대로 **가입 · 연결 · 값 입력**만 하면 됩니다.

| 순서 | 할 일 | 누가 |
|---|---|---|
| 1 | Cloudflare 가입, Pages에 GitHub 저장소 연결 | 직접 |
| 2 | 빌드 설정 · 환경 변수 입력 | 직접(아래 값 그대로) |
| 3 | 임시 주소(`○○.pages.dev`)에서 확인 | 함께 |
| 4 | GitHub 로그인 앱에 새 주소 추가 | 직접 |
| 5 | 후이즈 도메인 연결 | 직접 |
| 6 | Vercel 끄기 | 직접(확인 뒤) |

---

## 1. 가입 · 저장소 연결

1. https://dash.cloudflare.com 가입(무료 요금제) — 회사 메일로 가입 권장.
2. 왼쪽 메뉴 **Workers & Pages → Create → Pages → Connect to Git**.
3. GitHub 계정 연결 → 저장소 **`elisaohh/yy-corporation`** 만 선택해 허용.

## 2. 빌드 설정 (그대로 입력)

| 칸 | 값 |
|---|---|
| Project name | `yy-corporation` (임시 주소가 `yy-corporation.pages.dev`가 됨) |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build:cloudflare` |
| Build output directory | `out` |

**Environment variables (Production)** — "Add variable"로 하나씩, 두 비밀 값은 **Encrypt** 선택:

| 이름 | 값 |
|---|---|
| `NODE_VERSION` | `22` |
| `GITHUB_OAUTH_ID` | Vercel에 넣은 것과 같은 Client ID |
| `GITHUB_OAUTH_SECRET` | Vercel에 넣은 것과 같은 Client Secret |

→ **Save and Deploy**. 3~5분 뒤 임시 주소가 열립니다.

## 3. 임시 주소에서 확인

- `https://yy-corporation.pages.dev` — 화면 · 모션이 Vercel과 같은지(코드가 같아 차이 없음).
- 로그인은 4번을 마친 뒤 확인합니다.

## 4. GitHub 로그인 앱에 새 주소 추가

GitHub → Settings → Developer settings → OAuth Apps → **YY CORPORATION 관리** →
**Redirect URIs**에서 **Add redirect URI**로 아래를 추가(기존 Vercel 주소는 그대로 둠, 최대 10개):

```
https://yy-corporation.pages.dev/api/decap/callback
https://(회사 도메인)/api/decap/callback
https://www.(회사 도메인)/api/decap/callback
```

→ `https://yy-corporation.pages.dev/admin`에서 GitHub 로그인 → 제품 하나 수정 · 저장 → 아래 막대에 "반영되었습니다"까지 확인.

## 5. 후이즈 도메인 연결

**권장: 도메인 관리(DNS)를 Cloudflare로 옮기기** — 회사 도메인 맨 앞 주소(www 없는 주소)까지 연결하려면 이 방법이 필요합니다.

1. Cloudflare 대시보드 → **Add a domain** → 회사 도메인 입력 → **Free** 요금제.
2. Cloudflare가 기존 설정을 읽어 옵니다. ⚠ **회사 메일을 이 도메인으로 쓰고 있다면** 목록에 `MX` 기록이 있는지 꼭 확인하세요(없으면 메일이 끊깁니다 — 후이즈 DNS 화면의 값과 비교).
3. Cloudflare가 알려 주는 **네임서버 2개**(예: `xxx.ns.cloudflare.com`)를 복사.
4. 후이즈(whois.co.kr) 로그인 → **도메인 관리 → 네임서버 변경** → 위 2개로 바꿔 저장. 반영까지 몇 분 ~ 하루.
5. Cloudflare → Workers & Pages → `yy-corporation` → **Custom domains → Set up a custom domain** → `회사도메인`과 `www.회사도메인`을 각각 추가.

## 6. Vercel 끄기

새 도메인에서 화면 · `/admin` 로그인 · 저장이 모두 되면 Vercel 프로젝트를 지우거나 GitHub 연결을 끊습니다(둘 다 켜 두면 저장할 때마다 양쪽에서 빌드됨).

---

## 참고

- 무료 요금제: 상업용 사이트 허용, 방문자 수 제한 사실상 없음, 빌드 월 500회.
- 저장 후 반영: 1~3분(편집 막대가 Cloudflare 배포 기록을 읽어 "반영되었습니다"를 띄움).
- Cloudflare에서는 서버 기능 대신 `functions/api/decap/`(로그인 2곳)이 동작하고, 주소 이동 · 캐시는 빌드 때 `out/_redirects` · `out/_headers`로 들어갑니다. 예비 관리 화면 `/admin/cms`는 Cloudflare에서는 쓰지 않습니다.
- 내 컴퓨터에서 Cloudflare와 똑같이 시험: `npm run build:cloudflare` → `npx wrangler pages dev out` (로그인 시험용 값은 `.dev.vars`).
