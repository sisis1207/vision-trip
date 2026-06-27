// 로컬 개발 서버입니다.
// 정적 파일을 제공하고, VS Code 미리보기용 live reload 이벤트를 지원합니다.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 5173);
const root = __dirname;
const liveReloadClients = new Set();

// 확장자별 Content-Type 매핑입니다.
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

// HTTP 응답을 공통 형식으로 보냅니다.
function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

// 요청 처리: live reload 이벤트 또는 정적 파일 응답을 처리합니다.
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/__events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    });
    res.write("\n");
    liveReloadClients.add(res);
    req.on("close", () => liveReloadClients.delete(res));
    return;
  }

  let requestedPath = decodeURIComponent(url.pathname);

  if (requestedPath === "/") {
    requestedPath = "/index.html";
  }

  const filePath = path.resolve(root, `.${requestedPath}`);
  if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== root) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(root, "index.html"), (fallbackError, fallback) => {
        if (fallbackError) {
          send(res, 404, "Not found");
          return;
        }
        send(res, 200, fallback, types[".html"]);
      });
      return;
    }

    const ext = path.extname(filePath);
    send(res, 200, data, types[ext] || "application/octet-stream");
  });
});

server.listen(port, host, () => {
  console.log(`Vision Trip PWA running at http://localhost:${port}`);
  console.log(`LAN access is available at http://<your-pc-ip>:${port}`);
});

let reloadTimer;

function broadcastReload(fileName) {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    for (const client of liveReloadClients) {
      client.write(`event: reload\ndata: ${JSON.stringify({ fileName })}\n\n`);
    }
  }, 150);
}

fs.watch(root, { recursive: true }, (eventType, fileName) => {
  if (!fileName) return;
  if (fileName.includes(".git")) return;
  if (fileName.includes("node_modules")) return;
  broadcastReload(fileName);
});
