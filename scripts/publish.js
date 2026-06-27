// 배포 자동화 스크립트입니다.
// 실행 순서: 문법 검사 → 서비스워커 캐시 버전 갱신 → Git 커밋 → GitHub 푸시

const { execFileSync } = require("node:child_process");
const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

// 배포 전에 문법 검사를 수행할 JavaScript 파일 목록입니다.
const checkFiles = [
  "app.js",
  "data.js",
  "data/index.js",
  "data/info.js",
  "data/schedule.js",
  "data/songs.js",
  "data/words.js",
  "data/hanmom.js",
  "server.js",
  "sw.js",
  "scripts/publish.js",
];

// 외부 명령을 실행하고 출력은 터미널에 그대로 표시합니다.
function run(command, args, options = {}) {
  execFileSync(command, args, {
    stdio: "inherit",
    windowsHide: true,
    ...options,
  });
}

// 외부 명령 실행 결과를 문자열로 읽습니다.
function read(command, args) {
  return execFileSync(command, args, {
    encoding: "utf8",
    windowsHide: true,
  }).trim();
}

// 배포 시 서비스워커 캐시 버전을 자동으로 갱신합니다.
function updateServiceWorkerCacheVersion() {
  const swPath = join(process.cwd(), "sw.js");
  const source = readFileSync(swPath, "utf8");
  const nextVersion = `v${Date.now()}`;
  const nextSource = source.replace(
    /const cacheVersion = ".*?";/,
    `const cacheVersion = "${nextVersion}";`,
  );

  if (nextSource === source) {
    throw new Error("Could not find service worker cacheVersion.");
  }

  writeFileSync(swPath, nextSource);
  console.log(`Updated service worker cache version: ${nextVersion}`);
}

const message = process.argv.slice(2).join(" ").trim() || "Update vision trip app";
const gitBaseArgs = ["-c", `safe.directory=${process.cwd().replaceAll("\\", "/")}`];

updateServiceWorkerCacheVersion();

const status = read("git", [...gitBaseArgs, "status", "--porcelain"]);

if (!status) {
  console.log("No changes to publish.");
  process.exit(0);
}

checkFiles.forEach((file) => {
  run(process.execPath, ["--check", file]);
});
run("git", [...gitBaseArgs, "add", "."]);
run("git", [...gitBaseArgs, "commit", "-m", message]);
run("git", [...gitBaseArgs, "push", "origin", "main"]);
