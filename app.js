// 비전트립 앱의 메인 스크립트입니다.
// 화면 전환, 데이터 렌더링, 메모 저장, 이미지 확대, PWA 등록을 담당합니다.

import { categoryLabels, handbookItems } from "./data/index.js";

// =========================================================
// 1. 데이터 및 DOM 참조
// =========================================================
const validCategories = new Set(Object.keys(categoryLabels));
const scheduleItems = handbookItems.filter(
  (item) => item.category === "schedule",
);
const itemsByCategory = handbookItems.reduce((groups, item) => {
  const items = groups.get(item.category) || [];
  items.push(item);
  groups.set(item.category, items);
  return groups;
}, new Map());
const handbookItemsById = new Map(handbookItems.map((item) => [item.id, item]));
const todaySchedulesByDate = new Map(
  scheduleItems.map((day) => [
    day.date,
    {
      dateLabel: formatKoreaDateLabel(day.date),
      dayLabel: day.id.replace("day-", "DAY "),
      events: day.schedule.map((event, index) => ({
        ...event,
        index,
        minutes: parseScheduleMinutes(event.time),
      })),
    },
  ]),
);
// 검색할 때마다 문자열을 다시 조합하지 않도록 시작 시 한 번만 색인합니다.
const searchableTextById = new Map(
  handbookItems.map((item) => [item.id, getSearchText(item)]),
);
const bibleReferenceById = new Map(
  handbookItems.map((item) => [item.id, parseBibleReference(item.title)]),
);
const searchableCategories = new Set(["song", "word"]);
const searchPlaceholders = {
  song: "찬양 검색",
  word: "말씀 검색",
};
const urlParams = new URLSearchParams(window.location.search);
const homeHero = document.querySelector("#homeHero");
const todayScheduleCard = document.querySelector("#todayScheduleCard");
const todayScheduleDate = document.querySelector("#todayScheduleDate");
const todayScheduleList = document.querySelector("#todayScheduleList");
const todayDayBadge = document.querySelector("#todayDayBadge");
const todayToggle = document.querySelector("#todayToggle");
const categoryTabs = document.querySelector("#categoryTabs");
const pageHeader = document.querySelector("#pageHeader");
const pageTitle = document.querySelector("#pageTitle");
const wordSizeToggle = document.querySelector("#wordSizeToggle");
const backButton = document.querySelector("#backButton");
const list = document.querySelector("#contentList");
const tabs = Array.from(document.querySelectorAll(".tab"));
const scheduleTabs = document.querySelector("#scheduleTabs");
const scheduleDayButtons = Array.from(
  document.querySelectorAll(".schedule-tab"),
);
const wordSearch = document.querySelector("#wordSearch");
const wordSearchLabel = document.querySelector('label[for="wordSearchInput"]');
const wordSearchInput = document.querySelector("#wordSearchInput");
const installButton = document.querySelector("#installButton");
const installSheet = document.querySelector("#installSheet");
const closeInstallSheet = document.querySelector("#closeInstallSheet");
const installMessage = document.querySelector("#installMessage");
const imageViewer = document.querySelector("#imageViewer");
const viewerImage = document.querySelector("#viewerImage");
const closeImageViewer = document.querySelector("#closeImageViewer");

let activeCategory = null;
let activeScheduleDay = "day-1";
let activeLyricsSongId = null;
const activeSearchQueries = {
  song: "",
  word: "",
};
let todayExpanded = false;
let lyricsLarge = false;
let wordsLarge = false;
let activeLyricsMode = "all";
const lyricsModeOptions = [
  { value: "all", label: "전체" },
  { value: "ko", label: "한국어" },
  { value: "ja-original", label: "일본어" },
  { value: "pronunciation", label: "발음" },
];
const lyricsModeValues = new Set(lyricsModeOptions.map(({ value }) => value));
const publicAppUrl = "https://sisis1207.github.io/vision-trip/";
const memoStorageKey = "visionTripMemo";
const koreaTimeZone = "Asia/Seoul";
const koreaDateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: koreaTimeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// =========================================================
// 2. URL 해시와 화면 이동
// =========================================================
function getHashValue() {
  const hash = window.location.hash.replace("#", "");

  try {
    return decodeURIComponent(hash);
  } catch {
    return hash;
  }
}

