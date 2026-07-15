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
const bibleReferenceByTitle = new Map();

function getBibleReference(item) {
  const title = item.title || "";
  const cachedReference = bibleReferenceByTitle.get(title);
  if (cachedReference) return cachedReference;

  const book =
    item.tags?.[0] || bibleBooksByLength.find((name) => title.startsWith(name));
  const rank = bibleBookRanks.get(book) ?? Number.POSITIVE_INFINITY;
  const chapterAndVerse = book
    ? title.slice(book.length).match(/(\d+)\s*(?:장|편)\s*(\d+)\s*절/)
    : null;

  const reference = {
    rank,
    chapter: chapterAndVerse ? Number(chapterAndVerse[1]) : 0,
    verse: chapterAndVerse ? Number(chapterAndVerse[2]) : 0,
    title,
  };

  bibleReferenceByTitle.set(title, reference);
  return reference;
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

function createWordItem({ id, title, body }) {
  const book = bibleBooksByLength.find((name) => title.startsWith(name));

  return {
    id,
    category: "word",
    title,
    body,
    tags: book ? [book] : [],
  };
}

// 새 말씀을 추가할 때는 아래 목록에서 id, title, body만 입력하세요.
// category와 tags는 title을 기준으로 자동 생성됩니다.
const words = [
  {
    id: "message-1",
    title: "창세기 1장 1절",
    body: "태초에 하나님이 천지를 창조하시니라",
  },
  {
    id: "message-2",
    title: "마태복음 11장 28절",
    body: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라",
  },
  {
    id: "message-4",
    title: "디모데후서 1장 7절",
    body: "하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 오직 능력과 사랑과 절제하는 마음이니",
  },
  {
    id: "message-3",
    title: "요한계시록 3장 20절",
    body: "볼지어다 내가 문 밖에 서서 두드리노니 누구든지 내 음성을 듣고 문을 열면 내가 그에게로 들어가 그와 더불어 먹고 그는 나와 더불어 먹으리라",
  },
  {
    id: "message-5",
    title: "누가복음 13장 31절",
    body: "곧 그 때에 어떤 바리새인들이 나아와서 이르되 나가서 여기를 떠나소서 헤롯이 당신을 죽이고자 하나이다",
  },
  {
    id: "message-6",
    title: "누가복음 13장 32절",
    body: "이르시되 너희는 가서 저 여우에게 이르되 오늘과 내일은 내가 귀신을 쫓아내며 병을 고치다가 제삼일에는 완전하여지리라 하라",
  },
  {
    id: "message-7",
    title: "누가복음 13장 33절",
    body: "그러나 오늘과 내일과 모레는 내가 갈 길을 가야 하리니 선지자가 예루살렘 밖에서는 죽는 법이 없느니라",
  },
  {
    id: "message-8",
    title: "누가복음 13장 34절",
    body: "예루살렘아 예루살렘아 선지자들을 죽이고 네게 파송된 자들을 돌로 치는 자여 암탉이 제 새끼를 날개 아래에 모음 같이 내가 너희의 자녀를 모으려 한 일이 몇번이냐 그러나 너희가 원하지 아니하였도다",
  },
  {
    id: "message-9",
    title: "누가복음 13장 35절",
    body: "보라 너희 집이 황폐하여 버린 바 되리라 내가 너희에게 이르노니 너희가 주의 이름으로 오시는 이를 찬송하리로다 할 때 까지는 나를 보지 못하리라 하시니라",
  },
  {
    id: "message-10",
    title: "요한복음 10장 27절",
    body: "내 양은 내 음성을 들으며 나는 그들을 알며 그들은 나를 따르느니라",
  },
  {
    id: "message-11",
    title: "디모데전서 2장 5절",
    body: "하나님은 한 분이시요 또 하나님과 사람 사이에 중보자도 한 분이시니 곧 사람이신 그리스도 예수라",
  },
  {
    id: "message-12",
    title: "고린도전서 14장 31절",
    body: "너희는 다 모든 사랑으로 배우게 하고 모든 사람으로 권면을 받게 하기 위하여 하나씩 하나씩 예언할 수 있으니라.",
  },
  {
    id: "message-13",
    title: "히브리서 10장 14절",
    body: "그가 거룩하게 된 자들을 한번의 제사로 영원히 온전하게 하셨느니라",
  },
  {
    id: "message-14",
    title: "마가복음 2장 1절",
    body: "수 일 후에 예수께서 다시 가버나움에 들어가시니 집에 계시다는 소문이 들린지라",
  },
  {
    id: "message-15",
    title: "마가복음 2장 2절",
    body: "많은 사람이 모여서 문 앞까지도 들어설 자리가 없게 되었는데 예수께서 그들에게 도를 말씀하시더니",
  },
  {
    id: "message-16",
    title: "마가복음 2장 3절",
    body: "사람들이 한 중풍병자를 네 사람에게 메워 가지고 예수께로 올새",
  },
  {
    id: "message-17",
    title: "마가복음 2장 4절",
    body: "무리들 때문에 예수께 데려갈 수 없으므로 그 계신 곳의 지붕을 뜯어 구멍을 내고 중풍병자가 누운 상을 달아 내리니",
  },
  {
    id: "message-18",
    title: "마가복음 2장 5절",
    body: "예수께서 그들의 믿음을 보시고 중풍병자에게 이르시되 작은 자야 네 죄 사함을 받았느니라 하시니",
  },
  {
    id: "message-19",
    title: "다니엘 12장 3절",
    body: "지혜 있는 자는 궁창의 빛과 같이 빛날 것이요 많은 사람을 옳은데로 돌아오게 하는 자는 별과 같이 영원토록 빛나니라",
  },
  {
    id: "message-20",
    title: "고린도후서 10장 4절",
    body: "우리의 싸우는 무기는 육신에 속한 것이 아니요 오직 어떤 견고한 진도 무너뜨리는 하나님의 능력으로 모든 이론을 무너뜨리며",
  },
  {
    id: "message-21",
    title: "고린도후서 10장 5절",
    body: "하나님 아는 것을 대적하여 높아진 것을 다 무너뜨리고 모든 생각을 사로잡아 그리스도에게 복종하게 하니",
  },
  {
    id: "message-22",
    title: "요한복음 13장 2절",
    body: "마귀가 벌써 시몬의 아들 가롯 유다의 마음에 에수를 팔려는 생각을 넣었더라",
  },
  {
    id: "message-23",
    title: "열왕기상 19장 11절",
    body: "여호와께서 이르시되 너는 나가서 여호와 앞에서 산에 서라 하시더니 여호와께서 지나가시는데 여호와 앞에 크고 강한 바람이 산을 가르고 바위를 부수나 바람 가운데에 여호와께서 계시지 아니하며 바람 후에 지진이 있으나 지진 가운데에도 여호와께서 계시지 아니하며",
  },
  {
    id: "message-24",
    title: "열왕기상 19장 12절",
    body: "또 지진 후에 불이 있으나 불 가운데에도 여호와께서 계시지 아니하더니 불 후에 세미한 소리가 있는지라",
  },
  {
    id: "message-25",
    title: "열왕기상 19장 13절",
    body: "엘리야가 듣고 겉옷으로 얼굴을 가리고 나가 굴 어귀에 서매 소리가 그에게 임하여 이르시되 엘리야야 네가 어찌하여 여기 있느냐",
  },
  {
    id: "message-26",
    title: "누가복음 17장 7절",
    body: "너희 중 누구에게 밭을 갈거나 양을 치거나 하는 종이 있어 밭에서 돌아오면 그더러 곧 와 앉아서 먹으라 말할 자가 있느냐",
  },
  {
    id: "message-27",
    title: "누가복음 17장 8절",
    body: "도리어 그더러 내 먹을 것을 준비하고 띠를 띠고 내가 먹고 마시는 동안에 수종들고 너는 그 후에 먹고 마시라 하지 않겠느냐",
  },
  {
    id: "message-28",
    title: "누가복음 17장 9절",
    body: "명한 대로 하였다고 종에게 감사하겠느냐",
  },
  {
    id: "message-29",
    title: "누가복음 17장 10절",
    body: "이와 같이 너희도 명령 받은 것을 다 행한 후에 이르기를 우리는 무익한 종이라 우리가 하여야 할 일을 한 것뿐이라 할지니라",
  },

  {
    id: "message-30",
    title: "마가복음 2장 6절",
    body: "어떤 서기관들이 거기 앉아서 마음에 생각하기를",
  },
  {
    id: "message-31",
    title: "마가복음 2장 7절",
    body: "이 사람이 어찌 이렇게 말하는가 신성 모독이로다 오직 하나님 한 분 외에는 누가 능히 죄를 사하겠느냐",
  },
  {
    id: "message-32",
    title: "마가복음 2장 8절",
    body: "그들이 속으로 이렇게 생각하는 줄을 예수께서 곧 중심에 아시고 이르시되 어찌하여 이것을 마음에 생각하느냐",
  },
  {
    id: "message-33",
    title: "마가복음 2장 9절",
    body: "중풍병자에게 네 죄 사함을 받았느니라 하는 말과 일어나 네 상을 가지고 걸어가라 하는 말 중에서 어느 것이 쉽겠느냐",
  },
  {
    id: "message-34",
    title: "마가복음 2장 10절",
    body: "그러나 인자가 땅에서 죄를 사하는 권세가 있는 줄을 너희로 알게 하려 하노라 하시고 중풍병자에게 말씀하시되",
  },
  {
    id: "message-35",
    title: "마가복음 2장 11절",
    body: "내가 네게 이르노니 일어나 네 상을 가지고 집으로 가라 하시니",
  },
  {
    id: "message-36",
    title: "마가복음 2장 12절",
    body: "그가 일어나 곧 상을 가지고 모든 사람 앞에서 나가거늘 그들이 다 놀라 하나님께 영광을 돌리며 이르되 우리가 이런 일을 도무지 보지 못하였다 하더라",
  },
  {
    id: "message-37",
    title: "시편 62편 5절",
    body: "나의 영혼아 잠잠히 하나님만 바라라 무릇 나의 소망이 그로부터 나오는도다",
  },
].map(createWordItem);

export const wordItems = [...words].sort(compareBibleReferences);
