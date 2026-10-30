# YY CORPORATION 웹사이트 프로토타입

화장품 패키징 B2B 기업 YY CORPORATION의 인터랙티브 웹사이트 프로토타입입니다.
**처음 보는 분은 `docs/HANDOFF.md`(인수인계 문서)부터 읽어 주세요** — 구조 · 콘텐츠 수정 위치 · 이미지 파이프라인 · 디자인 토큰 · 모션 · 남은 요청사항이 정리돼 있습니다.

기획 기준은 `기획서.md`(v2.0), 결정 기록은 `docs/decisions.md`, 로컬 수정 방법은 `docs/local-editing.md`에 있습니다.

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
  app/              페이지 — HOME, about/company, about/story, products, process, contact
  components/       layout(헤더 · 메뉴 · 푸터 · 머리 영역) · home · about · story · product · process · contact
  data/             콘텐츠 — 메뉴, 문구, 제품, 회사 정보, 이미지 등록부
content/            제품 목록(products.json) · 뉴스레터(story/)
  config/site.ts    전역 설정(히어로 방식, 데모 폼, 임시 표시)
  lib/              폰트(Inter + Pretendard), ?still 도우미
scripts/            이미지 · 영상 변환(자료/ → public/assets/)
public/assets/      사이트에 쓰는 로고 · 사진 · 영상
docs/               HANDOFF(인수인계) · MOTION(모션 명세) · decisions(결정 기록) · asset-inventory(자산 목록) · local-editing(수정 방법)
자료/               원본 사진 · 영상 — Git에 없음, 별도 전달 (자료/README.md)
```

## 콘텐츠 · 자료 바꾸기

- 문구: `src/data/`의 해당 파일 — 위치 표는 `docs/HANDOFF.md` 5장.
- 제품 · 홈 노출: `content/products.json`. 뉴스레터: `content/story/` — `docs/HANDOFF.md` 6장.
- 사진 · 영상: 원본을 `자료/`에 같은 이름으로 넣고 `scripts/`의 변환 명령 실행 — `docs/HANDOFF.md` 7장, `자료/README.md`.
- 로고: `public/assets/brand/` 파일 또는 `src/data/brand.ts`.
- 회사 정보: `src/data/company.ts` — 푸터 · CONTACT에 함께 반영.

## 현재 상태 (2026-10-29)

- 화면 · 모션 · 반응형(390px 모바일까지) · 콘텐츠 구조 완료. 뉴스레터 YY LETTER Vol.01 · 02 게시.
- 개인정보 처리방침(`/privacy`) · 이용약관(`/terms`) 게시 — 푸터 · 문의 폼에서 연결. 사진 · 영상은 오른쪽 클릭 · 끌기 · 길게 눌러 저장 차단(화면 캡처는 막을 수 없음).
- 콘텐츠 관리 · 문의 전송 · 정식 도메인은 디자인 업체가 구현 — `docs/HANDOFF.md` 12장 요청사항.
- 카페24 웹호스팅에 올리기: `npm run export` → `export/*.zip` — 업체 안내는 `docs/CAFE24.md`.