function getCategoryFromHash() {
  const category = getHashValue();
  return validCategories.has(category) ? category : null;
}

function getLyricsSongIdFromHash() {
  const hash = getHashValue();
  if (!hash.startsWith("lyrics/")) return null;

  const songId = hash.replace("lyrics/", "");
  const song = handbookItemsById.get(songId);
  return song?.category === "song" ? song.id : null;
}

function openCategory(category) {
  window.location.hash = category;
}

function openLyrics(songId) {
  lyricsLarge = false;
  activeLyricsMode = "all";
  window.location.hash = `lyrics/${songId}`;
}

function isLocalPreviewHost() {
  return (
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname.startsWith("192.168.") ||
    location.hostname.startsWith("172.") ||
    location.hostname.startsWith("10.")
  );
}


// =========================================================
// 3. 홈 / 카테고리 화면 렌더링
// =========================================================
function showHome() {
  installButton.hidden = false;
  homeHero.hidden = false;
  categoryTabs.hidden = false;
  pageHeader.hidden = true;
  scheduleTabs.hidden = true;
  wordSearch.hidden = true;
  list.hidden = true;
  tabs.forEach((tab) => tab.classList.remove("active"));
  renderTodayScheduleCard();
}

function filterItems() {
  if (activeCategory === "schedule") {
    const schedule = handbookItemsById.get(activeScheduleDay);
    return schedule ? [schedule] : [];
  }

  const items = itemsByCategory.get(activeCategory) || [];

  const activeSearchQuery = searchableCategories.has(activeCategory)
    ? activeSearchQueries[activeCategory]
    : "";

  if (!activeSearchQuery) {
    return items;
  }

  const query = activeSearchQuery.toLowerCase();
  const bibleReferenceQuery =
    activeCategory === "word" ? parseBibleReference(activeSearchQuery) : null;

  return items.filter(
    (item) =>
      searchableTextById.get(item.id).includes(query) ||
      isBibleReferenceMatch(bibleReferenceById.get(item.id), bibleReferenceQuery),
  );
}

function getSearchText(item) {
  return [item.title, item.body, item.lyrics, ...(item.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getLyricsSong() {
  const item = handbookItemsById.get(activeLyricsSongId);
  return item?.category === "song" ? item : null;
}

function updateScheduleTabs() {
  scheduleTabs.hidden = activeCategory !== "schedule";
  scheduleDayButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.day === activeScheduleDay);
  });
}

function updateSearchControl() {
  const isSearchableCategory = searchableCategories.has(activeCategory);
  wordSearch.hidden = !isSearchableCategory;

  if (!isSearchableCategory) return;

  const placeholder = searchPlaceholders[activeCategory];
  wordSearchLabel.textContent = placeholder;
  wordSearchInput.placeholder = placeholder;
  wordSearchInput.value = activeSearchQueries[activeCategory];
}

function updateWordSizeToggle() {
  const isWordPage = activeCategory === "word";
  wordSizeToggle.hidden = !isWordPage;

  if (!isWordPage) return;

  wordSizeToggle.classList.toggle("active", wordsLarge);
  wordSizeToggle.title = wordsLarge ? "기본 크기" : "크게 보기";
  wordSizeToggle.setAttribute(
    "aria-label",
    wordsLarge ? "말씀 기본 크기로 보기" : "말씀 크게 보기",
  );
  wordSizeToggle.innerHTML = renderZoomIcon(wordsLarge);
}

