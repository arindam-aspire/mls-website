#!/usr/bin/env node
/**
 * Ensures every locale has the same message key tree as English (source of truth).
 * Run: npm run validate:i18n
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const messagesRoot = path.join(root, "src", "messages");
const sourceLocale = "en";
const locales = ["en", "ar", "es", "fr"];

function flattenKeys(obj, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, full));
    } else {
      keys.push(full);
    }
  }
  return keys.sort();
}

function loadLocaleMessages(locale) {
  const indexPath = path.join(messagesRoot, locale, "index.ts");
  if (!fs.existsSync(indexPath)) {
    throw new Error(`Missing index.ts for locale "${locale}"`);
  }

  const namespaces = fs
    .readdirSync(path.join(messagesRoot, locale))
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""));

  const tree = {};
  for (const ns of namespaces) {
    const jsonPath = path.join(messagesRoot, locale, `${ns}.json`);
    tree[ns] = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  }
  return tree;
}

function flattenNamespaceTree(tree) {
  const keys = [];
  for (const [namespace, messages] of Object.entries(tree)) {
    for (const key of flattenKeys(messages)) {
      keys.push(`${namespace}.${key}`);
    }
  }
  return keys;
}

const sourceTree = loadLocaleMessages(sourceLocale);
const sourceKeys = new Set(flattenNamespaceTree(sourceTree));

let failed = false;

for (const locale of locales) {
  const localeTree = loadLocaleMessages(locale);
  const localeKeys = new Set(flattenNamespaceTree(localeTree));

  for (const key of sourceKeys) {
    if (!localeKeys.has(key)) {
      console.error(`[${locale}] missing key: ${key}`);
      failed = true;
    }
  }

  for (const key of localeKeys) {
    if (!sourceKeys.has(key)) {
      console.error(`[${locale}] extra key (not in ${sourceLocale}): ${key}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\ni18n parity check failed. Add missing keys to all locales under src/messages/<locale>/*.json");
  process.exit(1);
}

console.log(`i18n parity OK (${sourceKeys.size} keys × ${locales.length} locales)`);
