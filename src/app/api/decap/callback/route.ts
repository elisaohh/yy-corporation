import type { NextRequest } from "next/server";

/** 관리 화면 로그인 2단계 — GitHub가 돌려준 코드를 토큰으로 바꿔 관리 화면 창에 전달한다 */
export const dynamic = "force-dynamic";

function reply(status: "success" | "error", content: object) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html><html><body><script>
(function () {
  var msg = ${JSON.stringify(message).replace(/</g, "\\u003c")};
  function receive(e) { window.opener.postMessage(msg, e.origin); window.removeEventListener("message", receive); }
  window.addEventListener("message", receive, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || state !== request.cookies.get("decap_state")?.value) {
    return reply("error", { message: "로그인 확인에 실패했습니다. 다시 시도해 주세요." });
  }
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_OAUTH_ID,
      client_secret: process.env.GITHUB_OAUTH_SECRET,
      code,
      redirect_uri: `${url.origin}/api/decap/callback`,
    }),
  });
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; error_description?: string };
  if (!body.access_token) return reply("error", { message: body.error_description || "로그인에 실패했습니다." });
  return reply("success", { token: body.access_token, provider: "github" });
}
