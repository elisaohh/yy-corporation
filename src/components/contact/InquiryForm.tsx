"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Pending } from "@/components/ui/Pending";
import { contactCopy } from "@/data/content";
import { privacyConsentSummary } from "@/data/privacy";
import { getProductById, productInquiryLabel } from "@/data/products";

/**
 * 문의 폼 — 기획서 2.0 부록 G.
 * 필수: 회사명·브랜드명 · 담당자명 · 이메일 · 연락처 · 문의 내용 · 개인정보 동의
 * 선택: 관심 제품 · 예상 발주 수량   (문의 유형 · 파일 첨부는 첫 버전에서 제외)
 *
 * 실제 전송은 하지 않는다. 데이터 모델(InquiryData)과 제출 처리(submitInquiry)를 분리해
 * 운영 단계에서 이메일 수신형으로 바꿀 때 submitInquiry만 교체한다.
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
}

type FieldName = keyof InquiryData;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: InquiryData = {
  company: "",
  name: "",
  email: "",
  phone: "",
  product: "",
  quantity: "",
  message: "",
  consent: false,
};

const ORDER: FieldName[] = ["company", "name", "email", "phone", "product", "quantity", "message", "consent"];

function validate(data: InquiryData): Errors {
  const errors: Errors = {};
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
  return errors;
}

/** 프로토타입: 실제 전송 없이 처리 시간만 흉내 낸다 */
async function submitInquiry(_data: InquiryData): Promise<"demo"> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return "demo";
}

