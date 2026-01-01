#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env

/**
 * Build CSS using Tailwind CLI
 * This script is used during development and production builds
 */

const isDev = Deno.args.includes("--watch");

const command = new Deno.Command("tailwindcss", {
  args: [
    "-i",
    "./src/styles/index.css",
    "-o",
    "./public/styles/output.css",
    ...(isDev ? ["--watch"] : ["--minify"]),
  ],
  stdout: "inherit",
  stderr: "inherit",
});

const process = command.spawn();
const status = await process.status;

Deno.exit(status.code);
