// Rewrites all @morpho-org/<name> references in package.json files to
// @gfxlabs/morpho-<name> so the packages are published under the @gfxlabs
// npm scope with a morpho- prefix.
//
// Run from the monorepo root:
//   node scripts/release/rewrite-scope.js
//
// This rewrites every package.json in-place. It is intended to run in CI
// right before pnpm publish, on a throwaway checkout.

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// @morpho-org/<name> -> @gfxlabs/morpho-<name>
const PATTERN = /@morpho-org\//g;
const REPLACEMENT = "@gfxlabs/morpho-";

const packageJsonPaths = [
  "package.json",
  ...readdirSync("packages").map((dir) =>
    join("packages", dir, "package.json"),
  ),
];

for (const pkgPath of packageJsonPaths) {
  let raw;
  try {
    raw = readFileSync(pkgPath, "utf8");
  } catch {
    continue;
  }

  const rewritten = raw.replace(PATTERN, REPLACEMENT);

  if (raw !== rewritten) {
    writeFileSync(pkgPath, rewritten);
    console.log(`Rewrote: ${pkgPath}`);
  }
}
