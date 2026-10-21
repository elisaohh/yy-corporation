# YY CORPORATION 웹사이트 — 디자인 · 개발 인수인계 문서

> 작성일 2026-10-19 · 저장소 `github.com/elisaohh/yy-corporation` (`main` 브랜치)
> 화장품 유리 패키징 B2B 기업 와이와이 코퍼레이션의 회사 웹사이트 **프로토타입**입니다.
> 화면 · 모션 · 콘텐츠 구조는 완성 단계이고, **콘텐츠 관리(CMS) · 문의 전송 · 운영 설정은 아직 없습니다**(→ 12장 요청사항).

---

## 1. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 형태 | 정적 사이트(빌드 시 모든 페이지를 미리 만듦). 서버 · DB 없음 |
| 프레임워크 | Next.js 16 (App Router) · React 19 · TypeScript 5.9 |
| 스타일 | Tailwind CSS 4 (`src/app/globals.css`의 `@theme` 토큰) |
| 모션 | GSAP 3.15 + ScrollTrigger |
| 콘텐츠 | `src/data/*.ts` 파일에 직접 작성(코드 안의 데이터) |
| 이미지 원본 | `자료/` 폴더(**git에 없음**, 별도 전달) → 변환 스크립트 → `public/assets/` |
| 실행 환경 | Node.js 20.9 이상 |

## 2. 실행 · 빌드

```bash
npm install
npm run dev        # http://localhost:3000 — 수정이 바로 반영
npm run build      # 배포용 빌드 + 타입 검사
npm run start      # 빌드 결과 실행
npm run typecheck  # 타입 검사만
```

- 배포: `npm run build` 결과를 Vercel 등 Next.js 호스팅에 올리면 됩니다(서버 기능 없음). 도메인 · 호스팅은 아직 정하지 않았습니다.
- 주소 옵션: 주소 뒤에 `?still`을 붙이면 로딩 · 등장 모션 · 공정 모션 고정 없이 완성 화면이 바로 보입니다(검수 · 캡처 · 피그마 가져오기용, 배포 사이트에서도 동작, `src/lib/still.ts`).

## 3. 폴더 구조

```text
src/
  app/                   페이지(라우트)
    page.tsx             HOME
    about/               /about → /about/company 로 이동
      company/           ABOUT › COMPANY (회사 소개)
      story/             ABOUT › STORY (뉴스레터 목록) · [slug]/ 상세 · [slug]/cover 대표 사진
    products/            PRODUCT 목록 · [slug]/ 상세
    process/             PROCESS
    contact/             CONTACT
    logo-check/          ⚠ 로고 검토용 내부 페이지(메뉴 없음) — 배포 전 삭제
    template.tsx         페이지 이동 시 페이드
    globals.css          디자인 토큰 · 공통 유틸리티
  components/
    layout/              헤더(드롭다운) · 모바일 메뉴 · 푸터 · 페이지 머리 영역(PageIntro) · 배경 영상 · TOP 버튼
    home/                HOME 섹션들(히어로 · 회사 소개 · 공정 모션 · 제품 · 슬로건 · CTA)
    about/               COMPANY 본문(Story · Vision · Business)
    story/               STORY 카드 목록 · 페이지 번호
    product/             제품 카드 · 목록 필터 · 상세 갤러리 · 규격 표
    process/             공정 흐름도 · PACKAGING TURN-KEY · 펼쳐지는 사진 띠
    contact/             문의 폼
    brand/ media/ motion/ ui/   로고 · 이미지 등록부 연결 · 등장 모션 · 미확정 표시
  data/                  ★ 콘텐츠 — 문구 · 제품 · 메뉴 · 회사 정보 · 이미지 등록부
  config/site.ts         전역 설정(히어로 방식 · 데모 폼 · 임시 표시)
  lib/                   폰트 · ?still 도우미
content/products.json    제품 목록(관리 화면이 고침)
content/story/           뉴스레터 — vol-NN.json(호수 · 파일 · 공개) + files/*.html(메일 원본)
scripts/                 이미지 · 영상 변환 스크립트(sharp)
public/assets/           사이트에 실제로 쓰이는 이미지 · 영상(변환 결과)
docs/                    이 문서 · 모션 명세(MOTION.md) · 결정 기록(decisions.md) · 자산 목록(asset-inventory.md) · 로컬 수정 안내(local-editing.md)
기획서.md                초기 기획서 v2.0 (이후 변경은 docs/decisions.md 우선)
```

