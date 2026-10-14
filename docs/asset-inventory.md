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
| yy-logo-*--mono-charcoal.svg (6개) | 위 6개 사본 | 스타일의 fill 값 2개 → #2b2b2a. path·viewBox 동일 | draft · `/logo-check` 비교용 |
- 색상: 심볼 `#ffc844`, 워드마크 `#f7af22`. 투명 배경. 단색(차콜/흰색) 버전 없음.

## 이미지 · 영상 · 3D

| ID (src/data/assets.ts) | 용도 | 상태 | 필요한 자료 |
|---|---|---|---|
| heroPoster | HOME 인트로 정지 포스터 (PC) | missing | 기준 30ml 세럼병 원본 사진 |
| heroPosterMobile | HOME 인트로 정지 포스터 (모바일 세로) | missing | 같음 |
| (제품 이미지) | PRODUCT 목록·상세 | missing | 제품별 사진 · 코드 · 규격 |
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
