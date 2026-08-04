// 일정 화면과 오늘 일정 카드에서 사용하는 일정 데이터입니다.
// id는 day-1 형식을 유지하고, date는 YYYY-MM-DD 형식으로 입력하세요.

const sleepPrepEvent = {
  time: "마무리",
  title: "온천 및 취침 준비",
};

export const scheduleItems = [
  {
    // 1일차
    id: "day-1",
    category: "schedule",
    title: "DAY 1 — 2026.08.11 (화) 일본 선교 시작",
    date: "2026-08-11",
    schedule: [
      {
        section: "아침 일정",
        time: "03:00 ~ 03:30",
        title: "이촌동교회 집합 및 이동 시작",
      },
      { section: "아침 일정", time: "05:00", title: "인천국제공항 도착" },
      {
        section: "아침 일정",
        time: "07:10",
        title: "비행기 탑승",
        note: "제주항공 7C1501",
      },
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
      { ...sleepPrepEvent },
    ],
    tags: ["일정"],
  },
  {
    // 2일차
    id: "day-2",
    category: "schedule",
    title: "DAY 2 — 2026.08.12 (수) 노방전도",
    date: "2026-08-12",
    schedule: [
      {
        time: "08:00",
        title: "기상 및 아침 식사",
        note: "아침 당번 : 김영창, 박정원, 오윤지 ",
      },
      {
        time: "09:30",
        title: "오전 예배",
        note: "본문 : 누가복음 13장 31~35절",
      },
      {
        time: "10:30 ~ 12:00",
        title: "노방전도 준비 및 이동",
      },
      { time: "12:00 ~ 13:00", title: "점심 식사" },
      {
        time: "13:00 ~ 18:00",
        title: "노방전도",
        note: "훗카이도국립대학, 오도리공원",
      },
      { time: "18:00 ~ 21:00", title: "저녁 식사 및 복귀" },
      {
        time: "21:30 ~ 22:30",
        title: "저녁 집회",
        note: "본문 : 요한복음 10장 27절",
      },
      { ...sleepPrepEvent },
    ],
    tags: ["일정"],
  },
  {
    // 3일차
    id: "day-3",
    category: "schedule",
    title: "DAY 3 — 2026.08.13 (목) 문화교류회",
    date: "2026-08-13",
    schedule: [
      {
        time: "08:00",
        title: "기상 및 아침 식사",
        note: "아침 당번 : 이재영, 이후성, 윤예준",
      },
      {
        time: "09:00 ~ 10:00",
        title: "일본 선교 부흥예배",
        note: "본문 : 마가복음 2장 1~12절",
      },
      {
        section: "문화교류 일정",
        time: "~ 15:30",
        title: "휴식 및 이동",
        note: "장보기, 필요 물품 구매, 리허설, 재료손질등 ",
      },
      {
        section: "문화교류 일정",
        time: "16:00",
        title: "접수",
      },
      {
        section: "문화교류 일정",
        time: "16:30",
        title: "문화교류회 시작",
        note: "오프닝 \n1. 찬양 ( 꽃들도, 더 원합니다 )\n2. 간증 : 김준서\n3. K-pop 댄스\n4. 레크레이션\n5. 노래",
      },
      {
        section: "문화교류 일정",
        time: "18:00",
        title: "k-푸드 체험",
        note: "김밥, 불고기, 잡채, 떡볶이",
      },
      {
        section: "문화교류 일정",
        time: "19:30",
        title: "정리 및 마무리, 숙소복귀",
      },
      {
        section: "문화교류 일정",
        time: "21:30",
        title: "저녁 예배",
        note: "본문 : 시편 62편 5절",
      },
      { ...sleepPrepEvent },
    ],
    tags: ["일정"],
  },
  {
    // 4일차
    id: "day-4",
    category: "schedule",
    title: "DAY 4 — 2026.08.14 (금) 비전트립",
    date: "2026-08-14",
    schedule: [
      {
        time: "08:00",
        title: "기상 및 아침 식사",
        note: "아침 당번 : 강호선, 김나연, 김준서",
      },
      {
        time: "08:30",
        title: "아침 예배",
        note: "본문 : 누가복음 17장 7~10절",
      },
      { time: "09:00", title: "조별 모임" },
      {
        time: "09:10 ~ 18:30",
        title: "비전트립",
      },
      { time: "18:30", title: "숙소 복귀" },
      { time: "19:00", title: "저녁 식사" },
      { time: "20:00", title: "비전트립 나눔" },
      { time: "21:00", title: "정리 예배", note: "본문 : 시편 62편 5절" },
      { ...sleepPrepEvent },
    ],
    tags: ["일정"],
  },
  {
    // 5일차
    id: "day-5",
    category: "schedule",
    title: "DAY 5 — 2026.08.15 (토) 귀국",
    date: "2026-08-15",
    schedule: [
      {
        time: "08:00",
        title: "기상 및 아침 식사",
        note: "아침 당번 : 김영욱, 김자영, 노주아",
      },
      { time: "09:00", title: "마무리 예배 및 공항 출발" },
      {
        section: "1팀 6명",
        time: "10:30",
        title: "삿포로 치토세공항 도착 및 간단한 점심",
      },
      {
        section: "1팀 6명",
        time: "12:55",
        title: "일본 출국(1팀)",
        note: "이스타항공 ZE626",
      },
      { section: "1팀 6명", time: "16:00", title: "인천국제공항 도착" },
      {
        section: "2팀 5명",
        time: "14:30",
        title: "일본 출국(2팀)",
        note: "티웨이항공 TW264",
      },
      { section: "2팀 5명", time: "17:40", title: "인천국제공항 도착" },
    ],
    tags: ["일정"],
  },
];
