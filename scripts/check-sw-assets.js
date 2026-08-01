// 서비스워커 캐시 목록에 있는 파일이 실제로 존재하는지 확인합니다.

const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const serviceWorkerSource = readFileSync(join(root, "sw.js"), "utf8");
const assetBlockMatch = serviceWorkerSource.match(/const assets = \[([\s\S]*?)\];/);

if (!assetBlockMatch) {
  console.error("sw.js에서 assets 목록을 찾을 수 없습니다.");
  process.exit(1);
}

const missing = [...assetBlockMatch[1].matchAll(/["']([^"']+)["']/g)]
  .map(([, assetPath]) => assetPath)
  .filter((assetPath) => !existsSync(join(root, assetPath)));

if (missing.length > 0) {
  console.error(
    missing.map((assetPath) => `${assetPath} 파일이 없습니다.`).join("\n"),
  );
  process.exit(1);
}
