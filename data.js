export const handbookItems = [
  // 안내
  {
    id: "info-1",
    category: "info",
    title: "정보",
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
    //1일차
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
    //2일차
    id: "day-2",
    category: "schedule",
    title: "DAY 2 — 2026.08.12 (수) 노방전도(훗카이도국립대학)",
    date: "2026-08-12",
    schedule: [
      { time: "08:00", title: "기상 및 아침 식사" },
      { time: "09:30", title: "오전 예배 및 조 나누기" },
      {
        time: "10:30 ~ 12:00",
        title: "노방전도 준비 및 이동",
      },
      { time: "12:00 ~ 13:00", title: "점심 식사" },
      { time: "13:00 ~ 18:00", title: "노방전도", note: "훗카이도국립대학" },
      { time: "18:00 ~ 21:00", title: "저녁 식사 및 복귀" },
      { time: "21:30 ~ 22:30", title: "저녁 집회", note: "간증 - 김준서" },
    ],
    tags: ["일정"],
  },
  {
    //3일차
    id: "day-3",
    category: "schedule",
    title: "DAY 3 — 2026.08.13 (목) 문화교류",
    date: "2026-08-13",
    schedule: [
      {
        section: "문화교류 일정",
        time: "08:00",
        title: "기상 및 아침 식사",
      },
      {
        section: "문화교류 일정",
        time: "09:00 ~ 10:00",
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
    //4일차
    id: "day-4",
    category: "schedule",
    title: "DAY 4 — 2026.08.14 (금) 비전트립",
    date: "2026-08-14",
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
    ],
    tags: ["일정"],
  },
  {
    //5일차
    id: "day-5",
    category: "schedule",
    title: "DAY 5 — 2026.08.15 (토) 귀국",
    date: "2026-08-15",
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
    title: "꽃들도(花も)",
    body: "",
    image: "./assets/songs/flowers.png",
    lyrics: `<span class="lyric-label">[ 1 ]</span>
<span class="lyric-ko">이곳에 생명 샘 솓아나 눈물 골짝 지나갈 때에</span>
<span class="lyric-ja">코코니 이즈미와 와쿠 나미다오 스기루 토키</span>

<span class="lyric-ko">머잖아 열매 맺히고 웃음 소리 넘쳐나리라</span>
<span class="lyric-ja">야가테 미오 무스비 와라이고에니 미치루</span>

<span class="lyric-label">[ 2 ]</span>
<span class="lyric-ko">그 날에 하늘이 열리고 모든 이가 보게 되리라</span>
<span class="lyric-ja">아오게 텐-와 하라키 보쿠라와 미루다로</span>

<span class="lyric-ko">마침내 꽃들이 피고 영광의 주가 오시리라</span>
<span class="lyric-ja">야가테 하나와 사키 에이코노 슈가 코라레루</span>

<span class="lyric-label">[ 후렴 ]</span>
<span class="lyric-ko">꽃들도 구름도 바람도 넓은 바다도</span>
<span class="lyric-ja">하나모 쿠모모 카제모 오오우미모</span>

<span class="lyric-ko">찬양하라 찬양하라 예수를</span>
<span class="lyric-ja">카나데요 카나데요 예수오</span>

<span class="lyric-ko">하늘을 울리며 노래해 나의 영혼아</span>
<span class="lyric-ja">소라니 히비케 우타에 타마시이요</span>

<span class="lyric-ko">은혜의 주 은혜의 주 은혜의 주</span>
<span class="lyric-ja">메구미오 메구미오 메구미오</span>`,
    tags: ["찬양"],
  },
  {
    id: "song-2",
    category: "song",
    title: "더 원합니다(慕い求めます)",
    body: "",
    image: "./assets/songs/more.png",
    lyrics: `<span class="lyric-ko">예수 사랑합니다 사랑합니다 온 마음 다하여</span>
<span class="lyric-ja">예수 아이스마스 아이시마스 코코로 소소기</span>

<span class="lyric-ko">오직 주님 한 분만 간절히 더 원합니다</span>
<span class="lyric-ja">타다 아나타다케 시타이 모토메마스</span>

<span class="lyric-ko">넘쳐나네 넘쳐나네 주를 향한 내 속의 갈망이</span>
<span class="lyric-ja">아후레루 아후레루 아나타오 시타우 오모이</span>

<span class="lyric-ko">주님께로 날 이끌어 주소서 주님을 더 원합니다</span>
<span class="lyric-ja">미소바니 히키요세테 슈요 사티이 모토메마스</span>
`,
    tags: ["찬양"],
  },
  // 말씀
  {
    id: "message-1",
    category: "word",
    title: "창세기 1장 1절",
    body: "태초에 하나님이 천지를 창조하시니라",
    tags: ["말씀", "창세기"],
  },
  {
    id: "message-2",
    category: "word",
    title: "마태복음 11장 28절",
    body: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라",
    tags: ["말씀", "마태복음"],
  },
  {
    id: "message-3",
    category: "word",
    title: "요한계시록 3장 20절",
    body: "볼지어다 내가 문 밖에 서서 두드리노니 누구든지 내 음성을 듣고 문을 열면 내가 그에게로 들어가 그와 더불어 먹고 그는 나와 더불어 먹으리라",
    tags: ["말씀", "요한계시록"],
  },
  // 패치노트
  {
    id: "update-1",
    category: "update",
    title: "2026.06.21",
    body: `1. 패치노트 카테고리 설정
2. 1~5일차 일정표 수정
3. 찬양 가사만 보기 추가
4. 말씀 검색 기능 추가
5. 공지 추가`,
  },
];

export const categoryLabels = {
  info: "안내",
  schedule: "일정",
  song: "찬양",
  word: "말씀",
  memo: "메모",
  checklist: "준비물",
  update: "패치노트",
};
