/**
 * Cloudflare Pages 함수 — 관리 화면 로그인 1단계: GitHub 로그인 창으로 보낸다.
 * (Vercel에서는 src/app/api/decap/auth/route.ts 가 같은 일을 한다)
 * Cloudflare 설정 → 환경 변수: GITHUB_OAUTH_ID
 */
export function onRequestGet({ request, env }) {
  const id = (env.GITHUB_OAUTH_ID || "").trim();
  if (!id) return new Response("GITHUB_OAUTH_ID가 설정되지 않았습니다.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", id);
  authorize.searchParams.set("redirect_uri", `${url.origin}/api/decap/callback`);
  authorize.searchParams.set("scope", "repo,user");
  authorize.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      "Set-Cookie": `decap_state=${state}; Path=/api/decap; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
      "Cache-Control": "no-store",
    },
  });
}
