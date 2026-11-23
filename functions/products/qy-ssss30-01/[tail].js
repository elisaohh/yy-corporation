/**
 * Cloudflare Pages 함수 — 메일로 잘못 나간 주소 바로잡기
 * /products/qy-ssss30-01/|  (주소창에선 %7C)  →  /products/qy-ssss30-01/
 * 그 밖의 주소(index.txt 등 실제 파일)는 건드리지 않고 그대로 보낸다.
 */
export function onRequest({ request, params, next }) {
  let tail = String(params.tail || "");
  try { tail = decodeURIComponent(tail); } catch {}
  if (tail.trim() === "|") {
    const url = new URL(request.url);
    return Response.redirect(`${url.origin}/products/qy-ssss30-01/${url.search}`, 301);
  }
  return next();
}
