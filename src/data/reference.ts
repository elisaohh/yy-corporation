/**
 * HOME 공정 모션 · PROCESS 3D의 기준 유리병.
 *
 * 기준병은 30ml.
 * 스포이드 없는 사진 시리즈(자료/01_기준유리병/사진/YS-SRRR30-04*.png)와 치수 파일이 같은 코드(YS-SRRR30-04)를 쓴다.
 * ⚠ 남은 확인: 치수 파일(37.0 × 75.8, "YI 클린 RR 30ml")과 제품규격표의 YS-SRRR30-04(38.0 × 74.4, "Y1 단 라운드 RR 30ml")가 다르다.
 *   확인 전까지 화면에 기준병 코드 · 치수를 표시하지 않는다.
 */
export const referenceBottle = {
  code: "YS-SRRR30-04",
  capacity: "30ml",
  neck: "18파이",
  sizeStatus: "conflict" as "conflict" | "confirmed",
  sizeCandidates: ["37.0 × 75.8 (기준유리병 치수 파일)", "38.0 × 74.4 (제품규격표)"],
  images: {
    clear: "procClear",
    finishes: ["procCoating", "procPrinting", "procEtching", "procLabel"],
    dropperCap: "dropperCap",
    dropperPipette: "dropperPipette",
  },
  /** 인쇄 단독 이미지가 없어 "코팅 후 인쇄"로 대체 중 */
  missing: ["YS-SRRR30-04 인쇄(단독)"],
} as const;
