const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
// Loader -> then hero sequence (.loaded): nav, headline lines, copy, CTAs, AC rises, airflow
const ld=document.getElementById('loader'),root=document.documentElement;
const startSite=()=>{document.getElementById('nav').classList.add('on');requestAnimationFrame(()=>document.body.classList.add('loaded'))};
if(ld){root.classList.add('ld-lock');const bar=document.getElementById('ldBar'),num=document.getElementById('ldNum'),min=reduce?300:1900;
 let ready=document.readyState==='complete',t0=performance.now();addEventListener('load',()=>ready=true);setTimeout(()=>ready=true,6000);
 (function tick(now){let p=Math.min((now-t0)/min,1)*100;if(!ready)p=Math.min(p,92);num.textContent=Math.round(p);bar.style.width=p+'%';
  if(p>=100){ld.classList.add('out');setTimeout(startSite,350);setTimeout(()=>{ld.remove();root.classList.remove('ld-lock')},1150)}else requestAnimationFrame(tick)})(t0)
}else startSite();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,end=+el.dataset.count,t0=performance.now();
 (function f(t){const p=Math.min((t-t0)/1200,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));p<1&&requestAnimationFrame(f)})(t0);co.unobserve(el)}));
document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));
if(!reduce&&matchMedia('(hover:hover)').matches){
 const hv=document.getElementById('tilt'),ac=hv.querySelector('.ac');
 hv.addEventListener('mousemove',e=>{const r=hv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ac.style.setProperty('--ry',x*14+'deg');ac.style.setProperty('--rx',-y*10+'deg')});
 hv.addEventListener('mouseleave',()=>{ac.style.setProperty('--ry','0deg');ac.style.setProperty('--rx','0deg')});
 document.querySelectorAll('.tilt').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`translateY(-8px) perspective(700px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`});c.addEventListener('mouseleave',()=>c.style.transform='')})}
const prog=el=>{const r=el.getBoundingClientRect();return Math.min(1,Math.max(0,(innerHeight*.65-r.top)/r.height))};
const why=document.getElementById('whyList'),items=[...why.querySelectorAll('.why-i')],steps=document.getElementById('steps'),lis=[...steps.querySelectorAll('li')];
let tick=false;function upd(){tick=false;
 const p=prog(why);document.getElementById('whyBar').style.height=p*100+'%';const cur=Math.min(items.length-1,Math.floor(p*items.length));items.forEach((it,i)=>it.classList.toggle('on',i===cur&&p>0));
 const q=prog(steps),v=innerWidth<=900;const b=document.getElementById('pBar');b.style.width=v?'100%':q*100+'%';b.style.height=v?q*100+'%':'100%';lis.forEach((l,i)=>l.classList.toggle('on',q>=i/(lis.length-1)-.05&&q>0))}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd();

// mouse-depth parallax for the About composition (desktop only)
if(!reduce&&matchMedia('(hover:hover)').matches){const av=document.querySelector('.about-vis');
 addEventListener('pointermove',e=>{const r=av.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;av.style.setProperty('--mx',(e.clientX/innerWidth-.5).toFixed(3));av.style.setProperty('--my',(e.clientY/innerHeight-.5).toFixed(3))},{passive:true})}

// Hero image clean-up: if the image has a fake (baked-in) checkerboard/white background, make it transparent.
// Flood-fills from the edges through light, low-colour pixels. Real transparent PNGs are left untouched.
(()=>{const im=document.querySelector('img.ac');if(!im)return;
 function run(){try{const w=im.naturalWidth,h=im.naturalHeight;if(!w||im.dataset.cut)return;
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);
  const d=x.getImageData(0,0,w,h),p=d.data;if(p[3]<250)return;
  const bg=i=>{const r=p[i],g=p[i+1],b=p[i+2],m=Math.max(r,g,b);return p[i+3]>0&&m>205&&m-Math.min(r,g,b)<24};
  const seen=new Uint8Array(w*h),st=[],push=(a,b)=>{if(a<0||b<0||a>=w||b>=h)return;const k=b*w+a;if(seen[k]||!bg(k*4))return;seen[k]=1;st.push(k)};
  for(let i=0;i<w;i++){push(i,0);push(i,h-1)}for(let j=0;j<h;j++){push(0,j);push(w-1,j)}
  while(st.length){const k=st.pop(),a=k%w,b=(k/w)|0;push(a+1,b);push(a-1,b);push(a,b+1);push(a,b-1)}
  for(let k=0;k<w*h;k++)if(seen[k])p[k*4+3]=0;
  x.putImageData(d,0,0);im.dataset.cut=1;im.src=cv.toDataURL('image/png')
 }catch(e){im.classList.add('blend')}} // e.g. opened via file:// -> canvas blocked; use CSS blend fallback
 im.complete?run():im.addEventListener('load',run,{once:true})})();