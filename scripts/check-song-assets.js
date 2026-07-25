// 찬양 데이터의 이미지 경로가 실제 파일과 서비스워커 캐시에 맞는지 확인합니다.

const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const songsSource = readFileSync(join(root, "data/songs.js"), "utf8");
const serviceWorkerSource = readFileSync(join(root, "sw.js"), "utf8");
const imageMatches = songsSource.matchAll(/image:\s*["']([^"']+)["']/g);
const missing = [];

for (const [, imagePath] of imageMatches) {
  if (!imagePath) continue;

  if (!existsSync(join(root, imagePath))) {
    missing.push(`${imagePath} 파일이 없습니다.`);
  }

  if (!serviceWorkerSource.includes(`"${imagePath}"`)) {
    missing.push(`${imagePath} 항목이 sw.js 캐시에 없습니다.`);
  }
}

if (missing.length > 0) {
  console.error(missing.join("\n"));
  process.exit(1);
}
