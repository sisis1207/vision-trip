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
    tags: ["찬양"],
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
    tags: ["찬양"],
  },
  /*test*/
  {
    id: "song-3",
    category: "song",
    title: "test",
    body: "테스트",
    lyrics: `<span class='lyric-ko'>테스트</span>
    <span class='lyric-ja'>테스트</span>
    <span class='lyric-ja-original'>테스트</span>`,
    tags: ["찬양"],
  },
];