## 4. 페이지 구성

| 주소 | 화면 | 주요 파일 |
|---|---|---|
| `/` | HOME — 로딩(로고) → 히어로(떠다니는 병 · 물방울) → 회사 소개(FIND · DRESS · MATCH · DELIVER) → 공정 모션 → 제품 → 슬로건 → CTA | `app/page.tsx`, `components/home/*`, `data/home.ts` |
| `/about/company` | 제목(미스트) → Story → Vision → Business → CTA | `components/about/AboutSections.tsx`, `data/about.ts` |
| `/about/story` | YY NOTES 카드 목록(9개씩, 페이지 번호 `?page=N`) — `content/story/*.html`에서 자동 생성 | `components/story/StoryBoard.tsx`, `lib/newsletter.ts` |
| `/about/story/[slug]` | 뉴스레터 상세(원본 HTML 그대로, 메일 하단 숨김) · 이전/다음 호 | `app/about/story/[slug]/page.tsx` |
| `/products` | 제품 목록(카테고리 필터 · 12개씩 LOAD MORE) | `components/product/ProductCatalog.tsx`, `data/products.ts` |
| `/products/[slug]` | 제품 상세(갤러리 · 규격 · 문의 버튼) | `app/products/[slug]/page.tsx` |
| `/process` | 제목(배경 영상) → From Idea to Delivery(흐름도) → PACKAGING TURN-KEY 4항목 → CTA | `components/process/*`, `data/process.ts` |
| `/contact` | 지도(구글 퍼가기 + 네이버 지도 버튼) · 회사 정보 · 문의 폼 | `app/contact/page.tsx`, `components/contact/InquiryForm.tsx` |
| `/privacy` | 개인정보 처리방침(14개 조항 · 목차, 시행일 2026.11.19) — 푸터 · 문의 폼 동의란에서 연결 | `app/privacy/page.tsx`, `data/privacy.ts` |
| `/terms` | 이용약관(17개 조항 · 부칙, 2026.11.19 시행) — 푸터에서 연결 | `app/terms/page.tsx`, `data/terms.ts` (두 문서 공통 화면: `components/legal/LegalDocument.tsx`) |

메뉴: 헤더 ABOUT(▾ COMPANY · STORY) · PRODUCT · PROCESS · CONTACT — `data/navigation.ts` 한 곳에서 헤더 · 모바일 메뉴 · 푸터가 함께 바뀝니다. HOME은 로고로 이동합니다.

## 5. 콘텐츠 수정 위치

| 바꿀 것 | 파일 |
|---|---|
| 메뉴 · 하위 메뉴 | `src/data/navigation.ts` |
| 회사 정보(주소 · 전화 · 이메일, 푸터 · CONTACT 공통) | `src/data/company.ts` |
| HOME 문구 · 회사 소개 4항목 · 공정 모션 장면 · CTA | `src/data/home.ts` |
| ABOUT 문구 · 이미지 | `src/data/about.ts` |
| STORY 뉴스레터 글 | **사이트 위 편집** (`/admin` 로그인, 6장, `docs/ADMIN.md`) |
| 제품 · 사진 · 홈 노출 | **사이트 위 편집** → `content/products.json` (`docs/ADMIN.md`) |
| 제품 카테고리 | `src/data/categories.ts` |
| PROCESS 공정 목록 · 머리말 | `src/data/process.ts` |
| PROCESS TURN-KEY 항목 · 사진 | `src/components/process/OneStopSystem.tsx` 상단 `sections` |
| PROCESS · PRODUCT 제목 배경 | 각 `app/*/page.tsx` 상단 `INTRO_VIDEO` / `INTRO_IMAGE` |
| CONTACT 문구 · 문의 결과 안내 | `src/data/content.ts` |
| 개인정보 처리방침 전문 · 문의 폼 동의 요약 | `src/data/privacy.ts` |
| 이용약관 전문 | `src/data/terms.ts` |
| 로고 파일 · 크기 | `src/data/brand.ts` |
| 문구 상태 | `status: final / draft / missing` — 미확정 문구는 draft로 두고 docs에서 관리 |

