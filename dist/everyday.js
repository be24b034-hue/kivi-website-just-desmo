import {animate,stagger} from './assets/anime.esm.min.js';
const root=document.querySelector('#everyday'),deck=root.querySelector('.world-deck'),cards=[...root.querySelectorAll('.world-card')],keys=['work','study','everyday'];
const texts={"work":"The designs are ready. Let’s review them together tomorrow.","study":"How does this idea connect to what we learned last week?","everyday":"Let’s meet by the sea on Saturday. I’ll bring the coffee."};
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
let paused=reduced.matches,active='work',timer,generation=0,panStart=null,transition;
const moving=()=>!paused&&!reduced.matches;
function stop(){clearTimeout(timer);generation++;}
function select(key,announce=true){
 stop();active=key;const index=keys.indexOf(key);
 deck.style.setProperty('--deck-rows',keys.map(k=>k===key?'1fr':'58px').join(' '));
 cards.forEach(card=>{const on=card.dataset.worldCard===key;card.classList.toggle('selected',on);card.querySelector('.world-select').setAttribute('aria-expanded',String(on));card.querySelector('.world-story').inert=!on;card.querySelector('[data-world-text]').textContent=texts[card.dataset.worldCard];card.querySelector('[data-world-status]').textContent='Voice-to-text preview';});
 root.querySelectorAll('[data-world-dot]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.worldDot===key)));
 if(announce)root.querySelector('.deck-announcement').textContent=['Work','Learning','Daily life'][index]+' world selected.';
 const image=cards[index].querySelector('.world-art');transition?.pause();
 if(moving())transition=animate(image,{scale:[1.13,1.035],duration:1300,ease:'outExpo'});
}
root.querySelectorAll('[data-world-select],[data-world-dot]').forEach(button=>{
 button.addEventListener('click',()=>select(button.dataset.worldSelect||button.dataset.worldDot));
 button.addEventListener('keydown',e=>{let index=keys.indexOf(active);if(e.key==='ArrowRight'||e.key==='ArrowDown')index=(index+1)%3;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')index=(index+2)%3;else return;e.preventDefault();select(keys[index]);cards[index].querySelector('.world-select').focus();});
});
root.querySelectorAll('[data-world-play]').forEach(button=>button.addEventListener('click',()=>{
 stop();const key=button.dataset.worldPlay,card=cards[keys.indexOf(key)],output=card.querySelector('[data-world-text]'),status=card.querySelector('[data-world-status]'),token=generation,text=texts[key];let n=0;status.textContent='Kivi at work…';
 function type(){if(token!==generation)return;n=moving()?n+1:text.length;output.textContent=text.slice(0,n);if(n<text.length)timer=setTimeout(type,28);else{status.textContent='Written in your app ✓';root.querySelector('.deck-announcement').textContent='Sample complete. '+text;if(moving())animate(card.querySelector('.world-message'),{scale:[1,1.02,1],duration:550,ease:'outCubic'});}}type();
}));
deck.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;panStart={x:e.clientX,y:e.clientY};});
deck.addEventListener('pointerup',e=>{if(!panStart)return;const dx=e.clientX-panStart.x,dy=e.clientY-panStart.y;panStart=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)){const i=(keys.indexOf(active)+(dx<0?1:2))%3;select(keys[i]);}});
deck.addEventListener('pointercancel',()=>panStart=null);
cards.forEach(card=>{let frame=false,x=0,y=0;const art=card.querySelector('.world-art');card.addEventListener('pointermove',e=>{if(!moving()||!fine.matches||!card.classList.contains('selected'))return;const r=card.getBoundingClientRect();x=((e.clientX-r.left)/r.width-.5)*12;y=((e.clientY-r.top)/r.height-.5)*10;if(!frame){frame=true;requestAnimationFrame(()=>{frame=false;art.style.translate=x+'px '+y+'px';});}});card.addEventListener('pointerleave',()=>{art.style.translate='0px 0px';});});
function settle(){stop();transition?.pause();cards.forEach(card=>{const art=card.querySelector('.world-art');art.style.translate='0px 0px';art.style.transform='';});select(active,false);}
window.addEventListener('kivi-motion',e=>{paused=e.detail.paused;if(paused)settle();});
reduced.addEventListener('change',e=>{paused=e.matches;if(paused)settle();});
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){if(moving())animate(cards,{opacity:[.3,1],y:[55,0],delay:stagger(130),duration:1100,ease:'outExpo'});observer.disconnect();}},{threshold:.12});observer.observe(deck);
select(active,false);
