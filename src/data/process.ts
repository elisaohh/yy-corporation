/**
 * PROCESS 콘텐츠 구조 — 기획서 2.0 부록 F + 콘텐츠 제작 가이드(엑셀) PROCESS 시트.
 *
 * 핵심 공정 4종(코팅 · 인쇄 · 부식 · 라벨): 엑셀의 공정 순서를 기준으로 한다.
 *   steps 는 엑셀 원문 순서를 그대로 옮겼다. 화면에는 2–3문장 요약 + 단계 흐름(접힘)으로 보여 준다.
 * 추가 공정(핫스탬핑 · UV · 실크인쇄 · 스프레이 · 메탈라이징): 실제 제공 여부 확정 전 — 별도 관리, 공식 서비스로 표기하지 않는다.
 *
 * 이미지: 후가공 결과 이미지는 같은 기준 유리병에 효과를 적용한 생성 이미지다.
 */

export interface ProcessStep {
  ko: string;
  en: string;
}

export interface FinishingProcess {
  key: "coating" | "printing" | "etching" | "labeling";
  /** 탭 · 제목 (영문) */
  name: string;
  nameKo: string;
  /** 한 줄 설명 */
  line: string;
  /** 2–3문장 요약 — 회사 검토 전 임시 초안 */
  summary: { text: string | null; status: "draft" | "final" | "missing" };
  /** 엑셀 원문 순서 */
  steps: ProcessStep[];
  /** 생성 예시 이미지 (public/assets/hero) */
  exampleImage: string;
}

export const finishingProcesses: FinishingProcess[] = [
  {
    key: "coating",
    name: "COATING",
    nameKo: "코팅",
    line: "투명 · 그라데이션 · 불투명 등 표면 표현",
    summary: { text: null, status: "missing" },
    steps: [
      { ko: "제품 입고", en: "Incoming Inspection" },
      { ko: "투입", en: "Line Loading" },
      { ko: "화염 처리", en: "Flame Treatment" },
      { ko: "프라이머", en: "Primer Application" },
      { ko: "코팅", en: "Main Coating" },
      { ko: "건조", en: "Drying & Curing" },
      { ko: "검사", en: "Quality Control" },
      { ko: "포장", en: "Packaging & Delivery" },
    ],
    exampleImage: "/assets/hero/proc-coating.webp",
  },
  {
    key: "printing",
    name: "PRINTING",
    nameKo: "인쇄",
    line: "용기 표면의 로고 · 문자 인쇄",
    summary: { text: null, status: "missing" },
    steps: [
      { ko: "그래픽 파일 검토", en: "Pre-Press Data Check" },
      { ko: "필름 & 인쇄판 제작", en: "Plate Making / CTP" },
      { ko: "잉크 투입 및 준비", en: "Ink Supply & Setup" },
      { ko: "본 인쇄", en: "Press / Printing" },
      { ko: "건조", en: "Drying" },
      { ko: "품질 검사", en: "Quality Inspection / QC" },
      { ko: "포장 및 출하", en: "Packaging & Logistics" },
    ],
    exampleImage: "/assets/hero/proc-printing.webp",
  },
  {
    key: "etching",
    name: "ETCHING",
    nameKo: "부식",
    line: "표면의 반투명 · 무광 질감",
    summary: { text: null, status: "missing" },
    steps: [
      { ko: "부식액 배합", en: "Etching Solution Mixing" },
      { ko: "공병 투입", en: "Bottle Loading" },
      { ko: "부식 반응", en: "Etching Reaction" },
      { ko: "수세척", en: "Water Rinsing" },
      { ko: "건조", en: "Drying" },
      { ko: "검사", en: "Quality Inspection" },
      { ko: "적재 및 후속 공정 이동", en: "Stacking & Transfer" },
    ],
    exampleImage: "/assets/hero/proc-etching.webp",
  },
  {
    key: "labeling",
    name: "LABELING",
    nameKo: "라벨",
    line: "용기 표면에 부착된 라벨의 형태",
    summary: { text: null, status: "missing" },
    steps: [
      { ko: "표면 전처리 및 세척", en: "Surface Cleaning & Prep" },
      { ko: "라벨 투입 및 원단 점검", en: "Label Feeding & Inspection" },
      { ko: "용기 정렬 및 위치 제어", en: "Bottle Orientation & Alignment" },
      { ko: "라벨 박리 및 부착", en: "Label Dispensing & Application" },
      { ko: "정밀 압착 및 롤링", en: "Pressing & Bubble Removal" },
      { ko: "품질 검사", en: "Quality Control / QC" },
      { ko: "적재 및 포장", en: "Packaging & Transport" },
    ],
    exampleImage: "/assets/hero/proc-label.webp",
  },
];

/** PROCESS 페이지 머리말 — 엑셀 ABOUT 시트 ② 회사 소개(정밀 후가공) 문장 */
export const processIntro = {
  title: "Process",
  lead: "코팅, 실크스크린, 박, 형압 등 브랜드의 아이덴티티와 감성을 살리는 후가공을 통합 관리합니다.",
  source: "엑셀 ABOUT 시트 ② 회사 소개",
};
