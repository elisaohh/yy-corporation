import { cmsConfig } from "@/lib/cms";

/**
 * 예비 관리 화면(/admin/cms) — Decap CMS. 평소에는 사이트 위 편집(/admin에서 로그인)을 쓴다.
 * - 운영: GitHub 계정으로 로그인(저장소 쓰기 권한이 있는 사람만). 환경 변수 GITHUB_OAUTH_ID · GITHUB_OAUTH_SECRET 필요.
 * - 내 컴퓨터: npm run dev 와 npm run cms 를 함께 켜면 로그인 없이 파일에 바로 저장된다.
 */
export const dynamic = "force-dynamic";

const DECAP = "https://unpkg.com/decap-cms@3.16.3/dist/decap-cms.js";

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const config = cmsConfig({
    branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
    // GitHub 로그인은 GitHub에 등록한 주소에서만 된다 — 다른 주소(미리보기)에서 쓰려면 DECAP_AUTH_URL에 등록한 주소를 넣는다
    baseUrl: process.env.DECAP_AUTH_URL || origin,
    local: process.env.NODE_ENV === "development",
  });
  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>YY CORPORATION 관리</title>
<script>window.CMS_MANUAL_INIT = true;</script>
<script src="${DECAP}"></script>
</head>
<body>
<script>CMS.init({ config: ${JSON.stringify(config).replace(/</g, "\\u003c")} });</script>
</body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
