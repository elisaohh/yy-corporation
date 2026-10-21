import type { NextRequest } from "next/server";
import { env } from "@/lib/env";

/** 관리 화면 로그인 2단계 — GitHub가 돌려준 코드를 토큰으로 바꿔 관리 화면 창에 전달한다 */
export const dynamic = "force-dynamic";

/** 로그인 결과는 이 사이트의 관리 화면 창에만 전달한다(다른 사이트가 로그인 창을 띄워 토큰을 가로채지 못하게) */
function reply(status: "success" | "error", content: object, origin: string) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html><html><body><script>
(function () {
  var msg = ${JSON.stringify(message).replace(/</g, "\\u003c")};
  var allowed = ${JSON.stringify(origin)};
  function receive(e) {
    if (e.origin !== allowed) return;
    window.opener.postMessage(msg, allowed);
    window.removeEventListener("message", receive);
  }
  window.addEventListener("message", receive, false);
  window.opener.postMessage("authorizing:github", allowed);
})();
</script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || state !== request.cookies.get("decap_state")?.value) {
    return reply("error", { message: "로그인 확인에 실패했습니다. 다시 시도해 주세요." }, url.origin);
  }
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env("GITHUB_OAUTH_ID"),
      client_secret: env("GITHUB_OAUTH_SECRET"),
      code,
      redirect_uri: `${url.origin}/api/decap/callback`,
    }),
  });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; error_description?: string };
  if (!body.access_token) return reply("error", { message: body.error_description || "로그인에 실패했습니다." }, url.origin);
  return reply("success", { token: body.access_token, provider: "github" }, url.origin);
}
