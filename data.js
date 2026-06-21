export const handbookItems = [
  // 안내
  {
    id: "info-1",
    category: "info",
    title: "안내",
    body: `기간 : 2026.8.11(화) ~ 2026.8.15(토), 4박 5일
장소 : 삿포로
교회 : 삿포로 가스펠교회
숙소 : 마나 프리룸
주소 : 4-chōme-410 Hanakawa Minami 8 Jō
인원 : 11명`,
    tags: ["안내"],
  },
  {
    id: "info-2",
    category: "info",
    title: "8월 15일 귀국 정보(6명) / 12시 55분",
    body: `● 김나연
    ● 김준서
    ● 오윤지
    ● 박정원
    ● 이재영
    ● 이후성 `,
    tags: ["안내"],
  },
  {
    id: "info-3",
    category: "info",
    title: "8월 15일 귀국 정보(5명) / 14시 30분",
    body: `● 강호선
    ● 김영창
    ● 김영욱
    ● 김자영
    ● 노주아`,
    tags: ["안내"],
  },
  // 일정
  {
    id: "day-1",
    category: "schedule",
    title: "DAY 1 — 2026.08.11 (화) 일본 선교 시작",
    schedule: [
      {
        section: "아침 일정",
        time: "03:00 ~ 03:30",
        title: "이촌동교회 집합 및 이동 시작",
      },
      { section: "아침 일정", time: "05:00", title: "인천국제공항 도착" },
      { section: "아침 일정", time: "07:10", title: "비행기 탑승" },
      { section: "아침 일정", time: "10:00", title: "삿포로 치토세공항 도착" },
      { section: "아침 일정", time: "11:00", title: "렌트 및 이동 / 점심식사" },
      {
        section: "아침 일정",
        time: "13:00",
        title: "가스펠교회 도착 및 짐 정리",
      },
      {
        section: "저녁 일정",
        time: "16:00",
        title: "선교사님 OT 및 선교 일정 PT",
      },
      { section: "저녁 일정", time: "18:00", title: "저녁 식사" },
      {
        section: "저녁 일정",
        time: "20:30",
        title: "저녁 예배",
        note: "선교사님 특강",
      },
    ],
    tags: ["일정"],
  },
  {
    id: "day-2",
    category: "schedule",
    title: "DAY 2 — 2026.08.12 (수) 노방전도(훗카이도국립대학)",
    schedule: [
      { time: "08:00", title: "기상 및 아침 식사" },
      { time: "09:30", title: "오전 예배 및 조 나누기" },
      {
        time: "10:30 ~ 12:00",
        title: "노방전도 준비 및 이동",
        note: "훗카이도국립대학",
      },
      { time: "12:00 ~ 13:00", title: "점심 식사" },
      { time: "13:00 ~ 18:00", title: "노방전도" },
      { time: "18:00 ~ 21:00", title: "저녁 식사 및 복귀" },
      { time: "21:30 ~ 22:30", title: "저녁 집회", note: "간증" },
    ],
    tags: ["일정"],
  },
  {
    id: "day-3",
    category: "schedule",
    title: "DAY 3 — 2026.08.13 (목) 문화교류",
    schedule: [
      {
        section: "문화교류 일정",
        time: "09:00",
        title: "기상 및 아침 식사",
      },
      {
        section: "문화교류 일정",
        time: "10:00 ~ 11:30",
        title: "일본 선교 부흥예배",
      },
      {
        section: "문화교류 일정",
        time: "~ 12:30",
        title: "휴식 및 이동",
        note: "장보기, 필요 물품 구매, 리허설, 재료손질등 ",
      },
      {
        section: "문화교류 일정",
        time: "16:00",
        title: "여는 예배",
        note: "- 찬양 ( 꽃들도, 더 원합니다 )",
      },
      {
        section: "문화교류 일정",
        time: "16:30",
        title: "문화교류 시작",
        note: "- K-pop 댄스(같이 춤 배우고 릴스 찍기)\n- 노래\n- 레크리에이션",
      },
      {
        section: "문화교류 일정",
        time: "18:00",
        title: "k-푸드 시식회",
        note: "저녁식사",
      },
      {
        section: "문화교류 일정",
        time: "19:30",
        title: "정리 및 마무리, 숙소복귀",
      },
      { section: "문화교류 일정", time: "21:30", title: "저녁 예배" },
    ],
    tags: ["일정"],
  },
  {
    id: "day-4",
    category: "schedule",
    title: "DAY 4 — 2026.08.14 (금) 비전트립",
    schedule: [
      { time: "08:00", title: "기상 및 아침 식사" },
      { time: "08:30", title: "아침 예배" },
      { time: "09:00", title: "조별 모임" },
      {
        time: "09:30",
        title: "비전트립",
        note: "점심 식사 / 여행 / 기념품 구매",
      },
      { time: "18:30", title: "숙소 복귀" },
      { time: "19:00", title: "저녁 식사" },
      { time: "20:00", title: "비전트립 나눔" },
      { time: "21:00", title: "정리 예배" },
      { time: "~", title: "짐 정리" },
    ],
    tags: ["일정"],
  },
  {
    id: "day-5",
    category: "schedule",
    title: "DAY 5 — 2026.08.15 (토) 귀국",
    schedule: [
      { time: "08:00", title: "기상 및 아침 식사" },
      { time: "09:00", title: "마무리 예배 및 공항 출발" },
      { time: "10:30", title: "삿포로 치토세공항 도착 및 간단한 점심" },
      { section: "1팀 6명", time: "12:55", title: "일본 출국" },
      { section: "1팀 6명", time: "16:00", title: "인천국제공항 도착" },
      { section: "2팀 5명", time: "14:30", title: "일본 출국" },
      { section: "2팀 5명", time: "17:40", title: "인천국제공항 도착" },
    ],
    tags: ["일정"],
  },
  // 찬양
  {
    id: "song-1",
    category: "song",
    title: "꽃들도",
    body: "",
    image: "./assets/songs/flowers.png",
    tags: ["찬양"],
  },
  {
    id: "song-2",
    category: "song",
    title: "더 원합니다",
    body: "",
    image: "./assets/songs/more.png",
    tags: ["찬양"],
  },
  // 말씀
  {
    id: "message-1",
    category: "word",
    title: "말씀",
    body: "내용을 직접 수정하세요.",
    tags: ["말씀"],
  },
  // 업데이트
  {
    id: "update-1",
    category: "update",
    title: "업데이트",
    body: `2026.06.21 패치노트
- 1. 업데이트 카테고리 설정
- 2. 3일차 일정표 수정
- 3. 4일차 일정표 수정`,
    tags: ["업데이트"],
  },
];

export const categoryLabels = {
  info: "안내",
  schedule: "일정",
  song: "찬양",
  word: "말씀",
  update: "업데이트",
};
