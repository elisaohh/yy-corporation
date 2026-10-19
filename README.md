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
  data/             콘텐츠 — 메뉴, 문구, 제품, 뉴스레터, 회사 정보, 이미지 등록부
  config/site.ts    전역 설정(히어로 방식, 데모 폼, 임시 표시)
  lib/              폰트(Inter + Pretendard), ?still 도우미
scripts/            이미지 · 영상 변환(자료/ → public/assets/)
public/assets/      사이트에 쓰는 로고 · 사진 · 영상
docs/               HANDOFF(인수인계) · MOTION(모션 명세) · decisions(결정 기록) · asset-inventory(자산 목록) · local-editing(수정 방법)
자료/               원본 사진 · 영상 — Git에 없음, 별도 전달 (자료/README.md)
```

## 콘텐츠 · 자료 바꾸기

- 문구 · 제품 · 뉴스레터: `src/data/`의 해당 파일 — 위치 표는 `docs/HANDOFF.md` 5장.
- 사진 · 영상: 원본을 `자료/`에 같은 이름으로 넣고 `scripts/`의 변환 명령 실행 — `docs/HANDOFF.md` 7장, `자료/README.md`.
- 로고: `public/assets/brand/` 파일 또는 `src/data/brand.ts`.
- 회사 정보: `src/data/company.ts` — 푸터 · CONTACT에 함께 반영.

## 현재 상태 (2026-10-19)

- 화면 · 모션 · 반응형(390px 모바일까지) · 콘텐츠 구조 완료. 뉴스레터 YY NOTES Vol.01 · 02 게시.
- **문의 폼은 실제로 전송되지 않는 데모**입니다(입력 검증 · 제품 자동 채움까지 동작).
- 개인정보 처리방침 게시(`/privacy`, 푸터 · 문의 폼에서 연결).
- 콘텐츠 관리(CMS) · 문의 전송 · 정식 도메인은 다음 단계 — `docs/HANDOFF.md` 12장 요청사항.
