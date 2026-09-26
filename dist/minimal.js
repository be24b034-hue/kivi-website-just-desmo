import {animate,stagger} from './assets/anime.esm.min.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduce.matches, heroRun=0, heroTimer, heroWave;
const move=(target,options)=>!paused&&!reduce.matches?animate(target,options):null;
move('.entrance',{opacity:[0,1],y:[25,0],duration:1050,delay:stagger(100),ease:'outExpo'});
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){move(e.target,{opacity:[.3,1],y:[25,0],duration:900,ease:'outExpo'});reveal.unobserve(e.target);}}),{threshold:.15});
$$('.flow-bridge h2,.language-head,.language-picker,.faq h2,.closing h2').forEach(el=>reveal.observe(el));
$$('[data-play-hero]').forEach(btn=>btn.addEventListener('click',()=>{
 clearTimeout(heroTimer);heroWave?.pause();const token=++heroRun;const text='“Let’s bring this idea to life.”';let i=0;
 $('[data-hero-status]').textContent='Listening…';
 heroWave=move('.voice-bar .tiny-wave i',{scaleY:[.4,1.4],duration:400,delay:stagger(45),alternate:true,loop:true,ease:'inOutSine'});
 function tick(){if(token!==heroRun)return;i=paused||reduce.matches?text.length:i+1;$('[data-hero-result]').textContent=text.slice(0,i);if(i<text.length)heroTimer=setTimeout(tick,36);else{heroWave?.pause();$('[data-hero-status]').textContent='Written in your app. ✓';}}
 tick();
}));
const greetings={ta:['வணக்கம்','Tamil'],hi:['नमस्ते','Hindi'],te:['నమస్కారం','Telugu'],kn:['ನಮಸ್ಕಾರ','Kannada'],ml:['നമസ്കാരം','Malayalam'],bn:['নমস্কাৰ','Bengali'],mr:['नमस्कार','Marathi'],gu:['નમસ્તે','Gujarati'],as:['নমস্কাৰ','Assamese']};
greetings.bn[0]='নমস্কার';
$$('[data-lang]').forEach(button=>button.addEventListener('click',()=>{
 $$('[data-lang]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 const [text,label]=greetings[button.dataset.lang];$('[data-greeting]').textContent=text;$('[data-greeting]').lang=button.dataset.lang;$('[data-greeting-label]').textContent=label;
 move('[data-greeting]',{opacity:[0,1],y:[15,0],duration:650,ease:'outExpo'});move('.language-spark',{rotate:'+=90',duration:900,ease:'outExpo'});
}));

window.addEventListener('kivi-motion',e=>{paused=e.detail.paused;if(paused)heroWave?.pause();});
reduce.addEventListener('change',e=>paused=e.matches);
