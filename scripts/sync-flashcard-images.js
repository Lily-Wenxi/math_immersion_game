#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const { toWordSlug, buildWordNameVariants } = require('../ssatFlashcardLogic');

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'flashcards');
const TARGET_DIR = path.join(ROOT, 'assets', 'flashcards');
const SUPPORTED_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.log('[sync] Source folder not found:', SOURCE_DIR);
    console.log('[sync] Put your images into ./flashcards, then run: node scripts/sync-flashcard-images.js');
    return;
  }

  ensureDir(TARGET_DIR);

  const files = fs.readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => SUPPORTED_EXTS.has(path.extname(name).toLowerCase()));

  let copied = 0;
  let skipped = 0;

  files.forEach((name) => {
    const ext = path.extname(name).toLowerCase();
    const rawName = path.basename(name, ext);

    // Support filename variants from user side, but normalize to slug target.
    const variants = buildWordNameVariants(rawName);
    const canonical = toWordSlug(rawName) || (variants[0] || 'word');

    const src = path.join(SOURCE_DIR, name);
    const dest = path.join(TARGET_DIR, `${canonical}${ext}`);

    if (fs.existsSync(dest)) {
      skipped += 1;
      return;
    }

    fs.copyFileSync(src, dest);
    copied += 1;
  });

  console.log(`[sync] scanned=${files.length} copied=${copied} skipped(existing)=${skipped}`);
  console.log('[sync] target:', TARGET_DIR);
}

main();
