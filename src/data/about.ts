/**
 * ABOUT 문구 — 회사가 직접 작성한 자료에서만 가져온다(새 사실을 만들지 않음).
 *   엑셀: 홈페이지_콘텐츠제작_가이드 ABOUT 시트(고객 작성란) · MAIN 시트
 *   YY NOTES Vol.01 회사 소개
 * 긴 원문은 문장 단위로 나눠 순서대로 등장시킨다. 표현은 원문 그대로 두고 일부 문장만 발췌했다.
 * 엑셀의 '플라스틱 용기'는 현재 사이트 범위(유리 용기) 밖이라 싣지 않았다.
 */

export const aboutIntro = {
  title: "About",
  /** YY NOTES 공식 문구 */
  slogan: "병 하나, 처음부터 끝까지",
  lead: "브랜드에 딱 맞는 병을 찾고, 옷을 입히고, 짝을 맞춰, 문 앞까지 데려다드려요.",
  source: "YY NOTES Vol.01 회사 소개",
};

export const story = {
  label: "Our Story",
  title: "친환경 유리의 감성으로 브랜드의 꿈을 실현하고, 환경에 기여하다",
  sentences: [
    "플라스틱 남용으로 인한 환경 문제가 대두되는 오늘날, YY코퍼레이션은 ‘지속 가능한 아름다움’에 대한 깊은 고민에서 출발했습니다.",
    "우리는 사출(플라스틱) 용기를 대체할 수 있는 친환경 소재인 ‘유리’ 특유의 맑고 투명한 감성, 그리고 변치 않는 보존성에 주목했습니다.",
    "화장품 브랜드사들이 그리던 이상적인 패키징의 꿈을 유리의 고급스러운 감성으로 실현시켜 드리는 것, 그리고 그 과정을 통해 지구 환경 보호에 기여하는 선한 영향력을 펼치고자 YY코퍼레이션을 설립하게 되었습니다.",
  ],
  source: "엑셀 ABOUT 시트 ① 회사 설립 배경",
};

export const vision = {
  label: "Our Vision",
  statement: "지속가능한 패키징 솔루션으로 뷰티 브랜드의 성공을 이끄는 글로벌 턴키 파트너",
  pillars: [
    {
      en: "Total Turnkey Expertise",
      ko: "완벽한 원스톱 턴키 솔루션",
      body: "디자인 제안, 국내 · 해외 부자재 소싱, 정밀 후가공, 품질 검사 및 배송까지 하나의 창구로 통합합니다. 고객사가 마케팅과 브랜드 성장에만 집중할 수 있도록 지원합니다.",
    },
    {
      en: "Brand Success & Value Creation",
      ko: "브랜드 가치와 성공의 동반자",
      body: "유리 특유의 고급스러운 감성과 디테일한 후가공 기술로 브랜드 고유의 아이덴티티를 시각화합니다. 고객사의 성공이 곧 YY코퍼레이션의 성공이라는 가치 아래 움직입니다.",
    },
  ],
  quote:
    "우리는 친환경 유리의 아름다운 감성과 무결점 턴키 프로세스로, 세상의 모든 뷰티 브랜드가 자신만의 빛나는 성공을 완벽히 담아낼 수 있도록 존재합니다.",
  source: "엑셀 ABOUT 시트 ③ 기업 비전",
};

/** 핵심 가치 — 큰 01/02/03/04 숫자 + 영문 키워드 + 한글 설명(부록 E) */
export const values = [
  { key: "Quality", line: "철저한 품질관리" },
  { key: "Innovation", line: "지속적인 제품 개발" },
  { key: "Trust", line: "고객과의 신뢰" },
  { key: "Partnership", line: "함께 성장하는 협력" },
];
export const valuesSource = "엑셀 ABOUT 시트 ④ 사업 방향 — 핵심 가치";

/**
 * 전문 역량 — SOURCING / FINISHING / MATCHING / DELIVERY (부록 E).
 * service: HOME의 FIND · DRESS · MATCH · DELIVER와 같은 짝(YY NOTES).
 */
