import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Pending } from "@/components/ui/Pending";
import { company, copyrightName } from "@/data/company";
import { mainNav } from "@/data/navigation";

/**
 * 공통 푸터 — 기획서 2.0 §3.3: 로고, 간단한 사업 소개, 메뉴, 연락처·주소, 저작권.
 * 다크 영역을 인트로·CTA로 한정하기 위해 밝은 바탕으로 둔다(설계서 v0.2, 확인 필요).
 * 회사 정보는 data/company.ts 에서만 읽고, 비어 있으면 "확인 필요"로 표시한다.
 */
export function Footer() {
  const rows: { label: string; value: string | null }[] = [
    { label: "ADDRESS", value: company.address },
    { label: "TEL", value: company.phone },
    { label: "FAX", value: company.fax },
    { label: "E-MAIL", value: company.email },
    { label: "HOURS", value: company.hours },
  ];
  const year = new Date().getFullYear();

  return (
    <footer data-header-theme="light" className="border-t border-stone bg-paper text-charcoal">
      <div className="container-yy grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="md:col-span-5">
          <Logo placement="footer" />
          <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-ash">
            {company.summary ?? (
              <>
                사업 소개 1–2줄 <Pending />
              </>
            )}
          </p>
        </div>

        <nav aria-label="푸터 메뉴" className="md:col-span-3">
          <ul className="grid gap-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="label-en inline-flex min-h-8 items-center bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 hover:bg-[length:100%_1px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <dl className="grid gap-3 text-[14px] md:col-span-4">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-4">
              <dt className="label-en text-[11px] text-ash">{row.label}</dt>
              <dd className="min-w-0">{row.value ?? <Pending />}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="container-yy border-t border-stone py-6">
        <p className="font-en text-[12px] tracking-[0.04em] text-ash">
          © {year} {copyrightName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
