# 자산 목록 (2026-10-19 기준)

원본은 `자료/` 폴더(Git 제외, `.gitignore`)에 두고, 사이트에는 `public/assets/`의 웹용 사본만 씁니다.
원본 파일별 쓰임 · 다시 만드는 명령은 `자료/README.md`, 변환 방법 요약은 `docs/HANDOFF.md` 7장에 있습니다.

구분: **실제** 실제 제품 · 현장 사진 / **편집** 현장 사진을 바탕으로 편집 / **생성** 생성 이미지

## 브랜드 (`public/assets/brand/`, `src/data/brand.ts`)

| 파일 | 원본 (`LOGO/`) | 용도 |
|---|---|---|
| yy-logo-horizontal-corporation.svg | 가로 로고(1).svg | 헤더 · 모바일 메뉴 · 푸터 |
| yy-logo-vertical-corporation.svg | 세로 로고(1).svg | 로딩 화면 |
| yy-logo-basic-corp.svg | 기본 로고.svg | 예비 |
| yy-logo-horizontal-korean.svg · yy-logo-vertical-korean.svg · yy-logo-vertical-corp.svg | 가로(2) · 세로(2) · 세로(3) | 예비 |
| derived/yy-logo-*--mono-charcoal.svg · --mono-white.svg (각 6개) | 위 로고의 단색 파생본(fill만 변경) | 반투명 그래픽 전용(로고 자리에는 쓰지 않음) |

- 사본은 원본과 바이트 단위로 동일. 위치별 로고 배정은 `brand.ts`에서 바꿉니다.

## HOME (`public/assets/hero/`, `src/data/assets.ts` · `home.ts`)

| 파일 | 용도 | 구분 | 원본 → 명령 |
|---|---|---|---|
| hero-base.webp, hero-drop-1~14.webp | 히어로 — 병 층 + 떠다니는 물방울 14개 | 생성 | `자료/07_히어로/` → `build-hero-layers.mjs` |
| proc-clear · proc-coating · proc-printing · proc-etching · proc-label.webp | 공정 모션 병 장면 5장(900×1600, 같은 좌표) | 생성 | `자료/01_기준유리병/사진/YS-SRRR30-04*.png` → `build-process-images.mjs` |
| dropper.webp → dropper-cap · dropper-pipette.webp | 공정 모션 스포이드(캡 · 피펫 분리, 피펫 200px 축소) | — | `build-dropper-parts.mjs` |

- 공정 모션 코팅 = 분홍 그라데이션, 인쇄 = 코팅 위 인쇄(인쇄 단독 이미지 없음), 라벨 = 부식 후 라벨.
- 라벨이 피펫을 가리는 높이 `home.ts`의 `labelBand` = 48.8~75.4%(라벨 이미지를 바꾸면 다시 잼).
- `assets.ts`의 `heroPoster` · `heroPosterMobile`은 `heroMode: "poster"`일 때만 쓰는 자리(현재 `float`라 미사용, 파일 없음).

## 기준 유리병 (`src/data/reference.ts`)

| 항목 | 값 |
|---|---|
| 제품 코드 | YS-SRRR30-04 · 30ml · 병목 18파이 |
| 치수 | ⚠ 미확정 — 치수 파일 37.0 × 75.8 vs 제품규격표 38.0 × 74.4 (확인 전까지 화면에 표시하지 않음) |

## PRODUCT (`public/assets/products/<코드>/`, `src/data/products.ts` · `productImages.ts`)

관리 화면(`/admin`)에서 바로 올리거나, 원본 `자료/03_제품/제품사진/<코드>_<컷>.png` → `public/assets/products/<코드>_<컷>.webp` (`build-product-images.mjs`) 후 관리 화면에서 선택

| 제품 코드 | 컷 | 규격 | 구분 |
|---|---|---|---|
| YS-SRRR15-01 | 01 · 02 · 03 · 04 | 15ml · 31.5 × 64.0 · Ø18 | 실제 |
| YS-SRRR20-01 | 01 · 02 · 03 · 04 | 20ml · 33.7 × 68.7 · Ø18 | 실제 |
| YS-SRRR30-02 | 01 · 02 · 03 · 04 | 30ml · 38.0 × 71.3 · Ø18 | 실제 |
| YS-SRRR30-04 | 01 · 02 · 03 · 04 | 30ml · 38.0 × 74.4 · Ø18 | 실제 |
| YS-SRRR50-02 | 01 · 02 · 03 · 04 | 50ml · 38.0 × 99.2 · Ø18 | 실제 |