**원칙(지금까지 지켜 온 것)**: 회사가 준 자료에 없는 사실 · 실적 · 수치는 만들지 않습니다. 값이 없으면 비워 두고 `Pending`(—)으로 표시합니다.

## 6. STORY(뉴스레터) 올리기

뉴스레터는 **메일로 보낸 원본 HTML 파일을 그대로** 보여 줍니다. 사이트용으로 옮겨 적거나 사진을 따로 꺼낼 필요가 없습니다.

1. `/admin`에서 로그인 → STORY 화면의 **+ 뉴스레터 올리기** → 호수 확인, HTML 파일 고르기 · 미리보기 → 올리기(`docs/ADMIN.md`).
2. 1~2분 뒤 목록 카드와 상세 페이지(`/about/story/yy-notes-vol-03`)가 자동으로 생깁니다.
   - 파일로 넣을 때: `content/story/files/`에 HTML, `content/story/vol-03.json`에 `{ "vol": 3, "html": "content/story/files/파일.html", "published": true }`.

| 자동으로 읽는 것 | HTML에서 가져오는 곳 |
|---|---|
| 호수 | 관리 화면에서 넣은 호수(Vol.03, 큰 번호가 맨 앞) |
| 제목 | 메일 제목(`<title>`)에서 "(광고)"와 "\| …" 뒷부분을 뺀 것 |
| 요약 | 메일 미리보기 문구(숨겨진 첫 문단) |
| 발행 시기 | 메일 머리의 "Vol.NN · 2026.10" |
| 대표 사진 | 본문 첫 번째 사진(빌드 시 `/about/story/<주소>/cover`로 만들어짐) |

- 상세 페이지는 메일 한 장을 종이처럼 가운데 두고(폭 600px 메일 디자인 그대로), **메일 하단(회사 정보 · 로고 · 홈페이지 · 수신거부 · 맺음말)은 자동으로 숨깁니다.**
- 하단을 숨기는 기준은 지금 메일 틀(하단 회사 정보 칸)에 맞춰져 있습니다. 메일 디자인 틀을 바꾸면 `src/lib/newsletter.ts`의 기준도 맞춰 주세요.
- 관련 코드: `src/lib/newsletter.ts`(읽기 · 정리), `components/story/NewsletterFrame.tsx`(틀 — 높이 자동, 스크립트 실행 안 함), `components/story/StoryBoard.tsx`(목록).

## 7. 이미지 · 영상

원본은 `자료/`, 사이트용 사본은 `public/assets/`. 원본을 같은 이름으로 바꾼 뒤 스크립트를 실행하면 사본이 다시 만들어집니다. 파일별 쓰임은 `자료/README.md`에 정리돼 있습니다.

| 대상 | 원본 | 명령 |
|---|---|---|
| 제품 사진 | `자료/03_제품/제품사진/코드_01~04.png` | `node scripts/build-product-images.mjs` |
| HOME 히어로(병 층 + 물방울 분리) | `자료/07_히어로/` | `node scripts/build-hero-layers.mjs` |
| HOME 공정 모션 병 5장 | `자료/01_기준유리병/사진/YS-SRRR30-04*.png` | `node scripts/build-process-images.mjs` |
| 스포이드 캡 · 피펫 분리 | `public/assets/hero/dropper.webp` | `node scripts/build-dropper-parts.mjs` |
| ABOUT 사진 6장 | `자료/08_ABOUT/` | `node scripts/build-about-images.mjs` |
| PROCESS TURN-KEY 사진 | `자료/02_후가공/작업사진/종류-01.jpg` | `node scripts/build-onestop-photos.mjs` |
| PROCESS 제목 배경 영상 | `자료/09_PROCESS/process-intro.mp4` | `public/assets/process/`에 같은 이름으로 복사 |

**이미지 성격(오해 소지 주의)**

| 구분 | 해당 이미지 |
|---|---|
| 실제 제품 사진 | PRODUCT 제품 사진 |
| 현장 사진 | PROCESS 유리 성형 · 입고 및 납품, 제목 배경 영상 |
| 현장 사진을 바탕으로 **편집** | PROCESS 후가공(코팅 · 인쇄 · 부식 · 라벨), 부자재(스포이드 · 유리관) |
| **생성 이미지** | HOME 히어로(PRODUCT 제목 배경으로도 사용) · 공정 모션 병, ABOUT 사진 6장, 부자재 펌프 · 스프레이 |

