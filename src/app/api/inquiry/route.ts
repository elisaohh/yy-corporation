import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { validateInquiry, type InquiryData } from "@/lib/inquiry";

/**
 * 문의 접수 — 폼 내용을 회사 메일로 보낸다(Resend, 무료 한도 안에서).
 * Vercel 환경 변수:
 *   RESEND_API_KEY  Resend에서 만든 API 키 (필수)
 *   INQUIRY_TO      받을 주소, 여러 개면 쉼표로 (필수)
 *   INQUIRY_FROM    보내는 주소 — 회사 도메인 인증 전에는 "onboarding@resend.dev"(Resend 가입 메일로만 받을 수 있음)
 */

const FIELDS = ["company", "name", "email", "phone", "product", "quantity", "message"] as const;

/** 같은 곳에서 짧은 시간에 여러 번 보내는 것을 막는다(서버 인스턴스별, 최선의 노력) */
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

function tooMany(ip: string): boolean {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  recent.set(ip, list);
  return list.length > LIMIT;
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // 사람에게는 보이지 않는 칸 — 값이 있으면 자동 프로그램으로 보고 조용히 성공 처리
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });

  const data = Object.fromEntries(FIELDS.map((k) => [k, typeof body[k] === "string" ? (body[k] as string).trim() : ""])) as Omit<InquiryData, "consent">;
  const inquiry: InquiryData = { ...data, consent: body.consent === true };
  const errors = validateInquiry(inquiry);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) return NextResponse.json({ ok: false, reason: "rate" }, { status: 429 });

  const key = env("RESEND_API_KEY");
  const to = env("INQUIRY_TO")?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  if (!key || !to.length) {
    console.error("[inquiry] RESEND_API_KEY 또는 INQUIRY_TO가 설정되지 않았습니다.");
    return NextResponse.json({ ok: false, reason: "config" }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["회사명 · 브랜드명", inquiry.company],
    ["담당자명", inquiry.name],
    ["이메일", inquiry.email],
    ["연락처", inquiry.phone],
    ["관심 제품", inquiry.product || "—"],
    ["예상 발주 수량", inquiry.quantity || "—"],
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "문의 내용:", inquiry.message, "", "개인정보 수집 · 이용 동의: 예"].join("\n");
  const html = `<div style="font-family:sans-serif;font-size:14px;line-height:1.7;color:#2b2b2a">
<h2 style="font-size:18px;margin:0 0 16px">홈페이지 문의</h2>
<table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6b6864;white-space:nowrap">${k}</td><td style="padding:4px 0">${escape(v)}</td></tr>`)
    .join("")}</table>
<p style="margin:20px 0 4px;color:#6b6864">문의 내용</p>
<div style="white-space:pre-wrap;border-left:3px solid #e6e4e0;padding-left:12px">${escape(inquiry.message)}</div>
<p style="margin-top:20px;color:#6b6864;font-size:12px">개인정보 수집 · 이용 동의: 예 · 이 메일에 답장하면 문의하신 분께 바로 갑니다.</p>
</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env("INQUIRY_FROM") || "YY CORPORATION 홈페이지 <onboarding@resend.dev>",
      to,
      reply_to: inquiry.email,
      subject: `[홈페이지 문의] ${inquiry.company} · ${inquiry.name}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[inquiry] 메일 전송 실패", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ ok: false, reason: "send" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
