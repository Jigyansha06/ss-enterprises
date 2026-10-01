// ===== CONFIG: replace placeholders here =====
const CONFIG={phone:'+910000000000',whatsapp:'910000000000',email:'hello@example.com',
 formEndpoint:'', // paste your Google Apps Script Web App URL (ends in /exec). Empty = WhatsApp fallback
 locations:{ // x,y = marker position on the illustrative map; map = Google Maps link
  Bhubaneswar:{x:290,y:160,map:'https://www.google.com/maps/search/?api=1&query=SS+Enterprises+Bhubaneswar'},
  Berhampur:{x:225,y:226,map:'https://www.google.com/maps/search/?api=1&query=SS+Enterprises+Berhampur'},
  Paralakhemundi:{x:186,y:261,map:'https://www.google.com/maps/search/?api=1&query=SS+Enterprises+Paralakhemundi'},
  Balangir:{x:143,y:133,map:'https://www.google.com/maps/search/?api=1&query=SS+Enterprises+Balangir'}},
 sales:{Home:'',Office:'',Shop:'',Showroom:'',Commercial:''}}; // add your own informational copy per space
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
$$('[data-call]').forEach(a=>a.href='tel:'+CONFIG.phone);
$$('[data-wa]').forEach(a=>a.href='https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent('Hello SS Enterprises, I need help with my AC.'));
$$('[data-mail]').forEach(a=>a.href='mailto:'+CONFIG.email);
$$('[data-map]').forEach(a=>a.href='https://www.google.com/maps/search/?api=1&query=SS+Enterprises+Odisha');
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
 card.innerHTML=`<h3>${n}</h3><p>Complete AC sales and service solutions for customers in ${n}.</p><a class="btn red sm" target="_blank" rel="noopener" href="${CONFIG.locations[n].map}">Get Directions <span>→</span></a>`}
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