화면에서 "생성 이미지" 안내 문구는 회사 요청으로 뺐습니다. 실제 제품 · 시설로 소개하는 문구는 쓰지 않습니다.

## 8. 디자인 시스템

토큰은 `src/app/globals.css`의 `@theme`에서만 정의합니다(컴포넌트에 색 값을 직접 쓰지 않음).

| 토큰 | 값 | 쓰임 |
|---|---|---|
| `paper` | #FFFFFF | 기본 바탕 |
| `mist` | #F4F3F1 | 페이지 제목 영역 · Vision 바탕 |
| `card` | #F5F5F3 | 사진 자리 · 카드 |
| `stone` | #E6E4E0 | 가는 선 |
| `ash` | #6B6864 | 보조 글자 |
| `charcoal` | #2B2B2A | 본문 · 굵은 선 |
| `intro` / `outro` | #262625 / #2E2E2D | 어두운 영역(제목 배경 영상 · CTA) |
| `point-1225` | #FFC844 | 로고 심볼 색 — **면 전용**(형광펜 띠 등) |
| `point-4008` | #F7AF22 | 로고 워드마크 색 — **선 전용**(진행 막대 등) |

- 서체: 영문 Inter(제목 · 메뉴 · 숫자), 국문 Pretendard(본문). `font-en`, 기본은 국문.
- 브레이크포인트: `md` 768px · `lg` 1200px · `xl` 1440px(Tailwind 기본값과 다름). 단, HOME 공정 모션은 1024px 기준으로 PC/모바일 동작이 나뉩니다.
- 레이아웃: `container-yy`(최대 1440px + 좌우 여백 `--gutter`). 큰 섹션은 35:65 2단(왼쪽 제목 · 오른쪽 내용)을 기본으로 씁니다.
- 헤더 색: 각 섹션의 `data-header-theme="light|dark"`를 읽어 헤더 바탕 · 글자색이 바뀝니다. 새 섹션을 만들면 이 속성을 꼭 넣어 주세요.
- 버튼 · 링크: `btn btn-primary` / `btn-secondary`, 영문 링크는 `link-en`.

## 9. 모션

> 시간 · 이징 · 순서까지 담은 상세 명세는 **`docs/MOTION.md`** (다른 플랫폼에서 다시 구현할 때 기준).

| 위치 | 동작 | 파일 |
|---|---|---|
| HOME 로딩 · 히어로 | 로고 차오름 → 커튼 → 병 · 물방울 등장, 마우스 깊이감, 물방울 떠다님 | `home/HeroFloat.tsx` |
| HOME 공정 모션 | **PC**: 화면 고정 + 스크롤로 코팅 → 인쇄 → 부식 → 라벨 → 스포이드 체결(공정 이름 클릭 시 그 장면으로 스크롤). **모바일(<1024px)**: 고정 없음, 공정 이름을 누르면 그 장면까지 재생 | `home/ProcessMotion.tsx`, `data/home.ts` |
| 공통 | 스크롤 등장(`Reveal`), 페이지 이동 페이드 | `motion/Reveal.tsx`, `app/template.tsx` |
| ABOUT | 사진 미세 확대 · 형광펜 띠 그어짐 | `about/AboutSections.tsx` |
| PROCESS 제목 | 배경 영상 8초 이후만 반복 · 1.25배 확대 | `layout/IntroVideo.tsx` |
| PROCESS 후가공 · 부자재 | 마우스를 올린 사진 띠가 펼쳐짐(모바일: 밀기 · 누르기, 키보드 ← →) | `process/StripAccordion.tsx` |

- **모든 모션은 "동작 줄이기(prefers-reduced-motion)" 설정을 따릅니다** — 바로 완성 화면으로 보입니다.
- 공정 모션의 라벨 높이(`labelBand`)는 라벨 이미지에서 잰 값입니다. 라벨 이미지를 바꾸면 다시 재야 스포이드 관이 라벨 뒤로 맞게 가려집니다.

## 10. 접근성 · 반응형 기준

