/**
 * 문의 폼 데이터와 검사 규칙(InquiryForm).
 */

export interface InquiryData {
  company: string;
  name: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  message: string;
  consent: boolean;
  /** 광고성 정보 수신 동의(선택) */
  marketing: boolean;
}

export type InquiryField = keyof InquiryData;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

/** 칸별 최대 글자 수 — 너무 긴 입력(스팸)을 막는다 */
type TextField = Exclude<InquiryField, "consent" | "marketing">;

export const INQUIRY_MAX: Record<TextField, number> = {
  company: 100,
  name: 50,
  email: 120,
  phone: 30,
  product: 100,
  quantity: 50,
  // 메일 앱으로 넘길 수 있는 길이에 맞춤
  message: 1500,
};

export function validateInquiry(data: InquiryData): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!data.company.trim()) errors.company = "회사명 또는 브랜드명을 입력해 주세요.";
  if (!data.name.trim()) errors.name = "담당자 성함을 입력해 주세요.";
  if (!data.email.trim()) errors.email = "이메일을 입력해 주세요.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = "이메일 주소 형식을 확인해 주세요. 예: name@company.com";
  const digits = data.phone.replace(/\D/g, "");
  if (!data.phone.trim()) errors.phone = "연락처를 입력해 주세요.";
  else if (!/^[\d\s+()-]+$/.test(data.phone) || digits.length < 9)
    errors.phone = "숫자와 하이픈(-)으로 입력해 주세요. 예: 010-1234-5678";
  if (!data.message.trim()) errors.message = "문의 내용을 입력해 주세요.";
  if (!data.consent) errors.consent = "개인정보 수집·이용에 동의해야 문의를 보낼 수 있습니다.";
  for (const [field, max] of Object.entries(INQUIRY_MAX) as [TextField, number][]) {
    if (!errors[field] && data[field].length > max) errors[field] = `${max}자 이내로 입력해 주세요.`;
  }
  return errors;
}
