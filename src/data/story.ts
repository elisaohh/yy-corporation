/**
 * ABOUT › STORY (/about/story) — 뉴스레터 YY NOTES 게시판(최신 호가 위).
 * 글은 storyPosts에 추가한다. 이미지는 자료/10_STORY/<slug>-NN.jpg → node scripts/build-story-images.mjs
 * 본문은 블록 목록(blocks)으로 쓴다 — 아래 StoryBlock 종류 참고. 지어낸 글 · 실적은 넣지 않는다.
 * Vol.01 · Vol.02는 뉴스레터 HTML의 문구를 그대로 옮겼다(메일 머리 · 바닥 · 수신거부 영역 제외).
 */

export type StoryImage = { src: string; alt: string; width: number; height: number };

export type StoryBlock =
  /** 본문 문단 */
  | { type: "p"; text: string }
  /** 작은 회색 글 — 서명 · 출처 */
  | { type: "note"; text: string }
  | ({ type: "image" } & StoryImage)
  /** 꼭지 제목 — 영문 라벨 · 한글 머리 · 큰 제목 */
  | { type: "heading"; label: string; kicker: string; title: string }
  /** 규격 표(두 단) */
  | { type: "spec"; label: string; rows: [string, string][] }
  /** 줄 목록 — 왼쪽 용어 · 가운데 설명 · 오른쪽 보조 */
  | { type: "rows"; rows: { term: string; text: string; aside?: string }[]; termStyle?: "serif" | "bold" }
  /** 버튼 · 링크 */
  | { type: "cta"; primary: { label: string; href: string }; secondary?: { label: string; href: string } }
  /** 두 단 — 각 단에 블록 */
  | { type: "columns"; columns: StoryBlock[][] };

export interface StoryPost {
  slug: string;
  /** 호수(정렬 기준, 클수록 최신) */
  vol: number;
  title: string;
  /** 발행 시기 — 표시용 (예: "2026.10") */
  issue: string;
  summary: string;
  /** 목록 · 상세 대표 이미지 */
  cover?: StoryImage;
  blocks: StoryBlock[];
}

export const storyIntro = {
  title: "Story",
  lead: "YY CORPORATION의 이야기를 전합니다.",
};