// "누가복음 13장 31~35절" 같은 범위 검색을 개별 절 카드와 연결합니다.
function parseBibleReference(text = "") {
  const normalized = text.replace(/\s+/g, " ").trim();
  const match = normalized.match(
    /^(.+?)\s*(\d+)\s*장\s*(\d+)\s*(?:[~\-–—]\s*(\d+)\s*)?절?$/,
  );

  if (!match) return null;

  const startVerse = Number(match[3]);
  const endVerse = Number(match[4] || match[3]);

  return {
    book: match[1].trim(),
    chapter: Number(match[2]),
    startVerse: Math.min(startVerse, endVerse),
    endVerse: Math.max(startVerse, endVerse),
  };
}

function isBibleReferenceMatch(itemReference, queryReference) {
  if (!itemReference || !queryReference) return false;

  return (
    itemReference.book === queryReference.book &&
    itemReference.chapter === queryReference.chapter &&
    itemReference.startVerse <= queryReference.endVerse &&
    itemReference.endVerse >= queryReference.startVerse
  );
}

function openWordReference(reference) {
  activeSearchQueries.word = reference;
  window.location.hash = "word";

  if (activeCategory === "word") {
    updateSearchControl();
    renderList();
  }
}


// =========================================================
// 4. 콘텐츠 카드 렌더링
// =========================================================
function renderScheduleNote(note = "") {
  const match = note.match(/^본문\s*:\s*(.+)$/);
  if (!match) return `<p>${note}</p>`;

  const reference = match[1].trim();
  return `
    <p>
      <button
        class="word-reference-link"
        type="button"
        data-word-reference="${reference}"
      >
        본문 : ${reference}
      </button>
    </p>
  `;
}