export const expertise = [
  {
    key: "Sourcing",
    service: "Find",
    line: "딱 맞는 병을 찾아요",
    body: "스킨케어(드롭퍼), 크림(헤비보텀), 바디용품 등 트렌드와 용도에 맞는 유리 용기를 기획하고 공급합니다. 글로벌 소싱 네트워크로 경쟁력 있는 단가와 유니크한 디자인을 제안합니다.",
  },
  {
    key: "Finishing",
    service: "Dress",
    line: "브랜드의 옷을 입혀요",
    body: "코팅, 실크스크린, 박, 형압 등 브랜드의 아이덴티티와 감성을 살리는 후가공을 통합 관리합니다.",
  },
  {
    key: "Matching",
    service: "Match",
    line: "캡과 드롭퍼, 짝을 맞춰요",
    body: "유리 용기와 결합 · 호환되는 캡, 펌프, 스포이드 등 맞춤형 부자재를 턴키로 소싱합니다.",
  },
  {
    key: "Delivery",
    service: "Deliver",
    line: "문 앞까지 책임져요",
    body: "품질 검사부터 발주 · 입출고 · 납품까지, 고객의 화장대에 닿기 전까지의 일을 함께합니다.",
  },
];
export const expertiseSource = "엑셀 ABOUT 시트 ② 회사 소개 · ③ 기업 비전, YY NOTES Vol.01";

/**
 * ABOUT 배경 · 사진 (2026-10-15) — 현장 사진(public/assets/site, 사용자 결정으로 사용)과 히어로 사진.
 * 교체할 때 이 경로만 바꾼다. video를 넣으면(예: "/assets/about/vision.mp4") 비전 구간 배경이 영상으로 바뀐다.
 */
export const aboutMedia = {
  /** 머리 영역 — PRODUCT와 같은 밝은 미스트 + 떠다니는 병(PRODUCT와 다른 사진) */
  intro: "/assets/products/YS-SRRR50-02/YS-SRRR50-02_04.webp",
  story: "/assets/products/YS-SRRR30-04/YS-SRRR30-04_04.webp",
  /** 비전 배경 영상 — Pexels "Slow Motion of a Grey Ink in Water"(6071224, 무료 라이선스) */
  vision: { image: "/assets/site/site-08.webp", video: "/assets/about/vision-ink.mp4" as string | null },
  expertise: {
    Sourcing: "/assets/site/site-05.webp",
    Finishing: "/assets/site/site-11.webp",
    Matching: "/assets/site/site-09.webp",
    Delivery: "/assets/site/site-15.webp",
  } as Record<string, string>,
};

/**
 * 비전 배경 영상 후보(2026-10-15 2차: 실물 대신 톤에 맞는 추상 배경, Pexels 무료 라이선스) — 개발 서버에서 /about?vision=1~6 로 미리보기.
 * 미리보기는 Pexels 서버에서 바로 재생한다. 결정하면 파일을 받아 public/assets/about/ 에 두고 aboutMedia.vision.video 에 연결한다.
 */
export const visionVideoCandidates = [
  { label: "벽에 비친 유리 빛 무늬", page: "https://www.pexels.com/video/shadow-of-patterns-reflected-on-the-wall-6392258/", src: "https://videos.pexels.com/video-files/6392258/6392258-hd_1366_720_24fps.mp4" },
  { label: "물잔을 통과한 빛 반사", page: "https://www.pexels.com/video/light-reflections-through-glass-of-water-6585633/", src: "https://videos.pexels.com/video-files/6585633/6585633-hd_1280_720_30fps.mp4" },
  { label: "맑은 물 표면의 빛 일렁임", page: "https://www.pexels.com/video/sunlight-reflections-on-clear-water-surface-34308148/", src: "https://videos.pexels.com/video-files/34308148/14534370_1280_720_30fps.mp4" },
  { label: "검은 배경의 연기", page: "https://www.pexels.com/video/close-up-shot-of-smoke-on-a-black-background-4320603/", src: "https://videos.pexels.com/video-files/4320603/4320603-hd_1280_720_24fps.mp4" },
  { label: "물속에 퍼지는 회색 잉크(슬로 모션)", page: "https://www.pexels.com/video/slow-motion-of-a-grey-ink-in-water-6071224/", src: "https://videos.pexels.com/video-files/6071224/6071224-hd_1280_720_30fps.mp4" },
  { label: "천천히 움직이는 금빛 액체", page: "https://www.pexels.com/video/golden-liquid-moving-6895129/", src: "https://videos.pexels.com/video-files/6895129/6895129-hd_1280_720_30fps.mp4" },
];
