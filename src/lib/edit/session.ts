/**
 * 사이트 위 편집 — 로그인 정보(이 브라우저 탭에만 보관, 탭을 닫으면 로그아웃).
 * - github: 저장 = GitHub 저장소에 바로 기록 → Vercel이 다시 만들어 1~2분 뒤 반영
 * - local: 내 컴퓨터(npm run dev)에서만 — 파일에 바로 저장
 */

export type EditSession =
  | { mode: "github"; token: string; login: string; branch: string }
  | { mode: "local"; login: string; branch: string };

const KEY = "yy-edit-session";
export const EDIT_EVENT = "yy-edit-session";

export function readSession(): EditSession | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EditSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: EditSession | null) {
  try {
    if (session) window.sessionStorage.setItem(KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(KEY);
  } catch {
    // 저장할 수 없는 브라우저(사생활 보호 모드 등) — 이 페이지에서만 유지
  }
  window.dispatchEvent(new Event(EDIT_EVENT));
}
