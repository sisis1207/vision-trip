const { execFileSync } = require("node:child_process");
const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const checkFiles = [
  "app.js",
  "data.js",
  "data/index.js",
  "data/info.js",
  "data/schedule.js",
  "data/songs.js",
  "data/words.js",
  "data/sermons.js",
  "server.js",
  "sw.js",
  "scripts/publish.js",
];

function run(command, args, options = {}) {
  execFileSync(command, args, {
    stdio: "inherit",
    windowsHide: true,
    ...options,
  });
}

function read(command, args) {
  return execFileSync(command, args, {
    encoding: "utf8",
    windowsHide: true,
  }).trim();
}

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
