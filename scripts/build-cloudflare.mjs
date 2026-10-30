/**
 * Cloudflare Pages 빌드 — 서버 없이 올리는 완성 파일(out/)을 만든다.
 *   Cloudflare 설정: 빌드 명령 `npm run build:cloudflare` · 출력 폴더 `out`
 *
 * - 화면 · 모션 · 사이트 위 편집(/admin)은 Vercel과 같은 코드.
 * - Next의 서버 기능(src/app/api, /admin/cms)은 빌드하는 동안만 잠시 숨긴다(앞에 _ 가 붙은 폴더는 페이지로 만들지 않음).
 *   로그인에 필요한 서버 부분은 functions/api/decap/ (Cloudflare 함수)가 맡는다.
 * - 주소 이동(_redirects) · 캐시(_headers) 파일을 함께 넣는다.
 */
import { spawnSync } from "node:child_process";
import { existsSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP = path.join(ROOT, "src", "app");
const HIDE = [["api"], ["admin", "cms"]];
const win = process.platform === "win32";

const moved = [];
const clearTypes = () => {
  for (const dir of [["types"], ["dev", "types"]]) rmSync(path.join(ROOT, ".next", ...dir), { recursive: true, force: true });
};

let ok = false;
try {
  for (const parts of HIDE) {
    const from = path.join(APP, ...parts);
    const to = path.join(APP, ...parts.slice(0, -1), `_${parts.at(-1)}`);
    if (existsSync(from)) {
      renameSync(from, to);
      moved.push([to, from]);
    }
  }
  rmSync(path.join(ROOT, "out"), { recursive: true, force: true });
  clearTypes();
  const build = spawnSync(win ? "npx.cmd" : "npx", ["next", "build"], {
    stdio: "inherit",
    shell: win,
    env: { ...process.env, NEXT_OUTPUT: "export" },
  });
  ok = build.status === 0;
} finally {
  for (const [from, to] of moved.reverse()) if (existsSync(from)) renameSync(from, to);
  clearTypes();
}
if (!ok) {
  console.error("\nCloudflare 빌드 실패 — 위 오류를 확인하세요.");
  process.exit(1);
}

const OUT = path.join(ROOT, "out");
writeFileSync(
  path.join(OUT, "_redirects"),
  `/about /about/company/ 301
/about/ /about/company/ 301
/about/story/yy-notes-vol-* /about/story/yy-letter-vol-:splat 301
`,
);
writeFileSync(
  path.join(OUT, "_headers"),
  `/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/admin/*
  X-Robots-Tag: noindex
`,
);
console.log("\n완료 — out/ (Cloudflare Pages 출력 폴더)");
