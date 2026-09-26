import { animate, stagger } from './assets/anime.esm.min.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const ambient=[];
let paused=reduced.matches;
const control=$('.motion-control');
function updateControl(){control.setAttribute('aria-pressed',String(paused));control.setAttribute('aria-label',paused?'Resume ambient animations':'Pause ambient animations');control.innerHTML=paused?'<span>▷</span> Motion off':'<span>Ⅱ</span> Motion on';document.body.classList.toggle('motion-paused',paused);}
if(!reduced.matches){
 ambient.push(animate('.ribbon-track',{x:['0%','-25%'],duration:24000,ease:'linear',loop:true}));
 ambient.push(animate('.scene-sticker',{rotate:[12,21],y:[-5,5],duration:3300,alternate:true,loop:true,ease:'inOutSine'}));
 ambient.push(animate('.title-star',{rotate:360,duration:25000,ease:'linear',loop:true}));
 ambient.push(animate('.scene-orbit',{rotate:'+=12',duration:8500,alternate:true,loop:true,ease:'inOutSine'}));
 animate('.photo-frame',{opacity:[0,1],y:[75,0],rotate:[-6,5],duration:1600,delay:150,ease:'outExpo'});
 animate('.thought-note',{opacity:[0,1],x:[40,0],rotate:[-6,9],duration:1400,delay:500,ease:'outExpo'});
 animate('.voice-bar',{opacity:[0,1],y:[25,0],duration:1000,delay:750,ease:'outExpo'});
 const fine=matchMedia('(pointer:fine)');
 $$('.magnetic').forEach(button=>{button.addEventListener('pointermove',e=>{if(paused||!fine.matches)return;const r=button.getBoundingClientRect();animate(button,{x:(e.clientX-r.left-r.width/2)*.16,y:(e.clientY-r.top-r.height/2)*.2,duration:350,ease:'outQuad'});});button.addEventListener('pointerleave',()=>animate(button,{x:0,y:0,duration:650,ease:'outElastic(1, .6)'}));});
 const scene=$('.cinematic-scene');
 scene.addEventListener('pointermove',e=>{if(paused||!fine.matches)return;const r=scene.getBoundingClientRect();const dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;animate('.photo-frame',{rotateY:dx*9,rotateX:-dy*7,duration:900,ease:'outQuad'});});
 scene.addEventListener('pointerleave',()=>animate('.photo-frame',{rotateX:0,rotateY:0,duration:1000,ease:'outExpo'}));
}
updateControl();
control.addEventListener('click',()=>{paused=!paused;ambient.forEach(a=>paused?a.pause():a.play());window.dispatchEvent(new CustomEvent('kivi-motion',{detail:{paused}}));updateControl();if(paused){$('.scene-photo').style.transform='';$('.closing-photo').style.transform='';}});
reduced.addEventListener('change',e=>{if(e.matches&&!paused)control.click();});
let queued=false;
function onScroll(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;if(paused)return;const scene=$('.cinematic-scene').getBoundingClientRect();if(scene.bottom>0&&scene.top<innerHeight)$('.scene-photo').style.transform=`translateY(${Math.max(-22,Math.min(22,(innerHeight/2-scene.top-scene.height/2)*.07))}px) scale(1.045)`;const closing=$('.closing').getBoundingClientRect();if(closing.bottom>0&&closing.top<innerHeight)$('.closing-photo').style.transform=`translateY(${(innerHeight/2-closing.top-closing.height/2)*.08}px)`;});}
addEventListener('scroll',onScroll,{passive:true});onScroll();
document.addEventListener('visibilitychange',()=>{ambient.forEach(a=>document.hidden||paused?a.pause():a.play());});
const worlds={blossom:{caption:'Let your mind wander.',alt:'Kivi beneath cherry blossoms beside a sunset lake',index:'001'},coast:{caption:'Find your own rhythm.',alt:'Kivi overlooking a blue ocean at golden hour',index:'002'},hills:{caption:'Room for a new thought.',alt:'Kivi above green tea terraces and misty hills',index:'003'}};
let changingWorld=false;
$$('[data-world]').filter(b=>b.tagName==='BUTTON').forEach(button=>button.addEventListener('click',async()=>{
 if(changingWorld||button.getAttribute('aria-pressed')==='true')return;
 changingWorld=true;
 const world=button.dataset.world,info=worlds[world],photo=$('.scene-photo');
 const preload=new Image();preload.src=`assets/${world}.png`;
 try{await preload.decode();}catch{changingWorld=false;return;}
 if(!paused)await animate(photo,{opacity:[1,0],duration:220,ease:'inQuad'});
 photo.src=preload.src;photo.alt=info.alt;$('.photo-caption').textContent=info.caption;
 $('.hero').dataset.world=world;
 $$('[data-world]').filter(b=>b.tagName==='BUTTON').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 if(!paused){animate(photo,{opacity:[.45,1],clipPath:['inset(100% 0% 0% 0%)','inset(0% 0% 0% 0%)'],duration:1000,ease:'inOutQuart'});animate('.photo-caption',{opacity:[0,1],y:[20,0],duration:850,delay:200,ease:'outExpo'});}else{photo.style.opacity='1';photo.style.clipPath='inset(0% 0% 0% 0%)';}
 changingWorld=false;
}));
