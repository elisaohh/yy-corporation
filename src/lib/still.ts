/** 개발 서버에서 주소에 ?still 이 있으면 등장 모션을 건너뛰고 완성된 화면을 바로 보여 준다(시안 캡처용). */
export function isStill(): boolean {
  return process.env.NODE_ENV === "development" && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("still");
}
