// 앱 데이터의 기본 구조가 화면 렌더링 규칙과 맞는지 확인합니다.

const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const errors = [];
const ids = new Set();
const categories = new Set(
  [
    ...readFileSync(join(root, "data/index.js"), "utf8").matchAll(
      /^\s{2}([a-z-]+):\s*"/gm,
    ),
  ].map(([, category]) => category),
);

function checkDuplicateId(id) {
  if (ids.has(id)) {
    errors.push(`${id} id가 중복되었습니다.`);
  }

  ids.add(id);
}

function checkCategory(id, category) {
  if (!categories.has(category)) {
    errors.push(`${id} 항목의 category가 올바르지 않습니다: ${category}`);
  }
}

function checkRequiredTitle(id, title) {
  if (!title) {
    errors.push(`${id} 항목의 title이 비어 있습니다.`);
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
      errors.push(`${id} 안내 항목의 infoGroup이 비어 있습니다.`);
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
