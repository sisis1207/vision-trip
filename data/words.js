// 말씀 화면에서 사용하는 말씀 데이터입니다.
// 검색은 title, body, tags를 기준으로 동작합니다.
// 항목은 성경 권 순서, 장, 절 기준으로 자동 정렬됩니다.

const bibleBooks = [
  "창세기",
  "출애굽기",
  "레위기",
  "민수기",
  "신명기",
  "여호수아",
  "사사기",
  "룻기",
  "사무엘상",
  "사무엘하",
  "열왕기상",
  "열왕기하",
  "역대상",
  "역대하",
  "에스라",
  "느헤미야",
  "에스더",
  "욥기",
  "시편",
  "잠언",
  "전도서",
  "아가",
  "이사야",
  "예레미야",
  "예레미야애가",
  "에스겔",
  "다니엘",
  "호세아",
  "요엘",
  "아모스",
  "오바댜",
  "요나",
  "미가",
  "나훔",
  "하박국",
  "스바냐",
  "학개",
  "스가랴",
  "말라기",
  "마태복음",
  "마가복음",
  "누가복음",
  "요한복음",
  "사도행전",
  "로마서",
  "고린도전서",
  "고린도후서",
  "갈라디아서",
  "에베소서",
  "빌립보서",
  "골로새서",
  "데살로니가전서",
  "데살로니가후서",
  "디모데전서",
  "디모데후서",
  "디도서",
  "빌레몬서",
  "히브리서",
  "야고보서",
  "베드로전서",
  "베드로후서",
  "요한일서",
  "요한이서",
  "요한삼서",
  "유다서",
  "요한계시록",
];
const bibleBookRanks = new Map(bibleBooks.map((book, index) => [book, index]));
const bibleBooksByLength = [...bibleBooks].sort((a, b) => b.length - a.length);

function getBibleReference(item) {
  const title = item.title || "";
  const book = bibleBooksByLength.find((name) => title.startsWith(name));
  const rank = bibleBookRanks.get(book) ?? Number.POSITIVE_INFINITY;
  const chapterAndVerse = book
    ? title.slice(book.length).match(/(\d+)\s*장\s*(\d+)\s*절/)
    : null;

  return {
    rank,
    chapter: chapterAndVerse ? Number(chapterAndVerse[1]) : 0,
    verse: chapterAndVerse ? Number(chapterAndVerse[2]) : 0,
    title,
  };
}

function compareBibleReferences(left, right) {
  const a = getBibleReference(left);
  const b = getBibleReference(right);

  return (
    a.rank - b.rank ||
    a.chapter - b.chapter ||
    a.verse - b.verse ||
    a.title.localeCompare(b.title, "ko")
  );
}

const words = [
  {
    id: "message-1",
    category: "word",
    title: "창세기 1장 1절",
    body: "태초에 하나님이 천지를 창조하시니라",
    tags: ["구약", "창세기"],
  },
  {
    id: "message-2",
    category: "word",
    title: "마태복음 11장 28절",
    body: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라",
    tags: ["신약", "마태복음"],
  },
  {
    id: "message-4",
    category: "word",
    title: "디모데후서 1장 7절",
    body: "하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 오직 능력과 사랑과 절제하는 마음이니",
    tags: ["신약", "디모데후서"],
  },
  {
    id: "message-3",
    category: "word",
    title: "요한계시록 3장 20절",
    body: "볼지어다 내가 문 밖에 서서 두드리노니 누구든지 내 음성을 듣고 문을 열면 내가 그에게로 들어가 그와 더불어 먹고 그는 나와 더불어 먹으리라",
    tags: ["신약", "요한계시록"],
  },
  {
    id: "message-5",
    category: "word",
    title: "누가복음 13장 31절",
    body: "곧 그 때에 어떤 바리세인들이 나아와서 이르되 나가서 여기를 떠나소서 헤롯이 당신을 죽이고자 하나이다",
    tags: ["신약", "누가복음"],
  },
  {
    id: "message-6",
    category: "word",
    title: "누가복음 13장 32절",
    body: "이르시되 너희는 가서 저 여우에게 이르되 오늘과 내일은 내가 귀신을 쫓아내며 병을 고치다가 제삼일에는 완전하여지리라 하라",
    tags: ["신약", "누가복음"],
  },
  {
    id: "message-7",
    category: "word",
    title: "누가복음 13장 33절",
    body: "그러나 오늘과 내일과 모레는 내가 갈 길을 가야 하리니 선지자가 예루살렘 밖에서는 죽는 법이 없느니라",
    tags: ["신약", "누가복음"],
  },
  {
    id: "message-8",
    category: "word",
    title: "누가복음 13장 34절",
    body: "예루살렘아 예루살렘아 선지자들을 죽이고 네게 파송된 자들을 돌로 치는 자여 암탉이 제 새끼를 날개 아래에 모음 같이 내가 너희의 자녀를 모으려 한 일이 몇번이냐 그러나 너희가 원하지 아니하였도다",
    tags: ["신약", "누가복음"],
  },
  {
    id: "message-9",
    category: "word",
    title: "누가복음 13장 35절",
    body: "보라 너희 집이 황폐하여 버린 바 되리라 내가 너희에게 이르노니 너희가 주의 이름으로 오시는 이를 찬송하리로다 할 때 까지는 나를 보지 못하리라 하시니라",
    tags: ["신약", "누가복음"],
  },
];

export const wordItems = [...words].sort(compareBibleReferences);
