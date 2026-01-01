#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-run --allow-net

import * as esbuild from "https://deno.land/x/esbuild@v0.20.1/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";

console.log("Building for production...");

// Clean dist directory
try {
  await Deno.remove("public/dist", { recursive: true });
} catch {
  // Directory doesn't exist
}
await Deno.mkdir("public/dist", { recursive: true });

// Build CSS with Tailwind
console.log("Building CSS...");
const cssProcess = new Deno.Command("deno", {
  args: ["run", "--allow-read", "--allow-write", "--allow-run", "--allow-env", "scripts/build-css.ts"],
  stdout: "inherit",
  stderr: "inherit",
});
const cssResult = await cssProcess.output();
if (!cssResult.success) {
  console.error("CSS build failed");
  Deno.exit(1);
}

// Build JavaScript with esbuild
console.log("Building JavaScript...");
try {
  await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["./src/main.tsx"],
    outfile: "./public/dist/main.js",
    bundle: true,
    minify: true,
    sourcemap: true,
    target: "es2020",
    format: "esm",
    jsx: "automatic",
    jsxImportSource: "solid-js",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });

  console.log("Build complete!");
  console.log("Output: public/dist/main.js");
} catch (error) {
  console.error("Build failed:", error);
  Deno.exit(1);
} finally {
  esbuild.stop();
}
