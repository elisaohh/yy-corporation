# YY CORPORATION 웹사이트 프로토타입

화장품 패키징 B2B 기업 YY CORPORATION의 인터랙티브 웹사이트 프로토타입입니다.
기획 기준은 `기획서.md`(v2.0), 결정 기록은 `docs/decisions.md`, 자산 현황은 `docs/asset-inventory.md`에 있습니다.

## 실행

Node.js 20.9 이상이 필요합니다.

```bash
npm install
```

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (수정 사항이 바로 반영됨) |
| `npm run build` | 배포용 빌드 및 검증 |
| `npm run start` | 빌드 결과 실행 |
| `npm run typecheck` | 타입 검사 |

## 구조

```text
src/
  app/              페이지 (HOME, about, products, process, contact)
  components/
    brand/          로고
    layout/         헤더, 모바일 메뉴, 푸터, TOP 버튼
    ui/             공통 UI (확인 필요 표시 등)
  config/site.ts    인트로 방식, 데모 폼, 임시 표시 등 전역 설정
  data/             메뉴, 로고, 회사 정보, 카테고리, 자산 등록부
  lib/fonts.ts      Inter + Pretendard
public/assets/      로고, 제품, 공정, 인트로, 3D 자산
```

## 자료 교체

- **로고**: `public/assets/brand/`의 파일을 교체하거나 `src/data/brand.ts`의 경로를 바꿉니다. 위치별 로고 배정도 같은 파일에서 바꿉니다.
- **회사 정보**: `src/data/company.ts`에 확인된 값만 입력합니다. 비어 있으면 화면에 "확인 필요"가 표시됩니다.
- **이미지·영상·3D**: 파일을 `public/assets/<분류>/`에 넣고 `src/data/assets.ts`의 `src`와 `status`를 바꿉니다.
- **임시 표시 끄기**: `src/config/site.ts`의 `showPlaceholderLabels`를 `false`로 바꿉니다.

## 현재 단계

1. 공통 기반 — 헤더 · 모바일 메뉴 · 푸터 · 페이지 전환 · 5개 경로 ✓
2. 정보 흐름 — PRODUCT 목록(탭 · LOAD MORE · 빈 카테고리) · 상세(갤러리 · 규격 · 문의) · CONTACT(자동 입력 · 검증 · 데모 안내) ✓
3. HOME 첫 시안 — 인트로(포스터 자리) · 임시 전환 · 슬로건 · FIND/DRESS/MATCH/DELIVER · 대표 제품 · 차콜 CTA ✓
4. 모션 · 3D — 인트로 고정 연출, 반사광 전환, 가로 스크롤, PROCESS 동기화 (예정)

제품은 모두 기능 검증용 임시 데이터입니다. 문의 폼은 실제로 전송되지 않는 데모입니다.
