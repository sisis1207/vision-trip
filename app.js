const handbookItems = [
  // 안내
  {
    id: "info-1",
    category: "info",
    title: "안내",
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
    id: "day-1",
    category: "schedule",
    title: "DAY 1 — 2026.08.11 (화) 일본 선교 시작",
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
    id: "day-2",
    category: "schedule",
    title: "DAY 2 — 2026.08.12 (수) 노방전도(훗카이도국립대학)",
    schedule: [
      { time: "08:00", title: "기상 및 아침 식사" },
      { time: "09:30", title: "오전 예배 및 조 나누기" },
      {
        time: "10:30 ~ 12:00",
        title: "노방전도 준비 및 이동",
        note: "훗카이도국립대학",
      },
      { time: "12:00 ~ 13:00", title: "점심 식사" },
      { time: "13:00 ~ 18:00", title: "노방전도" },
      { time: "18:00 ~ 21:00", title: "저녁 식사 및 복귀" },
      { time: "21:30 ~ 22:30", title: "저녁 집회", note: "간증" },
    ],
    tags: ["일정"],
  },
  {
    id: "day-3",
    category: "schedule",
    title: "DAY 3 — 2026.08.13 (목) 문화교류",
    schedule: [
      {
        section: "문화교류 세부일정표",
        time: "08:00",
        title: "기상 및 아침 식사",
      },
      {
        section: "문화교류 세부일정표",
        time: "10:00 ~ 11:00",
        title: "일본 선교 부흥예배",
      },
      {
        section: "문화교류 세부일정표",
        time: "12:00 ~ 15:00",
        title: "점심 식사 및 문화교류 준비",
        note: "13~21시까지 히마와리 회관 대여 / 필요 물품 구매 / 문화 교류 준비",
      },
      {
        section: "문화교류 세부일정표",
        time: "16:30",
        title: "문화교류 시작",
        note: "K-POP 댄스 / 노래 / 레크리에이션 / 18:00 K-푸드 시식회",
      },
      {
        section: "문화교류 세부일정표",
        time: "19:30",
        title: "정리 및 마무리",
      },
      { section: "문화교류 세부일정표", time: "21:30", title: "저녁 예배" },
    ],
    tags: ["일정"],
  },
  {
    id: "day-4",
    category: "schedule",
    title: "DAY 4 — 2026.08.14 (금) 비전트립",
    schedule: [
      { time: "08:00", title: "기상 및 아침 식사" },
      { time: "09:00", title: "아침 예배" },
      { time: "09:30", title: "조별 모임" },
      { time: "10:00", title: "비전트립", note: "점심 식사 / 트립 내용 기록" },
      { time: "18:00", title: "숙소 복귀" },
      { time: "19:00", title: "저녁 식사" },
      { time: "20:00", title: "비전트립 나눔" },
      { time: "21:00", title: "정리 예배" },
      { time: "~", title: "짐 정리" },
    ],
    tags: ["일정"],
  },
  {
    id: "day-5",
    category: "schedule",
    title: "DAY 5 — 2026.08.15 (토) 귀국",
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
    title: "꽃들도",
    body: "",
    image: "./assets/songs/flowers.png",
    tags: ["찬양"],
  },
  {
    id: "song-2",
    category: "song",
    title: "더 원합니다",
    body: "",
    image: "./assets/songs/more.png",
    tags: ["찬양"],
  },
  // 말씀
  {
    id: "message-1",
    category: "word",
    title: "말씀",
    body: "내용을 직접 수정하세요.",
    tags: ["말씀"],
  },
  // 업데이트
  {
    id: "update-1",
    category: "update",
    title: "업데이트",
    body: `2026.06.21
- 업데이트 내용을 여기에 적으세요.`,
    tags: ["업데이트"],
  },
];

const categoryLabels = {
  info: "안내",
  schedule: "일정",
  song: "찬양",
  word: "말씀",
  update: "업데이트",
};

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
