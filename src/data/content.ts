/**
 * 페이지 문구. 확정되지 않은 문구는 status로 구분하고, 화면에 "임시 초안" 표시를 붙인다.
 * 공식 카피가 오면 text와 status만 바꾼다.
 */

export type CopyStatus = "final" | "draft" | "missing";

export interface Copy {
  text: string | null;
  status: CopyStatus;
  source?: string;
}

export const contactCopy = {
  title: { text: "LET'S WORK TOGETHER.", status: "draft", source: "기획서 2.0 §4.5 초안" } as Copy,
  intro: { text: "제품, 후가공, 예상 수량 등 패키징에 관한 문의를 남겨 주세요.", status: "draft", source: "2026-10-15 임시 초안" } as Copy,
  /** 데모 상태 안내 — 기획서 2.0 부록 G: 실제 접수된 것처럼 오해할 문구 금지 */
  demoNotice: "이 페이지는 시연용입니다. 보내기를 눌러도 문의가 실제로 전송되지 않습니다.",
  demoResultTitle: "데모 화면입니다.",
  demoResultBody: "입력하신 내용은 저장되거나 전송되지 않았습니다. 실제 문의는 회사 대표 연락처로 해 주세요.",
  privacySummary: null as string | null,
};
