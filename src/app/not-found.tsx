import Link from "next/link";

export default function NotFound() {
  return (
    <section data-header-theme="light" className="container-yy flex min-h-[70svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="font-en text-[13px] tracking-[0.14em] text-ash">404</p>
      <h1 className="mt-4 text-[clamp(26px,3vw,36px)] font-normal tracking-[-0.02em]">찾는 페이지가 없습니다.</h1>
      <p className="mt-3 text-ash">주소를 확인하거나 홈에서 다시 찾아보세요.</p>
      <Link href="/" className="label-en mt-10 inline-flex w-fit border-b border-current pb-1">
        HOME
      </Link>
    </section>
  );
}
