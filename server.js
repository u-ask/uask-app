import handler from "serve-handler";
import http from "http";
import fs from "fs";

const serveOptions = {
  public: process.env.DIST || "./dist",
  rewrites: [
    {
      source: "**",
      destination: "/index.html"
    }
  ]
};

const server = http.createServer((request, response) => {
  return handler(request, response, serveOptions);
});

const flagFile = "/home/stop";

fs.stat(flagFile, err => {
  if (err) {
    start();
  }
});

function start() {
  server.listen(process.env.PORT || 8080, () => {
    const interval = setInterval(() => checkStop(interval), 20000);
  });
}

function checkStop(interval) {
  fs.stat(flagFile, err => {
    if (!err) {
      server.close();
      clearInterval(interval);
    }
  });
}