/** 메일 문의 링크 — 제목 · 본문 양식이 채워진 채로 메일 앱이 열린다 */
const mail = (subject: string, body: string) =>
  `mailto:sales@yycorp.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const IMG = "/assets/story";

export const storyPosts: StoryPost[] = [
  {
    slug: "yy-notes-vol-01",
    vol: 1,
    title: "퇴근길엔 하늘 한 번 봐요",
    issue: "2026.10",
    summary: "이달의 프리몰드 30ml 세럼병, 그리고 와이와이가 하는 일",
    cover: { src: `${IMG}/vol01-01.webp`, alt: "노을 지는 한강공원", width: 569, height: 436 },
    blocks: [
      { type: "image", src: `${IMG}/vol01-01.webp`, alt: "노을 지는 한강공원", width: 569, height: 436 },
      { type: "p", text: "“요즘 한강은 저녁 여섯 시쯤이면 이렇게 물들어요. 오늘 하루 바쁘게 보내시고, 퇴근길엔 하늘 한 번 올려다보시길 바라요." },
      { type: "p", text: "YY NOTES는 앞으로 한 달에 두 번, 이렇게 작은 편지로 인사드릴게요. 첫 편지에는 이달의 병과, 저희가 하는 일을 담았어요.”" },
      { type: "note", text: "와이와이 코퍼레이션" },

      { type: "heading", label: "This month's premold", kicker: "이달의 프리몰드 용기", title: "앰플이 먼저 알아본 병" },
      { type: "image", src: `${IMG}/vol01-02.webp`, alt: "햇살이 드는 테라조 위의 30ml 원형 세럼병", width: 1104, height: 998 },
      { type: "p", text: "“바닥 유리를 두껍게 남긴 원통형 30ml예요. 들어 올리면 생각보다 묵직해서, 손에 쥐는 순간 제품이 한층 고급스럽게 느껴져요." },
      { type: "p", text: "실제로 이 병으로 앰플 제품이 런칭되기도 했어요. 프리몰드라 금형 없이 바로 시작할 수 있고, 코팅 색이나 드롭퍼만 바꿔도 우리 브랜드만의 앰플이 돼요.”" },
      {
        type: "spec",
        label: "Spec",
        rows: [
          ["품번", "SL-SRSS30-03"],
          ["용량", "30ml"],
          ["재질", "유리, 투명"],
          ["형태", "원통형, 두꺼운 바닥"],
          ["넥 규격", "18파이"],
          ["MOQ", "5,000개"],
          ["리드타임", "약 30일"],
          ["부자재", "드롭퍼 매칭"],
        ],
      },
      {
        type: "cta",
        primary: {
          label: "샘플 신청하기",
          href: mail(
            "[YY NOTES] 샘플 신청 - SL-SRSS30-03",
            "안녕하세요, YY NOTES 보고 샘플 신청드립니다.\n\n■ 회사명:\n■ 담당자 / 직함:\n■ 연락처:\n■ 샘플 받으실 주소:\n■ 희망 품번: SL-SRSS30-03\n■ 희망 수량:\n■ 담을 내용물 (예: 앰플, 세럼):\n■ 희망 후가공 / 부자재:\n■ 기타 요청사항:\n",
          ),
        },
        secondary: {
          label: "견적 문의하기",
          href: mail(
            "[YY NOTES] 견적 문의 - SL-SRSS30-03",
            "안녕하세요, YY NOTES 보고 견적 문의드립니다.\n\n■ 회사명:\n■ 담당자 / 직함:\n■ 연락처:\n■ 희망 품번: SL-SRSS30-03\n■ 예상 발주 수량:\n■ 희망 후가공 / 부자재:\n■ 희망 납기:\n■ 기타 요청사항:\n",
          ),
        },
      },

      { type: "heading", label: "About us", kicker: "와이와이 코퍼레이션", title: "병 하나, 처음부터 끝까지" },
      { type: "p", text: "“브랜드에 딱 맞는 병을 찾고, 옷을 입히고, 짝을 맞춰, 문 앞까지 데려다드려요. 처음 병을 고르는 순간부터 고객의 화장대에 닿기 전까지, 그 사이의 일을 저희가 함께해요.”" },
      {
        type: "rows",
        termStyle: "serif",
        rows: [
          { term: "Find", text: "딱 맞는 병을 찾아요", aside: "프리몰드 소싱" },
          { term: "Dress", text: "브랜드의 옷을 입혀요", aside: "코팅 · 인쇄 후가공" },
          { term: "Match", text: "캡과 드롭퍼, 짝을 맞춰요", aside: "부자재 매칭" },
          { term: "Deliver", text: "문 앞까지 책임져요", aside: "발주 · 입출고 · 납품" },
        ],
      },
      { type: "note", text: "2주 뒤, 요즘 화장대 위 이야기를 들고 다시 찾아올게요." },
    ],
  },
  {
    slug: "yy-notes-vol-02",
    vol: 2,
    title: "화장대에도 계절이 있어요",
    issue: "2026.10",
    summary: "요즘 뜨는 성분, 세대마다 다른 화장대, 주목받는 브랜드",
    cover: { src: `${IMG}/vol02-02.webp`, alt: "요즘 화장대 위 세 단어: Repair, Texture, Mini", width: 1056, height: 792 },
    blocks: [
      {
        type: "columns",
        columns: [
          [
            { type: "image", src: `${IMG}/vol02-01.webp`, alt: "나무 그늘 아래 쉬는 사람들", width: 528, height: 704 },
            { type: "p", text: "“점심 먹고 잠깐 걷기 좋은 날씨예요. 나무 그늘 아래 앉아 있으면, 계절이 바뀌는 게 바람보다 햇살로 먼저 느껴지더라고요." },
            { type: "p", text: "오늘은 요즘 화장대 위 이야기를 가져왔어요.”" },
            { type: "note", text: "와이와이 코퍼레이션" },
          ],
          [
            { type: "image", src: `${IMG}/vol02-02.webp`, alt: "요즘 화장대 위 세 단어: Repair, Texture, Mini", width: 1056, height: 792 },
            { type: "p", text: "“요즘 사람들은 많이 바르기보다, 나에게 꼭 맞는 한 병을 고른대요. 피부를 다독이는 성분, 손끝에 닿는 기분 좋은 감촉, 작지만 진한 한 병처럼요.”" },
            { type: "note", text: "참고: 화해·올리브영 2026 뷰티 트렌드 리포트" },
          ],
        ],
      },

      { type: "heading", label: "This month's signal", kicker: "이달의 시장 이야기", title: "화장대에도 저마다의 계절이 있어요" },
      {
        type: "rows",
        termStyle: "bold",
        rows: [
          { term: "10·20대", text: "작은 병으로 좋은 걸 먼저 써봐요. 노화도 천천히, '슬로우에이징'" },
          { term: "30대", text: "무엇이 좋은지보다 왜 좋은지를 물어요. 효능과 브랜드 철학까지" },
          { term: "40·50대", text: "유행보다 내 피부. 기미·탄력 케어를 직접 발라보고 골라요" },
          { term: "50·60대", text: "성분표를 한 줄씩 읽어요. PDRN, 레티놀처럼 이름이 분명한 것으로" },
        ],
      },
      { type: "p", text: "“메디힐, 달바, 토리든, 리쥬란. 요즘 사랑받는 이름들을 보면, 마음을 얻는 건 결국 손에 쥐었을 때의 작은 차이더라고요. 담는 사람이 다르면, 병도 달라야 하니까요.”" },
      {
        type: "cta",
        primary: {
          label: "우리 브랜드에 맞는 병, 함께 찾아요",
          href: mail(
            "[YY NOTES] 패키지 상담 문의",
            "안녕하세요, YY NOTES 보고 연락드립니다.\n\n■ 회사명:\n■ 담당자 / 연락처:\n■ 준비 중인 제품:\n■ 주요 타깃 (연령대, 국가):\n■ 궁금한 점:\n",
          ),
        },
      },
      { type: "note", text: "참고: 올리브영, 오픈서베이, 업계 보도 (2025.12~2026.9)" },
      { type: "note", text: "다음 달 첫 편지에서는 새로운 병을 소개해 드릴게요." },
    ],
  },
];

/** 최신 호가 위로 */
export function sortedStoryPosts(): StoryPost[] {
  return [...storyPosts].sort((a, b) => b.vol - a.vol);
}

/** "2026.10" → "2026. 10" */
export function formatIssue(issue: string) {
  return issue.replaceAll(".", ". ");
}

export const volLabel = (vol: number) => `Vol.${String(vol).padStart(2, "0")}`;
