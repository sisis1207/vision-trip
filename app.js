import { categoryLabels, handbookItems } from "./data.js";

const validCategories = Object.keys(categoryLabels);
const homeHero = document.querySelector("#homeHero");
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
const installButton = document.querySelector("#installButton");
const installSheet = document.querySelector("#installSheet");
const closeInstallSheet = document.querySelector("#closeInstallSheet");
const installMessage = document.querySelector("#installMessage");
const imageViewer = document.querySelector("#imageViewer");
const viewerImage = document.querySelector("#viewerImage");
const closeImageViewer = document.querySelector("#closeImageViewer");

let activeCategory = null;
let activeScheduleDay = "day-1";
const publicAppUrl = "https://sisis1207.github.io/vision-trip/";

function getCategoryFromHash() {
  const category = window.location.hash.replace("#", "");
  return validCategories.includes(category) ? category : null;
}

function openCategory(category) {
  window.location.hash = category;
}

function showHome() {
  homeHero.hidden = false;
  categoryTabs.hidden = false;
  pageHeader.hidden = true;
  scheduleTabs.hidden = true;
  list.hidden = true;
  tabs.forEach((tab) => tab.classList.remove("active"));
}

function filterItems() {
  return handbookItems.filter((item) => {
    if (activeCategory !== "schedule") {
      return item.category === activeCategory;
    }

    return item.category === "schedule" && item.id === activeScheduleDay;
  });
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
          const section =
            event.section && event.section !== currentSection
              ? ((currentSection = event.section),
                `<h4 class="schedule-section">${event.section}</h4>`)
              : "";

          return `
            ${section}
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

function renderList() {
  const items = filterItems();

  if (!items.length) {
    list.innerHTML = '<div class="empty-state">등록된 내용이 없습니다.</div>';
    return;
  }

  list.innerHTML = items
    .map((item) => {
      const tags = item.tags
        .map((tag) => `<span class="pill">${tag}</span>`)
        .join("");

      return `
        <article class="entry">
          <div>
            <h3>${item.title}</h3>
            ${
              item.schedule
                ? renderSchedule(item.schedule)
                : item.image
                  ? `<button class="song-image-button" type="button" data-image="${item.image}" data-title="${item.title}"><img class="song-image" src="${item.image}" alt="${item.title} 악보" /></button>`
                  : `<p>${item.body}</p>`
            }
            <div class="meta">
              ${tags}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function showCategoryPage() {
  homeHero.hidden = true;
  categoryTabs.hidden = true;
  pageHeader.hidden = false;
  list.hidden = false;
  pageTitle.textContent = categoryLabels[activeCategory];
  tabs.forEach((tab) =>
    tab.classList.toggle("active", tab.dataset.category === activeCategory),
  );
  updateScheduleTabs();
  renderList();
}

function render() {
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
  const button = event.target.closest("[data-image]");
  if (!button) return;
  openImageViewer(button.dataset.image, button.dataset.title);
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
