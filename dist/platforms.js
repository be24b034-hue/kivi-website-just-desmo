import { animate, stagger } from './assets/anime.esm.min.js';
const root=document.querySelector('#platforms');
const q=s=>root.querySelector(s);
const tabs=[...root.querySelectorAll('[data-platform]')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=document.body.classList.contains('motion-paused'), active='message', timer, wave, transition, generation=0;
const samples={
message:{title:'Team chat',person:'Aarav',detail:'Your project team',prompt:'Any ideas for our next launch?',field:'YOUR REPLY',destination:'In your message',text:'Let’s launch something worth talking about.'},
email:{title:'New email',person:'Design team',detail:'To: Your collaborators',prompt:'Subject: A little inspiration for tomorrow',field:'YOUR EMAIL',destination:'In your email',text:'Hi team, the new designs are ready. Let’s review them tomorrow.'},
document:{title:'Your notebook',person:'A little room to think',detail:'Personal notes · Draft',prompt:'Good things start with a thought.',field:'YOUR DOCUMENT',destination:'In your document',text:'An idea for later: make more room for the unexpected.'}
};
const still=()=>paused||reduced.matches;
function stop(){clearTimeout(timer);wave?.pause();transition?.pause();generation++;q('[data-platform-play]').textContent='▷';q('[data-platform-play]').setAttribute('aria-label','Replay direct typing demo');root.querySelectorAll('.platform-wave i').forEach(el=>el.style.transform='');}
function finish(){q('[data-platform-output]').textContent=samples[active].text;q('[data-platform-status]').textContent='Inserted ✓';q('.platform-announcement').textContent='Sample text inserted '+samples[active].destination.toLowerCase()+'.';wave?.pause();q('[data-platform-play]').textContent='↻';q('[data-platform-play]').setAttribute('aria-label','Replay direct typing demo');}
function play(){
stop();q('.platform-window').style.opacity='1';q('.platform-window').style.transform='none';const token=generation;const text=samples[active].text;
if(still()){finish();return;}
q('[data-platform-output]').textContent='';q('[data-platform-status]').textContent='Kivi at work…';q('[data-platform-play]').textContent='↻';q('.platform-announcement').textContent='Demo playing.';
wave=animate(root.querySelectorAll('.platform-wave i'),{scaleY:[.35,1.2,.5],duration:650,delay:stagger(80),loop:true,ease:'inOutSine'});
let n=0;function tick(){if(token!==generation)return;q('[data-platform-output]').textContent=text.slice(0,++n);if(n<text.length)timer=setTimeout(tick,25);else finish();}tick();
}
function select(key,scroll=false){
stop();active=key;const s=samples[key];
tabs.forEach(t=>{const selected=t.dataset.platform===key;t.setAttribute('aria-selected',selected);t.tabIndex=selected?0:-1;});
q('#platform-preview').setAttribute('aria-labelledby','platform-'+key);q('#platform-preview').dataset.mode=key;
for(const field of ['title','person','detail','prompt','field','destination'])q('[data-platform-'+field+']').textContent=s[field];
q('.platform-avatar').textContent=s.person[0];q('[data-platform-output]').textContent='';q('[data-platform-status]').textContent='Ready to type.';
if(still()){finish();return;}
if(scroll){transition=animate(q('.platform-window'),{opacity:[.6,1],translateY:[12,0],duration:450,ease:'outQuart'});return;}
const token=generation;
transition=animate(q('.platform-window'),{opacity:[.25,1],translateY:[18,0],rotate:[key==='email'?1.2:-1.2,0],duration:550,ease:'outQuart',onComplete:()=>{if(token===generation)play();}});
}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>{window.dispatchEvent(new Event('platform-manual'));select(t.dataset.platform);});t.addEventListener('keydown',e=>{let index;if(e.key==='ArrowRight')index=(i+1)%tabs.length;if(e.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;if(e.key==='Home')index=0;if(e.key==='End')index=tabs.length-1;if(index!==undefined){e.preventDefault();window.dispatchEvent(new Event('platform-manual'));tabs[index].focus();select(tabs[index].dataset.platform);}});});
q('[data-platform-play]').addEventListener('click',()=>{window.dispatchEvent(new Event('platform-manual'));play();});
function settle(){stop();q('.platform-window').style.opacity='1';q('.platform-window').style.transform='none';finish();}
window.addEventListener('kivi-motion',e=>{paused=e.detail.paused;if(paused)settle();});
reduced.addEventListener('change',()=>{if(reduced.matches)settle();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});
window.addEventListener('platform-scroll',e=>{if(still())return;const {key,progress}=e.detail;if(key!==active)select(key,true);else{clearTimeout(timer);wave?.pause();}const text=samples[key].text;q('[data-platform-output]').textContent=text.slice(0,Math.ceil(text.length*progress));q('[data-platform-status]').textContent=progress>=1?'Inserted ✓':'Kivi at work…';q('[data-platform-play]').textContent='▷';});
