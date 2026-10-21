import { NextResponse } from "next/server";

/** 관리 화면 로그인 1단계 — GitHub 로그인 창으로 보낸다 */
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const id = process.env.GITHUB_OAUTH_ID;
  if (!id) return new Response("GITHUB_OAUTH_ID가 설정되지 않았습니다.", { status: 503 });
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", id);
  authorize.searchParams.set("redirect_uri", `${url.origin}/api/decap/callback`);
  authorize.searchParams.set("scope", "repo,user");
  authorize.searchParams.set("state", state);
  const res = NextResponse.redirect(authorize);
  res.cookies.set("decap_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/api/decap", maxAge: 600 });
  return res;
}
