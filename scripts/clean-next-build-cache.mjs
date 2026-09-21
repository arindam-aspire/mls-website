import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const NEXT_DIR = resolve(process.cwd(), ".next");
const DEV_CACHE_DIR = join(NEXT_DIR, "dev");
const DEV_TYPES_DIR = join(DEV_CACHE_DIR, "types");

const RM_OPTIONS = {
  force: true,
  recursive: true,
  maxRetries: 5,
  retryDelay: 200,
};

function removePath(target) {
  if (!existsSync(target)) {
    return true;
  }

  try {
    rmSync(target, RM_OPTIONS);
    return true;
  } catch (error) {
    if (
      error?.code === "EPERM" ||
      error?.code === "EBUSY" ||
      error?.code === "ENOTEMPTY"
    ) {
      return false;
    }

    throw error;
  }
}

function removeTreeBestEffort(target) {
  if (!existsSync(target)) {
    return { removed: true, skippedLocked: false };
  }

  if (removePath(target)) {
    return { removed: true, skippedLocked: false };
  }

  let isDirectory = false;
  try {
    isDirectory = statSync(target).isDirectory();
  } catch {
    return { removed: false, skippedLocked: true };
  }

  if (!isDirectory) {
    return { removed: false, skippedLocked: true };
  }

  let skippedLocked = false;

  for (const entry of readdirSync(target)) {
    const childResult = removeTreeBestEffort(join(target, entry));
    if (!childResult.removed) {
      skippedLocked = true;
    }
  }

  const removed = removePath(target);
  return { removed, skippedLocked: skippedLocked || !removed };
}

if (!existsSync(NEXT_DIR)) {
  process.exit(0);
}

// Production `next build` type-checks `.next/dev/types` via tsconfig include.
// A leftover/corrupt `validator.ts` (truncated `import type`) fails with
// "Cannot find name 'AppRoutes'". Always drop those types first, even when
// the rest of `.next/dev` is locked by `next dev`.
const typesResult = removeTreeBestEffort(DEV_TYPES_DIR);
if (!typesResult.removed) {
  console.error(
    "[prebuild] Could not remove `.next/dev/types`. Stop `npm run dev` and retry.",
  );
  process.exit(1);
}

const nextResult = removeTreeBestEffort(NEXT_DIR);

if (!nextResult.removed) {
  console.warn(
    "[prebuild] `.next` is partially locked (is `npm run dev` running?). Cleared unlocked artifacts, including `.next/dev/types`.",
  );
  console.warn(
    "[prebuild] Stop the dev server before `npm run build` for a fully clean production cache.",
  );
}

process.exit(0);