function renderSchedule(schedule = []) {
  let currentSection = "";

  return `
    <div class="schedule-list">
      ${schedule
        .map((event) => {
          const hasNewSection =
            event.section && event.section !== currentSection;
          if (hasNewSection) {
            currentSection = event.section;
          }

          return `
            ${
              hasNewSection
                ? `<h4 class="schedule-section">${event.section}</h4>`
                : ""
            }
            <div class="schedule-card">
              <time>${event.time}</time>
              <div>
                <strong>${event.title}</strong>
                ${event.note ? renderScheduleNote(event.note) : ""}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderTags(tags = []) {
  return tags.map((tag) => `<span class="pill">${tag}</span>`).join("");
}

function renderEntryContent(item) {
  if (item.schedule) {
    return renderSchedule(item.schedule);
  }

  if (item.category === "word") {
    return `<p class="word-body">${item.body}</p>`;
  }

  if (item.image) {
    const imageAlt =
      item.imageAlt ||
      (item.category === "song" ? `${item.title} 악보` : `${item.title} 이미지`);

    return `<button class="song-image-button" type="button" data-image="${item.image}" data-title="${item.title}"><img class="song-image" src="${item.image}" alt="${imageAlt}" /></button>`;
  }

  return `<p>${item.body}</p>`;
}

function renderLyricsButton(item) {
  if (!item.lyrics) return "";

  return `<button class="lyrics-button" type="button" data-lyrics-id="${item.id}" title="${item.title} 가사만 보기" aria-label="${item.title} 가사만 보기">♪</button>`;
}

function renderZoomIcon(isExpanded) {
  return `
    <svg
      class="lyrics-zoom-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="5.5"></circle>
      <path d="m15 15 4 4"></path>
      <path d="M8 10.5h5"></path>
      ${isExpanded ? "" : '<path d="M10.5 8v5"></path>'}
    </svg>
  `;
}

function hasLyricClass(song, className) {
  const classPattern = new RegExp(`class=["'][^"']*\\b${className}\\b`);
  return classPattern.test(song.lyrics || "");
}

function getLyricsModeOptions(song) {
  const hasKo = hasLyricClass(song, "lyric-ko");
  const hasJaOriginal = hasLyricClass(song, "lyric-ja-original");
  const hasPronunciation = hasLyricClass(song, "lyric-ja");
  const hasMultipleLanguages = hasJaOriginal || hasPronunciation;

  return lyricsModeOptions.filter(({ value }) => {
    if (value === "all") return true;
    if (value === "ko") return hasKo && hasMultipleLanguages;
    if (value === "ja-original") return hasJaOriginal;
    if (value === "pronunciation") return hasPronunciation;
    return false;
  });
}

function renderLyricsModeButtons(song) {
  return getLyricsModeOptions(song)
    .map(
      ({ value, label }) => `
        <button
          class="lyrics-mode-button ${activeLyricsMode === value ? "active" : ""}"
          type="button"
          data-lyrics-mode="${value}"
          aria-pressed="${activeLyricsMode === value}"
        >
          ${label}
        </button>
      `,
    )
    .join("");
}

function renderEntry(item) {
  return `
    <article class="entry ${item.category === "word" && wordsLarge ? "word-large" : ""}">
      <div>
        <div class="entry-title-row">
          <h3>${item.title}</h3>
          ${renderLyricsButton(item)}
        </div>
        ${renderEntryContent(item)}
        <div class="meta">
          ${renderTags(item.tags)}
        </div>
      </div>
    </article>
  `;
}

function renderList() {
  const items = filterItems();

  if (!items.length) {
    const hasSearchQuery =
      searchableCategories.has(activeCategory) &&
      activeSearchQueries[activeCategory];
    list.innerHTML =
      hasSearchQuery
        ? '<div class="empty-state">검색 결과가 없습니다.</div>'
        : '<div class="empty-state">등록된 내용이 없습니다.</div>';
    return;
  }

  list.innerHTML = items.map(renderEntry).join("");
}


// =========================================================
// 5. 오늘 일정 계산
// =========================================================
function getKoreaNowParts(date = new Date()) {
  const testNow = getTestNowParts();
  return testNow || getKoreaNowPartsFromDate(date);
}

function getTestNowParts() {
  const testDate = urlParams.get("testDate");
  const testTime = urlParams.get("testTime");

  if (!testDate && !testTime) return null;

  const realNow = getKoreaNowPartsFromDate();
  const dateKey = /^\d{4}-\d{2}-\d{2}$/.test(testDate || "")
    ? testDate
    : realNow.dateKey;
  const minutes = /^([01]\d|2[0-3]):[0-5]\d$/.test(testTime || "")
    ? parseScheduleMinutes(testTime)
    : realNow.minutes;

  return { dateKey, minutes };
}

function getKoreaNowPartsFromDate(date = new Date()) {
  const parts = koreaDateTimeFormatter.formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value;

  return {
    dateKey: `${value("year")}-${value("month")}-${value("day")}`,
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
  };
}

function parseScheduleMinutes(time = "") {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (!match) return Number.POSITIVE_INFINITY;

  return Number(match[1]) * 60 + Number(match[2]);
}

function formatKoreaDateLabel(dateKey = "") {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return "";

  const date = new Date(Date.UTC(year, month - 1, day));
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return `${month}월 ${day}일(${weekdays[date.getUTCDay()]})`;
}

function getTodayScheduleData() {
  const koreaNow = getKoreaNowParts();
  const todaySchedule = todaySchedulesByDate.get(koreaNow.dateKey);

  if (!todaySchedule) return null;

  const eventsByDistance = [...todaySchedule.events].sort(
    (a, b) =>
      Math.abs(a.minutes - koreaNow.minutes) -
      Math.abs(b.minutes - koreaNow.minutes),
  );
  const nearest = eventsByDistance[0];

  const visibleEvents = todayExpanded
    ? todaySchedule.events
    : eventsByDistance.slice(0, 3).sort((a, b) => a.minutes - b.minutes);

  return {
    dateLabel: todaySchedule.dateLabel,
    dayLabel: todaySchedule.dayLabel,
    events: todaySchedule.events,
    nearestIndex: nearest?.index,
    visibleEvents,
  };
}

function renderTodayScheduleCard() {
  const todaySchedule = getTodayScheduleData();

  if (!todaySchedule) {
    todayScheduleCard.hidden = true;
    homeHero.classList.add("hero-no-today");
    return;
  }

  homeHero.classList.remove("hero-no-today");
  todayScheduleCard.hidden = false;
  todayScheduleDate.textContent = todaySchedule.dateLabel;
  todayDayBadge.textContent = todaySchedule.dayLabel;
  todayToggle.hidden = todaySchedule.events.length <= 3;
  todayToggle.textContent = todayExpanded ? "접기" : "더 보기";
  todayToggle.classList.toggle("expanded", todayExpanded);
  todayScheduleList.innerHTML = todaySchedule.visibleEvents
    .map(
      (event) => `
        <div class="today-item ${event.index === todaySchedule.nearestIndex ? "nearest" : ""}">
          <time>${event.time}</time>
          <span>${event.title}</span>
        </div>
      `,
    )
    .join("");
}


// =========================================================
// 6. 메모 저장소
// =========================================================
function getStoredText(key) {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function setStoredText(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage can be unavailable in private or restricted browser modes.
  }
}

function renderMemoPage() {
  list.innerHTML = `
    <article class="entry tool-entry">
      <textarea class="memo-textarea" id="memoTextarea" placeholder="메모를 입력하세요."></textarea>
    </article>
  `;

  const memoTextarea = document.querySelector("#memoTextarea");
  if (!memoTextarea) return;

  memoTextarea.value = getStoredText(memoStorageKey);
  memoTextarea.addEventListener("input", () => {
    setStoredText(memoStorageKey, memoTextarea.value);
  });
}


// =========================================================
// 7. 가사 페이지
// =========================================================
function showLyricsPage() {
  const song = getLyricsSong();

  if (!song) {
    openCategory("song");
    return;
  }

  const availableLyricsModes = getLyricsModeOptions(song);
  if (!availableLyricsModes.some(({ value }) => value === activeLyricsMode)) {
    activeLyricsMode = "all";
  }

  installButton.hidden = true;
  homeHero.hidden = true;
  categoryTabs.hidden = true;
  pageHeader.hidden = false;
  todayScheduleCard.hidden = true;
  scheduleTabs.hidden = true;
  wordSearch.hidden = true;
  list.hidden = false;
  pageTitle.textContent = `${song.title} 가사`;
  wordSizeToggle.hidden = true;
  tabs.forEach((tab) => tab.classList.remove("active"));
  list.innerHTML = `
    <article class="entry lyrics-entry ${lyricsLarge ? "large" : ""}" data-lyrics-view="${activeLyricsMode}">
      <div>
        <div class="lyrics-header">
          <h3>${song.title}</h3>
          <button
            class="lyrics-size-button ${lyricsLarge ? "active" : ""}"
            type="button"
            data-lyrics-size-toggle
            title="${lyricsLarge ? "기본 크기" : "크게 보기"}"
            aria-label="${lyricsLarge ? "가사 기본 크기로 보기" : "가사 크게 보기"}"
          >
            ${renderZoomIcon(lyricsLarge)}
          </button>
        </div>
        <div class="lyrics-mode-tabs" style="--lyrics-mode-count: ${availableLyricsModes.length}" aria-label="가사 표시 방식">
          ${renderLyricsModeButtons(song)}
        </div>
        <div class="lyrics-text">${song.lyrics || "가사를 여기에 입력하세요."}</div>
      </div>
    </article>
  `;
}

function showCategoryPage() {
  installButton.hidden = true;
  homeHero.hidden = true;
  categoryTabs.hidden = true;
  pageHeader.hidden = false;
  todayScheduleCard.hidden = true;
  list.hidden = false;
  pageTitle.textContent = categoryLabels[activeCategory];
  tabs.forEach((tab) =>
    tab.classList.toggle("active", tab.dataset.category === activeCategory),
  );
  updateScheduleTabs();
  updateSearchControl();
  updateWordSizeToggle();

  if (activeCategory === "memo") {
    renderMemoPage();
    return;
  }

  renderList();
}


// =========================================================
// 8. 전체 화면 상태 렌더링
// =========================================================
function render() {
  activeLyricsSongId = getLyricsSongIdFromHash();
  if (activeLyricsSongId) {
    activeCategory = null;
    showLyricsPage();
    return;
  }

  activeCategory = getCategoryFromHash();

  if (!activeCategory) {
    showHome();
    return;
  }

  showCategoryPage();
}

// =========================================================
// 9. 이벤트 바인딩
// =========================================================
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    openCategory(tab.dataset.category);
  });
});

