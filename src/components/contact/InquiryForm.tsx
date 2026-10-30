"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { company } from "@/data/company";
import { contactCopy } from "@/data/content";
import { marketingConsentSummary, privacyConsentSummary } from "@/data/privacy";
import { getProductById, productInquiryLabel } from "@/data/products";
import { validateInquiry, type InquiryData, type InquiryErrors, type InquiryField } from "@/lib/inquiry";

/**
 * 문의 폼 — 기획서 2.0 부록 G.
 * 필수: 회사명·브랜드명 · 담당자명 · 이메일 · 연락처 · 문의 내용 · 개인정보 동의
 * 선택: 관심 제품 · 예상 발주 수량   (문의 유형 · 파일 첨부는 첫 버전에서 제외)
 *
 * 보내기 → 방문자의 메일 앱이 열리고 받는 사람(회사 메일) · 제목 · 내용이 채워진다. 방문자가 메일 앱에서 보낸다.
 * 메일은 영업 담당자가 한눈에 훑어볼 수 있는 접수표 형식(composeMail). 검사 규칙은 lib/inquiry.ts.
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
  marketing: false,
};

const ORDER: FieldName[] = ["company", "name", "email", "phone", "product", "quantity", "message", "consent"];

const validate = validateInquiry;

const MAIL_TO = company.email ?? "";

const LINE = "───────────────────────────";

/** 메일 제목 · 본문 — 접수표 형식 */
function composeMail(data: InquiryData) {
  const company = data.company.trim();
  const name = data.name.trim();
  const product = data.product.trim();
  const subject = `[견적 · 제품 문의] ${[company, name, product].filter(Boolean).join(" / ")}`;
  const rows: [string, string][] = [
    ["회사 · 브랜드", company],
    ["담당자", name],
    ["이메일", data.email.trim()],
    ["연락처", data.phone.trim()],
    ["관심 제품", product || "없음"],
    ["예상 수량", data.quantity.trim() || "미정"],
  ];
  // 항목 이름 뒤 칸을 맞춘다(한글은 두 칸으로 셈)
  const width = (t: string) => [...t].reduce((n, ch) => n + (/[\u3131-\uD79D]/.test(ch) ? 2 : 1), 0);
  const pad = (t: string) => t + " ".repeat(Math.max(2, 16 - width(t)));
  const body = [
    "────────── 문의 접수 ──────────",
    ...rows.map(([k, v]) => `${pad(k)}${v}`),
    LINE,
    "",
    "[문의 내용]",
    data.message.trim(),
    "",
    LINE,
    // 동의 기록 — 광고성 정보를 보내도 되는 사람인지 회사가 메일로 확인
    `동의  개인정보 수집 · 이용(필수) 동의 / 광고성 정보 수신(선택) ${data.marketing ? "동의" : "미동의"}`,
  ].join("\n");
  return { subject, body };
}

export function InquiryForm() {
  const params = useSearchParams();
  const uid = useId();
  const [data, setData] = useState<InquiryData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [prefilled, setPrefilled] = useState(false);
  /** 동의 항목별 '보기' 펼침 */
  const [detail, setDetail] = useState<"" | "consent" | "marketing">("");
  const allRef = useRef<HTMLInputElement>(null);
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

  // 전체 동의: 둘 다 = 체크, 하나만 = 중간 표시, 하나라도 빠지면 체크 해제
  const allChecked = data.consent && data.marketing;
  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = !allChecked && (data.consent || data.marketing);
  }, [allChecked, data.consent, data.marketing]);

  const fieldId = (name: FieldName) => `${uid}-${name}`;

  const update = (name: FieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = name === "consent" || name === "marketing" ? (event.target as HTMLInputElement).checked : event.target.value;
    const next = { ...data, [name]: value } as InquiryData;
    setData(next);
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
  };

  const textField = (
    name: Exclude<FieldName, "consent" | "marketing" | "message">,
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

      <fieldset className="grid gap-2">
        <legend className="sr-only">개인정보 동의</legend>
        <div className="grid gap-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium">
            <input
              ref={allRef}
              type="checkbox"
              checked={allChecked}
              onChange={(e) => {
                const on = e.target.checked;
                const next = { ...data, consent: on, marketing: on };
                setData(next);
                if (touched.consent || errors.consent) setErrors((prev) => ({ ...prev, consent: validate(next).consent }));
              }}
              className="size-4 shrink-0 cursor-pointer accent-charcoal"
            />
            전체 동의 <span className="font-normal text-ash">(선택 항목 포함)</span>
          </label>

          <div className="grid gap-1.5">
            {[
              { name: "consent" as const, label: "[필수] 개인정보 수집 · 이용 동의", summary: privacyConsentSummary },
              { name: "marketing" as const, label: "[선택] 광고성 정보 수신 동의 (이메일 · 문자)", summary: marketingConsentSummary },
            ].map((item) => {
              const open = detail === item.name;
              const panelId = `${fieldId(item.name)}-detail`;
              return (
                <div key={item.name}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <input
                        id={fieldId(item.name)}
                        name={item.name}
                        type="checkbox"
                        checked={data[item.name]}
                        onChange={update(item.name)}
                        onBlur={item.name === "consent" ? blur("consent") : undefined}
                        aria-invalid={item.name === "consent" && consentError ? true : undefined}
                        aria-describedby={item.name === "consent" && consentError ? `${fieldId("consent")}-error` : undefined}
                        className="mt-[3px] size-4 shrink-0 cursor-pointer accent-charcoal"
                      />
                      <label htmlFor={fieldId(item.name)} className="cursor-pointer text-[13px] leading-[1.7]">
                        {item.label}
                      </label>
                    </div>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setDetail(open ? "" : item.name)}
                      className="-my-3 inline-flex min-h-11 shrink-0 items-center text-[12px] text-ash underline-offset-4 hover:text-charcoal hover:underline"
                    >
                      보기 <span aria-hidden="true" className={`ml-1 inline-block transition-transform duration-200 ${open ? "rotate-90" : ""}`}>›</span>
                    </button>
                  </div>
                  <div id={panelId} hidden={!open} className="mt-1.5 mb-1 ml-[26px] border-l border-stone pl-3 text-[12px] leading-[1.7] text-ash">
                    <dl className="grid gap-1">
                      {item.summary.map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3">
                          <dt>{k}</dt>
                          <dd className="text-charcoal/80">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    {item.name === "consent" ? (
                      <p className="mt-2">
                        동의를 거부할 수 있으나, 이 경우 문의 접수가 어렵습니다.{" "}
                        <Link href="/privacy" target="_blank" className="underline underline-offset-4 hover:text-charcoal">
                          개인정보 처리방침 전문 보기
                        </Link>
                      </p>
                    ) : (
                      <p className="mt-2">동의하지 않아도 문의할 수 있으며, 언제든 수신을 거부할 수 있습니다.</p>
                    )}
                  </div>
                </div>
              );
            })}
            <p className="mt-0.5 text-[12px] text-ash">선택 항목은 동의하지 않아도 문의할 수 있습니다.</p>
          </div>
        </div>
        {consentError && (
          <p id={`${fieldId("consent")}-error`} className="text-[13px] text-charcoal">
            {consentError}
          </p>
        )}
      </fieldset>

      <div>
        <button type="submit" className="btn btn-primary w-full md:w-auto md:min-w-48">
          문의 보내기
        </button>
      </div>

    </form>
  );
}
