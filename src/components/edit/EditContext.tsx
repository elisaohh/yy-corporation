"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { EDIT_EVENT, readSession, type EditSession } from "@/lib/edit/session";

/**
 * 사이트 위 편집 — 로그인한 사람에게만 편집 버튼과 아래 편집 막대가 보인다.
 * 방문자에게는 아무것도 그리지 않고, 편집 화면 코드도 내려받지 않는다(로그인했을 때만 불러옴).
 */

export type EditRequest =
  | { type: "product"; code: string | null }
  | { type: "order" }
  | { type: "story"; vol: number | null }
  | { type: "stories" };

interface EditContextValue {
  session: EditSession | null;
  open: (request: EditRequest) => void;
}

const EditCtx = createContext<EditContextValue>({ session: null, open: () => {} });

const EditorHost = dynamic(() => import("./EditorHost").then((m) => m.EditorHost), { ssr: false });

export function EditProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<EditSession | null>(null);
  const [request, setRequest] = useState<EditRequest | null>(null);

  useEffect(() => {
    const sync = () => setSession(readSession());
    sync();
    window.addEventListener(EDIT_EVENT, sync);
    return () => window.removeEventListener(EDIT_EVENT, sync);
  }, []);

  const open = useCallback((next: EditRequest) => setRequest(next), []);

  return (
    <EditCtx.Provider value={{ session, open }}>
      {children}
      {session && <EditorHost session={session} request={request} onClose={() => setRequest(null)} />}
    </EditCtx.Provider>
  );
}

export const useEdit = () => useContext(EditCtx);

const chipClass =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-charcoal bg-paper px-4 text-[13px] font-medium text-charcoal shadow-[0_2px_10px_rgb(0_0_0/0.08)] transition-colors hover:bg-charcoal hover:text-paper";

/** 편집 버튼 — 로그인했을 때만 보인다 */
export function EditButton({ request, children, label, className = "" }: { request: EditRequest; children: ReactNode; label?: string; className?: string }) {
  const { session, open } = useEdit();
  if (!session) return null;
  return (
    <button type="button" onClick={() => open(request)} aria-label={label} className={`${chipClass} ${className}`}>
      {children}
    </button>
  );
}

/** 여러 편집 버튼을 한 줄로 — 로그인했을 때만 자리를 차지한다 */
export function EditToolbar({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { session } = useEdit();
  if (!session) return null;
  return (
    <div role="group" aria-label="편집" className={`flex flex-wrap items-center gap-2 ${className}`}>
      {children}
    </div>
  );
}
