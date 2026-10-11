// ===== CONFIG: replace placeholders here =====
const CONFIG={phone:'+919827870310',whatsapp:'919124633810',email:'ssenterprisebbsr12@gmail.com',
 formEndpoint:'', // paste your Google Apps Script Web App URL (ends in /exec). Empty = WhatsApp fallback
 locations:{ // x,y = marker position on the illustrative map; map = Google Maps link
  Bhubaneswar:{x:287,y:160,address:'Infront of Bandhan Bank, opposite Delta Square, Bhubaneswar - 751003',map:'https://www.google.com/maps/search/?api=1&query=SS+Enterprise+Bandhan+Bank+Delta+Square+Bhubaneswar+751003'},
  Berhampur:{x:222,y:226,map:'https://www.google.com/maps/search/?api=1&query=SS+Enterprise+Berhampur'},
  Paralakhemundi:{x:184,y:261,map:'https://www.google.com/maps/search/?api=1&query=SS+Enterprise+Paralakhemundi'},
  Balangir:{x:140,y:133,map:'https://www.google.com/maps/search/?api=1&query=SS+Enterprise+Balangir'}},
 sales:{Home:'',Office:'',Shop:'',Showroom:'',Commercial:''}}; // add your own informational copy per space
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
$$('[data-call]').forEach(a=>a.href='tel:'+CONFIG.phone);
$$('[data-wa]').forEach(a=>a.href='https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent('Hello SS Enterprise, I need help with my AC.'));
$$('[data-mail]').forEach(a=>a.href='mailto:'+CONFIG.email);
$$('[data-map]').forEach(a=>a.href=CONFIG.locations.Bhubaneswar.map);
const nav=$('#nav'),burger=$('#burger'),menu=$('#menu');
addEventListener('scroll',()=>nav.classList.toggle('sc',scrollY>40),{passive:true});
burger.onclick=()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)};
$$('#menu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded',false)}));
const links=$$('#menu a:not(.btn)');
$$('main section[id]').forEach(s=>new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&links.forEach(l=>l.classList.toggle('act',l.getAttribute('href')=='#'+s.id))),{rootMargin:'-45% 0px -50%'}).observe(s));
$$('[data-enquire]').forEach(a=>a.addEventListener('click',()=>$('#svcSel').value='AC Sales / Enquiry'));
const heads=['Room size','Suitable AC capacity','Energy efficiency','Cooling requirements','Installation requirements','Maintenance needs'];
const tabs=$('#tabs'),panel=$('#panel');
function showTab(k){$$('button',tabs).forEach(b=>b.setAttribute('aria-selected',b.dataset.k===k));
 const note=CONFIG.sales[k]||'Our team will guide you based on your '+k.toLowerCase()+' space and requirements.';
 panel.innerHTML=heads.map((h,i)=>`<div style="animation-delay:${i*60}ms"><h4>${h}</h4><p>${i?note:'Depends on your '+k.toLowerCase()+' layout. Share your space details and we will advise.'}</p></div>`).join('')}
Object.keys(CONFIG.sales).forEach(k=>{const b=document.createElement('button');b.textContent=k.toUpperCase();b.dataset.k=k;b.setAttribute('role','tab');b.onclick=()=>showTab(k);tabs.append(b)});showTab('Home');
const pins=$('#pins'),card=$('#locCard'),NS='http://www.w3.org/2000/svg';
function showLoc(n){$$('.pin').forEach(p=>p.classList.toggle('on',p.dataset.n===n));
 const L=CONFIG.locations[n];card.innerHTML=`<h3>${n}</h3><p>Complete AC sales and service solutions for customers in ${n}.</p>${L.address?`<p class="addr"><b>Address:</b> ${L.address}</p>`:''}<a class="btn red sm" target="_blank" rel="noopener" href="${CONFIG.locations[n].map}">Get Directions <span>→</span></a>`}
