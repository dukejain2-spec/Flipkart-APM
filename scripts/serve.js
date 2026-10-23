/* Zero-dependency local server for the prototype: `npm run dev`, then open the address it prints.
   The prototype itself needs no server; index.html also opens by double-click. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "DukeJain_IITDelhi");
const firstPort = Number(process.env.PORT) || 3000;
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon"
};

if (!fs.existsSync(path.join(root, "index.html"))) {
  console.error("Can't find " + path.join(root, "index.html") + ". Run this from the repository (the folder with package.json).");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(root, url === "/" ? "index.html" : url);
  if (path.relative(root, file).startsWith("..")) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  });
});

/* If the port is taken (another dev server, say), try the next few. */
let port = firstPort;
server.on("error", err => {
  if (err.code === "EADDRINUSE" && port < firstPort + 10) {
    console.log(`Port ${port} is busy, trying ${port + 1}...`);
    port++;
    server.listen(port);
  } else {
    console.error("Couldn't start the server: " + err.message);
    process.exit(1);
  }
});
server.on("listening", () => console.log(`Prototype running at http://localhost:${port}  (Ctrl+C to stop)`));
server.listen(port);
