import { cpSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
const require = createRequire(import.meta.url);
const dist = dirname(require.resolve("katex"));
mkdirSync("public/math", { recursive: true });
cpSync(join(dist, "katex.min.css"), "public/math/katex.min.css");
cpSync(join(dist, "fonts"), "public/math/fonts", { recursive: true });
