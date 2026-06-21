const { execFileSync } = require("node:child_process");

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

const message = process.argv.slice(2).join(" ").trim() || "Update vision trip app";
const gitBaseArgs = ["-c", `safe.directory=${process.cwd().replaceAll("\\", "/")}`];
const status = read("git", [...gitBaseArgs, "status", "--porcelain"]);

if (!status) {
  console.log("No changes to publish.");
  process.exit(0);
}

["app.js", "data.js", "server.js", "sw.js", "scripts/publish.js"].forEach((file) => {
  run(process.execPath, ["--check", file]);
});
run("git", [...gitBaseArgs, "add", "."]);
run("git", [...gitBaseArgs, "commit", "-m", message]);
run("git", [...gitBaseArgs, "push", "origin", "main"]);
