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
| HOME 문구 (회사 소개, CTA, 슬로건, 히어로) | `src/data/home.ts` |
| ABOUT 문구 | `src/data/about.ts` |
| PROCESS 소개 · 현장 문구 · 공정 설명 | `src/data/process.ts` |
| 제품 목록 · 규격 · 이름 | `src/data/products.ts` |
| 회사 정보 (주소 · 전화 · 이메일) | `src/data/company.ts` |
| 공정 이름 · 설명 · 단계 | `src/data/process.ts` |
| 색 · 글꼴 · 간격 | `src/app/globals.css` 맨 위 `@theme` |
| 로고 위치별 배정 · 크기 | `src/data/brand.ts` |
| 이미지 경로 | `src/data/assets.ts` |
| "임시" · "확인 필요" 표시 끄기 | `src/config/site.ts` → `showPlaceholderLabels: false` |

### 모션 속도 조절

- **히어로** `src/components/home/HeroFloat.tsx` (문구는 `src/data/home.ts`의 `hero`)
  - 로딩 진행선 `duration: 0.85`, 화면 걷힘 `0.8`, 물방울 자동 움직임 폭 `random(14, 24)`(세로) · `12`(가로) · `6`(회전), 마우스 반응 `nx * 22` 등 숫자를 바꾼다.
  - 사진 최대 폭 `MAX_W`, 제목 크기 `md:text-[clamp(52px,7.4vw,122px)]`
- **피펫 불투명도** 공정 모션 `ProcessMotion.tsx`의 `PIPETTE_OPACITY`
- **공정 모션** `src/components/home/ProcessMotion.tsx`
  - `window.innerHeight * (desktop ? 3.4 : 2.6)` → 고정 구간 길이(화면 수). 크면 느려진다.
  - `scrub: 1.4` → 클수록 스크롤을 더 부드럽게(늦게) 따라온다.
  - `SWEEP = 1.15`, `STEP = 1.5` → 공정 하나가 지나가는 시간 / 공정 간격.

## 4. 이미지 바꾸기

원본은 `자료/` 폴더에 두고(수정하지 않음) 아래 스크립트로 웹용 사본을 다시 만든다. 파일마다 어디에 쓰이는지는 `자료/README.md`에 정리돼 있다.

| 대상 | 명령 |
|---|---|
| 제품 사진 (`자료/03_제품/제품사진/코드_01.png` …) | `node scripts/build-product-images.mjs` |
| 공정 모션 병 이미지 (`자료/01_기준유리병/사진/YS-SRRR30-04*.png`) | `node scripts/build-process-images.mjs` |
| 스포이드 캡 · 피펫 분리 | `node scripts/build-dropper-parts.mjs` |
| PROCESS 턴키 사진 (`자료/02_후가공/작업사진/glass-01.jpg` … `spray-01.jpg`) | `node scripts/build-onestop-photos.mjs` |
| ABOUT 사진 (`자료/08_ABOUT/`) | `node scripts/build-about-images.mjs` |
| STORY 뉴스레터 사진 (`자료/10_STORY/vol01-01.jpg` …) · 글은 `src/data/story.ts` | `node scripts/build-story-images.mjs` |
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

## 7. 다음에 할 일 (기록)

- 기준병 치수 확정: 37.0×75.8(치수 파일) vs 38.0×74.4(제품규격표)
- 인쇄 단독 이미지(현재 코팅 후 인쇄로 대체)
- SRRR20-01의 MOQ · 재질 출처 확인
- 공장 사진 공개 권한, 개인정보처리방침 문서
- `/logo-check` 페이지는 배포 전 삭제
- 결정 기록: `docs/decisions.md`, 자료 현황: `docs/asset-inventory.md`
