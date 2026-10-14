# 자산 목록

상태: **final** 실제 자료 / **placeholder** 임시 / **missing** 아직 없음 / **보류** 권한 확인 전 비공개

원본 자료는 `자료/` 폴더에 두고 Git에서 제외한다(`.gitignore`). 사이트에는 `public/`의 웹용 사본만 쓴다.

## 브랜드

| 파일 (public/) | 원본 (/LOGO) | 용도 | 상태 |
|---|---|---|---|
| assets/brand/yy-logo-basic-corp.svg | 기본 로고.svg | PC·모바일 헤더, 모바일 메뉴 | final |
| assets/brand/yy-logo-vertical-corporation.svg | 세로 로고(1).svg | 로더 | final |
| assets/brand/yy-logo-horizontal-corporation.svg | 가로 로고(1).svg | 푸터 | final |
| assets/brand/yy-logo-horizontal-korean.svg | 가로 로고(2).svg | 예비 | final |
| assets/brand/yy-logo-vertical-korean.svg | 세로 로고(2).svg | 예비 | final |
| assets/brand/yy-logo-vertical-corp.svg | 세로 로고(3).svg | 예비 | final |

- 사본은 원본과 바이트 단위로 동일(`cmp` 확인). `.gitattributes`에서 줄바꿈 변환을 막았다.

### 파생본 (로고 자리에는 사용하지 않음)

| 파일 (public/assets/brand/derived/) | 변경 내용 | 상태 |
|---|---|---|
| yy-logo-*--mono-charcoal.svg (6개) | 스타일의 fill 값 2개 → #2b2b2a. path·viewBox 동일 | 반투명 그래픽 전용 |
| yy-logo-*--mono-white.svg (6개) | 스타일의 fill 값 2개 → #ffffff. path·viewBox 동일 | 반투명 그래픽 전용 |

## 기준 유리병 (data/reference.ts)

| 항목 | 값 | 출처 |
|---|---|---|
| 제품 코드 | YS-SRRR20-01 | 자료/01_기준유리병 |
| 용량 | 20ml (기획서의 30ml에서 변경) | 치수 메모 · 2026-10-14 결정 |
| 병목 | 18파이 | 치수 메모 |
| 크기 | 33.7 × 68.7 (가로 × 세로, 단위 표기 없음) | 치수 메모 · 사용자 확인 |
| 3D 기준 사진 | YS-SRRR20-01 _01 결합 정면 · _02 병 단독 · _03 분리 (600px) | 자료/03_제품 |
| 미확인 | 바닥 두께, 어깨 곡률, 스포이드 길이 · 벌브 지름 · 유리관 길이 | — |

## 제품 사진 (data/productImages.ts)

원본 `자료/03_제품/제품사진/*.png` → 사본 `public/assets/products/<코드>/<코드>_<컷>.webp` + `-thumb.webp`
(`node scripts/build-product-images.mjs`, 원본 PNG 약 7MB → WebP 약 376KB)

| 제품 코드 | 컷 | 규격 | 상태 |
|---|---|---|---|
| YS-SRRR15-01 | 02 · 03 · 04 (01 없음 → 02를 대표로 사용) | 미확인 | final (600px) |
| YS-SRRR20-01 | 01 · 02 · 03 · 04 | 20ml · 33.7×68.7 · MOQ 5,000 · 유리 · 넥 18파이 | final (600px) |
| YS-SRRR30-02 | 01 · 02 · 03 · 04 | 미확인 | final (600px) |
| YS-SRRR30-04 | 01 · 02 · 03 · 04 | 미확인 | final (600px) |
| YS-SRRR50-02 | 01 · 02 · 03 · 04 | 미확인 | final (600px) |

- 컷 규칙: 01 스포이드 결합 정면 · 02 병 단독 · 03 분리 · 04 색상·질감 변형(한 이미지에 3종, 개별 제품 아님).
- 흰 배경(15-01, 20-01, 30-02_04)과 투명 배경이 섞여 있어 화면에서는 multiply 혼합으로 카드 바탕에 맞춘다.
- 원본이 600px라 상세 큰 이미지에서 다소 흐릴 수 있음 → 고해상도(1600px 이상) 원본 확보 시 스크립트 재실행.

## 이미지 · 영상 · 3D (data/assets.ts)

| ID | 용도 | 상태 | 필요한 자료 |
|---|---|---|---|
| heroPoster · heroPosterMobile | HOME 인트로 포스터 | missing | 기준병 기반 렌더/촬영 |
| svcFind · svcDress · svcMatch · svcDeliver | HOME 사업 역량 이미지 | placeholder (회색 도형) | 3D 제품 + 그래픽 제작 |
| (공정 사진) | PROCESS | missing | 코팅 · 인쇄 · 부식 · 라벨 결과 사진, 공식 후가공 목록 |
| (3D 모델) | HOME · PROCESS | missing | 기준병 사진 기반 제작 예정 |

## 공개 보류

- 작업 사진 15장 — `docs/asset-candidates.md` 참고. 소유 관계 · 공개 권한 확인 전 사이트 미적용.

## 회사 정보 (data/company.ts)

- 출처: 기존 사이트 푸터 캡처(`자료/04_회사정보/회사정보.png`). 상태 **unverified** — 화면에 "기존 사이트 기준 · 최신 확인 필요" 표시.
- 상호 · 대표 · 사업자등록번호 · 주소 · 대표번호 · 이메일 있음. 팩스 · 운영 시간 없음(표시하지 않음).
- 개인정보처리방침 · 이용약관: 기존 문서 확보 전까지 작성 · 공개하지 않음.

## 폴더

- `public/assets/brand` 로고 · `public/assets/products` 제품 사진 사본 · `public/assets/placeholders` 임시 도형
- `public/assets/process` 공정 사진 · `public/assets/hero` 인트로 · `public/assets/models` 3D 모델 (비어 있음)
- `public/references` 3D 제작 참고(사이트에 노출하지 않음 — 단, public 폴더라 주소로 접근 가능하므로 공개 권한 확인된 자료만)
