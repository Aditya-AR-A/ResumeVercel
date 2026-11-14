"use client";
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import CommandInterface from './CommandInterface';
import type { ViewType } from './DynamicContentManager';
import { getAssetUrl } from '@/utils/assets';

const links = ['Projects', 'Experience', 'Certificates', 'About', 'Contact'];
export default function Navbar() {
  const pathname = usePathname(), router = useRouter();
  const palette = useRef<HTMLDialogElement>(null);
  const open = () => { window.dispatchEvent(new Event('sidebar:close')); palette.current?.showModal(); palette.current?.querySelector('input')?.focus(); };
  const close = () => palette.current?.close();
  useEffect(() => { close(); }, [pathname]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  const navigate = (view: ViewType) => { close(); router.push(view === 'home' ? '/' : `/${view}`); };
  return <>
    <nav aria-label="Main navigation" className="fixed inset-x-0 top-0 z-40 border-b border-[var(--color-border)] navbar-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button onClick={() => window.dispatchEvent(new Event('sidebar:toggle'))} aria-label="Open navigation menu" aria-haspopup="dialog" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] hover:bg-surfaceAlt"><svg aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" /></svg></button>
          <Link href="/" className="whitespace-nowrap font-semibold text-textStrong sm:text-xl">Aditya Raj<span className="text-blue-500">.</span></Link>
        </div>
        <div className="hidden items-center gap-4 lg:flex">{links.map(label => { const href = `/${label.toLowerCase()}`; return <Link key={href} href={href} aria-current={pathname.startsWith(href) ? 'page' : undefined} className={`text-sm ${pathname.startsWith(href) ? 'text-blue-600 dark:text-blue-400' : 'text-textMuted hover:text-textStrong'}`}>{label}</Link>; })}</div>
        <div className="flex items-center gap-2">
          <button onClick={open} aria-label="Search or navigate" aria-haspopup="dialog" className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 text-sm hover:bg-surfaceAlt"><svg aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></svg><span className="hidden sm:inline">Search</span><kbd className="hidden xl:inline text-xs text-textMuted">⌘ / Ctrl K</kbd></button>
          <a href={getAssetUrl('resume.pdf')} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4">Résumé</a>
        </div>
      </div>
    </nav>
    <dialog ref={palette} aria-labelledby="command-title" className="command-dialog w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-[var(--color-border)] bg-surface p-5 text-text shadow-xl sm:p-6" onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="command-title" className="text-lg font-semibold text-textStrong">Search or navigate</h2><p className="mt-1 text-sm text-textMuted">Try “show projects”, “contact me”, or “Python”.</p></div><button onClick={close} aria-label="Close search" className="h-10 w-10 shrink-0 rounded-lg hover:bg-surfaceAlt">✕</button></div>
      <CommandInterface variant="full" onViewChange={navigate} onNavigate={close} />
    </dialog>
  </>;
}
