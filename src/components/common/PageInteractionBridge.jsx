import { useEffect } from 'react';
import { pageMap } from '../../app/routes.js';

function normalizePath(pathname) {
  let path = pathname || '/';
  try { path = decodeURIComponent(path); } catch { /* Keep malformed path unchanged. */ }
  path = path.replace(/\/+/g, '/');
  if (path === '/' || path.toLowerCase() === '/index.html') return '/';
  return path.replace(/\/+$/, '').replace(/\.html$/i, '').toLowerCase() || '/';
}

export default function PageInteractionBridge({ path }) {
  useEffect(() => {
    const updateReveals = () => {
      const reveal = document.querySelectorAll('[data-reveal="true"], [data-aos]');
      if (!('IntersectionObserver' in window)) {
        reveal.forEach((node) => node.classList.add('is-revealed', 'aos-animate'));
        return undefined;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed', 'aos-animate');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      reveal.forEach((node) => observer.observe(node));
      return () => observer.disconnect();
    };

    document.querySelectorAll('[role="tab"][aria-controls]').forEach((tab) => {
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.hidden = tab.getAttribute('aria-selected') !== 'true';
    });
    document.querySelectorAll('button[aria-expanded][aria-controls]').forEach((button) => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = button.getAttribute('aria-expanded') !== 'true';
        panel.inert = button.getAttribute('aria-expanded') !== 'true';
      }
    });
    const cleanupReveal = updateReveals();

    const onInteraction = (event) => {
      const button = event.target.closest?.('button');
      if (!button) return;

      if (button.getAttribute('aria-haspopup') === 'dialog') {
        const menu = document.querySelector('dialog.tp-menu');
        if (menu && !menu.open) menu.showModal();
        return;
      }
      if (button.closest('dialog') && button.textContent.trim().toLowerCase() === 'close') {
        const dialog = button.closest('dialog');
        if (dialog.classList.contains('tp-menu')) {
          dialog.setAttribute('data-closing', 'true');
          window.setTimeout(() => {
            if (dialog.open) dialog.close();
            dialog.removeAttribute('data-closing');
          }, 450);
        } else dialog.close();
        return;
      }
      if (button.classList.contains('tp-clip__play')) {
        const video = button.closest('.tp-clip')?.querySelector('video');
        if (video) {
          if (video.paused) { video.play().catch(() => {}); button.setAttribute('aria-pressed', 'true'); }
          else { video.pause(); button.setAttribute('aria-pressed', 'false'); }
        }
        return;
      }
      if (button.matches('.tp-photowall__print, [aria-label^="Open "], [aria-label*="full screen"]')) {
        const page = button.closest('.site-root');
        const dialog = page?.querySelector('dialog[aria-label*="photos"], dialog[aria-label="Photo viewer"]');
        const image = button.querySelector('img');
        if (dialog && image) {
          dialog.replaceChildren();
          const close = document.createElement('button');
          close.type = 'button';
          close.textContent = 'Close';
          close.setAttribute('aria-label', 'Close photo viewer');
          close.className = 'tp-lightbox-close';
          close.addEventListener('click', () => dialog.close(), { once: true });
          const enlarged = document.createElement('img');
          enlarged.src = image.currentSrc || image.src;
          enlarged.alt = image.alt || button.getAttribute('aria-label') || 'Puppy photo';
          enlarged.className = 'tp-lightbox-image';
          dialog.append(close, enlarged);
          if (!dialog.open) dialog.showModal();
        }
        return;
      }
      if (button.getAttribute('role') === 'tab') {
        const tablist = button.closest('[role="tablist"]');
        const tabs = Array.from(tablist?.querySelectorAll('[role="tab"]') || []);
        tabs.forEach((tab, index) => {
          const selected = tab === button;
          tab.setAttribute('aria-selected', String(selected));
          tab.setAttribute('tabindex', selected ? '0' : '-1');
          const panel = document.getElementById(tab.getAttribute('aria-controls'));
          if (panel) panel.hidden = !selected;
          if (selected && tablist) tablist.style.setProperty('--at', String(index));
        });
        return;
      }
      const controls = button.getAttribute('aria-controls');
      if (controls) {
        const target = document.getElementById(controls);
        if (target) {
          const expanded = button.getAttribute('aria-expanded') === 'true';
          button.setAttribute('aria-expanded', String(!expanded));
          target.hidden = expanded;
          target.inert = expanded;
        }
      }
      if (button.getAttribute('aria-label') === 'Previous photo' || button.getAttribute('aria-label') === 'Next photo') {
        const story = button.closest('.tp-storypage');
        const gallery = story?.parentElement?.querySelector('ul[aria-label^="All photos"]');
        const mainImage = story?.querySelector('img');
        const thumbnails = Array.from(gallery?.querySelectorAll('button img') || []);
        if (mainImage && thumbnails.length) {
          const current = thumbnails.findIndex((img) => img.getAttribute('src') === mainImage.getAttribute('src'));
          const direction = button.getAttribute('aria-label') === 'Next photo' ? 1 : -1;
          const nextIndex = (Math.max(0, current) + direction + thumbnails.length) % thumbnails.length;
          const next = thumbnails[nextIndex];
          mainImage.src = next.currentSrc || next.src;
          if (next.srcset) mainImage.srcset = next.srcset;
          mainImage.alt = next.alt;
          const counter = story.querySelector('span');
          if (counter) counter.textContent = `${nextIndex + 1} / ${thumbnails.length}`;
        }
        return;
      }
      if (button.closest('ul[aria-label^="All photos"]')) {
        const gallery = button.closest('ul[aria-label^="All photos"]');
        const story = gallery.parentElement?.querySelector('.tp-storypage');
        const mainImage = story?.querySelector('img');
        const thumb = button.querySelector('img');
        if (mainImage && thumb) {
          mainImage.src = thumb.currentSrc || thumb.src;
          mainImage.alt = thumb.alt;
          if (thumb.srcset) mainImage.srcset = thumb.srcset;
        }
        return;
      }
      const dialogTarget = button.getAttribute('data-dialog-target');
      if (dialogTarget) document.getElementById(dialogTarget)?.showModal?.();
      if (button.matches('[data-dialog-close], dialog button[value="cancel"]')) button.closest('dialog')?.close?.();
    };

    const onDocumentClick = (event) => {
      const link = event.target.closest?.('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          link.target === '_blank' || link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!href || /^(https?:|mailto:|tel:|sms:|#|javascript:|\/\/)/i.test(href)) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      const next = normalizePath(url.pathname);
      if (!pageMap[next]) return;
      event.preventDefault();
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    document.addEventListener('click', onInteraction);
    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('click', onInteraction);
      document.removeEventListener('click', onDocumentClick);
      cleanupReveal?.();
    };
  }, [path]);

  return null;
}
