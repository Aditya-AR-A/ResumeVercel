const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(file) {
  const resolved = path.resolve(file);
  if (cache.has(resolved)) return cache.get(resolved);
  if (resolved.endsWith('.json')) return JSON.parse(fs.readFileSync(resolved, 'utf8'));
  const module = { exports: {} }; cache.set(resolved, module.exports);
  const code = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports: module.exports, module, require: spec => {
    let name = spec.startsWith('@/') ? path.join(root, spec.slice(2)) : path.resolve(path.dirname(resolved), spec);
    if (!path.extname(name)) name += '.ts';
    return load(name);
  } }, { filename: resolved });
  return module.exports;
}
const { answerPortfolioQuestion: answer, isAllowedGuidePath: allowed } = load(path.join(root, 'utils/portfolioGuide.ts'));
const { BrowserSpeech } = load(path.join(root, 'utils/browserSpeech.ts'));
const source = JSON.parse(fs.readFileSync(path.join(root, 'data/portfolio.json'), 'utf8'));
let checks = 0;
function check(name, run) { run(); checks++; console.log('PASS ' + name); }

check('SSHD answer uses the confirmed role and Node contribution', () => { const r = answer('What did Aditya build at SSHD?'); assert.match(r.text, /Node\.js/); assert(r.links.some(l => l.href.endsWith('ai-python-sshd-2026'))); });
check('Power BI contribution includes actual modeling and visuals', () => { const r = answer('Explain the Talent Power BI dashboard'); assert.match(r.text, /star schema/i); assert.match(r.text, /Vega-Lite/); assert.equal(r.projectId, 'talentpool-powerbi'); });
check('slicer script is separate from analytics', () => { assert.equal(answer('Explain the slicer script').projectId, 'slicer-overlay'); assert.equal(answer('Explain the slicer dashboard').projectId, 'slicer-analytics'); });
check('Performance Pro does not become an invented SSHD assignment', () => { const r = answer('Was Performance Pro at SSHD?'); assert.match(r.text, /not been confirmed/); assert.equal(r.destination, undefined); });
check('unsupported impact figures stay unverified', () => { const r = answer('How many users use the Slicer dashboard?'); assert.match(r.text, /does not publish verified/); });
check('follow-up technology question stays with the last project', () => { const r = answer('What technologies does it use?', { projectId: 'talentpool-powerbi' }); assert.match(r.text, /DAX/); assert.equal(r.projectId, 'talentpool-powerbi'); });
check('current project route supplies follow-up context', () => assert.equal(answer('What tools were used?', { pathname: '/projects/qlik-powerbi-suite' }).projectId, 'qlik-powerbi-suite'));
check('an explanation does not navigate', () => assert.equal(answer('Tell me about Performance Pro').destination, undefined));
check('explicit navigation opens only a known portfolio destination', () => assert.equal(answer('Open certificates').destination, '/certificates'));
check('backend discovery opens filtered projects instead of an arbitrary item', () => assert.equal(answer('Show me his backend projects').destination, '/projects?skill=Django'));
check('external URLs and executable schemes cannot become navigation', () => { for (const q of ['open https://example.com', 'open javascript:alert(1)', 'open data:text/html,hi']) assert.equal(answer(q).destination, undefined); });
check('unknown topics are not answered as expertise', () => assert.match(answer('Tell me about quantum computing').text, /prepared answers/));
check('private details are not fabricated', () => assert.match(answer('What is his salary?').text, /not published/));
check('links and navigation targets are constrained for all starter topics', () => { for (const q of ['hello', 'show Python projects', 'open home', 'open contact', 'skills', 'recruitment agent', 'open experience']) { const r = answer(q); assert(r.links.every(l => allowed(l.href))); if (r.destination) assert(allowed(r.destination)); } });
check('all data-backed routes are allowed, arbitrary paths are rejected', () => { for (const p of source.projects) assert(allowed('/projects/' + p.id)); for (const p of ['/admin', '//example.com', '/projects?skill=unknown', '/projects?skill=%E0%A4%A']) assert.equal(allowed(p), false); });

