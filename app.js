// 비전트립 앱의 메인 스크립트입니다.
// 화면 전환, 데이터 렌더링, 메모 저장, 이미지 확대, PWA 등록을 담당합니다.

import {
  applyPrivateItemOverrides,
  categoryLabels,
  handbookItems,
} from "./data/index.js";

// =========================================================
// 1. 데이터 및 DOM 참조
// =========================================================
const validCategories = new Set(Object.keys(categoryLabels));
const searchableCategories = new Set(["song", "word"]);
const scheduleItems = [];
const itemsByCategory = new Map();
const handbookItemsById = new Map();
const searchableTextById = new Map();
const bibleReferenceById = new Map();
const koreaWeekdays = ["일", "월", "화", "수", "목", "금", "토"];
let todaySchedulesByDate = new Map();

// 앱 시작 시 한 번의 순회로 화면, 검색, 일정용 색인을 함께 만듭니다.
function rebuildDataIndexes(items) {
  scheduleItems.length = 0;
  itemsByCategory.clear();
  handbookItemsById.clear();
  searchableTextById.clear();
  bibleReferenceById.clear();

  for (const item of items) {
    const categoryItems = itemsByCategory.get(item.category) || [];
    categoryItems.push(item);
    itemsByCategory.set(item.category, categoryItems);
    handbookItemsById.set(item.id, item);

    if (item.category === "schedule") {
      scheduleItems.push(item);
    }

    if (searchableCategories.has(item.category)) {
      searchableTextById.set(item.id, getSearchText(item));
    }

    if (item.category === "word") {
      bibleReferenceById.set(item.id, parseBibleReference(item.title));
    }
  }

  todaySchedulesByDate = new Map(
    scheduleItems.map((day) => {
      const events = day.schedule.map((event, index) => ({
        ...event,
        index,
        minutes: parseScheduleMinutes(event.time),
      }));

      return [
        day.date,
        {
          dateLabel: formatKoreaDateLabel(day.date),
          dayLabel: day.id.replace("day-", "DAY "),
          events,
        },
      ];
    }),
  );
}

rebuildDataIndexes(handbookItems);
const searchPlaceholders = {
  song: "찬양 검색",
  word: "말씀 검색",
};
const infoGroups = new Set(["immigration", "street-evangelism", "vision-trip"]);
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
const categoryStartButton = document.querySelector("#categoryStartButton");
const backButton = document.querySelector("#backButton");
const list = document.querySelector("#contentList");
const tabs = document.querySelectorAll(".tab");
const infoSummaryList = document.querySelector("#infoSummaryList");
const infoTabs = document.querySelector("#infoTabs");
const infoGroupButtons = document.querySelectorAll(".info-tab");
const dayTabs = document.querySelector("#scheduleTabs");
const dayTabButtons = document.querySelectorAll(".schedule-tab");
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
let activeInfoGroup = "immigration";
let activeScheduleDay = "day-1";
let activeMemoDay = "day-1";
let activeLyricsSongId = null;
let expandedSongId = null;
const activeSearchQueries = {
  song: "",
  word: "",
};
let todayExpanded = false;
let lyricsLarge = false;
let wordsLarge = false;
let memoLarge = false;
let memoSaveTimer = null;
let activeLyricsMode = "all";
const lyricsModeOptions = [
  { value: "all", label: "전체" },
  { value: "ko", label: "한국어" },
  { value: "ja-original", label: "일본어" },
  { value: "pronunciation", label: "발음" },
];
const lyricsModeClassByValue = {
  ko: "lyric-ko",
  "ja-original": "lyric-ja-original",
  pronunciation: "lyric-ja",
};
const lyricsModeValues = new Set(lyricsModeOptions.map(({ value }) => value));
const lyricsModeOptionsBySongId = new Map();
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

  const songId = hash.slice("lyrics/".length);
  const song = handbookItemsById.get(songId);
  return song?.category === "song" ? song.id : null;
}

function openCategory(category) {
  if (category === "song") {
    expandedSongId = null;
  }

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
function showContentShell() {
  installButton.hidden = true;
  homeHero.hidden = true;
  categoryTabs.hidden = true;
  pageHeader.hidden = false;
  todayScheduleCard.hidden = true;
  infoSummaryList.hidden = true;
  list.classList.remove("info-compact-grid");
  list.hidden = false;
}

function showHome() {
  installButton.hidden = false;
  homeHero.hidden = false;
  categoryTabs.hidden = false;
  pageHeader.hidden = true;
  categoryStartButton.hidden = true;
  infoSummaryList.hidden = true;
  infoTabs.hidden = true;
  dayTabs.hidden = true;
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

  if (activeCategory === "info") {
    return getInfoItems().filter((item) => item.infoGroup === activeInfoGroup);
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
      isBibleReferenceMatch(
        bibleReferenceById.get(item.id),
        bibleReferenceQuery,
      ),
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

function getInfoItems() {
  return itemsByCategory.get("info") || [];
}

function isStreetEvangelismInfoActive() {
  return activeCategory === "info" && activeInfoGroup === "street-evangelism";
}

function updateDayTabs() {
  const showsDayTabs = activeCategory === "schedule" || activeCategory === "memo";
  const activeDay = activeCategory === "memo" ? activeMemoDay : activeScheduleDay;
  dayTabs.hidden = !showsDayTabs;
  dayTabs.classList.toggle("memo-day-tabs", activeCategory === "memo");
  dayTabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.day === activeDay);
  });
}

