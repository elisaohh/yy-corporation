import { redirect } from "next/navigation";

/** /about → /about/company. ABOUT 하위 메뉴: COMPANY · STORY */
export default function AboutPage() {
  redirect("/about/company");
}
