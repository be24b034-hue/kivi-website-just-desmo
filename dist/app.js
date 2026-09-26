const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let anime;
try { anime = await import('./assets/anime.esm.min.js'); } catch { /* The content and demos also work without the motion library. */ }
const motion = (target, options) => { if (anime && !reduced.matches) return anime.animate(target, options); };
const legacyAmbient=[];
window.addEventListener('kivi-motion',e=>legacyAmbient.forEach(a=>e.detail.paused?a?.pause():a?.play()));
if (anime && !reduced.matches) {
  motion('.entrance', { opacity: [0, 1], y: [24, 0], duration: 1050, delay: anime.stagger(110), ease: 'outExpo' });
  motion('.hero-scene', { opacity: [0, 1], duration: 1500, ease: 'outQuad' });
  if($('.hero-bird'))legacyAmbient.push(motion('.hero-bird', { y: [-4, 5], rotate: [-2, 1], duration: 2600, alternate: true, loop: true, ease: 'inOutSine' }));
  legacyAmbient.push(motion('.floating-word', { y: [-5, 6], duration: 3300, delay: anime.stagger(300), alternate: true, loop: true, ease: 'inOutSine' }));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { motion(entry.target, { opacity: [0.3, 1], y: [28, 0], duration: 900, ease: 'outExpo' }); observer.unobserve(entry.target); }
  }), { threshold: 0.13 });
  $$('.reveal').forEach(el => observer.observe(el));
}
let toastTimer;
function toast(message) { $('.toast').textContent = message; $('.toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('.toast').classList.remove('show'), 2400); }
let heroRunning = false;
$$('[data-play-hero]').forEach(button => button.addEventListener('click', async () => {
  if (heroRunning) return;
  heroRunning = true;
  $('[data-hero-status]').textContent = 'Catching a thought…';
  const wave = motion('.voice-bar .tiny-wave i', { scaleY: [0.4, 1.5], duration: 320, alternate: true, loop: true, delay: anime?.stagger(45) });
  $('[data-hero-result]').textContent = '';
  await typeText($('[data-hero-result]'), '“Let’s make something worth talking about.”', 36);
  wave?.pause();
  $('[data-hero-status]').textContent = 'A thought, caught. ✓';
  motion('.thought-note', { scale: [0.98, 1.03, 1], duration: 700 });
  heroRunning = false;
}));
async function typeText(el, text, speed) {
  if (reduced.matches) { el.textContent = text; return; }
  el.textContent = '';
  for (const char of Array.from(text)) { el.textContent += char; await new Promise(resolve => setTimeout(resolve, speed)); }
}
const samples = {
  thought: { source: 'Your voice', target: 'In your document', spoken: '“Remind me to share the design with the team tomorrow morning.”', result: 'Remind me to share the design with the team tomorrow morning.', lang: 'en' },
  translate: { source: 'हिन्दी', target: 'தமிழ்', spoken: '“सबसे नज़दीकी रेलवे स्टेशन कहाँ है?”', result: 'அருகிலுள்ள ரயில் நிலையம் எங்கே?', lang: 'ta' }
};
let selected = 'thought', running = false;
function selectDemo(button) {
  if (running) return;
  selected = button.dataset.demo;
  $$('[data-demo]').forEach(b => { b.setAttribute('aria-selected', b === button); b.tabIndex = b === button ? 0 : -1; });
  $('#demo-content').setAttribute('aria-labelledby', button.id);
  $('[data-source-label]').textContent = samples[selected].source;
  $('[data-target-label]').textContent = samples[selected].target;
  $('[data-spoken]').textContent = samples[selected].spoken;
  $('[data-spoken]').lang = selected === 'translate' ? 'hi' : 'en';
  $('[data-result]').textContent = 'Your words will appear here as you speak.';
  $('[data-result]').lang = 'en';
  $('[data-demo-state]').textContent = 'Ready when you are';
  $('[data-insert-status]').textContent = 'Cursor ready';
  $('[data-run]').innerHTML = 'Play demo <span>▷</span>';
  motion('#demo-content', { opacity: [0.3, 1], y: [7, 0], duration: 400, ease: 'outQuad' });
}
$$('[data-demo]').forEach(button => {
  button.addEventListener('click', () => selectDemo(button));
  button.addEventListener('keydown', e => { if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key) && !running) { e.preventDefault(); const all = $$('[data-demo]'); const next = e.key === 'Home' ? all[0] : e.key === 'End' ? all[1] : all.find(b => b !== button); next.focus(); selectDemo(next); } });
});
$('[data-run]').addEventListener('click', async () => {
  if (running) return;
  running = true;
  $('[data-run]').disabled = true;
  $$('[data-demo]').forEach(b => b.disabled = true);
  $('[data-insert-status]').textContent = 'Typing in your document…';
  $('[data-demo-state]').textContent = selected === 'translate' ? 'A thought, crossing languages…' : 'A thought, taking shape…';
  $('[data-result]').lang = samples[selected].lang;
  const wave = motion('.demo-divider .tiny-wave i', { scaleY: [0.35, 1.4], duration: 250, alternate: true, loop: true, delay: anime?.stagger(40) });
  await typeText($('[data-result]'), samples[selected].result, 28);
  wave?.pause();
  $('[data-demo-state]').textContent = 'Written directly into your document. ✓';
  $('[data-insert-status]').textContent = 'Inserted ✓';
  $('[data-run]').innerHTML = 'Play again <span>↻</span>';
  $('[data-run]').disabled = false;
  $$('[data-demo]').forEach(b => b.disabled = false);
  running = false;
});
const greetings = { ta: ['வணக்கம்', 'Tamil'], hi: ['नमस्ते', 'Hindi'], te: ['నమస్కారం', 'Telugu'], kn: ['ನಮಸ್ಕಾರ', 'Kannada'], ml: ['നമസ്കാരം', 'Malayalam'], bn: ['নমস্কার', 'Bengali'], mr: ['नमस्कार', 'Marathi'], gu: ['નમસ્તે', 'Gujarati'], as: ['নমস্কাৰ', 'Assamese'] };
$$('[data-lang]').forEach(button => button.addEventListener('click', () => {
  $$('[data-lang]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', b === button); });
  const [text, language] = greetings[button.dataset.lang];
  $('[data-greeting]').textContent = text;
  $('[data-greeting]').lang = button.dataset.lang;
  $('[data-greeting-label]').textContent = `${language} · In your own words.`;
  motion('[data-greeting]', { opacity: [0, 1], y: [15, 0], duration: 650, ease: 'outExpo' });
  motion('.language-spark', { rotate: '+=90', duration: 900, ease: 'outExpo' });
}));
let companionRunning = false;
$$('[data-companion]').forEach(button => button.addEventListener('click', async () => {
  if (companionRunning) return;
  companionRunning = true;
  $('[data-companion-status]').textContent = 'Typing as you speak…';
  $('[data-companion-description]').textContent = 'Companion Mode · sample demo';
  $('.document-insert').hidden = false;
  motion('.mini-companion', { y: [0, -8, 0], duration: 700, ease: 'inOutSine' });
  await typeText($('.document-insert'), 'What if we made it feel a little more human?', 45);
  $('[data-companion-status]').textContent = 'Written directly in your document.';
  $('[data-companion-description]').textContent = 'Play again whenever you like.';
  companionRunning = false;
}));
