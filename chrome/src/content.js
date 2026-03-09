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

function isAlmdFile() {
  return window.location.pathname.endsWith('.almd');
}

function getThemeName() {
  const html = document.documentElement;
  const mode = html.getAttribute('data-color-mode');
  if (mode === 'dark') return 'github-dark';
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'github-dark'
      : 'github-light';
  }
  return 'github-light';
}

async function fetchRawCode() {
  const rawUrl = window.location.href.replace('/blob/', '/raw/');
  const res = await fetch(rawUrl);
  if (!res.ok) throw new Error(`Failed to fetch raw: ${res.status}`);
  return res.text();
}

async function run() {
  if (!isAlmdFile()) return;
  if (document.body.getAttribute('data-almide-highlighted') === 'true') return;
  document.body.setAttribute('data-almide-highlighted', 'true');

  try {
    const [hl, code] = await Promise.all([initHighlighter(), fetchRawCode()]);
    const themeName = getThemeName();

    const tokens = hl.codeToTokens(code, {
      lang: 'almide',
      theme: themeName,
    });

    // Find the per-line code divs (GitHub's react code view)
    const lineDivs = document.querySelectorAll(
      '.react-code-lines .react-code-line-contents-no-virtualization'
    );

    if (lineDivs.length === 0) {
      console.log('[Almide] No line divs found');
      return;
    }

    lineDivs.forEach((lineEl, i) => {
      if (i >= tokens.tokens.length) return;
      const lineTokens = tokens.tokens[i];
      if (!lineTokens || lineTokens.length === 0) {
        lineEl.innerHTML = '\n';
        return;
      }

      const html = lineTokens.map(token => {
        const escaped = token.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        if (token.color) {
          return `<span style="color:${token.color}">${escaped}</span>`;
        }
        return escaped;
      }).join('');

      lineEl.innerHTML = html;
    });

    console.log(`[Almide] Highlighted ${lineDivs.length} lines with ${themeName}`);
  } catch (e) {
    console.error('[Almide] Error:', e);
    document.body.removeAttribute('data-almide-highlighted');
  }
}

// Initial run (wait for GitHub to finish rendering)
setTimeout(run, 500);

// Handle GitHub SPA navigation by detecting URL changes
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    document.body.removeAttribute('data-almide-highlighted');
    setTimeout(run, 500);
  }
}).observe(document.body, { childList: true, subtree: true });