Object.entries(CONFIG.locations).forEach(([n,l])=>{const g=document.createElementNS(NS,'g');g.setAttribute('class','pin');g.dataset.n=n;g.setAttribute('tabindex',0);g.setAttribute('role','button');g.setAttribute('aria-label',n);
 g.innerHTML=`<circle class="p" cx="${l.x}" cy="${l.y}" r="6"/><circle class="c" cx="${l.x}" cy="${l.y}" r="7"/><text x="${l.x+12}" y="${l.y+4}">${n}</text>`;
 g.onclick=()=>showLoc(n);g.onkeydown=e=>(e.key==='Enter'||e.key===' ')&&showLoc(n);pins.append(g)});showLoc('Bhubaneswar');
$('#form').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,m=$('#fmsg'),btn=$('button[type=submit]',f);let ok=true;
 $$('[required]',f).forEach(i=>{const bad=!i.value.trim()||(i.name==='phone'&&!/^[+\d][\d\s-]{7,14}$/.test(i.value.trim()));i.classList.toggle('bad',bad);if(bad)ok=false});
 if(!ok){m.textContent='Please complete the highlighted fields.';return}
 const d=Object.fromEntries(new FormData(f));
 const wa=()=>{const t=encodeURIComponent(`New enquiry\nName: ${d.name}\nPhone: ${d.phone}\nLocation: ${d.location}\nService: ${d.service}\nMessage: ${d.message}`);m.textContent='Opening WhatsApp to send your enquiry…';open('https://wa.me/'+CONFIG.whatsapp+'?text='+t,'_blank')};
 if(!CONFIG.formEndpoint){wa();return}
 btn.disabled=true;m.textContent='Sending…';
 try{ // Apps Script: simple POST (no preflight). no-cors means the reply can't be read, so success = request was sent.
  await fetch(CONFIG.formEndpoint,{method:'POST',mode:'no-cors',body:new URLSearchParams(d)});
  m.textContent='Thank you! Our team will contact you shortly.';f.reset()}
 catch{m.textContent='Could not send. Please call us or use WhatsApp.';wa()}
 finally{btn.disabled=false}});

// Our Clients slider: native scroll-snap + arrow buttons, counter/progress bar, gentle autoplay
(()=>{const t=$('#clTrack');if(!t)return;const cards=[...t.children],n=cards.length,num=$('#clNum'),bar=$('#clBar');
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const step=()=>cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:t.clientWidth;
 const atEnd=()=>t.scrollLeft>=t.scrollWidth-t.clientWidth-4;
 function ui(){const r=(t.scrollLeft+t.clientWidth)/t.scrollWidth,c=atEnd()?n:Math.max(1,Math.round(r*n));num.textContent=String(c).padStart(2,'0');bar.style.width=(c/n*100)+'%'}
 function go(d){if(d>0&&atEnd()){t.scrollTo({left:0});return}t.scrollTo({left:Math.max(0,Math.round(t.scrollLeft/step())*step()+d*step())})}
 $('#clPrev').onclick=()=>{go(-1);hold()};$('#clNext').onclick=()=>{go(1);hold()};
 t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(1);hold()}if(e.key==='ArrowLeft'){e.preventDefault();go(-1);hold()}});
 let tick=false;t.addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(()=>{tick=false;ui()})}},{passive:true});addEventListener('resize',ui);ui();
 // autoplay: only while visible, paused on hover/focus/touch, never for reduced-motion users
 let paused=false,vis=false,timer;const hold=()=>{paused=true;clearTimeout(timer);timer=setTimeout(()=>paused=false,9000)};
 ['mouseenter','focusin','touchstart','pointerdown'].forEach(ev=>t.parentElement.addEventListener(ev,hold,{passive:true}));
 new IntersectionObserver(e=>vis=e[0].isIntersecting,{threshold:.3}).observe(t);
 if(!reduce)setInterval(()=>{if(vis&&!paused&&!document.hidden)go(1)},4500)})();