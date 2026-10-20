# 로컬에서 직접 수정하기

## 1. 준비 (처음 한 번)

1. **VS Code** 설치: https://code.visualstudio.com
2. VS Code에서 `파일 → 폴더 열기` → `바탕화면\yy-corporation`
3. 위 메뉴 `터미널 → 새 터미널`을 열고 아래 실행 (Node.js는 이미 설치되어 있음)
   PowerShell에서는 보안 설정 때문에 `npm` 대신 `npm.cmd`를 쓴다(터미널을 Command Prompt로 바꾸면 `npm` 그대로 가능).

```bash
npm.cmd install
```

## 2. 실행해서 보기

```bash
npm.cmd run dev
```

브라우저에서 http://localhost:3000 을 연다. 파일을 저장하면 화면이 자동으로 바뀐다. 끝낼 때는 터미널에서 `Ctrl + C`.

## 3. 무엇을 어디서 고치나

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 메뉴 · ABOUT 하위 메뉴(COMPANY · STORY) | `src/data/navigation.ts` |
| HOME 문구 (히어로, 회사 소개, 공정 모션 장면, 슬로건, CTA) | `src/data/home.ts` |
| ABOUT › COMPANY 문구 · 사진 | `src/data/about.ts` |
| ABOUT › STORY 뉴스레터 글 | 메일 HTML 파일을 `content/story/vol-NN.html`로 넣기 (`docs/HANDOFF.md` 6장) |
| 제품 목록 · 규격 · 이름 · 카테고리 | `src/data/products.ts` · `categories.ts` · `productImages.ts` |
| PROCESS 소개 · 공정 이름 · 단계 | `src/data/process.ts` |
| PROCESS TURN-KEY 4항목 · 사진 | `src/components/process/OneStopSystem.tsx` 위쪽 `sections` |
| PROCESS · PRODUCT 제목 배경 | `src/app/process/page.tsx`의 `INTRO_VIDEO`, `src/app/products/page.tsx`의 `INTRO_IMAGE` |
| CONTACT 문구 · 문의 결과 안내 | `src/data/content.ts` |
| 개인정보 처리방침 · 문의 폼 동의 요약 | `src/data/privacy.ts` |
| 이용약관 | `src/data/terms.ts` |
| 회사 정보 (주소 · 전화 · 이메일 — 푸터 · CONTACT 공통) | `src/data/company.ts` |
| 색 · 글꼴 · 간격 | `src/app/globals.css` 맨 위 `@theme` |
| 로고 위치별 배정 · 크기 | `src/data/brand.ts` |
| 이미지 등록부(HOME 공정 모션 등) | `src/data/assets.ts` |
| "임시" · "확인 필요" 표시 켜기/끄기 | `src/config/site.ts` → `showPlaceholderLabels` |

### 모션 조절

- **로딩 · 히어로** `src/components/home/HeroFloat.tsx`
  - 로고 차오름 `duration: 0.8`, 머무름 `{ duration: 0.6 }`, 커튼 걷힘 `0.9`.
  - 물방울 떠다니는 폭 `random(14, 24)`(세로) · `12`(가로) · `6`(회전), 마우스 반응 `nx * 22`.
  - 사진 최대 폭 `MAX_W = 1240`, 제목 크기 `md:text-[clamp(52px,7.4vw,122px)]`.
- **HOME 공정 모션** `src/components/home/ProcessMotion.tsx`
  - PC 고정 구간 길이 `window.innerHeight * (desktop ? 4.4 : 3.6)` — 클수록 느려짐.
  - `scrub: 0.8` 스크롤 따라오는 부드러움, `snap` 공정마다 멈춤.
  - `SWEEP = 1.5`(공정 하나가 지나가는 시간) · `STEP = 1.9`(공정 간격).
  - 모바일(1024px 미만)은 고정 없이 공정 이름을 누르면 재생 — 재생 시간 `tweenTo(..., { duration: 1.4 })`.
  - 피펫 불투명도 `PIPETTE_OPACITY`, 라벨이 피펫을 가리는 높이 `src/data/home.ts`의 `labelBand`.
- **PROCESS 사진 띠** `src/components/process/StripAccordion.tsx` — 펼친 띠 비율 `flexGrow: on ? 6 : 1`.
- **PROCESS 제목 영상** `src/app/process/page.tsx`의 `INTRO_VIDEO` — 시작 `start: 8`, 확대 `zoom: 1.25`(1.3 이하 권장), 위치 `focus`.
- **STORY 한 쪽 카드 수** `src/components/story/StoryBoard.tsx`의 `PER_PAGE = 9`.

## 4. 이미지 바꾸기

원본은 `자료/` 폴더에 두고(수정하지 않음) 아래 스크립트로 웹용 사본을 다시 만든다. 파일마다 어디에 쓰이는지는 `자료/README.md`에 정리돼 있다.

| 대상 | 명령 |
|---|---|
| 제품 사진 (`자료/03_제품/제품사진/코드_01.png` …) | `node scripts/build-product-images.mjs` |
| 공정 모션 병 이미지 (`자료/01_기준유리병/사진/YS-SRRR30-04*.png`) | `node scripts/build-process-images.mjs` |
| 스포이드 캡 · 피펫 분리 | `node scripts/build-dropper-parts.mjs` |
| PROCESS 턴키 사진 (`자료/02_후가공/작업사진/glass-01.jpg` … `spray-01.jpg`) | `node scripts/build-onestop-photos.mjs` |
| ABOUT 사진 (`자료/08_ABOUT/`) | `node scripts/build-about-images.mjs` |
| PROCESS 제목 배경 영상 (`자료/09_PROCESS/process-intro.mp4`) | `public/assets/process/process-intro.mp4`에 같은 이름으로 복사 (시작 8초 · 확대는 `src/app/process/page.tsx`의 `INTRO_VIDEO`) |
| 히어로 사진 (`자료/07_히어로/히어로_병_물방울.webp`) → 병 층 + 물방울 분리 | `node scripts/build-hero-layers.mjs` |

공정 장면에 쓰는 파일 이름은 `scripts/build-process-images.mjs` 위쪽 `scenes` 목록에서 바꾼다.

## 5. 저장 기록 · 되돌리기 (Git)

```bash
git status
```

```bash
git add -A
```

```bash
git commit -m "수정 내용 한 줄"
```

마지막으로 커밋한 상태로 모두 되돌리기(저장 안 한 수정은 사라짐):

```bash
git restore .
```

VS Code 왼쪽 "소스 제어" 아이콘에서도 같은 작업을 버튼으로 할 수 있다.

## 6. 수정 후 확인

```bash
npm.cmd run build
```

오류 없이 끝나면 배포 가능한 상태다.

## 7. 남은 확인 · 할 일

- 기준병 치수 확정: 37.0 × 75.8(치수 파일) vs 38.0 × 74.4(제품규격표)
- HOME 공정 모션 인쇄 단독 이미지(현재 코팅 후 인쇄로 대체)
- 현장 사진 공개 권한 — `docs/asset-inventory.md` "공개 전 확인할 것"
- 개인정보 처리방침 제5조 수탁자 · 위탁업무 `[ ]` 칸 채우기(문의 접수 서비스 확정 후)
- `/logo-check` 페이지 · 미사용 코드는 배포 전 삭제 — `docs/HANDOFF.md` 11장
- 기능 추가 요청(STORY · PRODUCT 관리, 문의 전송) — `docs/HANDOFF.md` 12장
- 결정 기록: `docs/decisions.md`, 자산 현황: `docs/asset-inventory.md`, 원본 쓰임: `자료/README.md`