function fixture(options = {}) {
  const recognitions = [], events = [], timers = new Map(), utterances = [];
  let id = 0, cancels = 0;
  class Recognition {
    constructor() { recognitions.push(this); }
    start() { if (options.startThrows) throw new Error('denied'); if (!options.pending) this.onstart?.(); }
    stop() { this.onend?.(); }
    abort() { this.aborted = true; this.onend?.(); }
  }
  class Utterance { constructor(text) { this.text = text; } }
  const env = {
    ...(options.unsupported ? {} : { SpeechRecognition: Recognition, SpeechSynthesisUtterance: Utterance, speechSynthesis: {
      cancel() { cancels++; }, getVoices() { return [{ name: 'local', lang: 'en-IN', localService: true }]; },
      speak(u) { utterances.push(u); u.onstart?.(); },
    } }),
    setTimeout(fn, delay) { timers.set(++id, { fn, delay }); return id; }, clearTimeout(n) { timers.delete(n); },
  };
  const controller = new BrowserSpeech(env, {
    onStatus: s => events.push(['status', s]), onTranscript: t => events.push(['transcript', t]),
    onInterim: t => events.push(['interim', t]), onError: e => events.push(['error', e]),
  });
  return { controller, recognitions, events, timers, utterances, cancels: () => cancels };
}
const result = (recognition, text, final = true) => recognition.onresult({ results: [{ isFinal: final, 0: { transcript: text } }] });
check('unsupported browser preserves a text fallback', () => { const f = fixture({ unsupported: true }); assert.equal(f.controller.canListen, false); f.controller.listen(); assert(f.events.some(e => e[0] === 'error' && /type/.test(e[1]))); });
check('speech is delivered only after listening ends', () => { const f = fixture(); f.controller.listen(); const r = f.recognitions[0]; result(r, 'open certificates'); assert(!f.events.some(e => e[0] === 'transcript')); r.onend(); assert.equal(f.events.filter(e => e[0] === 'transcript').length, 1); assert.equal(f.timers.size, 0); });
check('interim speech is not submitted as a question', () => { const f = fixture(); f.controller.listen(); result(f.recognitions[0], 'partial', false); f.recognitions[0].onend(); assert(!f.events.some(e => e[0] === 'transcript')); });
check('stop ignores late recognition events and clears timers', () => { const f = fixture(); f.controller.listen(); const r = f.recognitions[0]; f.controller.stop(); result(r, 'open contact'); r.onend(); assert(r.aborted); assert.equal(f.timers.size, 0); assert(!f.events.some(e => e[0] === 'transcript')); });
check('restart cannot deliver the previous microphone session', () => { const f = fixture(); f.controller.listen(); const old = f.recognitions[0]; f.controller.listen(); result(old, 'stale'); old.onend(); assert(!f.events.some(e => e[0] === 'transcript')); f.controller.stop(); });
check('permission errors stop listening with useful fallback text', () => { const f = fixture(); f.controller.listen(); f.recognitions[0].onerror({ error: 'not-allowed' }); assert.equal(f.timers.size, 0); assert(f.events.some(e => e[0] === 'error' && /denied.*type/.test(e[1]))); });
check('synchronous speech-service failure does not break the guide', () => { const f = fixture({ startThrows: true }); f.controller.listen(); assert.equal(f.timers.size, 0); assert(f.events.some(e => e[0] === 'error')); });
check('pending microphone access is bounded by the listening timeout', () => { const f = fixture({ pending: true }); f.controller.listen(); const timer = [...f.timers.values()].find(t => t.delay === 20000); timer.fn(); assert(f.recognitions[0].aborted); assert.equal(f.timers.size, 0); });
check('read-aloud cancels listening to avoid microphone feedback', () => { const f = fixture(); f.controller.listen(); f.controller.speak('A recorded contribution.'); assert(f.recognitions[0].aborted); assert.equal(f.utterances.length, 1); assert.equal(f.utterances[0].voice.localService, true); f.controller.stop(); });
check('stop cancels playback and late completion cannot change state', () => { const f = fixture(); f.controller.speak('Hello'); const u = f.utterances[0]; f.controller.stop(); const n = f.events.length; u.onend(); assert.equal(f.events.length, n); assert.equal(f.timers.size, 0); assert(f.cancels() > 0); });
console.log(checks + ' guide and speech lifecycle checks passed.');
