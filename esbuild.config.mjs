import { build } from "esbuild";

build({
  entryPoints: ["./src/demo.ts"],
  bundle: true,
  outfile: "./dist/bundle.js",
  platform: "browser",
  sourcemap: true,
  target: "es2016",
  loader: {
    ".ts": "ts",
  },
  define: {
    "process.env.NODE_ENV": '"development"',
  },
}).catch((error) => {
  console.error("Build failed:", error);
});
