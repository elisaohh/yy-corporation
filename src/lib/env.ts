/** 환경 변수 읽기 — 붙여 넣을 때 딸려 온 앞뒤 빈칸 · 줄바꿈을 지운다(값이 없으면 undefined) */
export function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}
