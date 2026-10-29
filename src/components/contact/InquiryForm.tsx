"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { company } from "@/data/company";
import { contactCopy } from "@/data/content";
import { privacyConsentSummary } from "@/data/privacy";
import { getProductById, productInquiryLabel } from "@/data/products";
import { validateInquiry, type InquiryData, type InquiryErrors, type InquiryField } from "@/lib/inquiry";

/**
 * 문의 폼 — 기획서 2.0 부록 G.
 * 필수: 회사명·브랜드명 · 담당자명 · 이메일 · 연락처 · 문의 내용 · 개인정보 동의
 * 선택: 관심 제품 · 예상 발주 수량   (문의 유형 · 파일 첨부는 첫 버전에서 제외)
 *
 * 보내기 → 방문자의 메일 앱이 열리고 받는 사람(회사 메일) · 제목 · 내용이 채워진다. 방문자가 메일 앱에서 보낸다.
 * 메일 앱이 없을 때를 위해 주소 · 내용 복사 버튼을 함께 보여 준다. 검사 규칙은 lib/inquiry.ts.
 */

type FieldName = InquiryField;
type Errors = InquiryErrors;

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

const validate = validateInquiry;

const MAIL_TO = company.email ?? "";

/** 메일 제목 · 본문 */
function composeMail(data: InquiryData) {
  const subject = `[홈페이지 문의] ${data.company.trim()} · ${data.name.trim()}${data.product.trim() ? ` · ${data.product.trim()}` : ""}`;
  const body = [
    `회사명 · 브랜드명: ${data.company.trim()}`,
    `담당자명: ${data.name.trim()}`,
    `이메일: ${data.email.trim()}`,
    `연락처: ${data.phone.trim()}`,
    `관심 제품: ${data.product.trim() || "—"}`,
    `예상 발주 수량: ${data.quantity.trim() || "—"}`,
    "",
    "문의 내용:",
    data.message.trim(),
    "",
    "개인정보 수집 · 이용 동의: 예",
  ].join("\n");
  return { subject, body };
}

export function InquiryForm() {
  const params = useSearchParams();
  const uid = useId();
  const [data, setData] = useState<InquiryData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "opened">("idle");
  const [copied, setCopied] = useState<"" | "address" | "body">("");
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
    if (status === "opened") resultRef.current?.focus();
  }, [status]);

  const fieldId = (name: FieldName) => `${uid}-${name}`;

  const update = (name: FieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = name === "consent" ? (event.target as HTMLInputElement).checked : event.target.value;
    const next = { ...data, [name]: value } as InquiryData;
    setData(next);
    if (status === "opened") setStatus("idle");
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
    // 방문자의 메일 앱 열기 — 받는 사람 · 제목 · 내용 채움
    const { subject, body } = composeMail(data);
    window.location.href = `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setCopied("");
    setStatus("opened");
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
  const copy = async (what: "address" | "body") => {
    const { subject, body } = composeMail(data);
    try {
      await navigator.clipboard.writeText(what === "address" ? MAIL_TO : `${subject}\n\n${body}`);
      setCopied(what);
    } catch {
      setCopied("");
    }
  };

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative grid gap-6">
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
          aria-describedby={[`${fieldId("message")}-hint`, messageError ? `${fieldId("message")}-error` : null].filter(Boolean).join(" ")}
          className={`w-full resize-y border bg-paper px-4 py-3 text-[15px] leading-[1.7] text-charcoal transition-[border-color,box-shadow] duration-200 focus:border-charcoal focus:outline-2 focus:outline-offset-0 focus:outline-charcoal ${
            messageError ? "border-charcoal shadow-[inset_3px_0_0_var(--color-point-4008)]" : "border-stone hover:border-ash"
          }`}
        />
        <p id={`${fieldId("message")}-hint`} className="text-[13px] text-ash">
          {contactCopy.messageHint}
        </p>
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
        <button type="submit" className="btn btn-primary w-full md:w-auto md:min-w-48">
          문의 보내기
        </button>
      </div>

      <div role="status" aria-live="polite">
        {status === "opened" && (
          <div
            ref={resultRef}
            tabIndex={-1}
            className="fade-in bg-mist px-5 py-4 text-[14px] leading-[1.7] shadow-[inset_3px_0_0_var(--color-charcoal)] outline-none"
          >
            <p className="font-medium">{contactCopy.openedTitle}</p>
            <p className="mt-1 text-ash">{contactCopy.openedBody}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-en">{MAIL_TO}</span>
              <button type="button" onClick={() => copy("address")} className="min-h-11 underline underline-offset-4 hover:text-charcoal">
                {copied === "address" ? "주소 복사됨" : "주소 복사"}
              </button>
              <button type="button" onClick={() => copy("body")} className="min-h-11 underline underline-offset-4 hover:text-charcoal">
                {copied === "body" ? "내용 복사됨" : "문의 내용 복사"}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
