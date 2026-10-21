"use client";

import { Check, LogOut, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { deployState } from "@/lib/edit/repo";
import { saveSession, type EditSession } from "@/lib/edit/session";
import type { EditRequest } from "./EditContext";
import { OrderEditor } from "./OrderEditor";
import { ProductEditor } from "./ProductEditor";
import { StoriesManager, StoryEditor } from "./StoryEditor";
import { Spinner } from "./ui";

type Deploy = { state: "idle" } | { state: "pending" | "success" | "failure" | "slow"; message: string; goTo?: string };

const POLL_MS = 8000;
const GIVE_UP_MS = 6 * 60 * 1000;

/** 편집 막대(화면 아래) + 편집 창. 로그인했을 때만 불러온다 */
export function EditorHost({ session, request, onClose }: { session: EditSession; request: EditRequest | null; onClose: () => void }) {
  const router = useRouter();
  const [current, setCurrent] = useState<EditRequest | null>(request);
  const [deploy, setDeploy] = useState<Deploy>({ state: "idle" });
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => setCurrent(request), [request]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // 위로 가기 버튼이 편집 막대에 가리지 않게
  useEffect(() => {
    document.documentElement.style.setProperty("--edit-bar-h", "64px");
    return () => {
      document.documentElement.style.removeProperty("--edit-bar-h");
    };
  }, []);

  const close = () => {
    setCurrent(null);
    onClose();
  };

  /** 저장 뒤 — 사이트에 반영될 때까지 상태를 보여 준다 */
  const saved = (sha: string | null, message: string, goTo?: string) => {
    close();
    window.clearTimeout(timer.current);
    if (!sha) {
      // 내 컴퓨터: 바로 반영
      setDeploy({ state: "success", message, goTo });
      return;
    }
    setDeploy({ state: "pending", message, goTo });
    const started = Date.now();
    const poll = async () => {
      const state = await deployState(session, sha).catch(() => "unknown" as const);
      if (state === "success") return setDeploy({ state: "success", message, goTo });
      if (state === "failure") return setDeploy({ state: "failure", message, goTo });
      if (Date.now() - started > GIVE_UP_MS) return setDeploy({ state: "slow", message, goTo });
      timer.current = window.setTimeout(poll, POLL_MS);
    };
    timer.current = window.setTimeout(poll, POLL_MS);
  };

  const refresh = () => {
    const target = deploy.state !== "idle" ? deploy.goTo : undefined;
    setDeploy({ state: "idle" });
    if (target && target !== window.location.pathname) window.location.assign(target);
    else window.location.reload();
  };

  const logout = () => {
    if (deploy.state === "pending" && !window.confirm("아직 사이트에 반영 중입니다. 로그아웃해도 반영은 계속됩니다. 로그아웃할까요?")) return;
    saveSession(null);
    router.refresh();
  };

  return (
    <>
      <div role="region" aria-label="편집 모드" className="fixed inset-x-0 bottom-0 z-[80] border-t border-charcoal/10 bg-charcoal text-paper">
        <div className="container-yy flex min-h-14 flex-wrap items-center gap-x-4 gap-y-1 py-2 text-[13px]">
          <p className="flex items-center gap-2 font-medium">
            <span className="size-2 rounded-full bg-point-1225" aria-hidden="true" />
            편집 모드
            <span className="font-normal text-on-dark-sub">
              {session.login}
              {session.mode === "local" ? " · 내 컴퓨터" : session.branch !== "main" ? ` · ${session.branch}` : ""}
            </span>
          </p>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-3" aria-live="polite">
            {deploy.state === "pending" && (
              <span className="flex items-center gap-2 text-on-dark-sub">
                <Spinner /> {deploy.message} 사이트에 반영 중(1~2분)
              </span>
            )}
            {deploy.state === "success" && (
              <>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-point-1225" aria-hidden="true" /> {deploy.message} 반영되었습니다.
                </span>
                <button type="button" onClick={refresh} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-paper px-4 font-medium text-charcoal">
                  <RefreshCw className="size-3.5" aria-hidden="true" /> 새로고침
                </button>
              </>
            )}
            {deploy.state === "failure" && <span>{deploy.message} 하지만 사이트 반영에 실패했습니다. 개발 담당에게 알려 주세요.</span>}
            {deploy.state === "slow" && (
              <>
                <span className="text-on-dark-sub">{deploy.message} 반영이 늦어지고 있습니다.</span>
                <button type="button" onClick={refresh} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-paper px-4 font-medium text-charcoal">
                  <RefreshCw className="size-3.5" aria-hidden="true" /> 새로고침
                </button>
              </>
            )}
          </div>

          <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-1.5 text-on-dark-sub hover:text-paper">
            <LogOut className="size-4" aria-hidden="true" /> 로그아웃
          </button>
        </div>
      </div>
      {/* 편집 막대가 푸터 끝을 가리지 않게 */}
      <div aria-hidden="true" className="h-16" />

      {current?.type === "product" && <ProductEditor key={current.code ?? "new"} session={session} code={current.code} onClose={close} onSaved={saved} />}
      {current?.type === "order" && <OrderEditor session={session} onClose={close} onSaved={saved} />}
      {current?.type === "story" && <StoryEditor key={current.vol ?? "new"} session={session} vol={current.vol} onClose={close} onSaved={saved} />}
      {current?.type === "stories" && <StoriesManager session={session} onClose={close} onOpen={setCurrent} />}
    </>
  );
}
