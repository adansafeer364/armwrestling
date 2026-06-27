'use client';

import { useEffect, useRef } from 'react';
import { useI18n } from '@/app/i18n';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA', 'IFRAME']);
const URDU = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/; // Arabic/Urdu script
const HAS_LETTER = /[A-Za-z]/;           // skip pure numbers / symbols
const CACHE_KEY = 'tr_ur_cache';

export default function AutoTranslate() {
  const { lang } = useI18n();
  const originals = useRef(new WeakMap<Text, string>());
  const translated = useRef(new Set<Text>());
  const phOriginals = useRef(new WeakMap<HTMLElement, string>());
  const cache = useRef<Record<string, string>>({});
  const observer = useRef<MutationObserver | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // load persisted cache once
  useEffect(() => {
    try { cache.current = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { cache.current = {}; }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const html = document.documentElement;

    const skip = (node: Node | null): boolean => {
      let el = node?.parentElement || null;
      while (el) {
        if (SKIP_TAGS.has(el.tagName)) return true;
        if (el.getAttribute('translate') === 'no' || el.hasAttribute('data-no-translate')) return true;
        el = el.parentElement;
      }
      return false;
    };

    const collect = () => {
      const nodes: Text[] = [];
      const phEls: HTMLElement[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      while ((n = walker.nextNode())) {
        const t = n as Text;
        const v = (t.nodeValue || '').trim();
        if (!v || !HAS_LETTER.test(v) || URDU.test(v)) continue;
        if (translated.current.has(t)) continue;
        if (skip(t)) continue;
        nodes.push(t);
      }
      document.querySelectorAll<HTMLElement>('input[placeholder], textarea[placeholder]').forEach((el) => {
        const ph = (el.getAttribute('placeholder') || '').trim();
        if (ph && HAS_LETTER.test(ph) && !URDU.test(ph) && !phOriginals.current.has(el) && !skip(el)) phEls.push(el);
      });
      return { nodes, phEls };
    };

    const apply = (fn: () => void) => {
      observer.current?.disconnect();
      fn();
      if (lang === 'ur') observer.current?.observe(document.body, { childList: true, subtree: true, characterData: true });
    };

    const translate = async () => {
      const { nodes, phEls } = collect();
      if (!nodes.length && !phEls.length) return;

      const uniq = Array.from(new Set([
        ...nodes.map((t) => t.nodeValue!.trim()),
        ...phEls.map((e) => e.getAttribute('placeholder')!.trim()),
      ])).filter((s) => cache.current[s] === undefined);

      if (uniq.length) {
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: uniq, to: 'ur' }),
          }).then((r) => r.json());
          (res.translations || []).forEach((tr: string, i: number) => { cache.current[uniq[i]] = tr; });
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache.current)); } catch {}
        } catch { /* keep originals */ }
      }
      if (lang !== 'ur') return; // user toggled back mid-flight

      apply(() => {
        nodes.forEach((t) => {
          const key = (t.nodeValue || '').trim();
          const tr = cache.current[key];
          if (tr && tr !== key) {
            if (!originals.current.has(t)) originals.current.set(t, t.nodeValue || '');
            t.nodeValue = (t.nodeValue || '').replace(key, tr);
            translated.current.add(t);
          }
        });
        phEls.forEach((e) => {
          const key = (e.getAttribute('placeholder') || '').trim();
          const tr = cache.current[key];
          if (tr && tr !== key) {
            if (!phOriginals.current.has(e)) phOriginals.current.set(e, e.getAttribute('placeholder') || '');
            e.setAttribute('placeholder', tr);
          }
        });
      });
    };

    const restore = () => {
      observer.current?.disconnect();
      translated.current.forEach((t) => { const o = originals.current.get(t); if (o !== undefined) t.nodeValue = o; });
      translated.current = new Set();
      document.querySelectorAll<HTMLElement>('input, textarea').forEach((e) => {
        const o = phOriginals.current.get(e); if (o !== undefined) e.setAttribute('placeholder', o);
      });
    };

    if (lang === 'ur') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ur');
      observer.current = new MutationObserver(() => {
        if (debounce.current) clearTimeout(debounce.current);
        debounce.current = setTimeout(translate, 350);
      });
      translate();
      observer.current.observe(document.body, { childList: true, subtree: true, characterData: true });
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      restore();
    }

    return () => { observer.current?.disconnect(); if (debounce.current) clearTimeout(debounce.current); };
  }, [lang]);

  return null;
}