function updateInfoTabs() {
  infoTabs.hidden = activeCategory !== "info";
  infoSummaryList.hidden = activeCategory !== "info";

  if (activeCategory === "info") {
    const summaryItems = getInfoItems().filter((item) => !item.infoGroup);
    infoSummaryList.hidden = summaryItems.length === 0;
    infoSummaryList.innerHTML = summaryItems.map(renderEntry).join("");
  }

  infoGroupButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.infoGroup === activeInfoGroup,
    );
  });
}

function updateListLayoutClass() {
  list.classList.toggle("info-compact-grid", isStreetEvangelismInfoActive());
}

function scrollInfoContentIntoView() {
  if (activeCategory !== "info") return;

  requestAnimationFrame(() => {
    list.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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

function updateSizeToggle() {
  const isWordPage = activeCategory === "word";
  const isMemoPage = activeCategory === "memo";
  const isSizeTogglePage = isWordPage || isMemoPage;
  const isLarge = isMemoPage ? memoLarge : wordsLarge;
  const labelTarget = isMemoPage ? "메모" : "말씀";

  wordSizeToggle.hidden = !isSizeTogglePage;

  if (!isSizeTogglePage) return;

  wordSizeToggle.classList.toggle("active", isLarge);
  wordSizeToggle.title = isLarge ? "기본 크기" : "크게 보기";
  wordSizeToggle.setAttribute(
    "aria-label",
    isLarge ? `${labelTarget} 기본 크기로 보기` : `${labelTarget} 크게 보기`,
  );
  wordSizeToggle.innerHTML = renderZoomIcon(isLarge);
}

function updateCategoryStartButton() {
  categoryStartButton.hidden = activeCategory !== "word";
}

function scrollToPageTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// "누가복음 13장 31~35절" 같은 범위 검색을 개별 절 카드와 연결합니다.
function parseBibleReference(text = "") {
  const normalized = text.replace(/\s+/g, " ").trim();
  const match = normalized.match(
    /^(.+?)\s*(\d+)\s*(?:장|편)\s*(\d+)\s*(?:[~\-–—]\s*(\d+)\s*)?절?$/,
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

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

// =========================================================
// 4. 콘텐츠 카드 렌더링
// =========================================================
function renderScheduleNote(note = "") {
  const match = note.match(/^본문\s*:\s*(.+)$/);
  if (!match) return `<p>${escapeHtml(note)}</p>`;

  const reference = match[1].trim();
  const safeReference = escapeHtml(reference);
  return `<p><button class="word-reference-link" type="button" data-word-reference="${safeReference}">본문 : ${safeReference}</button></p>`;
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
                ? `<h4 class="schedule-section">${escapeHtml(event.section)}</h4>`
                : ""
            }
            <div class="schedule-card">
              <time>${escapeHtml(event.time)}</time>
              <div>
                <strong>${escapeHtml(event.title)}</strong>
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
  return tags
    .map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`)
    .join("");
}

function renderEntryContent(item) {
  if (item.schedule) {
    return renderSchedule(item.schedule);
  }

  if (item.category === "word") {
    return `<p class="word-body">${escapeHtml(item.body)}</p>`;
  }

  if (item.image) {
    const imageAlt =
      item.imageAlt ||
      (item.category === "song"
        ? `${item.title} 악보`
        : `${item.title} 이미지`);

    return `<button class="song-image-button" type="button" data-image="${escapeHtml(item.image)}" data-title="${escapeHtml(item.title)}"><img class="song-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(imageAlt)}" /></button>`;
  }

  return `<p class="entry-body">${escapeHtml(item.body)}</p>`;
}

function renderLyricsButton(item) {
  if (!item.lyrics) return "";

  return `<button class="lyrics-button" type="button" data-lyrics-id="${escapeHtml(item.id)}" title="${escapeHtml(item.title)} 가사만 보기" aria-label="${escapeHtml(item.title)} 가사만 보기">♪</button>`;
}

function renderSongEntry(item) {
  const isExpanded = expandedSongId === item.id;
  const sheetId = `song-sheet-${item.id}`;

  return `
    <article class="entry song-entry ${isExpanded ? "expanded" : ""}">
      <div>
        <div class="entry-title-row song-title-row">
          <button
            class="song-title-button"
            type="button"
            data-song-toggle="${escapeHtml(item.id)}"
            aria-label="${escapeHtml(`${item.title} 악보 ${isExpanded ? "접기" : "보기"}`)}"
            aria-expanded="${isExpanded}"
            aria-controls="${escapeHtml(sheetId)}"
          >
            <span class="song-title-text">${escapeHtml(item.title)}</span>
          </button>
          ${isExpanded ? renderLyricsButton(item) : ""}
        </div>
        ${
          isExpanded
            ? `<div class="song-sheet-panel" id="${escapeHtml(sheetId)}">
                ${renderEntryContent(item)}
                <div class="meta">
                  ${renderTags(item.tags)}
                </div>
              </div>`
            : ""
        }
      </div>
    </article>
  `;
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
  const cachedOptions = lyricsModeOptionsBySongId.get(song.id);
  if (cachedOptions) return cachedOptions;

  const availableLyricsByMode = Object.fromEntries(
    Object.entries(lyricsModeClassByValue).map(([value, className]) => [
      value,
      hasLyricClass(song, className),
    ]),
  );
  const hasMultipleLanguages =
    availableLyricsByMode["ja-original"] ||
    availableLyricsByMode.pronunciation;

  const availableOptions = lyricsModeOptions.filter(({ value }) => {
    if (value === "all") return true;
    if (value === "ko") return availableLyricsByMode.ko && hasMultipleLanguages;
    return Boolean(availableLyricsByMode[value]);
  });

  lyricsModeOptionsBySongId.set(song.id, availableOptions);
  return availableOptions;
}

function renderLyricsModeButtons(availableOptions) {
  return availableOptions
    .map(
      ({ value, label }) => `
        <button
          class="lyrics-mode-button ${activeLyricsMode === value ? "active" : ""}"
          type="button"
          data-lyrics-mode="${escapeHtml(value)}"
          aria-pressed="${activeLyricsMode === value}"
        >
          ${escapeHtml(label)}
        </button>
      `,
    )
    .join("");
}

function renderEntry(item) {
  if (item.category === "song") {
    return renderSongEntry(item);
  }

  return `
    <article class="entry ${item.category === "word" && wordsLarge ? "word-large" : ""}">
      <div>
        <div class="entry-title-row">
          <h3>${escapeHtml(item.title)}</h3>
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
  updateListLayoutClass();
  const items = filterItems();

  if (!items.length) {
    const hasSearchQuery =
      searchableCategories.has(activeCategory) &&
      activeSearchQueries[activeCategory];
    list.innerHTML = hasSearchQuery
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
  const values = {};

  for (const { type, value } of parts) {
    values[type] = value;
  }

  return {
    dateKey: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
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
  return `${month}월 ${day}일(${koreaWeekdays[date.getUTCDay()]})`;
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
          <time>${escapeHtml(event.time)}</time>
          <span>${escapeHtml(event.title)}</span>
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

function hasStoredText(key) {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

function setStoredText(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage can be unavailable in private or restricted browser modes.
  }
}

function getMemoStorageKey(dayId = activeMemoDay) {
  return `${memoStorageKey}:${dayId}`;
}

function getStoredMemo(dayId = activeMemoDay) {
  const memoKey = getMemoStorageKey(dayId);
  const memo = getStoredText(memoKey);
  if (hasStoredText(memoKey) || dayId !== "day-1") return memo;

  const legacyMemo = getStoredText(memoStorageKey);
  if (legacyMemo) {
    setStoredText(memoKey, legacyMemo);
  }

  return legacyMemo;
}

function updateMemoSaveStatus(statusElement, label) {
  if (!statusElement) return;

  statusElement.textContent = label;
  statusElement.classList.toggle("saving", label === "입력 중...");
}

function getMemoDateLabel(dayId = activeMemoDay) {
  const date = scheduleItems.find((item) => item.id === dayId)?.date;
  const [year, month, day] = (date || "").split("-").map(Number);

  if (!year || !month || !day) return "";

  const dateValue = new Date(Date.UTC(year, month - 1, day));
  return `${month}.${day} ${koreaWeekdays[dateValue.getUTCDay()]}`;
}

function renderMemoPage() {
  const memoDayLabel = `${activeMemoDay.replace("day-", "")}일차`;
  const memoDateLabel = getMemoDateLabel();
  const memoTitle = memoDateLabel
    ? `${memoDayLabel} · ${memoDateLabel}`
    : memoDayLabel;

  list.innerHTML = `
    <article class="entry tool-entry memo-entry ${memoLarge ? "memo-large" : ""}">
      <div class="memo-toolbar">
        <strong>${escapeHtml(memoTitle)}</strong>
      </div>
      <textarea class="memo-textarea" id="memoTextarea" placeholder="메모를 입력하세요."></textarea>
      <div class="memo-footer">
        <span class="memo-save-status" id="memoSaveStatus">저장됨</span>
      </div>
    </article>
  `;

  const memoTextarea = document.querySelector("#memoTextarea");
  const memoSaveStatus = document.querySelector("#memoSaveStatus");
  if (!memoTextarea) return;

  memoTextarea.value = getStoredMemo();
  memoTextarea.addEventListener("input", () => {
    updateMemoSaveStatus(memoSaveStatus, "입력 중...");
    setStoredText(getMemoStorageKey(), memoTextarea.value);

    clearTimeout(memoSaveTimer);
    memoSaveTimer = setTimeout(() => {
      updateMemoSaveStatus(memoSaveStatus, "저장됨");
    }, 450);
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

  showContentShell();
  infoSummaryList.hidden = true;
  infoTabs.hidden = true;
  dayTabs.hidden = true;
  wordSearch.hidden = true;
  pageTitle.textContent = `${song.title} 가사`;
  wordSizeToggle.hidden = true;
  categoryStartButton.hidden = false;
  tabs.forEach((tab) => tab.classList.remove("active"));
  list.innerHTML = `
    <article class="entry lyrics-entry ${lyricsLarge ? "large" : ""}" data-lyrics-view="${activeLyricsMode}">
      <div>
        <div class="lyrics-header">
          <h3>${escapeHtml(song.title)}</h3>
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
          ${renderLyricsModeButtons(availableLyricsModes)}
        </div>
        <div class="lyrics-text">${song.lyrics || "가사를 여기에 입력하세요."}</div>
      </div>
    </article>
  `;
}

function showCategoryPage() {
  showContentShell();
  pageTitle.textContent = categoryLabels[activeCategory];
  tabs.forEach((tab) =>
    tab.classList.toggle("active", tab.dataset.category === activeCategory),
  );
  updateInfoTabs();
  updateDayTabs();
  updateSearchControl();
  updateSizeToggle();
  updateCategoryStartButton();

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

async function loadPrivateLocalData() {
  if (!isLocalPreviewHost()) return;

  try {
    const { privateItemOverrides = [] } = await import("./data/private.local.js");
    if (!privateItemOverrides.length) return;

    lyricsModeOptionsBySongId.clear();
    rebuildDataIndexes(
      applyPrivateItemOverrides(handbookItems, privateItemOverrides),
    );
    render();
  } catch {
    // data/private.local.js is optional and intentionally ignored by Git.
  }
}

// =========================================================
// 9. 이벤트 바인딩
// =========================================================
categoryTabs.addEventListener("click", (event) => {
  const tab = event.target.closest?.("[data-category]");
  if (!tab || !categoryTabs.contains(tab)) return;

  openCategory(tab.dataset.category);
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

dayTabs.addEventListener("click", (event) => {
  const button = event.target.closest?.("[data-day]");
  if (!button || !dayTabs.contains(button)) return;

  if (activeCategory === "memo") {
    activeMemoDay = button.dataset.day;
  } else {
    activeScheduleDay = button.dataset.day;
  }

  render();
});

infoTabs.addEventListener("click", (event) => {
  const button = event.target.closest?.("[data-info-group]");
  if (!button || !infoTabs.contains(button)) return;

  const nextInfoGroup = button.dataset.infoGroup;
  if (!infoGroups.has(nextInfoGroup)) return;

  activeInfoGroup = nextInfoGroup;
  updateInfoTabs();
  renderList();
  scrollInfoContentIntoView();
});

wordSearchInput.addEventListener("input", () => {
  if (!searchableCategories.has(activeCategory)) return;

  activeSearchQueries[activeCategory] = wordSearchInput.value.trim();
  renderList();
});

wordSizeToggle.addEventListener("click", () => {
  if (activeCategory === "memo") {
    memoLarge = !memoLarge;
    updateSizeToggle();
    renderMemoPage();
    return;
  }

  wordsLarge = !wordsLarge;
  updateSizeToggle();
  renderList();
});

categoryStartButton.addEventListener("click", () => {
  if (activeLyricsSongId) {
    activeSearchQueries.song = "";
    openCategory("song");
    scrollToPageTop();
    return;
  }

  if (searchableCategories.has(activeCategory)) {
    activeSearchQueries[activeCategory] = "";
    updateSearchControl();
    renderList();
  }

  scrollToPageTop();
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
  const songToggle = event.target.closest("[data-song-toggle]");
  if (songToggle) {
    const nextSongId = songToggle.dataset.songToggle;
    expandedSongId = expandedSongId === nextSongId ? null : nextSongId;
    renderList();
    return;
  }

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
loadPrivateLocalData();
