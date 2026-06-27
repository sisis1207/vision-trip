import { categoryLabels, handbookItems } from "./data/index.js";

const validCategories = Object.keys(categoryLabels);
const scheduleItems = handbookItems.filter(
  (item) => item.category === "schedule",
);
const homeHero = document.querySelector("#homeHero");
const todayScheduleCard = document.querySelector("#todayScheduleCard");
const todayScheduleDate = document.querySelector("#todayScheduleDate");
const todayScheduleList = document.querySelector("#todayScheduleList");
const todayDayBadge = document.querySelector("#todayDayBadge");
const todayToggle = document.querySelector("#todayToggle");
const categoryTabs = document.querySelector("#categoryTabs");
const pageHeader = document.querySelector("#pageHeader");
const pageTitle = document.querySelector("#pageTitle");
const backButton = document.querySelector("#backButton");
const list = document.querySelector("#contentList");
const tabs = Array.from(document.querySelectorAll(".tab"));
const scheduleTabs = document.querySelector("#scheduleTabs");
const scheduleDayButtons = Array.from(
  document.querySelectorAll(".schedule-tab"),
);
const wordSearch = document.querySelector("#wordSearch");
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
let activeWordQuery = "";
let todayExpanded = false;
let lyricsLarge = false;
const publicAppUrl = "https://sisis1207.github.io/vision-trip/";
const memoStorageKey = "visionTripMemo";
const koreaTimeZone = "Asia/Seoul";

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
  return validCategories.includes(category) ? category : null;
}

function getLyricsSongIdFromHash() {
  const hash = getHashValue();
  if (!hash.startsWith("lyrics/")) return null;

  const songId = hash.replace("lyrics/", "");
  const song = handbookItems.find(
    (item) => item.category === "song" && item.id === songId,
  );
  return song ? song.id : null;
}

function openCategory(category) {
  window.location.hash = category;
}

function openLyrics(songId) {
  lyricsLarge = false;
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
  const items = handbookItems.filter((item) => {
    if (activeCategory !== "schedule") {
      return item.category === activeCategory;
    }

    return item.category === "schedule" && item.id === activeScheduleDay;
  });

  if (activeCategory !== "word" || !activeWordQuery) {
    return items;
  }

  const query = activeWordQuery.toLowerCase();
  return items.filter((item) => getSearchText(item).includes(query));
}

function getSearchText(item) {
  return [item.title, item.body, ...(item.tags || [])].join(" ").toLowerCase();
}

function getLyricsSong() {
  return handbookItems.find((item) => item.id === activeLyricsSongId);
}

function updateScheduleTabs() {
  scheduleTabs.hidden = activeCategory !== "schedule";
  scheduleDayButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.day === activeScheduleDay);
  });
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
                ${event.note ? `<p>${event.note}</p>` : ""}
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

  if (item.image) {
    return `<button class="song-image-button" type="button" data-image="${item.image}" data-title="${item.title}"><img class="song-image" src="${item.image}" alt="${item.title} 악보" /></button>`;
  }

  return `<p>${item.body}</p>`;
}

function renderLyricsButton(item) {
  if (!item.lyrics) return "";

  return `<button class="lyrics-button" type="button" data-lyrics-id="${item.id}" title="${item.title} 가사만 보기" aria-label="${item.title} 가사만 보기">♪</button>`;
}

function renderEntry(item) {
  return `
    <article class="entry">
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
    list.innerHTML =
      activeCategory === "word" && activeWordQuery
        ? '<div class="empty-state">검색 결과가 없습니다.</div>'
        : '<div class="empty-state">등록된 내용이 없습니다.</div>';
    return;
  }

  list.innerHTML = items.map(renderEntry).join("");
}

function getKoreaNowParts(date = new Date()) {
  const testNow = getTestNowParts();
  return testNow || getKoreaNowPartsFromDate(date);
}

function getTestNowParts() {
  const params = new URLSearchParams(window.location.search);
  const testDate = params.get("testDate");
  const testTime = params.get("testTime");

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
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: koreaTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
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
  const day = scheduleItems.find((item) => item.date === koreaNow.dateKey);

  if (!day) return null;

  const events = day.schedule.map((event, index) => ({
    ...event,
    index,
    minutes: parseScheduleMinutes(event.time),
  }));
  const eventsByDistance = [...events].sort(
    (a, b) =>
      Math.abs(a.minutes - koreaNow.minutes) -
      Math.abs(b.minutes - koreaNow.minutes),
  );
  const nearest = eventsByDistance[0];

  const visibleEvents = todayExpanded
    ? events
    : eventsByDistance.slice(0, 3).sort((a, b) => a.minutes - b.minutes);

  return {
    dateLabel: formatKoreaDateLabel(day.date),
    dayLabel: day.id.replace("day-", "DAY "),
    events,
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
  memoTextarea.value = getStoredText(memoStorageKey);
  memoTextarea.addEventListener("input", () => {
    setStoredText(memoStorageKey, memoTextarea.value);
  });
}

function showLyricsPage() {
  const song = getLyricsSong();

  if (!song) {
    openCategory("song");
    return;
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
  tabs.forEach((tab) => tab.classList.remove("active"));
  list.innerHTML = `
    <article class="entry lyrics-entry ${lyricsLarge ? "large" : ""}">
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
            <svg
              class="lyrics-zoom-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="5.5"></circle>
              <path d="m15 15 4 4"></path>
              <path d="M8 10.5h5"></path>
              ${lyricsLarge ? "" : '<path d="M10.5 8v5"></path>'}
            </svg>
          </button>
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
  wordSearch.hidden = activeCategory !== "word";

  if (activeCategory === "memo") {
    renderMemoPage();
    return;
  }

  renderList();
}

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
  activeWordQuery = wordSearchInput.value.trim();
  renderList();
});

todayToggle.addEventListener("click", () => {
  todayExpanded = !todayExpanded;
  renderTodayScheduleCard();
});

window.addEventListener("hashchange", render);

function showBookmarkGuide() {
  const isIPad =
    /ipad/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isIPhone = /iphone|ipod/i.test(navigator.userAgent);
  const isIOS = isIPad || isIPhone;
  const isAndroid = /android/i.test(navigator.userAgent);

  if (isLocalPreviewHost()) {
    installMessage.textContent = `지금 주소는 개발용 미리보기라 PC가 꺼지면 열리지 않습니다. 휴대폰이나 다른 PC에서는 GitHub Pages 주소를 북마크하세요: ${publicAppUrl}`;
  } else if (isIPad) {
    installMessage.textContent =
      'iPad는 Safari 상단 공유 버튼을 누른 뒤 "책갈피 추가" 또는 "홈 화면에 추가"를 선택하세요. 추가한 뒤에는 iPad 홈 화면에서 앱처럼 열 수 있습니다.';
  } else if (isIOS) {
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

function openImageViewer(src, title) {
  viewerImage.src = src;
  viewerImage.alt = `${title} 악보 크게 보기`;
  imageViewer.hidden = false;
}

function hideImageViewer() {
  imageViewer.hidden = true;
  viewerImage.src = "";
  viewerImage.alt = "";
}

list.addEventListener("click", (event) => {
  if (event.target.closest("[data-lyrics-size-toggle]")) {
    lyricsLarge = !lyricsLarge;
    showLyricsPage();
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed.", error);
    });
  });
}

if ("EventSource" in window && isLocalPreviewHost()) {
  const liveReload = new EventSource("./__events");
  liveReload.addEventListener("reload", () => {
    window.location.reload();
  });
}

render();
