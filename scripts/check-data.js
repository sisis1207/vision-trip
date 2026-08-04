// 데이터의 기본 구조가 화면 렌더링 규칙과 맞는지 확인합니다.

const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const errors = [];
const ids = new Set();
const allowedLyricClasses = new Set([
  "lyric-label",
  "lyric-ko",
  "lyric-ja-original",
  "lyric-ja",
]);
const categories = new Set(
  [
    ...readFileSync(join(root, "data/index.js"), "utf8").matchAll(
      /^\s{2}([a-z-]+):\s*"/gm,
    ),
  ].map(([, category]) => category),
);

function addError(message) {
  errors.push(message);
}

function checkDuplicateId(id) {
  if (ids.has(id)) {
    addError(`${id} id가 중복되었습니다.`);
  }

  ids.add(id);
}

function checkCategory(id, category) {
  if (!categories.has(category)) {
    addError(`${id} 항목의 category가 올바르지 않습니다: ${category}`);
  }
}

function checkRequiredTitle(id, title) {
  if (!title) {
    addError(`${id} 항목의 title이 비어 있습니다.`);
  }
}

function checkDate(id, date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
    addError(`${id} 항목의 date는 YYYY-MM-DD 형식이어야 합니다.`);
  }
}

function checkSchedule(id, body) {
  const date = body.match(/date:\s*"([^"]*)"/)?.[1];
  checkDate(id, date);

  const scheduleBlock = body.match(/schedule:\s*\[([\s\S]*?)\],\s*tags:/)?.[1];
  if (!scheduleBlock) {
    addError(`${id} 항목의 schedule 배열을 찾을 수 없습니다.`);
    return;
  }

  const eventMatches = [...scheduleBlock.matchAll(/\{\s*([\s\S]*?)\s*\},/g)];
  if (eventMatches.length === 0) {
    addError(`${id} 항목의 schedule에 일정이 없습니다.`);
  }

  eventMatches.forEach(([, eventBody], index) => {
    if (eventBody.includes("...")) return;

    const time = eventBody.match(/time:\s*"([^"]*)"/)?.[1];
    const title = eventBody.match(/title:\s*"([^"]*)"/)?.[1];

    if (!time) {
      addError(`${id} schedule ${index + 1}번째 항목의 time이 비어 있습니다.`);
    }

    if (!title) {
      addError(`${id} schedule ${index + 1}번째 항목의 title이 비어 있습니다.`);
    }
  });
}

function checkSong(id, body) {
  const image = body.match(/image:\s*"([^"]*)"/)?.[1];
  if (image && !existsSync(join(root, image))) {
    addError(`${id} 항목의 image 파일이 없습니다: ${image}`);
  }

  for (const [, classList] of body.matchAll(/class=["']([^"']+)["']/g)) {
    classList
      .split(/\s+/)
      .filter((className) => className.startsWith("lyric-"))
      .forEach((className) => {
        if (!allowedLyricClasses.has(className)) {
          addError(`${id} 항목의 가사 class가 올바르지 않습니다: ${className}`);
        }
      });
  }
}

function checkObjectItems(file, fallbackCategory = null) {
  const source = readFileSync(join(root, file), "utf8");
  const itemMatches = source.matchAll(
    /\{\s*id:\s*"([^"]+)",([\s\S]*?)(?=\n\s*\},)/g,
  );

  for (const [, id, body] of itemMatches) {
    const category = body.match(/category:\s*"([^"]+)"/)?.[1] || fallbackCategory;
    const title = body.match(/title:\s*"([^"]*)"/)?.[1];

    checkDuplicateId(id);
    checkRequiredTitle(id, title);

    if (category) {
      checkCategory(id, category);
    }

    if (category === "info" && id !== "info-1" && !body.includes("infoGroup:")) {
      addError(`${id} 안내 항목의 infoGroup이 비어 있습니다.`);
    }

    if (category === "schedule") {
      checkSchedule(id, body);
    }

    if (category === "song") {
      checkSong(id, body);
    }
  }
}

checkObjectItems("data/info.js");
checkObjectItems("data/schedule.js");
checkObjectItems("data/songs.js");
checkObjectItems("data/hanmom.js");
checkObjectItems("data/words.js", "word");

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
