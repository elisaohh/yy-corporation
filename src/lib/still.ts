/** 주소에 ?still 이 있으면 등장 모션을 건너뛰고 완성된 화면을 바로 보여 준다(화면 캡처 · 피그마 가져오기 · 검수용). 배포 사이트에서도 동작한다. */
export function isStill(): boolean {
  return typeof window !== "undefined" && new URLSearchParams(window.location.search).has("still");
}