- 본문 16px 이상, 가로 스크롤 없음(390px 모바일까지 확인), 키보드 포커스 표시 유지.
- 버튼 · 링크 터치 영역 44px 이상, 이미지 대체 텍스트(alt) 작성, 장식 이미지는 숨김 처리.
- 모바일 메뉴: 포커스 가두기 · ESC 닫기 · 배경 스크롤 잠금.

## 11. 알려진 제한 · 정리할 것

| 항목 | 현재 상태 |
|---|---|
| 문의 폼 | 보내기 → 방문자의 메일 앱이 열리고 회사 메일 · 제목 · 내용이 채워짐(방문자가 직접 보냄, 외부 서비스 없음). 메일 앱이 없으면 주소 · 내용 복사. 사이트가 직접 보내는 방식(메일 발송 서비스 + 회사 도메인 인증)은 나중에 |
| 개인정보 | 처리방침 페이지(`/privacy`)와 문의 폼 동의 요약 있음. ⚠ 제5조 수탁자 · 위탁업무의 `[ ]` 칸은 실제 외부 서비스(문의 저장 · 메일 발송 등)가 정해지면 채워야 합니다 |
| 콘텐츠 관리 | 사이트 위 편집(`/admin`에서 GitHub 로그인 → 페이지마다 추가 · 수정 버튼) — 제품 · 홈 노출 · 뉴스레터. 예비 관리 화면 `/admin/cms`. 그 밖의 문구는 코드 안에 있음 |
| 사진 저장 막기 | 사진 · 영상 위 마우스 오른쪽 메뉴, 끌어서 저장, 휴대폰 길게 눌러 저장을 막음(`layout/ImageGuard.tsx`, `globals.css`). **화면 캡처와 개발자 도구로 파일 받기는 웹에서 막을 수 없음.** 링크가 걸린 사진(제품 카드 등)에서도 오른쪽 메뉴가 막혀 "새 탭에서 열기"는 안 됨 |
| 지도 | 구글 지도 퍼가기(API 키 불필요). 네이버 지도를 화면에 넣으려면 네이버 클라우드 지도 API 키가 필요합니다 |
| 제목 배경 영상 | 7MB(앞 8초는 쓰지 않음). 잘라서 압축하면 2~3MB로 줄일 수 있습니다(ffmpeg) |
| SEO | 사이트 설명(`config/site.ts` description)이 임시 문장, OG 이미지 · sitemap · robots 없음 |
| 제품 | 유리병 7종(YS-SRRR 5 · SL-SRSS 2), 화면에는 코드만(이름 없음), 규격은 확인된 것만, 사이즈는 숫자만(가로 × 세로 표기 없음), 홈에는 "홈에 보이기"를 켠 제품. DROPPER · CAP · ACCESSORIES 카테고리는 제품이 없음 |
| 미확정 문구 | HOME CTA 등 `status: "draft"` 문구 — docs에서 관리 |
| 개발용 잔여물 | `app/logo-check`(로고 검토 페이지), `components/layout/StageNotice.tsx`(미사용), `data/about.ts`의 `values` · `expertise`, `data/process.ts`의 `onSite` · `additionalProcesses`, `data/reference.ts`(모두 화면 미사용) — 배포 전 삭제 권장 |
| 뉴스레터 | Vol.01 규격 표에 MOQ(5,000개)가 원문대로 들어 있음(제품 페이지에서는 MOQ를 표시하지 않음) |

결정 이력은 `docs/decisions.md`(날짜순), 자산별 상태 · 공개 전 확인 사항은 `docs/asset-inventory.md`, 수정 방법은 `docs/local-editing.md`를 참고하세요.

---

## 12. 요청사항

> 2026-10-21: 요청 1 · 2 · 3의 기본 기능은 사이트 위 편집(`/admin` 로그인)과 메일 앱으로 문의 보내기로 만들어 두었습니다(`docs/ADMIN.md`). 아래는 원래 요청 내용이며, 남은 것(예약 발행 · 사이트가 직접 보내는 문의 메일 · 문의 내역 저장 · 접수 확인 메일 · 첨부 파일 등)을 참고해 주세요.

### 요청 1. STORY — 뉴스레터를 하나씩 올릴 수 있도록

뉴스레터가 **매주 1편** 발행될 예정입니다. 지금은 메일 HTML 파일을 `content/story/`에 넣고 배포하면 올라가지만(6장), 담당자가 개발 도구 없이 직접 올릴 수 있는 방법이 필요합니다.