backButton.addEventListener("click", () => {
  if (activeLyricsSongId) {
    openCategory("song");
    return;
  }

  history.pushState(
    "",
    document.title,
    window.location.pathname + window.location.search,
  );
  render();
});

scheduleDayButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeScheduleDay = button.dataset.day;
    render();
  });
});

wordSearchInput.addEventListener("input", () => {
  if (!searchableCategories.has(activeCategory)) return;

  activeSearchQueries[activeCategory] = wordSearchInput.value.trim();
  renderList();
});

wordSizeToggle.addEventListener("click", () => {
  wordsLarge = !wordsLarge;
  updateWordSizeToggle();
  renderList();
});

todayToggle.addEventListener("click", () => {
  todayExpanded = !todayExpanded;
  renderTodayScheduleCard();
});

window.addEventListener("hashchange", render);


// =========================================================
// 10. 북마크 / 홈 화면 추가 안내
// =========================================================
function showBookmarkGuide() {
  const isIPad =
    /ipad/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isIPhone = /iphone|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);

  if (isLocalPreviewHost()) {
    installMessage.textContent = `지금 주소는 개발용 미리보기라 PC가 꺼지면 열리지 않습니다. 휴대폰이나 다른 PC에서는 GitHub Pages 주소를 북마크하세요: ${publicAppUrl}`;
  } else if (isIPad) {
    installMessage.textContent =
      'iPad는 Safari 상단 공유 버튼을 누른 뒤 "책갈피 추가" 또는 "홈 화면에 추가"를 선택하세요. 추가한 뒤에는 iPad 홈 화면에서 앱처럼 열 수 있습니다.';
  } else if (isIPhone) {
    installMessage.textContent =
      'iPhone은 Safari 공유 버튼을 누른 뒤 "책갈피 추가" 또는 "홈 화면에 추가"를 선택하세요.';
  } else if (isAndroid) {
    installMessage.textContent =
      'Android는 Chrome 오른쪽 위 메뉴를 누른 뒤 별표로 북마크하거나 "홈 화면에 추가"를 선택하세요.';
  } else {
    installMessage.textContent =
      "PC에서는 Ctrl+D를 눌러 북마크에 저장하세요. 저장한 북마크를 누르면 비전트립 앱이 바로 열립니다.";
  }
  installSheet.hidden = false;
}

