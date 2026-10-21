import { productCategories } from "@/data/categories";

/**
 * 예비 관리 화면(/admin/cms, Decap CMS) 설정 — 평소에는 사이트 위 편집(/admin 로그인)을 쓴다.
 * 저장하면 GitHub 저장소에 바로 기록되고, Vercel이 사이트를 다시 만들어 1~2분 뒤 반영된다(서버 · DB 없음).
 */

export const CMS_REPO = "elisaohh/yy-corporation";

export function cmsConfig({ branch, baseUrl, local }: { branch: string; baseUrl: string; local: boolean }) {
  return {
    load_config_file: false,
    locale: "ko",
    local_backend: local,
    backend: {
      name: "github",
      repo: CMS_REPO,
      branch,
      base_url: baseUrl,
      auth_endpoint: "api/decap/auth",
      commit_messages: {
        create: "관리 화면: {{collection}} 새로 올림 — {{slug}}",
        update: "관리 화면: {{collection}} 수정 — {{slug}}",
        delete: "관리 화면: {{collection}} 삭제 — {{slug}}",
        uploadMedia: "관리 화면: 파일 올림 — {{path}}",
        deleteMedia: "관리 화면: 파일 삭제 — {{path}}",
      },
    },
    media_folder: "public/assets/products",
    public_folder: "/assets/products",
    collections: [
      {
        name: "products",
        label: "PRODUCT 제품",
        description: "목록 순서가 화면 순서입니다. '홈에 보이기'를 켠 제품만 홈 PRODUCT에 나옵니다(넓은 화면 한 줄 5개).",
        editor: { preview: false },
        files: [
          {
            name: "products",
            label: "제품 목록",
            file: "content/products.json",
            fields: [
              {
                name: "items",
                label: "제품",
                label_singular: "제품",
                widget: "list",
                summary: "{{fields.code}} · {{fields.capacity}}",
                collapsed: true,
                fields: [
                  {
                    name: "code",
                    label: "제품 코드",
                    widget: "string",
                    hint: "예: YS-SRRR30-04 — 화면에는 코드만 나옵니다. 내부 제품명은 넣지 마세요.",
                    pattern: ["^[A-Za-z0-9-]+$", "영문 · 숫자 · 하이픈(-)만 쓸 수 있습니다."],
                  },
                  {
                    name: "category",
                    label: "종류",
                    widget: "select",
                    default: "glass-bottle",
                    options: productCategories.map((c) => ({ label: `${c.label} (${c.labelKo})`, value: c.slug })),
                  },
                  { name: "capacity", label: "용량", widget: "string", required: false, hint: "예: 30ml" },
                  { name: "dimensions", label: "사이즈", widget: "string", required: false, hint: "예: 38.0 × 74.4" },
                  { name: "material", label: "재질", widget: "string", required: false, default: "유리" },
                  { name: "neck", label: "병목 규격", widget: "string", required: false, hint: "예: Ø18 — 비우면 화면에 나오지 않습니다." },
                  { name: "description", label: "설명", widget: "text", required: false, hint: "제품 상세의 제목 아래 문단. 비워도 됩니다." },
                  { name: "home", label: "홈에 보이기", widget: "boolean", default: false, required: false },
                  {
                    name: "images",
                    label: "사진",
                    label_singular: "사진",
                    widget: "list",
                    min: 1,
                    hint: "첫 번째 = 대표 사진, 두 번째 = 마우스를 올렸을 때 사진. 정사각형 · 흰 배경 권장, 파일 이름은 코드_01처럼.",
                    field: { name: "image", label: "사진", widget: "image", choose_url: false },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "story",
        label: "STORY 뉴스레터",
        label_singular: "뉴스레터",
        description: "메일로 보낸 뉴스레터 HTML 파일을 올리면 카드(제목 · 요약 · 사진)와 글 화면이 자동으로 만들어집니다.",
        folder: "content/story",
        extension: "json",
        format: "json",
        create: true,
        delete: true,
        identifier_field: "vol",
        slug: "vol-{{fields.vol}}",
        summary: "Vol.{{fields.vol}}",
        sortable_fields: ["vol"],
        media_folder: "/content/story/files",
        public_folder: "/content/story/files",
        editor: { preview: false },
        fields: [
          { name: "vol", label: "호수", widget: "number", value_type: "int", min: 1, hint: "숫자만. 예: 3 → Vol.03" },
          {
            name: "html",
            label: "뉴스레터 HTML 파일",
            widget: "file",
            choose_url: false,
            hint: "메일 발송에 쓴 .html 파일. 메일 하단(회사 정보 · 수신거부)은 사이트에서 자동으로 숨겨집니다.",
          },
          { name: "published", label: "사이트에 공개", widget: "boolean", default: true, required: false },
        ],
      },
    ],
  };
}
