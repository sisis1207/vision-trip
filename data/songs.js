// 찬양 화면에서 사용하는 악보 이미지와 가사 데이터입니다.
// image 경로와 lyrics HTML 구조를 변경할 때는 오프라인 캐시(sw.js)도 함께 확인하세요.

export const songItems = [
  /*꽃들도(花も)*/
  {
    id: "song-1",
    category: "song",
    title: "꽃들도(花も)",
    body: "",
    image: "./assets/songs/flowers.png",
    lyrics: `<span class="lyric-label">[ 1 ]</span>
<span class="lyric-ko">이곳에 생명 샘 솓아나 눈물 골짝 지나갈 때에</span>
<span class="lyric-ja-original">ここにいずみはわく  涙をすぎるとき</span>
<span class="lyric-ja">코코니 이즈미와 와쿠 나미다오 스기루 토키</span>

<span class="lyric-ko">머잖아 열매 맺히고 웃음 소리 넘쳐나리라</span>
<span class="lyric-ja-original">やがて実を結び  笑い声に満ちる</span>
<span class="lyric-ja">야가테 미오 무스비 와라이고에니 미치루</span>

<span class="lyric-label">[ 2 ]</span>
<span class="lyric-ko">그 날에 하늘이 열리고 모든 이가 보게 되리라</span>
<span class="lyric-ja-original">あおげ天はひらき  僕らは見るだろう</span>
<span class="lyric-ja">아오게 텐-와 하라키 보쿠라와 미루다로</span>

<span class="lyric-ko">마침내 꽃들이 피고 영광의 주가 오시리라</span>
<span class="lyric-ja-original">やがて花は咲き  栄光の主が来られる</span>
<span class="lyric-ja">야가테 하나와 사키 에이코노 슈가 코라레루</span>

<span class="lyric-label">[ 후렴 ]</span>
<span class="lyric-ko">꽃들도 구름도 바람도 넓은 바다도</span>
<span class="lyric-ja-original">花も雲も風も大海も</span>
<span class="lyric-ja">하나모 쿠모모 카제모 오오우미모</span>

<span class="lyric-ko">찬양하라 찬양하라 예수를</span>
<span class="lyric-ja-original">かなでようかなでよう  イエスを</span>
<span class="lyric-ja">카나데요 카나데요 예수오</span>

<span class="lyric-ko">하늘을 울리며 노래해 나의 영혼아</span>
<span class="lyric-ja-original">空にひびけ  歌え魂よ</span>
<span class="lyric-ja">소라니 히비케 우타에 타마시이요</span>

<span class="lyric-ko">은혜의 주 은혜의 주 은혜의 주</span>
<span class="lyric-ja-original">恵みを恵みを恵みを</span>
<span class="lyric-ja">메구미오 메구미오 메구미오</span>`,
  },

  /*더 원합니다(慕い求めます)*/
  {
    id: "song-2",
    category: "song",
    title: "더 원합니다(慕い求めます)",
    body: "",
    image: "./assets/songs/more.png",
    lyrics: `<span class="lyric-ko">예수 사랑합니다 사랑합니다 온 마음 다하여</span>
<span class="lyric-ja-original">イエス愛します愛します心注ぎ</span>
<span class="lyric-ja">예수 아이시마스 아이시마스 코코로 소소기</span>

<span class="lyric-ko">오직 주님 한 분만 간절히 더 원합니다</span>
<span class="lyric-ja-original">ただあなただけ慕い求めます </span>
<span class="lyric-ja">타다 아나타다케 시타이 모토메마스</span>

<span class="lyric-ko">넘쳐나네 넘쳐나네 주를 향한 내 속의 갈망이</span>
<span class="lyric-ja-original">溢れる溢れるあなたを慕う思い </span>
<span class="lyric-ja">아후레루 아후레루 아나타오 시타우 오모이</span>

<span class="lyric-ko">주님께로 날 이끌어 주소서 주님을 더 원합니다</span>
<span class="lyric-ja-original">みそばに引き寄せて主よ慕い求めます</span>
<span class="lyric-ja">미소바니 히키요세테 슈요 시타이 모토메마스</span>
`,
  },
  /*주님이 주신 땅으로*/
  {
    id: "song-3",
    category: "song",
    title: "주님이 주신 땅으로",
    body: "",
    image: "./assets/songs/give me this hill country.jpg",
    lyrics: `<span class='lyric-ko'>주님이 주신 땅으로 한 걸음씩 나아갈 때에</span>
    <span class='lyric-ko'>수많은 적들과 견고한 성이 나를 두렵게 하지만</span>
    <span class='lyric-ko'>주님을 신뢰함으로 주님을 의지함으로</span>
    <span class='lyric-ko'>주님이 주시는 담대함으로 큰 소리 외치며 나아가네</span>
    <span class='lyric-ko'>이 산지를 내게 주소서 그날에 주께서 말씀하신</span>
    <span class='lyric-ko'>이제 내가 주님의 이름으로 그 땅을 취하리니</span>`,
  },
  {
    id: "song-4",
    category: "song",
    title: "내 모습 이대로",
    image: "./assets/songs/just as i am.png",
    lyrics: `<span class='lyric-ko'>내 모습 이대로 사랑하시네
    연약함 그대로 사랑하시네</span>
<span class='lyric-ko'>나의 모든 발걸음 주가 아시나니
날 인도하소서</span>
<span class='lyric-ko'>주의 날개 아래 거하는 것
주의 임재 안에 거하는 것</span>
<span class='lyric-ko'>나의 가장 큰 소망 나의 가장 큰 은혜
주와 함께 동행하는 일</span>`,
  },
  {
    id: "song-5",
    category: "song",
    title: "세상 모든 민족이",
    image: "./assets/songs/as the waters cover the sea.png",
    lyrics: `<span class='lyric-ko'>세상 모든 민족이 구원을 얻기까지
    쉬지 않으시는 하나님

    주의 심장 가지고 우리 이제 일어나
    주 따르게 하소서

    세상 모든 육체가 주의 영광 보도록
    우릴 부르시는 하나님

    주의 손과 발 되어 세상을 치유하며
    주 섬기게 하소서

    물이 바다 덮음 같이
    여호와의 영광을 인정하는 것이
    온 세상 가득하리라

    물이 바다 덮음 같이
    물이 바다 덮음 같이
    물이 바다 덮음 같이

    보리라 그 날에
    주의 영광 가득한 세상

    우리는 듣게 되리
    온 세상 가득한 승리의 함성</span>`,
  },
  {
    id: "song-6",
    category: "song",
    title: "오늘 이곳에 계신 성령님",
    image: "./assets/songs/oh holy spirit teach us.png",
    lyrics: `<span class='lyric-ko'>오늘 이곳에 계신 성령님
    우리에게 말씀하시고 우릴 가르치소서

    닫힌 우리 맘 열어주시고
    주의 빛으로 밝혀 우릴 인도하소서

    주님보다 앞서지 않고
    겸손하게 주님의 말씀 기다리리

    주님 손에 우릴 드립니다
    사랑으로 인도하소서

    창조하신 모습 잃은 우리를
    예수님 닮게 빚으소서</span>`,
  },
  {
    id: "song-7",
    category: "song",
    title: "내 영혼은 안전합니다",
    image: "./assets/songs/my soul is secure in you.jpg",
    lyrics: `<span class='lyric-ko'>내 아버지 그 품 안에서
    내 영혼은 안전합니다
    주 손길로 내 삶을 안으시니
    그 평강이 나를 덮습니다
    나 비록 넘어지며 흔들리지만
    주 내 안에 거하며 나를 붙드시니
    내 생각을 주께로 돌리고
    주시는 평강의 옷을 입습니다
    주 약속 안에서 내 영혼 평안해
    내 뜻보다 크신 주님의 계획
    나 신뢰해 두려움 다 내려놓고
    주님만 의지해
    주 안에서 내 영혼 안전합니다
    </span>`,
  },
];
