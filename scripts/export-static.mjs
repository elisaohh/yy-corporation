/**
 * 카페24 웹호스팅용 완성 파일 만들기 — 서버 없이 올리는 정적 사이트(out/) + 압축 파일(export/).
 *   실행: npm run export   (개발 서버 npm run dev 는 끄고 실행)
 *
 * - 화면 · 모션은 Vercel 사이트와 같은 코드로 만든다(같은 HTML · CSS · JS).
 * - 서버가 필요한 부분(사이트 위 편집 로그인 /admin, /api)은 넣지 않는다 — 편집은 Vercel에서 하고, 다시 내보내 올린다.
 * - 일반 웹호스팅(Apache)용 .htaccess(주소 정리 · 404 · 캐시)를 함께 넣는다.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP = path.join(ROOT, "src", "app");
// 앞에 _ 가 붙은 폴더는 Next가 페이지로 만들지 않는다 → 내보내는 동안만 잠시 숨긴다
const HIDE = ["api", "admin"];
const EDIT_URL = process.env.EDIT_URL || "https://yy-corporation.vercel.app/admin/";

const moved = [];
function hide() {
  for (const name of HIDE) {
    const from = path.join(APP, name);
    const to = path.join(APP, `_${name}`);
    if (existsSync(from)) {
      renameSync(from, to);
      moved.push([to, from]);
    }
  }
}
function restore() {
  for (const [from, to] of moved.reverse()) if (existsSync(from)) renameSync(from, to);
}

let ok = false;
try {
  hide();
  rmSync(path.join(ROOT, "out"), { recursive: true, force: true });
  // 숨긴 폴더의 예전 빌드 · 개발 서버 기록이 남아 있으면 타입 검사가 실패한다(개발 서버는 끄고 실행)
  for (const dir of [["types"], ["dev", "types"]]) rmSync(path.join(ROOT, ".next", ...dir), { recursive: true, force: true });
  const build = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", ["next", "build"], { stdio: "inherit", shell: process.platform === "win32", env: { ...process.env, NEXT_OUTPUT: "export" } });
  ok = build.status === 0;
} finally {
  restore();
  for (const dir of [["types"], ["dev", "types"]]) rmSync(path.join(ROOT, ".next", ...dir), { recursive: true, force: true });
}
if (!ok) {
  console.error("\n내보내기 실패 — 위 오류를 확인하세요.");
  process.exit(1);
}

const OUT = path.join(ROOT, "out");
writeFileSync(
  path.join(OUT, ".htaccess"),
  `# YY CORPORATION — 완성 파일용 웹서버 설정(카페24 웹호스팅 · Apache)
# 이 폴더 안의 파일은 npm run export 로 다시 만들어진다. 직접 고치지 말 것.

DirectoryIndex index.html
Options -Indexes
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # ABOUT → COMPANY
  RewriteRule ^about/?$ /about/company/ [R=301,L]
  # 뉴스레터 예전 주소(YY NOTES) → 새 주소(YY LETTER)
  RewriteRule ^about/story/yy-notes-vol-([0-9]+)/?$ /about/story/yy-letter-vol-$1/ [R=301,L]
  # 사이트 편집은 Vercel에서
  RewriteRule ^admin/?$ ${EDIT_URL} [R=302,L]
</IfModule>

AddType image/webp .webp
AddType image/svg+xml .svg
AddType video/mp4 .mp4
AddType font/woff2 .woff2

<IfModule mod_headers.c>
  # 화면(HTML)은 늘 새로, 이름에 버전이 붙은 파일(_next/static)은 오래 보관
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType image/svg+xml "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType video/mp4 "access plus 30 days"
</IfModule>
`,
);

// 압축 파일 — 업체에 그대로 보낼 수 있게(Windows · macOS 기본 tar가 zip을 만든다)
const DIST = path.join(ROOT, "export");
mkdirSync(DIST, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const zip = path.join(DIST, `yy-corporation-site-${stamp}.zip`);
rmSync(zip, { force: true });
// Windows는 기본 tar(bsdtar), macOS도 bsdtar — Git Bash의 GNU tar는 zip을 못 만든다
const tar = process.platform === "win32" ? path.join(process.env.SystemRoot || "C:\Windows", "System32", "tar.exe") : "tar";
const z = spawnSync(tar, ["-a", "-c", "-f", zip, "-C", OUT, "."], { stdio: "inherit" });
console.log(z.status === 0 ? `\n완료 — 폴더: out/ · 압축 파일: export/${path.basename(zip)}` : "\n완료 — 폴더: out/ (압축은 직접 해 주세요)");
