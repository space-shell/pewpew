#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env --allow-run --watch

import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const PORT = 5173;

console.log(`Starting development server on http://0.0.0.0:${PORT}`);
console.log("Building CSS with Tailwind...");

// Start Tailwind CSS build in watch mode
const tailwindProcess = new Deno.Command("deno", {
  args: ["run", "--allow-read", "--allow-write", "--allow-run", "--allow-env", "scripts/build-css.ts", "--watch"],
  stdout: "inherit",
  stderr: "inherit",
}).spawn();

// Simple dev server
Deno.serve({ port: PORT, hostname: "0.0.0.0" }, async (req) => {
  const url = new URL(req.url);

  // Serve from public directory
  if (url.pathname.startsWith("/dist/") ||
      url.pathname.startsWith("/styles/") ||
      url.pathname.startsWith("/icons/") ||
      url.pathname === "/manifest.json" ||
      url.pathname === "/sw.js") {
    return serveDir(req, {
      fsRoot: "public",
      urlRoot: "",
    });
  }

  // For SPA routing, serve index.html for all other routes
  if (url.pathname === "/" || !url.pathname.includes(".")) {
    return serveDir(req, {
      fsRoot: "public",
      urlRoot: "",
    });
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
  });
});

// Cleanup on exit
Deno.addSignalListener("SIGINT", () => {
  tailwindProcess.kill();
  Deno.exit();
});
