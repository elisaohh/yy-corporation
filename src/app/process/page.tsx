import type { Metadata } from "next";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { FinishingSections } from "@/components/process/FinishingSections";
import { ProcessFlow } from "@/components/process/ProcessFlow";
import { OneStopSystem } from "@/components/process/OneStopSystem";
import { processIntro } from "@/data/process";

export const metadata: Metadata = { title: "Process" };

export default function ProcessPage() {
  return (
    <>
      <PageIntro title={processIntro.title} intro={processIntro.lead} />
      <ProcessFlow />
      <OneStopSystem />
      <FinishingSections />
      <ContactCta />
    </>
  );
}
