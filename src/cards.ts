import { SCRIPTS, generateRandomLoadstring, getChangelog, type ScriptDef } from './data';
import { copyToClipboard } from './clipboard';

const COPY_ICON =
  '<svg class="animated-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
const HISTORY_ICON =
  '<svg class="animated-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>';

const EMOJIS = ['❤️', '💖', '💗', '💓', '💕', '💞'];

let lastFocused: HTMLElement | null = null;

export function showModal(modal: HTMLElement): void {
  lastFocused = document.activeElement as HTMLElement | null;
  modal.hidden = false;
  requestAnimationFrame(() => {
    modal.classList.add('visible');
    // Move focus into the dialog so keyboard/screen-reader users land inside it
    modal.querySelector<HTMLElement>('.close-modal')?.focus();
  });
}

export function hideModal(modal: HTMLElement): void {
  modal.classList.remove('visible');
  window.setTimeout(() => {
    modal.hidden = true;
  }, 300);
  // Return focus to whatever opened the dialog
  if (lastFocused?.isConnected) lastFocused.focus();
  lastFocused = null;
}

function openPreviewModal(scriptText: string, copied: boolean): void {
  const modal = document.getElementById('script-preview-modal') as HTMLElement;
  const display = document.getElementById('script-link-display') as HTMLPreElement;
  const msg = document.getElementById('script-preview-msg') as HTMLElement;
  display.textContent = scriptText;
  msg.textContent = copied
    ? 'Your script is ready! It has been automatically copied to your clipboard.'
    : 'Your script is ready! Clipboard access was blocked — tap the code below to select it, then copy it manually.';
  showModal(modal);
}

/** Copy-with-theatre: loader bar + cycling emoji, then modal + clipboard. */
async function runCopyFlow(btn: HTMLButtonElement, pre: HTMLPreElement): Promise<void> {
  if (btn.dataset.loading === '1') return;
  if (btn.classList.contains('copied')) {
    btn.classList.remove('copied');
    btn.innerHTML = `${COPY_ICON} Copy Script`;
    return;
  }
  btn.dataset.loading = '1';
  const scriptText = generateRandomLoadstring();
  const originalText = pre.textContent ?? '';
  pre.textContent = '';

  const loader = document.createElement('div');
  loader.className = 'loader-container';
  loader.innerHTML =
    '<div class="loader-bar"></div><div class="loader-text"><span>Generating Script for you</span><span class="emoji">❤️</span></div>';
  pre.appendChild(loader);

  const duration = Math.floor(Math.random() * 3000) + 2000;
  const bar = loader.querySelector<HTMLElement>('.loader-bar');
  if (bar) bar.style.animationDuration = `${duration / 1000}s`;

  const emojiSpan = loader.querySelector<HTMLElement>('.emoji');
  let emojiIdx = 0;
  const emojiTimer = window.setInterval(() => {
    if (emojiSpan) emojiSpan.textContent = EMOJIS[(emojiIdx = (emojiIdx + 1) % EMOJIS.length)];
  }, 300);

  await new Promise((r) => window.setTimeout(r, duration));
  window.clearInterval(emojiTimer);
  loader.remove();
  pre.textContent = originalText;

  const ok = await copyToClipboard(scriptText);
  openPreviewModal(scriptText, ok);
  if (ok) {
    btn.innerHTML = '✓ Copied!';
    btn.classList.add('copied');
  }
  delete btn.dataset.loading;
}

function openChangelog(script: ScriptDef): void {
  const modal = document.getElementById('changelog-modal') as HTMLElement;
  const title = document.getElementById('changelog-title') as HTMLElement;
  const content = document.getElementById('version-history-content') as HTMLElement;
  title.textContent = `${script.title} - Version History`;
  content.textContent = '';
  for (const v of getChangelog(script.changelogKey)) {
    const item = document.createElement('div');
    item.className = 'version-item';
    const date = document.createElement('div');
    date.className = 'version-date';
    date.textContent = v.date;
    const changes = document.createElement('div');
    changes.className = 'version-changes';
    changes.textContent = v.changes;
    item.append(date, changes);
    content.appendChild(item);
  }
  if (!content.childElementCount) {
    const empty = document.createElement('p');
    empty.textContent = 'No version history recorded for this script yet.';
    content.appendChild(empty);
  }
  showModal(modal);
}

