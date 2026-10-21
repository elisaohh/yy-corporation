"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { loadProducts, saveOrder, type ProductEntry } from "@/lib/edit/content";
import type { EditSession } from "@/lib/edit/session";
import { Drawer, iconButton, Notice, Spinner } from "./ui";

/** 제품 순서 · 홈 노출 — 목록 순서가 PRODUCT와 홈의 순서 */
export function OrderEditor({ session, onClose, onSaved }: { session: EditSession; onClose: () => void; onSaved: (sha: string | null, message: string) => void }) {
  const [list, setList] = useState<ProductEntry[] | null>(null);
  const [home, setHome] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    loadProducts(session)
      .then((items) => {
        if (!alive) return;
        setList(items);
        setHome(new Set(items.filter((p) => p.home).map((p) => p.code)));
      })
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [session]);

  const move = (index: number, dir: -1 | 1) =>
    setList((l) => {
      if (!l) return l;
      const next = [...l];
      [next[index], next[index + dir]] = [next[index + dir], next[index]];
      return next;
    });

  const toggle = (code: string) =>
    setHome((h) => {
      const next = new Set(h);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  const save = async () => {
    if (!list) return;
    setBusy(true);
    setError("");
    try {
      const sha = await saveOrder(session, list.map((p) => p.code), home);
      onSaved(sha, "순서와 홈 노출을 저장했습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장하지 못했습니다.");
      setBusy(false);
    }
  };

  const homeCount = list?.filter((p) => home.has(p.code)).length ?? 0;

  return (
    <Drawer
      title="순서 · 홈 노출"
      onClose={onClose}
      busy={busy}
      footer={
        list && (
          <>
            <button type="button" onClick={save} disabled={busy} className="btn btn-primary min-w-32">
              {busy ? (
                <>
                  <Spinner /> 저장 중
                </>
              ) : (
                "저장"
              )}
            </button>
            <button type="button" onClick={onClose} disabled={busy} className="btn btn-secondary">
              취소
            </button>
            <p className="ml-auto text-[13px] text-ash" aria-live="polite">
              홈에 {homeCount}개
            </p>
          </>
        )
      }
    >
      {error && (
        <div className="mb-6">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      {!list ? (
        !error && (
          <p className="flex items-center gap-3 text-ash">
            <Spinner /> 불러오는 중
          </p>
        )
      ) : (
        <>
          <p className="mb-5 text-[14px] leading-[1.7] text-ash">위에서부터 PRODUCT 목록 순서입니다. 홈에는 체크한 제품만 같은 순서로 나옵니다(넓은 화면 한 줄 5개).</p>
          <ol className="border-t border-stone">
            {list.map((p, i) => (
              <li key={p.code} className="flex items-center gap-3 border-b border-stone py-3">
                <span className="w-6 text-right font-en text-[13px] tabular-nums text-ash">{i + 1}</span>
                <div className="relative size-12 shrink-0 bg-card">
                  {p.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" className="absolute inset-[8%] size-[84%] object-contain mix-blend-multiply" />
                  )}
                </div>
                <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={home.has(p.code)} onChange={() => toggle(p.code)} aria-label={`${p.code} 홈에 보이기`} className="size-5 shrink-0 accent-charcoal" />
                  <span className="min-w-0">
                    <span className="block truncate font-en text-[15px] font-medium">{p.code}</span>
                    <span className="block text-[12px] text-ash">{home.has(p.code) ? "홈에 보임" : "홈에 안 보임"}</span>
                  </span>
                </label>
                <button type="button" className={iconButton} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`${p.code} 위로`}>
                  <ArrowUp className="size-4" aria-hidden="true" />
                </button>
                <button type="button" className={iconButton} disabled={i === list.length - 1} onClick={() => move(i, 1)} aria-label={`${p.code} 아래로`}>
                  <ArrowDown className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </Drawer>
  );
}
