"use client";

import { FileUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deleteStory, loadStories, pad, readStoryHtml, saveStory, type StoryEntry } from "@/lib/edit/content";
import type { EditSession } from "@/lib/edit/session";
import { cleanNewsletter, footerFound, parseNewsletter } from "@/lib/newsletter-html";
import type { EditRequest } from "./EditContext";
import { Drawer, Field, Notice, Spinner, textButton, Toggle } from "./ui";

type Saved = (sha: string | null, message: string, goTo?: string) => void;

/** 뉴스레터 올리기(vol: null) · 수정 */
export function StoryEditor({ session, vol, onClose, onSaved }: { session: EditSession; vol: number | null; onClose: () => void; onSaved: Saved }) {
  const isNew = vol === null;
  const [ready, setReady] = useState(false);
  const [number, setNumber] = useState("");
  const [published, setPublished] = useState(true);
  const [taken, setTaken] = useState<Set<number>>(new Set());
  const [html, setHtml] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [changedFile, setChangedFile] = useState(false);
  const [busy, setBusy] = useState<"" | "save" | "delete">("");
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await loadStories(session);
      if (!alive) return;
      setTaken(new Set(list.map((s) => s.vol)));
      if (isNew) {
        setNumber(String((list[0]?.vol ?? 0) + 1));
      } else {
        const entry = list.find((s) => s.vol === vol);
        if (!entry) throw new Error("이 뉴스레터를 찾지 못했습니다. 이미 지워졌을 수 있습니다.");
        setNumber(String(entry.vol));
        setPublished(entry.published);
        setHtml(await readStoryHtml(session, entry));
        setFileName(entry.html.split("/").pop() ?? "");
      }
      setReady(true);
    })().catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [isNew, session, vol]);

  const volNum = Number(number);
  const numberError = !Number.isInteger(volNum) || volNum < 1 ? "호수를 숫자로 넣어 주세요." : isNew && taken.has(volNum) ? `Vol.${pad(volNum)}은 이미 있습니다.` : "";
  const fileError = !html ? "뉴스레터 HTML 파일을 올려 주세요." : "";
  const info = useMemo(() => (html ? parseNewsletter(html, volNum || 0) : null), [html, volNum]);
  const preview = useMemo(() => (html ? cleanNewsletter(html) : ""), [html]);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!/\.html?$/i.test(file.name)) {
      setError("HTML 파일(.html)을 올려 주세요.");
      return;
    }
    setError("");
    setHtml(await file.text());
    setFileName(file.name);
    setChangedFile(true);
  };

  const save = async () => {
    setTried(true);
    if (numberError || fileError) return;
    setBusy("save");
    setError("");
    try {
      const sha = await saveStory(session, { vol: volNum, published }, isNew || changedFile ? html : null, isNew);
      onSaved(sha, isNew ? `Vol.${pad(volNum)}을 올렸습니다.` : `Vol.${pad(volNum)}을 저장했습니다.`, published ? `/about/story/yy-notes-vol-${pad(volNum)}` : "/about/story");
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장하지 못했습니다.");
      setBusy("");
    }
  };

  const remove = async () => {
    if (vol === null || !window.confirm(`Vol.${pad(vol)}을 지울까요? 사이트에서 사라지고 HTML 파일도 지워집니다.`)) return;
    setBusy("delete");
    try {
      const sha = await deleteStory(session, vol);
      onSaved(sha, `Vol.${pad(vol)}을 지웠습니다.`, "/about/story");
    } catch (e) {
      setError(e instanceof Error ? e.message : "지우지 못했습니다.");
      setBusy("");
    }
  };

  return (
    <Drawer
      title={isNew ? "뉴스레터 올리기" : `Vol.${pad(vol)} 수정`}
      onClose={onClose}
      busy={Boolean(busy)}
      footer={
        ready && (
          <>
            <button type="button" onClick={save} disabled={Boolean(busy)} className="btn btn-primary min-w-32">
              {busy === "save" ? (
                <>
                  <Spinner /> 저장 중
                </>
              ) : isNew ? (
                "올리기"
              ) : (
                "저장"
              )}
            </button>
            <button type="button" onClick={onClose} disabled={Boolean(busy)} className="btn btn-secondary">
              취소
            </button>
            {!isNew && (
              <button type="button" onClick={remove} disabled={Boolean(busy)} className={`${textButton} ml-auto`}>
                {busy === "delete" ? "지우는 중…" : "뉴스레터 삭제"}
              </button>
            )}
          </>
        )
      }
    >
      {error && (
        <div className="mb-6">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      {!ready ? (
        !error && (
          <p className="flex items-center gap-3 text-ash">
            <Spinner /> 불러오는 중
          </p>
        )
      ) : (
        <div className="grid gap-6">
          <Field label="호수" required hint={isNew ? "숫자만. 예: 3 → Vol.03 (큰 번호가 목록 맨 앞)" : "호수는 바꿀 수 없습니다. 바꾸려면 지우고 새로 올려 주세요."} error={tried ? numberError : ""}>
            {(p) => (
              <input id={p.id} aria-describedby={p.describedBy} className={`${p.className} font-en tabular-nums`} inputMode="numeric" value={number} readOnly={!isNew} onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} />
            )}
          </Field>

          <div className="grid gap-2">
            <p className="text-[14px] font-medium">
              뉴스레터 HTML 파일{isNew && <span className="ml-1.5 text-[12px] font-normal text-ash">필수</span>}
            </p>
            <input type="file" accept=".html,.htm,text/html" className="sr-only" id="edit-story-file" onChange={(e) => pick(e.target.files?.[0])} />
            <label htmlFor="edit-story-file" className={`flex min-h-20 cursor-pointer items-center justify-center gap-3 border border-dashed px-4 py-5 text-[14px] transition-colors hover:border-charcoal ${tried && fileError ? "border-charcoal" : "border-stone"}`}>
              <FileUp className="size-5 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block font-medium">{fileName ? (isNew ? "다른 파일 고르기" : "파일 바꾸기") : "파일 고르기"}</span>
                <span className="block truncate text-[13px] text-ash">{fileName || "메일 발송에 쓴 .html 파일"}</span>
              </span>
            </label>
            {tried && fileError && <p className="text-[13px]">{fileError}</p>}
          </div>

          <Toggle checked={published} onChange={setPublished} label="사이트에 공개" hint="끄면 목록과 글 화면에서 숨겨집니다(파일은 남음)." />

          {info && (
            <div className="grid gap-4">
              <p className="text-[14px] font-medium">카드에 들어갈 내용 (HTML에서 자동으로 읽음)</p>
              <dl className="grid gap-2 border-y border-stone py-4 text-[14px]">
                {[
                  ["제목", info.title],
                  ["요약", info.summary || "—"],
                  ["발행 시기", info.issue || "—"],
                  ["대표 사진", info.hasImage ? "본문 첫 번째 사진" : "없음"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
                    <dt className="text-ash">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              {html && !footerFound(html) && <Notice>메일 하단(회사 정보 · 수신거부)을 찾지 못해 그대로 보입니다. 메일 틀이 바뀌었다면 개발 담당에게 알려 주세요.</Notice>}
              <p className="text-[14px] font-medium">미리보기</p>
              <iframe title="뉴스레터 미리보기" srcDoc={preview} sandbox="" className="h-[60svh] w-full border border-stone bg-paper" />
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

/** 뉴스레터 전체 관리 — 숨긴 호 포함 */
export function StoriesManager({ session, onClose, onOpen }: { session: EditSession; onClose: () => void; onOpen: (request: EditRequest) => void }) {
  const [list, setList] = useState<StoryEntry[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    loadStories(session)
      .then((l) => alive && setList(l))
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [session]);

  return (
    <Drawer
      title="뉴스레터 관리"
      onClose={onClose}
      footer={
        <button type="button" onClick={() => onOpen({ type: "story", vol: null })} className="btn btn-primary">
          + 뉴스레터 올리기
        </button>
      }
    >
      {error && <Notice tone="error">{error}</Notice>}
      {!list ? (
        !error && (
          <p className="flex items-center gap-3 text-ash">
            <Spinner /> 불러오는 중
          </p>
        )
      ) : list.length === 0 ? (
        <p className="text-ash">아직 올린 뉴스레터가 없습니다.</p>
      ) : (
        <ul className="border-t border-stone">
          {list.map((s) => (
            <li key={s.vol} className="flex items-center gap-4 border-b border-stone py-3">
              <span className="font-en text-[15px] font-semibold tabular-nums">YY NOTES Vol.{pad(s.vol)}</span>
              <span className={`text-[13px] ${s.published ? "text-ash" : "font-medium"}`}>{s.published ? "공개" : "숨김"}</span>
              <button type="button" onClick={() => onOpen({ type: "story", vol: s.vol })} className={`${textButton} ml-auto`}>
                수정
              </button>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
