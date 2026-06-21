import { categoryLabels, handbookItems, homeNotices } from "./data.js";

const validCategories = Object.keys(categoryLabels);
const homeHero = document.querySelector("#homeHero");
const homeNotice = document.querySelector("#homeNotice");
const noticeList = document.querySelector("#noticeList");
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
const publicAppUrl = "https://sisis1207.github.io/vision-trip/";

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
  window.location.hash = `lyrics/${songId}`;
}

function showHome() {
  homeHero.hidden = false;
  homeNotice.hidden = false;
  categoryTabs.hidden = false;
  pageHeader.hidden = true;
  scheduleTabs.hidden = true;
  wordSearch.hidden = true;
  list.hidden = true;
  tabs.forEach((tab) => tab.classList.remove("active"));
  renderNotices();
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

function renderNotices() {
  if (!homeNotices.length) {
    homeNotice.hidden = true;
    return;
  }

  noticeList.innerHTML = homeNotices
    .map(
      (notice) => `
        <article class="notice-item">
          <strong>${notice.title}</strong>
          <p>${notice.body}</p>
        </article>
      `,
    )
    .join("");
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

function showLyricsPage() {
  const song = getLyricsSong();

  if (!song) {
    openCategory("song");
    return;
  }

  homeHero.hidden = true;
  homeNotice.hidden = true;
  categoryTabs.hidden = true;
  pageHeader.hidden = false;
  scheduleTabs.hidden = true;
  wordSearch.hidden = true;
  list.hidden = false;
  pageTitle.textContent = `${song.title} 가사`;
  tabs.forEach((tab) => tab.classList.remove("active"));
  list.innerHTML = `
    <article class="entry lyrics-entry">
      <div>
        <h3>${song.title}</h3>
        <div class="lyrics-text">${song.lyrics || "가사를 여기에 입력하세요."}</div>
      </div>
    </article>
  `;
}

function showCategoryPage() {
  homeHero.hidden = true;
  homeNotice.hidden = true;
  categoryTabs.hidden = true;
  pageHeader.hidden = false;
  list.hidden = false;
  pageTitle.textContent = categoryLabels[activeCategory];
  tabs.forEach((tab) =>
    tab.classList.toggle("active", tab.dataset.category === activeCategory),
  );
  updateScheduleTabs();
  wordSearch.hidden = activeCategory !== "word";
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

window.addEventListener("hashchange", render);

function showBookmarkGuide() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);
  const isLocal =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname.startsWith("192.168.") ||
    location.hostname.startsWith("172.") ||
    location.hostname.startsWith("10.");

  if (isLocal) {
    installMessage.textContent = `지금 주소는 개발용 미리보기라 PC가 꺼지면 열리지 않습니다. 휴대폰이나 다른 PC에서는 GitHub Pages 주소를 북마크하세요: ${publicAppUrl}`;
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
    navigator.serviceWorker.register("./sw.js");
  });
}

if ("EventSource" in window) {
  const liveReload = new EventSource("./__events");
  liveReload.addEventListener("reload", () => {
    window.location.reload();
  });
}

render();
