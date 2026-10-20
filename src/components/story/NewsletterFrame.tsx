"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 뉴스레터 원본 HTML을 그대로 보여 주는 틀 — 사이트 스타일과 섞이지 않게 iframe(srcDoc)에 넣고,
 * 내용 높이에 맞춰 늘어나 스크롤이 이중으로 생기지 않게 한다. 스크립트는 실행하지 않는다(sandbox).
 */
export function NewsletterFrame({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let ro: ResizeObserver | null = null;
    const fit = () => {
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      setHeight(Math.ceil(doc.documentElement.scrollHeight));
      if (!ro) {
        ro = new ResizeObserver(() => setHeight(Math.ceil(doc.documentElement.scrollHeight)));
        ro.observe(doc.body);
      }
    };
    frame.addEventListener("load", fit);
    fit();
    return () => {
      frame.removeEventListener("load", fit);
      ro?.disconnect();
    };
  }, [html]);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={html}
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      className="block w-full border-0 bg-paper"
      style={{ height }}
    />
  );
}
