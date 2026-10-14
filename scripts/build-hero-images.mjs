/**
 * HOME 인트로 I-1 어두운 유리 접사 (공장 사진 공개 권한 확인 전 대체 자료)
 *   원본(수정하지 않음): 자료/01_기준유리병/사진/YS-SRRR30-04.png (스포이드 없는 기준병, 1600×1600)
 *   사본: public/assets/hero/macro-glass-dark.webp
 * 기준병 몸통만 잘라 명암을 반전 → 검은 바탕에 유리 테두리 반사광만 밝게 남는다. 형태는 바꾸지 않는다.
 *
 * 공정 모션 장면은 scripts/build-process-images.mjs, 스포이드 분리는 scripts/build-dropper-parts.mjs.
 * (스포이드 원본 '드로퍼 피펫.png'는 자료 폴더에서 삭제되어, 정렬된 사본 public/assets/hero/dropper.webp가 유일한 원본이다.)
 * 실행: node scripts/build-hero-images.mjs
 */
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("자료/01_기준유리병/사진/YS-SRRR30-04.png");
const OUT = path.resolve("public/assets/hero/macro-glass-dark.webp");

const t = await sharp(SRC).flatten({ background: "#ffffff" }).trim({ background: "#ffffff", threshold: 14 }).toBuffer({ resolveWithObject: true });
// 목 · 바닥 반사를 뺀 몸통 구간(여백 제거 후 높이 기준 비율)
const top = Math.round(t.info.height * 0.17);
const height = Math.round(t.info.height * 0.62);
await sharp(t.data)
  .extract({ left: 0, top, width: t.info.width, height })
  .negate({ alpha: false })
  .linear(1.15, -12)
  .resize({ height: 1720 })
  .webp({ quality: 88 })
  .toFile(OUT);
const meta = await sharp(OUT).metadata();
console.log(`macro-glass-dark: ${meta.width}×${meta.height}`);
