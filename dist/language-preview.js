import {animate} from './assets/anime.esm.min.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let animation;
document.querySelector('[data-replay-language]').addEventListener('click',()=>{
 animation?.pause();const target=document.querySelector('[data-greeting]');
 if(reduced.matches||document.body.classList.contains('motion-paused'))return;
 animation=animate(target,{opacity:[0,1],y:[12,0],clipPath:['inset(0 100% 0 0)','inset(0 0% 0 0)'],duration:850,ease:'outQuart'});
});
window.addEventListener('kivi-motion',e=>{if(e.detail.paused){animation?.pause();const target=document.querySelector('[data-greeting]');target.style.opacity='1';target.style.transform='none';target.style.clipPath='none';}});
