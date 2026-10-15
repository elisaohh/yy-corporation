import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Pending } from "@/components/ui/Pending";
import { aboutIntro } from "@/data/about";
import { company, companyStatus, copyrightName } from "@/data/company";
import { headerNav } from "@/data/navigation";

/**
 * 공통 푸터 — 로고(누르면 홈) · 슬로건 · 메뉴(HOME 제외) · 회사 정보 · 저작권.
 * 2026-10-15: ABOUT의 회사 정보(Company) 구간을 푸터로 옮김.
 * 회사 정보는 data/company.ts 에서만 읽는다. 값이 없는 항목은 표시하지 않는다.
 * 개인정보처리방침 · 이용약관 링크는 기존 문서 확보 후 페이지와 함께 추가한다(임의 작성 금지).
 */
export function Footer() {
  const info = [
    { label: "회사명", value: company.legalName },
    { label: "주소", value: company.address },
    { label: "전화", value: company.phone, href: company.phone ? `tel:${company.phone.replace(/-/g, "")}` : undefined },
    { label: "팩스", value: company.fax },
    { label: "이메일", value: company.email, href: company.email ? `mailto:${company.email}` : undefined },
  ].filter((row): row is { label: string; value: string; href?: string } => Boolean(row.value));

  const year = new Date().getFullYear();

  return (
    <footer data-header-theme="light" className="border-t border-stone bg-paper text-charcoal">
      <div className="container-yy grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="md:col-span-4">
          <Link href="/" aria-label="YY CORPORATION 홈" className="-m-2 inline-flex p-2">
            <Logo placement="footer" decorative />
          </Link>
          <p className="mt-6 text-[clamp(20px,1.8vw,24px)] leading-[1.4] font-bold tracking-[-0.03em]">{aboutIntro.slogan}</p>
        </div>

        <nav aria-label="푸터 메뉴" className="md:col-span-2">
          <ul className="grid gap-3">
            {headerNav.map((item) => (
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

        <div className="md:col-span-6">
          <dl className="text-[14px]">
            {info.map((row) => (
              <div key={row.label} className="grid grid-cols-[112px_minmax(0,1fr)] items-baseline gap-4 border-t border-stone py-3 first:border-t-0 first:pt-0">
                <dt className="text-ash">{row.label}</dt>
                <dd className="min-w-0">
                  {row.href ? (
                    <a href={row.href} className="underline-offset-4 hover:underline">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
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

      <div className="container-yy border-t border-stone py-6 text-[12px] text-ash">
        <p className="font-en tracking-[0.04em]">
          © {year} {copyrightName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
