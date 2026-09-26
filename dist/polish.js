import { animate, stagger } from './assets/anime.esm.min.js';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduce.matches;
window.addEventListener('kivi-motion',e=>paused=e.detail.paused);
reduce.addEventListener('change',e=>paused=e.matches);
const canMove=()=>!paused&&!reduce.matches;
// Preserve complete words and native heading semantics while revealing line by line.
const headings=[...document.querySelectorAll('.section h2,.closing h2')];
headings.forEach(heading=>{
 const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(document.createTextNode(word));else{const span=document.createElement('span');span.className='word-reveal';span.textContent=word;fragment.append(span);}});node.replaceWith(fragment);});
});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(!entry.isIntersecting)return;observer.unobserve(entry.target);
 if(canMove())animate(entry.target.querySelectorAll('.word-reveal'),{opacity:[0,1],y:[30,0],rotate:[2,0],delay:stagger(65),duration:1000,ease:'outExpo'});
}),{threshold:.5});headings.forEach(h=>observer.observe(h));
const groups=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;groups.unobserve(entry.target);if(canMove())animate(entry.target.children,{opacity:[.2,1],y:[35,0],delay:stagger(110),duration:900,ease:'outExpo'});}),{threshold:.22});
document.querySelectorAll('.steps,.language-picker').forEach(group=>groups.observe(group));
// Pointer movement adds restrained perspective; touch and keyboard stay unchanged.
const fine=matchMedia('(hover:hover) and (pointer:fine)');
document.querySelectorAll('.demo-panel,.document-window').forEach(panel=>{
 panel.addEventListener('pointermove',e=>{if(!fine.matches||!canMove())return;const r=panel.getBoundingClientRect();animate(panel,{rotateY:((e.clientX-r.left)/r.width-.5)*5,rotateX:-((e.clientY-r.top)/r.height-.5)*4,duration:650,ease:'outQuad'});});
 panel.addEventListener('pointerleave',()=>{animate(panel,{rotateX:0,rotateY:0,duration:800,ease:'outExpo'});});
});
// Animate native disclosures without losing their keyboard and accessibility behavior.
document.querySelectorAll('details').forEach(details=>{
 const summary=details.querySelector('summary');let transition;
 summary.addEventListener('click',event=>{
  if(!canMove())return;
  event.preventDefault();if(transition)return;
  const closing=details.open,start=details.getBoundingClientRect().height;
  if(!closing)details.open=true;
  const end=closing?summary.getBoundingClientRect().height:details.getBoundingClientRect().height;
  details.style.overflow='hidden';
  transition=animate(details,{height:[start,end],duration:420,ease:'inOutCubic',onComplete:()=>{if(closing)details.open=false;details.style.height='';details.style.overflow='';transition=null;}});
  if(!closing)animate(details.querySelector('p'),{opacity:[0,1],y:[-6,0],duration:450,delay:80,ease:'outQuad'});
 });
});
// Give completed speech and translation results a brief, deliberate confirmation.
const state=document.querySelector('[data-demo-state]');
new MutationObserver(()=>{if(canMove()&&state.textContent.includes('Written directly'))animate('.result',{scale:[.98,1.025,1],duration:650,ease:'outCubic'});}).observe(state,{childList:true});
document.querySelectorAll('.button').forEach(button=>button.addEventListener('pointerdown',()=>{if(canMove())animate(button,{scale:[1,.96,1],duration:350,ease:'outCubic'});}));
