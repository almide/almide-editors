import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import githubDark from 'shiki/themes/github-dark.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import almideGrammar from '../../grammar/almide.tmLanguage.json';

const almideLang = { ...almideGrammar, name: 'almide' };

let highlighter = null;

async function initHighlighter() {
  if (highlighter) return highlighter;
  highlighter = await createHighlighterCore({
    themes: [githubDark, githubLight],
    langs: [almideLang],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

function isDarkMode() {
  // GitHub-specific
  const mode = document.documentElement.getAttribute('data-color-mode');
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  // Fallback to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getThemeName() {
  return isDarkMode() ? 'github-dark' : 'github-light';
}

// --- Code block highlighting (any website) ---

function findAlmideCodeBlocks() {
  const blocks = [];
  // Common patterns: <code class="language-almide">, <code class="language-almd">
  // Also: <pre lang="almide">, highlight-source-almide (GitHub)
  const codeEls = document.querySelectorAll(
    'code[class*="language-almide"], code[class*="language-almd"], ' +
    'code[class*="highlight-source-almide"], ' +
    'pre[lang="almide"], pre[lang="almd"]'
  );

  codeEls.forEach(el => {
    if (el.getAttribute('data-almide-done') === 'true') return;
    const codeEl = el.tagName === 'PRE' ? el.querySelector('code') || el : el;
    blocks.push(codeEl);
  });

  return blocks;
}

function tokensToHtml(tokens) {
  return tokens.map(token => {
    const escaped = token.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    if (token.color) {
      return `<span style="color:${token.color}">${escaped}</span>`;
    }
    return escaped;
  }).join('');
}

async function highlightCodeBlocks() {
  const blocks = findAlmideCodeBlocks();
  if (blocks.length === 0) return;

  const hl = await initHighlighter();
  const themeName = getThemeName();

  blocks.forEach(codeEl => {
    const code = codeEl.textContent;
    if (!code.trim()) return;

    try {
      const tokens = hl.codeToTokens(code, {
        lang: 'almide',
        theme: themeName,
      });

      const html = tokens.tokens
        .map(line => tokensToHtml(line))
        .join('\n');

      codeEl.innerHTML = html;
      codeEl.setAttribute('data-almide-done', 'true');
    } catch (e) {
      console.error('[Almide] Code block error:', e);
    }
  });

  console.log(`[Almide] Highlighted ${blocks.length} code block(s)`);
}

// --- GitHub .almd file highlighting ---

function isGitHubAlmdFile() {
  return location.hostname === 'github.com' &&
    window.location.pathname.endsWith('.almd') &&
    window.location.pathname.includes('/blob/');
}

async function fetchRawCode() {
  const rawUrl = window.location.href.replace('/blob/', '/raw/');
  const res = await fetch(rawUrl);
  if (!res.ok) throw new Error(`Failed to fetch raw: ${res.status}`);
  return res.text();
}

async function highlightGitHubFile() {
  if (!isGitHubAlmdFile()) return;
  if (document.body.getAttribute('data-almide-file-done') === 'true') return;
  document.body.setAttribute('data-almide-file-done', 'true');

  try {
    const [hl, code] = await Promise.all([initHighlighter(), fetchRawCode()]);
    const themeName = getThemeName();

    const tokens = hl.codeToTokens(code, {
      lang: 'almide',
      theme: themeName,
    });

    const lineDivs = document.querySelectorAll(
      '.react-code-lines .react-code-line-contents-no-virtualization'
    );

    if (lineDivs.length === 0) return;

    lineDivs.forEach((lineEl, i) => {
      if (i >= tokens.tokens.length) return;
      const lineTokens = tokens.tokens[i];
      if (!lineTokens || lineTokens.length === 0) {
        lineEl.innerHTML = '\n';
        return;
      }
      lineEl.innerHTML = tokensToHtml(lineTokens);
    });

    console.log(`[Almide] Highlighted file: ${lineDivs.length} lines`);
  } catch (e) {
    console.error('[Almide] File highlight error:', e);
    document.body.removeAttribute('data-almide-file-done');
  }
}

// --- Entry point ---

async function run() {
  await Promise.all([
    highlightCodeBlocks(),
    highlightGitHubFile(),
  ]);
}

// Initial run
setTimeout(run, 500);

// Handle SPA navigation (GitHub) + dynamic content loading
let lastUrl = location.href;
let debounceTimer = null;

new MutationObserver(() => {
  // URL changed (SPA navigation)
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    document.body.removeAttribute('data-almide-file-done');
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(run, 500);
    return;
  }
  // Debounce code block scanning
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (findAlmideCodeBlocks().length > 0) {
      highlightCodeBlocks();
    }
  }, 300);
}).observe(document.body, { childList: true, subtree: true });
