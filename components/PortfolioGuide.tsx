'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { answerPortfolioQuestion, GUIDE_STARTERS, isAllowedGuidePath, type GuideReply } from '@/utils/portfolioGuide';
import { createBrowserSpeech, type BrowserSpeech, type VoiceStatus } from '@/utils/browserSpeech';

interface Exchange { id: number; question: string; reply: GuideReply }
function MicIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v3m-4 0h8" /></svg>;
}

export default function PortfolioGuide() {
  const pathname = usePathname(), router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null), log = useRef<HTMLDivElement>(null);
  const speech = useRef<BrowserSpeech | null>(null), sequence = useRef(0);
  const questionHandler = useRef<(text: string) => void>(() => {});
  const [open, setOpen] = useState(false), [draft, setDraft] = useState('');
  const [history, setHistory] = useState<Exchange[]>([]);
  const [lastProject, setLastProject] = useState<string | undefined>();
  const [status, setStatus] = useState<VoiceStatus>('idle'), [interim, setInterim] = useState('');
  const [notice, setNotice] = useState(''), [readAloud, setReadAloud] = useState(true);
  const [capabilities, setCapabilities] = useState({ ready: false, listen: false, speak: false });

  const close = useCallback(() => {
    speech.current?.stop();
    if (dialog.current?.open) dialog.current.close();
    setOpen(false);
  }, []);

  useEffect(() => {
    const controller = createBrowserSpeech({
      onStatus: setStatus, onInterim: setInterim, onError: setNotice,
      onTranscript: text => questionHandler.current(text),
    });
    speech.current = controller;
    setCapabilities({ ready: true, listen: controller.canListen, speak: controller.canSpeak });
    const hidden = () => { if (document.hidden) controller.stop(); };
    const stop = () => controller.stop();
    window.addEventListener('portfolio-guide:close', close);
    window.addEventListener('pagehide', stop);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      controller.stop(); speech.current = null;
      window.removeEventListener('portfolio-guide:close', close);
      window.removeEventListener('pagehide', stop);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [close]);
  useEffect(() => { close(); }, [pathname, close]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [history]);

  const ask = useCallback((question: string) => {
    const value = question.trim().slice(0, 500);
    if (!value) return;
    speech.current?.stop(); setNotice(''); setDraft('');
    const reply = answerPortfolioQuestion(value, { pathname, projectId: lastProject });
    setLastProject(reply.projectId);
    const exchange = { id: ++sequence.current, question: value, reply };
    setHistory(previous => [...previous, exchange].slice(-4));
    if (reply.destination && isAllowedGuidePath(reply.destination)) {
      close(); router.push(reply.destination); return;
    }
    if (readAloud && speech.current?.canSpeak) speech.current.speak(reply.text);
  }, [pathname, lastProject, readAloud, router, close]);
  useEffect(() => { questionHandler.current = ask; }, [ask]);

  const show = () => {
    window.dispatchEvent(new Event('sidebar:close'));
    document.querySelector<HTMLDialogElement>('.command-dialog[open]')?.close();
    setNotice(''); dialog.current?.showModal(); setOpen(true);
    dialog.current?.querySelector<HTMLInputElement>('input')?.focus();
  };
  const listening = status === 'starting' || status === 'listening';
  const busy = status !== 'idle';
  const stateLabel = status === 'starting' ? 'Waiting for microphone…' : status === 'listening' ? 'Listening — say one question' : status === 'speaking' ? 'Reading the answer aloud' : 'Ready when you are';

  return <>
    <button type="button" onClick={show} aria-haspopup="dialog" aria-controls="portfolio-guide" aria-expanded={open} className="fixed bottom-5 right-4 z-30 inline-flex min-h-12 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-indigo-400/30 bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-indigo-700 sm:bottom-6 sm:right-6"><MicIcon /><span>Ask about my work</span><span aria-hidden="true" className="text-indigo-200">↗</span></button>
    <dialog ref={dialog} id="portfolio-guide" aria-labelledby="portfolio-guide-title" aria-describedby="portfolio-guide-description" className="max-w-none overflow-hidden rounded-3xl border border-[var(--color-border)] bg-surface p-0 text-text shadow-2xl" style={{ width: 'min(42rem, calc(100% - 2rem))' }} onClose={() => { speech.current?.stop(); setOpen(false); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[min(46rem,calc(100dvh-2rem))]">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--color-border)] p-5 sm:px-7">
          <div><p className="text-[.65rem] font-semibold uppercase tracking-[.2em] text-indigo-600 dark:text-indigo-300">Voice & text · guided portfolio</p><h2 id="portfolio-guide-title" className="mt-1 text-xl font-semibold text-textStrong">Get to know the work.</h2><p id="portfolio-guide-description" className="mt-1 text-xs leading-5 text-textMuted">Prepared answers from Aditya’s public portfolio.</p></div>
          <div className="flex shrink-0 items-center gap-1">{history.length > 0 && <button type="button" onClick={() => { speech.current?.stop(); setHistory([]); setLastProject(undefined); setNotice(''); }} className="min-h-10 rounded-lg px-2 text-xs text-textMuted hover:bg-surfaceAlt">Clear chat</button>}<button type="button" aria-label="Close portfolio guide" onClick={close} className="h-10 w-10 rounded-xl text-lg hover:bg-surfaceAlt">×</button></div>
        </header>
        <div ref={log} role="log" aria-label="Portfolio guide conversation" aria-live="polite" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-7">
          {history.length === 0 ? <div><div className="rounded-2xl bg-surfaceAlt p-5"><p className="text-lg font-semibold tracking-tight text-textStrong">A project, a skill, or the story behind it.</p><p className="mt-2 text-sm leading-6 text-textMuted">Ask about a contribution, explore a technology, or say “open certificates” to go there.</p></div><p className="mb-3 mt-6 text-xs font-medium text-textMuted">Start with a question</p><div className="grid gap-2 sm:grid-cols-2">{GUIDE_STARTERS.map(question => <button type="button" key={question} onClick={() => ask(question)} className="rounded-xl border border-[var(--color-border)] px-4 py-3 text-left text-sm leading-6 transition-colors hover:border-indigo-400 hover:bg-surfaceAlt">{question}<span aria-hidden="true" className="ml-2 text-indigo-500">↗</span></button>)}</div></div> : <div className="space-y-6">{history.map(item => <article key={item.id} className="space-y-3"><div className="ml-8 rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-3 text-sm leading-6 text-white"><span className="sr-only">You: </span>{item.question}</div><div className="mr-3 rounded-2xl rounded-tl-sm bg-surfaceAlt p-4"><p className="mb-2 text-[.65rem] font-semibold uppercase tracking-[.15em] text-indigo-600 dark:text-indigo-300">Portfolio guide</p><p className="text-sm leading-7">{item.reply.text}</p>{item.reply.links.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{item.reply.links.map(link => <Link href={link.href} key={link.href} onClick={close} className="inline-flex min-h-10 items-center rounded-lg border border-[var(--color-border)] bg-surface px-3 py-2 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-300">{link.label} <span aria-hidden="true" className="ml-2">↗</span></Link>)}</div>}</div></article>)}</div>}
        </div>
        <div className="shrink-0 border-t border-[var(--color-border)] p-4 sm:px-7 sm:py-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><button type="button" disabled={!capabilities.listen} onClick={() => { setNotice(''); if (listening) speech.current?.finishListening(); else speech.current?.listen(); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"><MicIcon />{listening ? 'Done speaking' : 'Speak a question'}</button><button type="button" aria-label="Read answers aloud" aria-pressed={readAloud} disabled={!capabilities.speak} onClick={() => { if (readAloud) speech.current?.stop(); setReadAloud(value => !value); }} className="min-h-11 rounded-xl border border-[var(--color-border)] px-3 text-xs hover:bg-surfaceAlt disabled:opacity-40">Read aloud {readAloud ? 'on' : 'off'}</button></div>{busy && <button type="button" onClick={() => speech.current?.stop()} className="min-h-10 rounded-lg px-2 text-xs font-semibold text-rose-600 hover:bg-surfaceAlt dark:text-rose-300">Stop audio</button>}</div>
          <p role="status" className="mb-3 text-xs leading-5 text-textMuted">{notice || interim || (capabilities.ready && !capabilities.listen ? 'Voice input is unavailable in this browser. Type or choose a topic.' : stateLabel)}</p>
          <form onSubmit={event => { event.preventDefault(); ask(draft); }} className="flex items-center gap-2"><label htmlFor="portfolio-guide-question" className="sr-only">Question about Aditya’s portfolio</label><input id="portfolio-guide-question" value={draft} onChange={event => setDraft(event.target.value)} maxLength={500} autoComplete="off" placeholder="Ask about a project or skill…" className="min-h-12 min-w-0 flex-1 rounded-xl border border-[var(--color-border)] bg-surfaceAlt px-4 text-sm" /><button type="submit" disabled={!draft.trim()} aria-label="Ask portfolio guide" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white hover:bg-indigo-700 disabled:opacity-40">↑</button></form>
          <p className="mt-3 text-[.65rem] leading-5 text-textMuted">Voice uses your browser’s speech service, which may process audio remotely. This site doesn’t save recordings or chats. You can always type instead.</p>
        </div>
      </div>
    </dialog>
  </>;
}