- 관리 화면에서 **메일 HTML 파일 업로드(또는 붙여 넣기)만으로 게시** — 제목 · 요약 · 발행 시기 · 대표 사진은 지금처럼 HTML에서 자동으로 읽기
- 필요하면 제목 · 요약 · 대표 사진을 손으로 고칠 수 있게
- 미리보기 · 예약 발행 · 비공개(초안) 상태
- 목록 카드 · 페이지 번호 · 상세 디자인은 지금 것을 유지

### 요청 2. PRODUCT — 제품을 올리고, HOME에 보이는 제품을 고를 수 있도록

- 제품 등록 · 수정 · 삭제: 코드 · 카테고리 · 용량 · 사이즈 · 병목 규격 · 설명 · 사진(대표 · 마우스 올림 · 상세 컷)
- 카테고리(GLASS BOTTLE · DROPPER · CAP · ACCESSORIES) 관리 — 제품이 없는 카테고리는 숨김
- **HOME 노출 관리**: 지금은 HOME 제품 섹션에 전체 제품이 나옵니다. "HOME에 보이기" 선택과 **순서 지정**(끌어서 정렬)이 필요합니다
- HOME 공정 모션 · 히어로 등 다른 HOME 요소(문구 · 이미지)도 관리 화면에서 바꿀 수 있으면 좋습니다
- 제품 상세 규격에 재질(유리) 표시, MOQ는 표시하지 않음(데이터만 유지)

### 요청 3. CONTACT — 문의가 실제로 작동하도록

- 보내기 → **담당 메일(sales@yycorp.co.kr) 수신** + 문의자에게 접수 확인 메일
- 문의 내역 저장(관리 화면에서 목록 · 상태 관리)
- 스팸 방지(Cloudflare Turnstile / reCAPTCHA, 전송 횟수 제한)
- 개인정보 동의 기록 저장(동의 문구 · 처리방침은 준비됨 — 사용하는 외부 서비스를 처리방침 제5조 · 제6조에 반영)
- 첨부 파일(참고 이미지 · 도면) 업로드 — 선택
- 제품 상세의 "문의" 버튼 → 제품 자동 채움은 이미 동작합니다

### 추가 제안 (기능상 필요해 보이는 것)

| 우선 | 제안 | 이유 |
|---|---|---|
| 높음 | **도메인 · 호스팅 · 배포 자동화**(예: Vercel + GitHub 연결) | 지금은 로컬 실행만 가능 |
| 높음 | **SEO 기본 세팅** — 페이지별 제목 · 설명, OG 이미지(공유 미리보기), sitemap.xml, robots.txt, 네이버 서치어드바이저 · 구글 서치콘솔 등록 | B2B 검색 유입 |
| 높음 | 방문 분석(GA4 또는 네이버 애널리틱스) + 문의 전환 측정 | 어떤 제품 · 글이 문의로 이어지는지 확인 |
| 중간 | **뉴스레터 구독 신청**(STORY · 푸터) + 메일 발송 서비스(스티비 등) 연동 | 매주 발행하는 뉴스레터와 사이트 연결 |
| 중간 | 제품 검색 · 용량별 필터, 제품 비교 또는 "관심 제품 담아 한 번에 문의" | 제품 수가 늘어날 때 |
| 중간 | 제목 배경 영상 압축 · 정지 화면(poster) 이미지 | 모바일 첫 화면 속도 |
| 중간 | 영문 페이지(EN) | 해외 고객 대응이 필요하다면 |
| 낮음 | 네이버 지도 API로 지도 교체 | 국내 이용자 익숙함 |
| 낮음 | 404 · 오류 페이지 디자인, 개발용 잔여물 삭제(11장) | 배포 전 정리 |

관리 기능(요청 1 · 2 · 3)은 하나의 관리 화면으로 묶는 것을 권장합니다. 헤드리스 CMS(예: Sanity · Contentful · Strapi) 또는 DB + 간단한 관리자 페이지(예: Supabase) 중 운영 담당자가 쓰기 편한 쪽으로 정하면 됩니다. 지금의 `src/data/*.ts` 구조가 그대로 CMS 스키마의 초안이 됩니다.
