// Motion is decorative: answers and hints remain real, immediately readable text.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const enabled = () => !reduced.matches && !document.body.classList.contains('no-motion');
const animations = new Set();
function play(el, frames, options = {}) {
  if (!enabled() || !el || !el.getClientRects().length) return;
  const a = el.animate(frames, {duration:550, easing:'cubic-bezier(.2,.8,.2,1)', ...options});
  animations.add(a); a.finished.catch(()=>{}).finally(()=>animations.delete(a));
}
const entrance = [{opacity:0,transform:'translateY(17px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}];
const observer = new IntersectionObserver(entries => entries.forEach(e=>{
  if(e.isIntersecting){play(e.target,entrance,{delay:Number(e.target.dataset.motionDelay||0)});observer.unobserve(e.target);}
}),{threshold:.08});
function register(root=document){
  root.querySelectorAll('header, .hero-copy > *, .world, .feature-strip > div, .section-head, .chapter, .rules, footer, .question-card, .helper-card, dialog h2, dialog label').forEach((el,i)=>{
    if(el.dataset.animated)return;el.dataset.animated='1';el.dataset.motionDelay=String((i%5)*65);observer.observe(el);
  });
}
register();
const robot = document.createElement('div');
robot.className='wandering-bit';robot.setAttribute('aria-hidden','true');
robot.innerHTML=`<svg viewBox="0 0 80 88"><g class="bit-antenna"><path d="M40 20V9"/><circle cx="40" cy="7" r="4"/></g><g class="bit-arm left-arm"><path d="M17 53L7 64"/></g><g class="bit-arm right-arm"><path d="M63 53L73 42"/></g><g class="bit-leg left-leg"><path d="M29 71L25 82"/></g><g class="bit-leg right-leg"><path d="M51 71L55 82"/></g><rect x="21" y="47" width="38" height="28" rx="12" fill="#dceee0" stroke="#578c78" stroke-width="2"/><circle cx="40" cy="61" r="8" fill="#559e7c"/><path d="m36 61 3 3 6-7" stroke="white" stroke-width="2" fill="none"/><rect x="11" y="18" width="58" height="36" rx="14" fill="#f8fff5" stroke="#578c78" stroke-width="2"/><rect x="18" y="25" width="44" height="22" rx="9" fill="#294d4c"/><g class="bit-eyes" fill="#b8f4c9"><ellipse cx="29" cy="35" rx="3" ry="4"/><ellipse cx="51" cy="35" rx="3" ry="4"/></g><path class="bit-mouth" d="M36 40Q40 44 44 40" stroke="#b8f4c9" stroke-width="2" fill="none"/></svg><span class="bit-shadow"></span>`;
document.body.append(robot);
let speakingTimer;
function speak(){robot.classList.add('speaking');document.querySelector('.bot-avatar')?.classList.add('speaking');clearTimeout(speakingTimer);speakingTimer=setTimeout(()=>{robot.classList.remove('speaking');document.querySelector('.bot-avatar')?.classList.remove('speaking')},2200)}
function celebrate(){
  if(!enabled())return;
  const box=document.createElement('div');box.className='celebration';box.setAttribute('aria-hidden','true');
  for(let i=0;i<22;i++){const bit=document.createElement('i');bit.style.cssText=`--x:${Math.random()*100}vw;--drift:${Math.random()*160-80}px;--turn:${Math.random()*720}deg;--delay:${Math.random()*.35}s;background:${['#8caf70','#f3bf72','#a3b9df','#e8a6a1'][i%4]}`;box.append(bit)}
  document.body.append(box);setTimeout(()=>box.remove(),2300);
}
function burstHeart(){
  if(!enabled())return;
  document.querySelectorAll('.heart-burst').forEach(el=>el.remove());
  const overlay=document.createElement('div');
  overlay.className='heart-burst';overlay.setAttribute('aria-hidden','true');
  // SVG keeps the heart crisp even when it fills a phone or desktop viewport.
  overlay.innerHTML=`<div class="burst-heart-shape"><svg viewBox="0 0 100 100"><path d="M50 88C39 78 8 57 8 32C8 9 36 5 50 24C64 5 92 9 92 32C92 57 61 78 50 88Z" fill="#ef7b91" stroke="#d95e79" stroke-width="2"/><path d="M22 31C22 22 32 18 39 24" stroke="#ffdce4" stroke-width="6" stroke-linecap="round" fill="none"/><path class="heart-crack" d="M52 24L43 40L56 49L43 61L51 84" fill="none" stroke="#fff4ed" stroke-width="3" stroke-linejoin="round"/></svg></div><div class="heart-pop-ring"></div>`;
  for(let i=0;i<24;i++){
    const particle=document.createElement('span');
    particle.className='heart-fragment';
    const angle=(i/24)*Math.PI*2;
    const distance=(.35+Math.random()*.2)*Math.min(innerWidth,innerHeight);
    particle.style.setProperty('--dx',`${Math.cos(angle)*distance}px`);
    particle.style.setProperty('--dy',`${Math.sin(angle)*distance}px`);
    particle.style.setProperty('--spin',`${Math.random()*360-180}deg`);
    particle.style.setProperty('--particle-size',`${12+Math.random()*17}px`);
    particle.style.color=['#ef7b91','#e85d7d','#f5a1b2','#f7bc82'][i%4];
    particle.textContent=i%3===0?'♥':'✦';overlay.append(particle);
  }
  document.body.append(overlay);
  setTimeout(()=>overlay.remove(),1800);
}
const dynamicIds = new Set(['questionText','topicLabel','hintText','feedback','totalPoints','hearts','resultTitle','resultText','resultIcon','authError','hintMode']);
let changed=new Set(),flush;
new MutationObserver(records=>{
  for(const record of records){
    if(record.type==='attributes'){
      if(record.target.hidden===false||record.target.open){play(record.target,entrance);register(record.target)}
      continue;
    }
    const el=record.target.nodeType===3?record.target.parentElement:record.target;
    if(dynamicIds.has(el.id))changed.add(el);
    if(el.id==='chapters')register(el);
  }
  cancelAnimationFrame(flush);flush=requestAnimationFrame(()=>{
    changed.forEach(el=>{
      if(el.id==='hintText'){play(el,[{opacity:.2,clipPath:'inset(0 0 100% 0)',transform:'translateY(8px)'},{opacity:1,clipPath:'inset(0 0 0 0)',transform:'translateY(0)'}],{duration:850});speak();}
      else if(el.id==='feedback'){
        const wrong=el.classList.contains('wrong');
        play(el,wrong?[{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}]:entrance);
        if(!el.hidden&&el.getClientRects().length){if(wrong)burstHeart();else celebrate();}
      }else play(el,entrance,{duration:450});
    });changed.clear();
  });
}).observe(document.querySelector('main'),{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','open']});
document.querySelectorAll('dialog').forEach(dialog=>new MutationObserver(()=>{if(dialog.open)play(dialog,entrance,{duration:300})}).observe(dialog,{attributes:true,attributeFilter:['open']}));
document.addEventListener('pointerdown',event=>{const b=event.target.closest('button');if(b&&!b.disabled)play(b,[{scale:'1'},{scale:'.94'},{scale:'1'}],{duration:230})});
// The robot only travels through empty space. Check every movement segment,
// including during scrolling/resizing; it never captures pointer events.
const size=64,pad=12;
let blockers=[],x=-100,y=-100,target=null,nextTrip=0,last=0,dirty=true,lastScan=0;
function scan(){
  blockers=[...document.querySelectorAll('header,footer,button,input,select,label,h1,h2,h3,p,.eyebrow,.mini-note,.bubble,.island-label,.chapter,.question-card,.helper-card,.rules,.feature-strip,.game-top')]
    .filter(el=>el.getClientRects().length)
    .map(el=>el.getBoundingClientRect()).filter(r=>r.bottom>0&&r.top<innerHeight);
  dirty=false;
}
function safe(a,b){return a>=4&&b>=4&&a+size<=innerWidth-4&&b+size<=innerHeight-4&&!blockers.some(r=>a+size+pad>r.left&&a-pad<r.right&&b+size+pad>r.top&&b-pad<r.bottom)}
function candidates(){const out=[];for(let yy=8;yy<innerHeight-size;yy+=45)for(const xx of [8,innerWidth-size-8])if(safe(xx,yy))out.push({x:xx,y:yy});for(let xx=8;xx<innerWidth-size;xx+=55)for(const yy of [8,innerHeight-size-8])if(safe(xx,yy))out.push({x:xx,y:yy});return out}
function route(a){const steps=Math.ceil(Math.hypot(a.x-x,a.y-y)/12);for(let i=1;i<=steps;i++)if(!safe(x+(a.x-x)*i/steps,y+(a.y-y)*i/steps))return false;return true}
function frame(now){
  const dt=Math.min((now-last)/1000,.04);last=now;
  const paused=!enabled()||document.hidden||!!document.querySelector('dialog[open]');
  if(paused){robot.style.opacity='0';target=null;requestAnimationFrame(frame);return}
  if(dirty||now-lastScan>180){scan();lastScan=now}
  if(!safe(x,y)){
    const spots=candidates();target=null;robot.classList.remove('walking');
    if(!spots.length){robot.style.opacity='0';requestAnimationFrame(frame);return}
    const spot=spots[Math.floor(Math.random()*spots.length)];x=spot.x;y=spot.y;nextTrip=now+1800;
  }
  robot.style.opacity='1';
  const focused=document.activeElement?.matches('input,textarea,select');
  if(focused){target=null;nextTrip=now+1500;robot.classList.remove('walking')}
  else if(!target&&now>nextTrip){const spots=candidates().filter(p=>Math.hypot(p.x-x,p.y-y)>45&&route(p));target=spots[Math.floor(Math.random()*spots.length)]||null;nextTrip=now+2200+Math.random()*3000}
  if(target){
    const dx=target.x-x,dy=target.y-y,d=Math.hypot(dx,dy),step=Math.min(d,38*dt),nx=x+dx/d*step,ny=y+dy/d*step;
    if(d<2){target=null;robot.classList.remove('walking')}
    else if(safe(nx,ny)){x=nx;y=ny;robot.classList.add('walking');robot.style.setProperty('--facing',dx<0?'-1':'1')}
    else{target=null;robot.classList.remove('walking')}
  }
  robot.style.transform=`translate3d(${x}px,${y}px,0)`;requestAnimationFrame(frame);
}
for(const type of ['scroll','resize','focusin','focusout'])window.addEventListener(type,()=>{dirty=true},{passive:true,capture:true});
function stopMotion(){if(!enabled()){animations.forEach(a=>a.cancel());document.querySelectorAll('.celebration,.heart-burst').forEach(el=>el.remove())}dirty=true}
new MutationObserver(stopMotion).observe(document.body,{attributes:true,attributeFilter:['class']});reduced.addEventListener('change',stopMotion);
requestAnimationFrame(frame);