function hideBookmarkGuide() {
  installSheet.hidden = true;
}

installButton.addEventListener("click", showBookmarkGuide);

closeInstallSheet.addEventListener("click", hideBookmarkGuide);

installSheet.addEventListener("click", (event) => {
  if (event.target === installSheet) {
    hideBookmarkGuide();
  }
});


// =========================================================
// 11. 이미지 확대 보기
// =========================================================
function openImageViewer(src, title) {
  viewerImage.src = src;
  viewerImage.alt = `${title} 크게 보기`;
  imageViewer.hidden = false;
}

function hideImageViewer() {
  imageViewer.hidden = true;
  viewerImage.src = "";
  viewerImage.alt = "";
}

list.addEventListener("click", (event) => {
  const wordReferenceLink = event.target.closest("[data-word-reference]");
  if (wordReferenceLink) {
    openWordReference(wordReferenceLink.dataset.wordReference);
    return;
  }

  if (event.target.closest("[data-lyrics-size-toggle]")) {
    lyricsLarge = !lyricsLarge;
    showLyricsPage();
    return;
  }

  const lyricsModeButton = event.target.closest("[data-lyrics-mode]");
  if (lyricsModeButton) {
    const nextLyricsMode = lyricsModeButton.dataset.lyricsMode;
    if (lyricsModeValues.has(nextLyricsMode)) {
      activeLyricsMode = nextLyricsMode;
      showLyricsPage();
    }
    return;
  }

  const imageButton = event.target.closest("[data-image]");
  if (imageButton) {
    openImageViewer(imageButton.dataset.image, imageButton.dataset.title);
    return;
  }

  const lyricsButton = event.target.closest("[data-lyrics-id]");
  if (lyricsButton) {
    openLyrics(lyricsButton.dataset.lyricsId);
  }
});

