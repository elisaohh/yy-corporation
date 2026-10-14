/**
 * HOME 공정 모션 · PROCESS 3D의 기준 유리병.
 *
 * 2026-10-14 자료 갱신: 기준병 사진이 "YS-SRRR30-01.png"(30ml)로 바뀌었다.
 * ⚠ 확인 필요 — 자료끼리 코드 · 치수가 맞지 않는다.
 *   - 사진 파일명: YS-SRRR30-01
 *   - 자료/01_기준유리병/치수: YS-SRRR30-04 · 30ml · 37.0 × 75.8 · "YI 클린 RR 30ml" · MOQ 5000 · 유리 · 넥 18파이
 *   - 자료/03_제품/제품규격: YS-SRRR30-04 = "Y1 단 라운드 RR 30ml" · 38.0 × 74.4
 * 확인 전까지 화면 · 제품 데이터에는 이 코드와 치수를 쓰지 않는다.
 */
export const referenceBottle = {
  status: "conflict" as "conflict" | "confirmed",
  capacity: "30ml",
  neck: "18파이",
  codeCandidates: ["YS-SRRR30-01 (사진 파일명)", "YS-SRRR30-04 (치수 파일)"],
  sizeCandidates: ["37.0 × 75.8 (치수 파일)", "38.0 × 74.4 (제품규격 — 30-04)"],
  images: {
    clear: "heroBottleClear",
    finishes: ["finishCoating", "finishPrinting", "finishEtching", "finishLabel"],
    dropper: "dropperPart",
  },
  /** 아직 없는 자료 — 부자재 체결 장면용 */
  missing: ["스포이드 없는 병(투명 · 같은 각도 · 같은 크기)"],
} as const;
