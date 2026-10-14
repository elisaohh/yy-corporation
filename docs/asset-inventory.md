# 자산 목록

상태: **final** 실제 자료 / **placeholder** 임시 / **missing** 아직 없음

## 브랜드

| 파일 (public/) | 원본 (/LOGO) | 용도 | 상태 |
|---|---|---|---|
| assets/brand/yy-logo-basic-corp.svg | 기본 로고.svg | PC·모바일 헤더, 모바일 메뉴 | final |
| assets/brand/yy-logo-vertical-corporation.svg | 세로 로고(1).svg | HOME 인트로, 로더 | final |
| assets/brand/yy-logo-horizontal-corporation.svg | 가로 로고(1).svg | 푸터 | final |
| assets/brand/yy-logo-horizontal-korean.svg | 가로 로고(2).svg | 예비 | final |
| assets/brand/yy-logo-vertical-korean.svg | 세로 로고(2).svg | 예비 | final |
| assets/brand/yy-logo-vertical-corp.svg | 세로 로고(3).svg | 예비 | final |

- 사본은 원본과 바이트 단위로 동일(`cmp` 확인). `.gitattributes`에서 줄바꿈 변환을 막았다.

### 파생 시안 (미승인 — 사이트 미적용)

| 파일 (public/assets/brand/derived/) | 기준 원본 | 변경 내용 | 상태 |
|---|---|---|---|
| yy-logo-*--mono-charcoal.svg (6개) | 위 6개 사본 | 스타일의 fill 값 2개 → #2b2b2a. path·viewBox 동일 | 반투명 그래픽 전용 |
| yy-logo-*--mono-white.svg (6개) | 위 6개 사본 | 스타일의 fill 값 2개 → #ffffff. path·viewBox 동일 | 반투명 그래픽 전용 |

로고 자리(헤더·메뉴·인트로·로더·푸터)에는 공식 키컬러만 사용한다.
- 색상: 심볼 `#ffc844`, 워드마크 `#f7af22`. 투명 배경. 단색(차콜/흰색) 버전 없음.

## 이미지 · 영상 · 3D

| ID (src/data/assets.ts) | 용도 | 상태 | 필요한 자료 |
|---|---|---|---|
| heroPoster | HOME 인트로 정지 포스터 (PC) | missing | 기준 30ml 세럼병 원본 사진 |
| heroPosterMobile | HOME 인트로 정지 포스터 (모바일 세로) | missing | 같음 |
| phBottleA · phBottleB · phDropperA · phDropperB · phCapA · phCapB · phViewTop · phViewBottom | PRODUCT 목록·상세 기능 검증 | placeholder | 회색 도형 SVG(`public/assets/placeholders/`). 실제 제품 아님 |
| (제품 이미지) | PRODUCT 목록·상세 | missing | 제품별 사진(대표 · 측면 · 후면 · 입구 · 바닥) · 코드 · 규격 |

### 임시 제품 데이터 (`src/data/products.ts`)

- `sample-01`–`sample-14`: 기능 검증용. 유리용기 6 · 드로퍼 5 · 캡 3, ACCESSORIES 0(빈 카테고리 안내 확인용).
- 제품명은 "임시 제품 NN", 코드 · 용량 · 사이즈 · MOQ · 재질은 모두 비어 있음(화면 "—").
- 실제 제품 자료가 오면 배열 전체를 교체한다.
| (공정 사진) | PROCESS | missing | 공정별 사진 · 공식 명칭 |
| (3D 모델) | HOME · PROCESS | missing | 사진 기반 제작 예정 |

## 폴더

- `public/assets/brand` 로고
- `public/assets/products` 제품 사진
- `public/assets/process` 공정 사진
- `public/assets/hero` 인트로 포스터 · 영상 · 시퀀스
- `public/assets/models` GLB 등 3D 모델
- `public/assets/placeholders` 임시 이미지(기능 검증용, 실제 제품 아님)
- `public/references` 3D 제작 참고 사진(사이트에 노출하지 않음)