closeImageViewer.addEventListener("click", hideImageViewer);

imageViewer.addEventListener("click", (event) => {
  if (event.target === imageViewer) {
    hideImageViewer();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageViewer.hidden) {
    hideImageViewer();
  }
});


// =========================================================
// 12. 모바일 브라우저 확대 및 당겨 새로고침 방지
// =========================================================
function preventBrowserDoubleTapZoom() {
  let lastTouchEndAt = 0;
  let lastTouchTarget = null;

  document.addEventListener(
    "touchend",
    (event) => {
      const currentTouchTarget =
        event.target.closest?.(
          "button, a, input, textarea, select, [role='button']",
        ) || event.target;
      const now = Date.now();
      const isRepeatedTap =
        currentTouchTarget === lastTouchTarget && now - lastTouchEndAt < 320;

      if (isRepeatedTap) {
        event.preventDefault();
      }

      lastTouchEndAt = now;
      lastTouchTarget = currentTouchTarget;
    },
    { passive: false },
  );
}

function preventPullToRefresh() {
  let startY = 0;

  function canScrollInsideTarget(target, deltaY) {
    let element = target instanceof Element ? target : target?.parentElement;

    while (element && element !== document.body) {
      const style = window.getComputedStyle(element);
      const canScrollY = /(auto|scroll)/.test(style.overflowY);
      const hasScrollableContent = element.scrollHeight > element.clientHeight;

      if (canScrollY && hasScrollableContent) {
        const canScrollUp = element.scrollTop > 0;
        const canScrollDown =
          element.scrollTop + element.clientHeight < element.scrollHeight;

        if ((deltaY > 0 && canScrollUp) || (deltaY < 0 && canScrollDown)) {
          return true;
        }
      }

      element = element.parentElement;
    }

    return false;
  }

  document.addEventListener(
    "touchstart",
    (event) => {
      startY = event.touches[0]?.clientY || 0;
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      const currentY = event.touches[0]?.clientY || 0;
      const deltaY = currentY - startY;
      const isPullingDown = deltaY > 0;

      if (
        window.scrollY <= 0 &&
        isPullingDown &&
        !canScrollInsideTarget(event.target, deltaY)
      ) {
        event.preventDefault();
      }
    },
    { passive: false },
  );
}

preventBrowserDoubleTapZoom();
preventPullToRefresh();


// =========================================================
// 13. PWA 서비스워커 등록
// =========================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed.", error);
    });
  });
}


// =========================================================
// 14. 로컬 개발용 자동 새로고침
// =========================================================
if ("EventSource" in window && isLocalPreviewHost()) {
  const liveReload = new EventSource("./__events");
  liveReload.addEventListener("reload", () => {
    window.location.reload();
  });
}

render();
