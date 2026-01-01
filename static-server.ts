#!/usr/bin/env -S deno run --allow-net --allow-read

import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const PORT = 8080;

console.log(`Preview server running on http://0.0.0.0:${PORT}`);

Deno.serve({ port: PORT, hostname: "0.0.0.0" }, (req) => {
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
  });
});
