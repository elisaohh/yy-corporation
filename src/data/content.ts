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
  /** 문의 내용 칸 아래 안내 */
  messageHint: "참고 사진을 보내 주시면 대체 용기를 제안해 드립니다.",
};
