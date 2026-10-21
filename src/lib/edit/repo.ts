import type { EditSession } from "./session";

/**
 * 저장소 읽기 · 쓰기 — 편집 화면이 쓴다.
 * github: GitHub API로 여러 파일을 커밋 하나로 저장(사진 + 목록이 한 번에 반영되도록).
 * local: 개발 서버의 /api/edit-local(내 컴퓨터 파일).
 */

export const REPO = "elisaohh/yy-corporation";
const API = "https://api.github.com";

export type Change = { path: string; text: string } | { path: string; base64: string } | { path: string; remove: true };

export interface DirEntry {
  name: string;
  path: string;
}

export class RepoError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

function gh(session: Extract<EditSession, { mode: "github" }>) {
  return async (path: string, init: RequestInit = {}, accept = "application/vnd.github+json") => {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Accept: accept,
        Authorization: `Bearer ${session.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      cache: "no-store",
    });
    if (res.status === 401) throw new RepoError("로그인이 만료되었습니다. 다시 로그인해 주세요.", 401);
    return res;
  };
}

/** 파일 내용(문자) — 없으면 null */
export async function readText(session: EditSession, path: string): Promise<string | null> {
  if (session.mode === "local") {
    const res = await fetch(`/api/edit-local?path=${encodeURIComponent(path)}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new RepoError("파일을 읽지 못했습니다.", res.status);
    return res.text();
  }
  const res = await gh(session)(`/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(session.branch)}`, {}, "application/vnd.github.raw+json");
  if (res.status === 404) return null;
  if (!res.ok) throw new RepoError("파일을 읽지 못했습니다.", res.status);
  return res.text();
}

export async function readJSON<T>(session: EditSession, path: string): Promise<T | null> {
  const text = await readText(session, path);
  return text === null ? null : (JSON.parse(text) as T);
}

/** 폴더 안 파일 목록 */
export async function listDir(session: EditSession, dir: string): Promise<DirEntry[]> {
  if (session.mode === "local") {
    const res = await fetch(`/api/edit-local?dir=${encodeURIComponent(dir)}`, { cache: "no-store" });
    if (!res.ok) throw new RepoError("목록을 읽지 못했습니다.", res.status);
    return res.json();
  }
  const res = await gh(session)(`/repos/${REPO}/contents/${dir}?ref=${encodeURIComponent(session.branch)}`);
  if (res.status === 404) return [];
  if (!res.ok) throw new RepoError("목록을 읽지 못했습니다.", res.status);
  const list = (await res.json()) as { name: string; path: string; type: string }[];
  return list.filter((f) => f.type === "file").map(({ name, path }) => ({ name, path }));
}

/** 이 저장소에 쓸 수 있는 계정인지 */
export async function checkWriteAccess(token: string): Promise<{ ok: boolean; login: string }> {
  const call = gh({ mode: "github", token, login: "", branch: "main" });
  const [repoRes, userRes] = await Promise.all([call(`/repos/${REPO}`), call(`/user`)]);
  const login = userRes.ok ? ((await userRes.json()) as { login: string }).login : "";
  if (!repoRes.ok) return { ok: false, login };
  const repo = (await repoRes.json()) as { permissions?: { push?: boolean } };
  return { ok: Boolean(repo.permissions?.push), login };
}

/**
 * 여러 파일을 한 번에 저장. build(최신 상태 읽기 → 바꿀 파일 목록)를 받아,
 * 그 사이 다른 사람이 먼저 저장했으면 최신 상태로 한 번 더 시도한다.
 * 반환: 커밋 번호(github) — 반영 상태 확인에 쓴다.
 */
export async function commit(session: EditSession, message: string, build: () => Promise<Change[]>): Promise<string | null> {
  if (session.mode === "local") {
    const changes = await build();
    const res = await fetch("/api/edit-local", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ changes }) });
    if (!res.ok) throw new RepoError("저장하지 못했습니다.", res.status);
    return null;
  }

  const call = gh(session);
  const ref = `heads/${session.branch}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    const changes = await build();
    const refRes = await call(`/repos/${REPO}/git/ref/${ref}`);
    if (!refRes.ok) throw new RepoError("저장 위치(브랜치)를 찾지 못했습니다.", refRes.status);
    const head = ((await refRes.json()) as { object: { sha: string } }).object.sha;
    const headCommit = (await (await call(`/repos/${REPO}/git/commits/${head}`)).json()) as { tree: { sha: string } };

    const tree = await Promise.all(
      changes.map(async (change) => {
        if ("remove" in change) return { path: change.path, mode: "100644", type: "blob", sha: null };
        const body = "text" in change ? { content: change.text, encoding: "utf-8" } : { content: change.base64, encoding: "base64" };
        const blobRes = await call(`/repos/${REPO}/git/blobs`, { method: "POST", body: JSON.stringify(body) });
        if (!blobRes.ok) throw new RepoError("파일을 올리지 못했습니다.", blobRes.status);
        const { sha } = (await blobRes.json()) as { sha: string };
        return { path: change.path, mode: "100644", type: "blob", sha };
      }),
    );
    const treeRes = await call(`/repos/${REPO}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }) });
    if (!treeRes.ok) throw new RepoError("저장하지 못했습니다.", treeRes.status);
    const newTree = ((await treeRes.json()) as { sha: string }).sha;
    const commitRes = await call(`/repos/${REPO}/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message: `${message}\n\n사이트 편집 화면에서 저장(${session.login})`, tree: newTree, parents: [head] }),
    });
    if (!commitRes.ok) throw new RepoError("저장하지 못했습니다.", commitRes.status);
    const sha = ((await commitRes.json()) as { sha: string }).sha;
    const update = await call(`/repos/${REPO}/git/refs/${ref}`, { method: "PATCH", body: JSON.stringify({ sha, force: false }) });
    if (update.ok) return sha;
    if (update.status !== 422) throw new RepoError("저장하지 못했습니다.", update.status);
    // 422 = 그 사이 다른 저장이 먼저 들어감 → 최신 상태로 다시
  }
  throw new RepoError("다른 사람이 동시에 저장하고 있습니다. 잠시 후 다시 시도해 주세요.");
}

/** 사이트 반영 상태 — Vercel이 커밋에 남기는 배포 상태를 읽는다 */
export async function deployState(session: EditSession, sha: string): Promise<"pending" | "success" | "failure" | "unknown"> {
  if (session.mode === "local") return "success";
  const res = await gh(session)(`/repos/${REPO}/commits/${sha}/status`);
  if (!res.ok) return "unknown";
  const { state, statuses } = (await res.json()) as { state: string; statuses: unknown[] };
  if (!statuses.length) return "pending";
  return state === "success" ? "success" : state === "failure" || state === "error" ? "failure" : "pending";
}

/** 브라우저에서 파일 → base64 */
export async function fileToBase64(blob: Blob): Promise<string> {
  const buffer = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < buffer.length; i += 0x8000) binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000));
  return btoa(binary);
}
