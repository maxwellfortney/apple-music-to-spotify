import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/nestjs.ts", "src/nextjs.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  noExternal: ['@t3-oss/env-core', '@t3-oss/env-nextjs'] // force transpilation of @t3-oss/env-core, bc its only ESM by default
}); 