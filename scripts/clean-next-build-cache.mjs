import { existsSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const NEXT_DIR = resolve(process.cwd(), ".next");
const DEV_CACHE_DIR = join(NEXT_DIR, "dev");

const RM_OPTIONS = {
  force: true,
  recursive: true,
  maxRetries: 3,
  retryDelay: 100,
};

function removePath(target) {
  if (!existsSync(target)) {
    return true;
  }

  try {
    rmSync(target, RM_OPTIONS);
    return true;
  } catch (error) {
    if (error?.code === "EPERM" || error?.code === "EBUSY") {
      return false;
    }

    throw error;
  }
}

function cleanProductionArtifacts() {
  let skippedLocked = false;

  for (const entry of readdirSync(NEXT_DIR)) {
    if (entry === "dev") {
      continue;
    }

    const target = join(NEXT_DIR, entry);
    if (!removePath(target)) {
      skippedLocked = true;
      console.warn(`[prebuild] Skipped locked path: ${target}`);
    }
  }

  return skippedLocked;
}

if (!existsSync(NEXT_DIR)) {
  process.exit(0);
}

if (existsSync(DEV_CACHE_DIR)) {
  console.warn(
    "[prebuild] `.next/dev` detected (is `npm run dev` running?). Skipping dev cache and clearing production artifacts only.",
  );
  console.warn(
    "[prebuild] Stop the dev server before `npm run build` for a reliable production build.",
  );

  const skippedLocked = cleanProductionArtifacts();

  if (skippedLocked) {
    console.warn(
      "[prebuild] Some build artifacts are still locked. Stop other Next.js processes for a full clean.",
    );
  }

  process.exit(0);
}

removePath(NEXT_DIR);