function openDetailModal(script: ScriptDef): void {
  const modal = document.getElementById('script-detail-modal') as HTMLElement;
  const title = document.getElementById('modal-title') as HTMLElement;
  const description = document.getElementById('modal-description') as HTMLElement;
  const copyBtn = document.getElementById('modal-copy-btn') as HTMLButtonElement;
  const gallery = document.getElementById('modal-image-gallery') as HTMLElement;
  title.textContent = script.title;
  description.textContent = script.description;
  copyBtn.innerHTML = '💪 Copy Script';
  copyBtn.onclick = async () => {
    const text = generateRandomLoadstring();
    const ok = await copyToClipboard(text);
    if (ok) {
      copyBtn.innerHTML = '✅ Copied!';
    } else {
      // Clipboard blocked — still surface the script link so the user can copy manually.
      openPreviewModal(text, false);
    }
  };
  // Populate gallery dynamically
  gallery.innerHTML = '';
  if (script.images?.length) {
    for (const src of script.images) {
      const btn = document.createElement('button');
      btn.className = 'gallery-img-container';
      btn.type = 'button';
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${script.title} preview`;
      img.className = 'gallery-img';
      img.loading = 'lazy';
      img.decoding = 'async';
      btn.appendChild(img);
      gallery.appendChild(btn);
    }
  }
  showModal(modal);
}

export function renderCards(): void {
  const container = document.getElementById('scripts-container') as HTMLElement;
  const updatedTitle = `Updated on: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`;

  SCRIPTS.forEach((script, i) => {
    const card = document.createElement('article');
    card.className = 'script-card';
    card.style.setProperty('--card-i', String(i));
    card.dataset.scriptId = script.id;
    // Searchable haystack: heading + description + tag labels
    card.dataset.search = `${script.heading} ${script.description} ${script.tags.map((t) => t.label).join(' ')}`.toLowerCase();

    const h2 = document.createElement('h2');
    h2.textContent = script.heading;

    // Image strip on card (max 3 thumbnails)
    if (script.images?.length) {
      const imgStrip = document.createElement('div');
      imgStrip.className = 'card-images';
      const maxThumbs = Math.min(script.images.length, 3);
      for (let i = 0; i < maxThumbs; i++) {
        const thumb = document.createElement('img');
        thumb.src = script.images[i];
        thumb.alt = `${script.title} preview ${i + 1}`;
        thumb.className = 'card-img-thumb';
        thumb.loading = 'lazy';
        thumb.decoding = 'async';
        thumb.fetchPriority = 'low'; // decorative thumbs never compete with content
        thumb.width = 160;
        thumb.height = 90;
        imgStrip.appendChild(thumb);
      }
      card.insertBefore(imgStrip, h2.nextSibling);
    }

    const meta = document.createElement('div');
    meta.className = 'script-meta';
    const tags = document.createElement('div');
    tags.className = 'status-tags';
    for (const t of script.tags) {
      const tag = document.createElement('span');
      tag.className = `tag ${t.cls}`;
      tag.textContent = t.label;
      if (t.cls === 'updated') tag.title = updatedTitle;
      tags.appendChild(tag);
    }
    meta.appendChild(tags);

    const pre = document.createElement('pre');
    pre.textContent = 'Click "Copy Script" to get the code';

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn copy-btn';
    copyBtn.innerHTML = `${COPY_ICON} Copy Script`;
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      void runCopyFlow(copyBtn, pre);
    });

    const historyBtn = document.createElement('button');
    historyBtn.type = 'button';
    historyBtn.className = 'btn secondary-btn';
    historyBtn.innerHTML = `${HISTORY_ICON} Version History`;
    historyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openChangelog(script);
    });

    buttons.append(copyBtn, historyBtn);
    card.append(h2, meta, pre, buttons);
    // Card is clickable + keyboard-operable (opens detail modal)
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${script.title} — details`);
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button, a')) return;
      openDetailModal(script);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if ((e.target as HTMLElement).closest('button, a')) return;
      e.preventDefault();
      openDetailModal(script);
    });
    container.appendChild(card);
  });
}

export function setupSearch(): void {
  const searchBar = document.getElementById('search-bar') as HTMLInputElement;
  const noResults = document.getElementById('no-results') as HTMLElement;
  const status = document.getElementById('search-status') as HTMLElement;

  const applyFilter = (term: string): void => {
    const q = term.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll<HTMLElement>('.script-card').forEach((card) => {
      const haystack = card.dataset.search ?? card.querySelector('h2')?.textContent?.toLowerCase() ?? '';
      const match = haystack.includes(q);
      card.style.display = match ? 'flex' : 'none';
      if (match) visible++;
    });
    noResults.hidden = visible > 0;
    // Announce result count to screen readers (empty query = no announcement)
    status.textContent = q ? `${visible} script${visible === 1 ? '' : 's'} found` : '';
  };

  searchBar.addEventListener('input', () => {
    applyFilter(searchBar.value);
    syncQueryParam(searchBar.value);
  });

  // "/" focuses the search bar (common list-page convention); ignored while typing.
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    const el = document.activeElement;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return;
    e.preventDefault();
    searchBar.focus();
  });

  // Escape in the search bar clears the filter (type="search" only clears the text).
  searchBar.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !searchBar.value) return;
    e.stopPropagation(); // don't also close a modal
    searchBar.value = '';
    applyFilter('');
    syncQueryParam('');
  });

  // "Clear search" button inside the no-results message
  document.getElementById('clear-search')?.addEventListener('click', () => {
    searchBar.value = '';
    applyFilter('');
    syncQueryParam('');
    searchBar.focus();
  });

  // Honour ?q= so the JSON-LD SearchAction (and shared search links) work.
  const initialQuery = new URLSearchParams(window.location.search).get('q');
  if (initialQuery) {
    searchBar.value = initialQuery;
    applyFilter(initialQuery);
  }
}

let syncTimer = 0;
/** Debounced: mirror the search term into ?q= so results are shareable. */
function syncQueryParam(term: string): void {
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    const url = new URL(window.location.href);
    const q = term.trim();
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }, 400);
}
