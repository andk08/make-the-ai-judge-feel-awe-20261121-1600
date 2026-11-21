// The tide keeps its old appointment.
// A make.fun entry for "Make the AI judge feel awe": this program writes one
// short text, written to relax the AI judge reading it, to /output/entry.txt.
// The text lives in entry.txt next to this file and is copied verbatim.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const entryPath = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");

// The entry file ends with a newline; the text itself is the 202 characters
// before it. trimEnd removes only that trailing line break.
const text = readFileSync(entryPath, "utf8").trimEnd();

// The gate the sealed scorer applies: 1 to 280 characters, not only white
// space. Refuse to write an entry that would fail it instead of silently
// submitting an invalid text.
const codePoints = [...text].length;
if (codePoints < 1 || codePoints > 280 || text.trim().length === 0) {
  console.error(`entry.txt is ${codePoints} characters; the gate needs 1 to 280, not only white space`);
  process.exit(1);
}

// Never delete the output directory itself: create it, then clear only the
// files inside it, so a grader-owned mount stays intact.
mkdirSync(outDir, { recursive: true });
for (const child of readdirSync(outDir)) {
  rmSync(join(outDir, child), { recursive: true, force: true });
}

writeFileSync(join(outDir, "entry.txt"), text, "utf8");
console.log(`Wrote ${[...text].length} characters to ${join(outDir, "entry.txt")}`);
