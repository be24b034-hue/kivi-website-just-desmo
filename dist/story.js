import {animate,createTimeline,stagger} from './assets/anime.esm.min.js';
const root=document.querySelector('#platforms'),pin=root.querySelector('.platform-pin');
const q=s=>root.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches, act=-1, frame=false, manual=-1, headingMotion;
const acts=[['ACT 01 / THE SPARK','A thought.<br><em>Out loud.</em>','Start with whatever’s on your mind.'],['ACT 02 / THE MAGIC','From voice.<br><em>To words.</em>','Kivi turns speech into text.'],['ACT 03 / THE ARRIVAL','In your app.<br><em>Just like that.</em>','Your cursor. Your words. Already there.']];
const timeline=createTimeline({autoplay:false,defaults:{ease:'inOutCubic'}});
timeline.add('.story-voice',{opacity:[1,0],scale:[1,.8],y:[0,-70],duration:200},180)
.add('.story-core',{opacity:[0,1],scale:[.3,1],rotate:[-20,0],duration:230},240)
.add('.story-core',{scale:[1,.45],opacity:[1,0],y:[0,100],duration:220},570)
.add('.story-visual .platform-stage',{opacity:[0,1],scale:[.78,1],rotateY:[-18,0],y:[60,0],duration:230},620)
.add('.story-landscape img',{scale:[1.18,1],x:[50,-30],duration:1000,ease:'linear'},0)
.add('.core-ring',{rotate:[0,180],duration:600,ease:'linear'},240);
const wave=animate('.story-sound i',{scaleY:[.25,1,.4],duration:1100,delay:stagger(35),loop:true,ease:'inOutSine',autoplay:false});
const bridge=animate('.flow-line img',{x:[-100,100],rotate:[-10,10],autoplay:false,duration:1000,ease:'inOutSine'});
function setAct(n){
 q('.platform-stage').inert=n!==2&&!paused&&!reduced.matches;
 q('.story-core').inert=n!==1||paused||reduced.matches;
 if(act===n)return;act=n;pin.dataset.act=n;
 const [label,title,copy]=acts[n];q('[data-act-label]').textContent=label;q('[data-act-title]').innerHTML=title.replace('<br>','<br> ');q('[data-act-copy]').textContent=copy;
 root.querySelectorAll('[data-chapter]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));
 q('.platform-stage').inert=n!==2&&!paused&&!reduced.matches;
 headingMotion?.pause();
 if(!paused&&!reduced.matches)headingMotion=animate([q('[data-act-label]'),q('[data-act-title]'),q('[data-act-copy]')],{opacity:[0,1],y:[18,0],duration:650,delay:stagger(50),ease:'outExpo'});
}
function render(){
 frame=false;
 if(paused||reduced.matches){setAct(2);timeline.seek(1000);wave.pause();return;}
 const r=root.getBoundingClientRect(),travel=root.offsetHeight-innerHeight,p=Math.max(0,Math.min(1,-r.top/Math.max(1,travel)));
 root.querySelectorAll('[data-chapter]').forEach((b,i)=>b.style.setProperty('--chapter-progress',Math.max(0,Math.min(1,p*3-i))));
 timeline.seek(p*1000);setAct(p<.3?0:p<.66?1:2);
 if(r.top<innerHeight&&r.bottom>0&&act===0&&!document.hidden)wave.play();else wave.pause();
 const b=document.querySelector('.flow-bridge').getBoundingClientRect();bridge.seek(Math.max(0,Math.min(1,(innerHeight-b.top)/(innerHeight+b.height)))*1000);
 if(act===2&&r.bottom>0){if(manual>=0&&Math.abs(scrollY-manual)<110)return;manual=-1;window.dispatchEvent(new CustomEvent('platform-scroll',{detail:{key:'message',progress:Math.max(0,Math.min(1,(p-.72)/.2))}}));}
}
function queue(){if(!frame){frame=true;requestAnimationFrame(render);}}
window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue,{passive:true});
window.addEventListener('platform-manual',()=>manual=scrollY);
root.querySelectorAll('[data-chapter]').forEach(button=>button.addEventListener('click',()=>{
 const n=Number(button.dataset.chapter);
 if(paused||reduced.matches){setAct(2);return;}
 const travel=root.offsetHeight-innerHeight;window.scrollTo({top:scrollY+root.getBoundingClientRect().top+travel*[.08,.47,.96][n],behavior:'smooth'});
}));
window.addEventListener('kivi-motion',e=>{paused=e.detail.paused;requestAnimationFrame(render);});
reduced.addEventListener('change',e=>{paused=e.matches;queue();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)wave.pause();else queue();});
render();
