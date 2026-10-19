"use client";

import { useEffect } from "react";

/**
 * 사진 · 영상 쉽게 저장하기 막기 — 이미지 위 마우스 오른쪽 메뉴, 끌어서 저장을 막는다.
 * (휴대폰 길게 눌러 저장 · 끌기 방지는 globals.css의 img · video 규칙)
 * ⚠ 화면 캡처(스크린샷)와 개발자 도구로 파일을 받는 것은 웹에서 막을 수 없다 — 쉽게 저장하는 경로만 차단.
 */
export function ImageGuard() {
  useEffect(() => {
    const isMedia = (t: EventTarget | null) => t instanceof Element && !!t.closest("img, picture, video, svg image");
    const block = (e: Event) => {
      if (isMedia(e.target)) e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);
  return null;
}
