"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { checkWriteAccess } from "@/lib/edit/repo";
import { readSession, saveSession } from "@/lib/edit/session";
import { Notice, Spinner } from "./ui";

/**
 * 관리자 로그인 — GitHub 계정으로 로그인하고, 이 저장소에 쓸 수 있는 사람만 편집 모드로 들어간다.
 * 로그인 창(/api/decap/auth → GitHub → /api/decap/callback)은 결과를 이 사이트 창에만 보낸다.
 */
export function AdminLogin({ branch, local }: { branch: string; local: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "waiting" | "checking">("idle");
  const [error, setError] = useState("");
  const [signedIn, setSignedIn] = useState<string | null>(null);
  const popup = useRef<Window | null>(null);

  useEffect(() => {
    setSignedIn(readSession()?.login ?? null);
  }, []);

  useEffect(() => {
    const onMessage = async (e: MessageEvent) => {
      if (e.origin !== window.location.origin || typeof e.data !== "string") return;
      if (e.data === "authorizing:github") {
        // 로그인 창이 준비됨 → 결과를 달라고 답한다
        (e.source as Window | null)?.postMessage("authorizing:github", window.location.origin);
        return;
      }
      const match = e.data.match(/^authorization:github:(success|error):([\s\S]*)$/);
      if (!match) return;
      popup.current?.close();
      const body = JSON.parse(match[2]) as { token?: string; message?: string };
      if (match[1] !== "success" || !body.token) {
        setState("idle");
        setError(body.message || "로그인에 실패했습니다.");
        return;
      }
      setState("checking");
      try {
        const { ok, login } = await checkWriteAccess(body.token);
        if (!ok) {
          setState("idle");
          setError(`${login || "이"} 계정은 편집 권한이 없습니다. 저장소 관리자에게 초대를 요청해 주세요.`);
          return;
        }
        saveSession({ mode: "github", token: body.token, login, branch });
        router.push("/");
      } catch {
        setState("idle");
        setError("권한을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [branch, router]);

  const login = () => {
    setError("");
    const w = 560;
    const h = 720;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    popup.current = window.open("/api/decap/auth", "yy-login", `width=${w},height=${h},left=${left},top=${top}`);
    if (!popup.current) {
      setError("로그인 창이 막혔습니다. 브라우저 주소창의 팝업 차단을 풀고 다시 눌러 주세요.");
      return;
    }
    setState("waiting");
    const watch = window.setInterval(() => {
      if (popup.current?.closed) {
        window.clearInterval(watch);
        setState((s) => (s === "waiting" ? "idle" : s));
      }
    }, 500);
  };

  const localLogin = () => {
    saveSession({ mode: "local", login: "개발용", branch: "local" });
    router.push("/");
  };

  return (
    <div className="grid max-w-[460px] gap-6">
      {signedIn ? (
        <>
          <Notice>
            <b className="font-medium">{signedIn}</b> 계정으로 편집 중입니다. 사이트 아무 곳에서나 편집 버튼을 눌러 고칠 수 있습니다.
          </Notice>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => router.push("/products")} className="btn btn-primary">
              PRODUCT로 가기
            </button>
            <button
              type="button"
              onClick={() => {
                saveSession(null);
                setSignedIn(null);
              }}
              className="btn btn-secondary"
            >
              로그아웃
            </button>
          </div>
        </>
      ) : (
        <>
          <button type="button" onClick={login} disabled={state !== "idle"} className="btn btn-primary w-full sm:w-auto sm:min-w-64">
            {state === "waiting" ? (
              <>
                <Spinner /> 로그인 창에서 진행해 주세요
              </>
            ) : state === "checking" ? (
              <>
                <Spinner /> 권한 확인 중
              </>
            ) : (
              "GitHub 계정으로 로그인"
            )}
          </button>
          {local && (
            <button type="button" onClick={localLogin} className="btn btn-secondary w-full sm:w-auto sm:min-w-64">
              내 컴퓨터에서 편집(개발용)
            </button>
          )}
          {error && <Notice tone="error">{error}</Notice>}
          <ul className="grid gap-2 text-[14px] leading-[1.7] text-ash">
            <li>· 저장소에 초대된 계정만 편집할 수 있습니다.</li>
            <li>· 로그인은 이 브라우저 탭에서만 유지되고, 탭을 닫으면 로그아웃됩니다.</li>
            <li>· 저장하면 1~2분 뒤 사이트에 반영됩니다.</li>
          </ul>
        </>
      )}
    </div>
  );
}
