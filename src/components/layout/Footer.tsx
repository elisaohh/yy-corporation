import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Pending } from "@/components/ui/Pending";
import { company, companyStatus, copyrightName } from "@/data/company";
import { mainNav } from "@/data/navigation";

/**
 * 공통 푸터 — 기획서 2.0 §3.3: 로고, 간단한 사업 소개, 메뉴, 연락처·주소, 사업자 정보, 저작권.
 * 다크 영역을 인트로·CTA로 한정하기 위해 밝은 바탕으로 둔다.
 * 회사 정보는 data/company.ts 에서만 읽는다. 값이 없는 항목(팩스·운영 시간 등)은 표시하지 않는다.
 * 개인정보처리방침 · 이용약관 링크는 기존 문서 확보 후 페이지와 함께 추가한다(임의 작성 금지).
 */
export function Footer() {
  const contacts = [
    { label: "ADDRESS", value: company.address },
    { label: "TEL", value: company.phone },
    { label: "FAX", value: company.fax },
    { label: "E-MAIL", value: company.email },
    { label: "HOURS", value: company.hours },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  const business = [
    company.legalName && `상호 ${company.legalName}`,
    company.representative && `대표 ${company.representative}`,
    company.businessNumber && `사업자등록번호 ${company.businessNumber}`,
  ].filter(Boolean) as string[];

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

        <div className="md:col-span-4">
          <dl className="grid gap-3 text-[14px]">
            {contacts.map((row) => (
              <div key={row.label} className="grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-4">
                <dt className="label-en text-[11px] text-ash">{row.label}</dt>
                <dd className="min-w-0">{row.value}</dd>
              </div>
            ))}
          </dl>
          {companyStatus !== "confirmed" && (
            <p className="mt-4">
              <Pending label="기존 사이트 기준 · 최신 확인 필요" />
            </p>
          )}
        </div>
      </div>

      <div className="container-yy flex flex-col gap-2 border-t border-stone py-6 text-[12px] text-ash md:flex-row md:items-center md:justify-between">
        {business.length > 0 && (
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            {business.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        )}
        <p className="font-en tracking-[0.04em]">
          © {year} {copyrightName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
