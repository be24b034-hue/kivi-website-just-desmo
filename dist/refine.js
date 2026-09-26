import {animate} from './assets/anime.esm.min.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches;
window.addEventListener('kivi-motion',e=>paused=e.detail.paused);
const canMove=()=>!paused&&!reduced.matches;
document.querySelector('.story-core').addEventListener('click',()=>document.querySelector('[data-chapter="2"]').click());
document.querySelectorAll('.platform-selector button,.language-picker button,[data-platform-play]').forEach(button=>{
 let animation;
 button.addEventListener('pointerdown',()=>{if(!canMove())return;animation?.pause();animation=animate(button,{scale:[1,.95,1],duration:320,ease:'outCubic'});});
});
document.querySelectorAll('.faq-list details').forEach(details=>{
 const summary=details.querySelector('summary');let transition;
 summary.addEventListener('click',e=>{
  if(!canMove())return;e.preventDefault();if(transition)return;
  const closing=details.open,start=details.getBoundingClientRect().height;
  if(!closing)details.open=true;
  const end=closing?summary.getBoundingClientRect().height:details.getBoundingClientRect().height;
  details.style.overflow='hidden';
  transition=animate(details,{height:[start,end],duration:360,ease:'inOutCubic',onComplete:()=>{if(closing)details.open=false;details.style.height='';details.style.overflow='';transition=null;}});
  if(!closing)animate(details.querySelector('p'),{opacity:[0,1],y:[-5,0],duration:350,ease:'outQuad'});
 });
});