export function InquiryForm() {
  const params = useSearchParams();
  const uid = useId();
  const [data, setData] = useState<InquiryData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "demo">("idle");
  const [prefilled, setPrefilled] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // PRODUCT 상세에서 넘어오면 제품 코드 자동 입력
  useEffect(() => {
    const id = params.get("product");
    const product = id ? getProductById(id) : undefined;
    if (product) {
      setData((prev) => ({ ...prev, product: productInquiryLabel(product) }));
      setPrefilled(true);
    }
  }, [params]);

  useEffect(() => {
    if (status === "demo") resultRef.current?.focus();
  }, [status]);

  const fieldId = (name: FieldName) => `${uid}-${name}`;

  const update = (name: FieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = name === "consent" ? (event.target as HTMLInputElement).checked : event.target.value;
    const next = { ...data, [name]: value } as InquiryData;
    setData(next);
    if (status === "demo") setStatus("idle");
    if (touched[name] || errors[name]) setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }));
  };

  const blur = (name: FieldName) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(data)[name] }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const found = validate(data);
    setErrors(found);
    setTouched(Object.fromEntries(ORDER.map((name) => [name, true])));
    const first = ORDER.find((name) => found[name]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`)?.focus();
      return;
    }
    setStatus("submitting");
    await submitInquiry(data);
    setStatus("demo");
  };

  const textField = (
    name: Exclude<FieldName, "consent" | "message">,
    label: string,
    options: { required?: boolean; type?: string; autoComplete?: string; inputMode?: "numeric" | "tel" | "email"; hint?: string } = {},
  ) => {
    const error = errors[name];
    const hintId = `${fieldId(name)}-hint`;
    const errorId = `${fieldId(name)}-error`;
    const describedBy = [options.hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
    return (
      <div className="grid min-w-0 gap-2">
        <label htmlFor={fieldId(name)} className="text-[14px] font-medium">
          {label}
          <span className="ml-1.5 text-[12px] font-normal text-ash">{options.required ? "필수" : "선택"}</span>
        </label>
        <input
          id={fieldId(name)}
          name={name}
          type={options.type ?? "text"}
          autoComplete={options.autoComplete}
          inputMode={options.inputMode}
          value={data[name]}
          onChange={update(name)}
          onBlur={blur(name)}
          required={options.required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`h-12 w-full border bg-paper px-4 text-[15px] text-charcoal transition-[border-color,box-shadow] duration-200 placeholder:text-ash/70 focus:border-charcoal focus:outline-2 focus:outline-offset-0 focus:outline-charcoal ${
            error ? "border-charcoal shadow-[inset_3px_0_0_var(--color-point-4008)]" : "border-stone hover:border-ash"
          }`}
        />
        {options.hint && (
          <p id={hintId} className="text-[13px] text-ash">
            {options.hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-[13px] text-charcoal">
            {error}
          </p>
        )}
      </div>
    );
  };

  const messageError = errors.message;
  const consentError = errors.consent;
  const submitting = status === "submitting";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {textField("company", "회사명 · 브랜드명", { required: true, autoComplete: "organization" })}
        {textField("name", "담당자명", { required: true, autoComplete: "name" })}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {textField("email", "이메일", { required: true, type: "email", autoComplete: "email", inputMode: "email" })}
        {textField("phone", "연락처", { required: true, type: "tel", autoComplete: "tel", inputMode: "tel" })}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {textField("product", "관심 제품", {
          hint: prefilled ? "선택하신 제품이 자동으로 입력되었습니다. 수정할 수 있습니다." : "제품 코드를 적어 주세요.",
        })}
        {textField("quantity", "예상 발주 수량", { hint: "예: 5,000개" })}
      </div>

      <div className="grid gap-2">
        <label htmlFor={fieldId("message")} className="text-[14px] font-medium">
          문의 내용
          <span className="ml-1.5 text-[12px] font-normal text-ash">필수</span>
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={6}
          value={data.message}
          onChange={update("message")}
          onBlur={blur("message")}
          required
          aria-invalid={messageError ? true : undefined}
          aria-describedby={messageError ? `${fieldId("message")}-error` : undefined}
          className={`w-full resize-y border bg-paper px-4 py-3 text-[15px] leading-[1.7] text-charcoal transition-[border-color,box-shadow] duration-200 focus:border-charcoal focus:outline-2 focus:outline-offset-0 focus:outline-charcoal ${
            messageError ? "border-charcoal shadow-[inset_3px_0_0_var(--color-point-4008)]" : "border-stone hover:border-ash"
          }`}
        />
        {messageError && (
          <p id={`${fieldId("message")}-error`} className="text-[13px] text-charcoal">
            {messageError}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <div className="flex items-start gap-3">
          <input
            id={fieldId("consent")}
            name="consent"
            type="checkbox"
            checked={data.consent}
            onChange={update("consent")}
            onBlur={blur("consent")}
            aria-invalid={consentError ? true : undefined}
            aria-describedby={consentError ? `${fieldId("consent")}-error` : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-charcoal"
          />
          <label htmlFor={fieldId("consent")} className="cursor-pointer text-[14px] leading-[1.6]">
            개인정보 수집 · 이용에 동의합니다. <span className="text-ash">(필수)</span>
          </label>
        </div>
        <details className="ml-8 text-[13px] text-ash">
          <summary className="w-fit cursor-pointer py-1 underline underline-offset-4">수집 항목과 이용 목적 보기</summary>
          <div className="mt-2 border-l border-stone pl-4 leading-[1.7]">
            <dl className="grid gap-1">
              {privacyConsentSummary.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3">
                  <dt>{k}</dt>
                  <dd className="text-charcoal/80">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/privacy" target="_blank" className="mt-2 inline-block underline underline-offset-4 hover:text-charcoal">
              개인정보 처리방침 전문 보기
            </Link>
          </div>
        </details>
        {consentError && (
          <p id={`${fieldId("consent")}-error`} className="ml-8 text-[13px] text-charcoal">
            {consentError}
          </p>
        )}
      </div>

      <div>
        <button type="submit" disabled={submitting} className="btn btn-primary w-full md:w-auto md:min-w-48">
          {submitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              처리 중
            </>
          ) : (
            "문의 보내기"
          )}
        </button>
      </div>

      <div role="status" aria-live="polite">
        {status === "demo" && (
          <div
            ref={resultRef}
            tabIndex={-1}
            className="fade-in bg-mist px-5 py-4 text-[14px] leading-[1.7] shadow-[inset_3px_0_0_var(--color-charcoal)] outline-none"
          >
            <p className="font-medium">{contactCopy.demoResultTitle}</p>
            <p className="mt-1 text-ash">
              {contactCopy.demoResultBody} <Pending label="연락처 확인 필요" />
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
