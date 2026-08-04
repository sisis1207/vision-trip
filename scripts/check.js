// 배포와 로컬 점검에서 공통으로 사용하는 전체 검사 스크립트입니다.

const { execFileSync } = require("node:child_process");

const syntaxCheckFiles = [
  "app.js",
  "data.js",
  "data/index.js",
  "data/info.js",
  "data/private.example.js",
  "data/schedule.js",
  "data/songs.js",
  "data/words.js",
  "data/hanmom.js",
  "server.js",
  "sw.js",
  "scripts/check.js",
  "scripts/check-data.js",
  "scripts/check-song-assets.js",
  "scripts/check-sw-assets.js",
  "scripts/publish.js",
];

function run(args) {
  execFileSync(process.execPath, args, {
    stdio: "inherit",
    windowsHide: true,
  });
}

syntaxCheckFiles.forEach((file) => {
  run(["--check", file]);
});

run(["scripts/check-data.js"]);
run(["scripts/check-song-assets.js"]);
run(["scripts/check-sw-assets.js"]);