- 규격 출처: `자료/03_제품/제품규격/제품규격.txt`(가로 × 세로).
- 컷: 01 스포이드 결합 정면 · 02 병 단독 · 03 분리 · 04 색상 · 질감 변형(한 이미지에 3종 — 개별 제품 아님).
- 원본이 600px — 고해상도(1600px 이상) 원본을 받으면 스크립트를 다시 실행합니다.
- 제품 상세에 재질(유리)을 표시합니다. MOQ 값은 데이터에만 있고 화면에는 표시하지 않습니다.
- PRODUCT 머리 영역 배경은 HOME 히어로 사진(`hero-base.webp`, 생성)을 씁니다(`app/products/page.tsx`의 `INTRO_IMAGE`).

## ABOUT (`public/assets/about/`, `src/data/about.ts` `aboutVisuals`)

| 파일 | 용도 | 구분 |
|---|---|---|
| 01a-story-main.webp · 01b-story-sub.webp | Story 사진 2장 | 생성 |
| 02-glass-packaging · 03-component-sourcing · 04-decoration · 05-global-sourcing.webp | Business 4항목 | 생성 |

원본 `자료/08_ABOUT/*-generated.*` → `build-about-images.mjs`. 실제 YY 제품 · 시설로 소개하지 않습니다.

## PROCESS (`public/assets/process/`)

| 파일 | 용도 | 구분 |
|---|---|---|
| process-intro.mp4 (1920×1080, 7MB) | 제목 배경 영상 — 8초 이후 반복 · 1.25배 확대 | 실제 |
| process-flow.png | From Idea to Delivery 흐름도 | — |
| onestop/glass-01 · glass-02.webp | TURN-KEY 01 유리 성형 | 편집(밀대 · 공구 제거) |
| onestop/coating · printing · etching · labeling-01.webp | 02 후가공 4칸 | 편집 |
| onestop/dropper-01 · tube-01.webp | 03 부자재 — 스포이드(고무) · 유리관 | 편집 |
| onestop/pump-01 · spray-01.webp | 03 부자재 — 펌프 · 스프레이 | 생성 |
| onestop/delivery-01 · delivery-02.webp | 04 입고 및 납품 | 실제 |

원본 `자료/02_후가공/작업사진/<종류>-01.jpg` → `build-onestop-photos.mjs`. 영상은 `자료/09_PROCESS/`에서 같은 이름으로 복사.
화면의 "생성 · 편집 이미지" 안내 문구는 회사 요청으로 표시하지 않습니다.

## STORY (`content/story/`)

뉴스레터 원본 HTML(`vol-01.html`, `vol-02.html`)을 그대로 보여 줍니다. 사진은 HTML 안에 들어 있어 따로 저장하지 않으며, 목록 카드의 대표 사진은 빌드 시 첫 번째 사진으로 만들어집니다(`/about/story/<주소>/cover`).

## 회사 정보 (`src/data/company.ts`)

- 상호 · 주소 · 대표번호 · 이메일 — 확인 완료(`confirmed`). 팩스 · 상담 시간은 값이 없어 표시하지 않습니다.
- 출처: 기존 사이트 푸터(`자료/04_회사정보/회사정보.png`).

## 공개 전 확인할 것

1. **현장 사진 속 시설의 소유 관계** — YY 소유 공장인지 협력 생산처인지. 협력처라면 "자사 공장"으로 읽히는 문구를 쓰지 않습니다(현재 문구는 지킴).
2. **웹사이트 공개 사용 허락** — 현장 사진 · 영상 촬영처의 허락, 사진 속 작업자(뒷모습 포함)의 동의.
3. **타사 상호 · 설비 표기 노출** — 편집 이미지에서 대부분 지웠지만 배포 전 한 번 더 확인.
4. **생성 · 편집 이미지 고지** — 안내 문구를 뺀 상태입니다. 광고 · 표시 관련 문제가 없을지 회사에서 판단이 필요합니다.
5. **개인정보 처리방침** — `/privacy`에 게시(시행일 2026.11.19). 제5조 수탁자 · 위탁업무 `[ ]` 칸은 문의 접수 서비스가 정해지면 채웁니다.

## 사용하지 않는 원본 (`자료/_보관/`)

이전 기준병(SRRR30-01) 장면, 안 쓰는 공정 장면, 예전 현장 사진 갤러리 원본(`현장-NN.jpg`), 편집 전 현장 사진(`*-현장원본.jpg`), ABOUT 이전 후보(Pexels), 뉴스레터 로고 등. 목록은 `자료/README.md` 마지막 표.
