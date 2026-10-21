"use client";

import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { productCategories } from "@/data/categories";
import { deleteProduct, EditError, loadProducts, saveProduct, type NewImage, type ProductEntry } from "@/lib/edit/content";
import { toWebp } from "@/lib/edit/image";
import { fileToBase64 } from "@/lib/edit/repo";
import type { EditSession } from "@/lib/edit/session";
import { Drawer, Field, iconButton, Notice, Spinner, textButton, Toggle } from "./ui";

const EMPTY: ProductEntry = {
  code: "",
  category: "glass-bottle",
  capacity: "",
  dimensions: "",
  material: "유리",
  neck: "",
  description: "",
  home: false,
  images: [],
};

const CODE = /^[A-Za-z0-9-]+$/;

/** 제품 추가 · 수정 */
export function ProductEditor({
  session,
  code,
  onClose,
  onSaved,
}: {
  session: EditSession;
  code: string | null;
  onClose: () => void;
  onSaved: (sha: string | null, message: string, goTo?: string) => void;
}) {
  const [form, setForm] = useState<ProductEntry | null>(code ? null : EMPTY);
  const [uploads, setUploads] = useState<(NewImage & { preview: string })[]>([]);
  const [busy, setBusy] = useState<"" | "save" | "delete" | "image">("");
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!code) return;
    let alive = true;
    loadProducts(session)
      .then((list) => {
        if (!alive) return;
        const found = list.find((p) => p.code === code);
        if (found) setForm(found);
        else setError("이 제품을 찾지 못했습니다. 이미 지워졌을 수 있습니다.");
      })
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [code, session]);

  // 창을 닫을 때 미리보기 주소 정리
  const uploadsRef = useRef(uploads);
  uploadsRef.current = uploads;
  useEffect(() => () => uploadsRef.current.forEach((u) => URL.revokeObjectURL(u.preview)), []);

  const previews = useMemo(() => new Map(uploads.map((u) => [u.src, u.preview])), [uploads]);

  const codeError = !form ? "" : !form.code.trim() ? "제품 코드를 입력해 주세요." : !CODE.test(form.code.trim()) ? "영문 · 숫자 · 하이픈(-)만 쓸 수 있습니다." : "";
  const imageError = form && form.images.length === 0 ? "사진을 한 장 이상 올려 주세요." : "";

  const set = <K extends keyof ProductEntry>(key: K, value: ProductEntry[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const addImages = async (files: FileList | null) => {
    if (!files?.length || !form) return;
    setBusy("image");
    setError("");
    try {
      const base = (form.code.trim() || "product").toUpperCase();
      const stamp = Date.now().toString(36);
      const added = await Promise.all(
        [...files].map(async (file, i) => {
          const { blob, ext } = await toWebp(file);
          const src = `/assets/products/${base}_${stamp}${i}.${ext}`;
          return { src, base64: await fileToBase64(blob), preview: URL.createObjectURL(blob) };
        }),
      );
      setUploads((u) => [...u, ...added]);
      set("images", [...form.images, ...added.map((a) => a.src)]);
    } catch {
      setError("사진을 읽지 못했습니다. JPG · PNG · WEBP 파일인지 확인해 주세요.");
    } finally {
      setBusy("");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    if (!form) return;
    const images = [...form.images];
    [images[index], images[index + dir]] = [images[index + dir], images[index]];
    set("images", images);
  };

  const save = async () => {
    setTried(true);
    if (!form || codeError || imageError) return;
    setBusy("save");
    setError("");
    const clean = { ...form, code: form.code.trim(), capacity: form.capacity.trim(), dimensions: form.dimensions.trim(), material: form.material.trim(), neck: form.neck.trim(), description: form.description.trim() };
    try {
      const sha = await saveProduct(session, clean, code, uploads);
      onSaved(sha, code ? `${clean.code} 저장했습니다.` : `${clean.code} 추가했습니다.`, `/products/${clean.code.toLowerCase()}`);
    } catch (e) {
      setError(e instanceof EditError || e instanceof Error ? e.message : "저장하지 못했습니다.");
      setBusy("");
    }
  };

  const remove = async () => {
    if (!code || !window.confirm(`${code} 제품을 지울까요? 사진도 함께 지워집니다.`)) return;
    setBusy("delete");
    setError("");
    try {
      const sha = await deleteProduct(session, code);
      onSaved(sha, `${code} 지웠습니다.`, "/products");
    } catch (e) {
      setError(e instanceof Error ? e.message : "지우지 못했습니다.");
      setBusy("");
    }
  };

  return (
    <Drawer
      title={code ? "제품 수정" : "제품 추가"}
      onClose={onClose}
      busy={busy === "save" || busy === "delete"}
      footer={
        form && (
          <>
            <button type="button" onClick={save} disabled={Boolean(busy)} className="btn btn-primary min-w-32">
              {busy === "save" ? (
                <>
                  <Spinner /> 저장 중
                </>
              ) : (
                "저장"
              )}
            </button>
            <button type="button" onClick={onClose} disabled={busy === "save" || busy === "delete"} className="btn btn-secondary">
              취소
            </button>
            {code && (
              <button type="button" onClick={remove} disabled={Boolean(busy)} className={`${textButton} ml-auto`}>
                {busy === "delete" ? "지우는 중…" : "제품 삭제"}
              </button>
            )}
          </>
        )
      }
    >
      {!form ? (
        error ? <Notice tone="error">{error}</Notice> : <p className="flex items-center gap-3 text-ash"><Spinner /> 불러오는 중</p>
      ) : (
        <div className="grid gap-6">
          {error && <Notice tone="error">{error}</Notice>}

          <Field label="제품 코드" required hint="화면에는 코드만 나옵니다. 내부 제품명은 넣지 마세요." error={tried ? codeError : ""}>
            {(p) => <input id={p.id} aria-describedby={p.describedBy} className={`${p.className} font-en`} value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="예: YS-SRRR30-04" autoComplete="off" />}
          </Field>

          <Field label="종류">
            {(p) => (
              <select id={p.id} className={p.className} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {productCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label} ({c.labelKo})
                  </option>
                ))}
              </select>
            )}
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="용량" hint="예: 30ml">
              {(p) => <input id={p.id} aria-describedby={p.describedBy} className={p.className} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />}
            </Field>
            <Field label="사이즈" hint="예: 38.0 × 74.4">
              {(p) => <input id={p.id} aria-describedby={p.describedBy} className={p.className} value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} />}
            </Field>
            <Field label="재질">
              {(p) => <input id={p.id} className={p.className} value={form.material} onChange={(e) => set("material", e.target.value)} />}
            </Field>
            <Field label="병목 규격" hint="예: Ø18 — 비우면 나오지 않습니다.">
              {(p) => <input id={p.id} aria-describedby={p.describedBy} className={p.className} value={form.neck} onChange={(e) => set("neck", e.target.value)} />}
            </Field>
          </div>

          <Field label="설명" hint="제품 상세의 제목 아래 문단. 비워도 됩니다.">
            {(p) => <textarea id={p.id} aria-describedby={p.describedBy} rows={3} className={`${p.className} resize-y leading-[1.7]`} value={form.description} onChange={(e) => set("description", e.target.value)} />}
          </Field>

          <Toggle checked={form.home} onChange={(v) => set("home", v)} label="홈에 보이기" hint="홈 PRODUCT에 나옵니다. 넓은 화면에서 한 줄에 5개." />

          <div className="grid gap-3">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[14px] font-medium">
                사진<span className="ml-1.5 text-[12px] font-normal text-ash">필수</span>
              </p>
              <p className="text-[13px] text-ash">첫 번째 = 대표, 두 번째 = 마우스 올림</p>
            </div>
            {form.images.length > 0 && (
              <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {form.images.map((src, i) => (
                  <li key={src} className="grid gap-2">
                    <div className="relative aspect-square bg-card">
                      {/* eslint-disable-next-line @next/next/no-img-element -- 올리기 전 미리보기 포함 */}
                      <img src={previews.get(src) ?? src} alt={`사진 ${i + 1}`} className="absolute inset-[8%] size-[84%] object-contain mix-blend-multiply" />
                      {i < 2 && <span className="absolute top-1.5 left-1.5 bg-paper px-1.5 py-0.5 text-[11px] font-medium">{i === 0 ? "대표" : "올림"}</span>}
                    </div>
                    <div className="flex justify-between gap-1">
                      <button type="button" className={iconButton} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`사진 ${i + 1} 앞으로`}>
                        <ArrowLeft className="size-4" aria-hidden="true" />
                      </button>
                      <button type="button" className={iconButton} onClick={() => set("images", form.images.filter((s) => s !== src))} aria-label={`사진 ${i + 1} 빼기`}>
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                      <button type="button" className={iconButton} disabled={i === form.images.length - 1} onClick={() => move(i, 1)} aria-label={`사진 ${i + 1} 뒤로`}>
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="sr-only" id="edit-product-images" onChange={(e) => addImages(e.target.files)} />
            <label htmlFor="edit-product-images" className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-6 text-center text-[14px] transition-colors hover:border-charcoal ${tried && imageError ? "border-charcoal" : "border-stone"}`}>
              {busy === "image" ? (
                <span className="flex items-center gap-2 text-ash">
                  <Spinner /> 사진 줄이는 중
                </span>
              ) : (
                <>
                  <ImagePlus className="size-5" aria-hidden="true" />
                  <span className="font-medium">사진 올리기</span>
                  <span className="text-[13px] text-ash">여러 장 한꺼번에 · 정사각형 흰 배경 권장 · 자동으로 가볍게 바뀝니다</span>
                </>
              )}
            </label>
            {tried && imageError && <p className="text-[13px]">{imageError}</p>}
          </div>
        </div>
      )}
    </Drawer>
  );
}
