#!/usr/bin/env node

/**
 * Tweet Updater — Refresh the curated tweet feed
 *
 * Usage:
 *   npm run update-tweets
 *
 * Workflow:
 *   1. Open your X list: https://x.com/i/lists/2031824041691222475
 *   2. Right-click on good tweets → "Copy link to post"
 *   3. Paste all URLs when prompted (one per line, blank line to finish)
 *   4. Script updates src/data/curatedTweets.ts with the new tweets
 *   5. Commit and push to deploy
 *
 * Also accepts URLs from a file:
 *   npm run update-tweets -- --file tweets.txt
 *
 * URL formats accepted:
 *   https://x.com/jerallaire/status/1988992291491492294
 *   https://twitter.com/circle/status/1933147279244017903
 *   https://x.com/jerallaire/status/1988992291491492294?s=20  (query params stripped)
 */

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TWEETS_FILE = resolve(__dirname, '../src/data/curatedTweets.ts');

// Parse a tweet URL into { id, handle }
function parseTweetUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Match: https://x.com/USERNAME/status/TWEET_ID or https://twitter.com/USERNAME/status/TWEET_ID
  const match = trimmed.match(
    /(?:x\.com|twitter\.com)\/([^/]+)\/status\/(\d+)/
  );
  if (!match) return null;

  return { handle: match[1], id: match[2] };
}

// Read URLs from stdin interactively
async function readUrlsFromStdin() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n📋 Paste tweet URLs below (one per line).');
  console.log('   Press Enter on a blank line when done.\n');

  const urls = [];
  return new Promise((resolve) => {
    rl.on('line', (line) => {
      if (line.trim() === '') {
        rl.close();
        resolve(urls);
      } else {
        urls.push(line);
      }
    });
  });
}

// Read URLs from a file
function readUrlsFromFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return content.split('\n').filter((line) => line.trim());
}

// Generate the curatedTweets.ts file content
function generateFileContent(tweets, listId) {
  const today = new Date().toISOString().slice(0, 10);

  // Group tweets by handle for readable output
  const grouped = new Map();
  for (const tweet of tweets) {
    if (!grouped.has(tweet.handle)) grouped.set(tweet.handle, []);
    grouped.get(tweet.handle).push(tweet);
  }

  let entries = '';
  for (const [handle, handleTweets] of grouped) {
    entries += `  // @${handle}\n`;
    for (const t of handleTweets) {
      entries += `  { id: '${t.id}', handle: '${t.handle}' },\n`;
    }
    entries += '\n';
  }

  return `export interface CuratedTweet {
  id: string;
  handle: string;
}

export const curatedTweets: CuratedTweet[] = [
${entries.trimEnd()}
];

export const CURATED_TWEETS_LAST_UPDATED = '${today}';

// X List ID for the embedded live timeline
// To find: go to your X list URL (e.g., https://x.com/i/lists/123456789) — the number is the list ID
export const X_LIST_ID = '${listId}';
`;
}

// Extract the current X_LIST_ID from the file
function getCurrentListId() {
  const content = readFileSync(TWEETS_FILE, 'utf-8');
  const match = content.match(/export const X_LIST_ID = '([^']+)'/);
  return match ? match[1] : 'LIST_ID_HERE';
}

// Main
async function main() {
  const args = process.argv.slice(2);
  let urls;

  // Check for --file flag
  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    const filePath = resolve(process.cwd(), args[fileIdx + 1]);
    console.log(`📂 Reading URLs from: ${filePath}`);
    urls = readUrlsFromFile(filePath);
  } else if (args.length > 0 && args[0] !== '--file') {
    // URLs passed as arguments
    urls = args;
  } else {
    // Interactive mode
    urls = await readUrlsFromStdin();
  }

  // Parse URLs
  const tweets = [];
  const errors = [];
  for (const url of urls) {
    const parsed = parseTweetUrl(url);
    if (parsed) {
      tweets.push(parsed);
    } else if (url.trim()) {
      errors.push(url.trim());
    }
  }

  if (errors.length > 0) {
    console.log('\n⚠️  Could not parse these URLs:');
    for (const e of errors) console.log(`   ${e}`);
  }

  if (tweets.length === 0) {
    console.log('\n❌ No valid tweet URLs found. Nothing updated.');
    process.exit(1);
  }

  // Deduplicate by tweet ID
  const seen = new Set();
  const unique = tweets.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  // Get current list ID and generate file
  const listId = getCurrentListId();
  const content = generateFileContent(unique, listId);
  writeFileSync(TWEETS_FILE, content);

  const today = new Date().toISOString().slice(0, 10);
  const handles = [...new Set(unique.map((t) => `@${t.handle}`))];

  console.log(`\n✅ Updated curatedTweets.ts`);
  console.log(`   ${unique.length} tweets from ${handles.length} accounts`);
  console.log(`   Date set to: ${today}`);
  console.log(`   Accounts: ${handles.join(', ')}`);
  console.log(`\n🚀 Next: commit and push to deploy.`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
