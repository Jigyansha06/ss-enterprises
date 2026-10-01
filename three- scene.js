// Lightweight hero airflow: Canvas2D ribbons + particles (white -> soft red -> red).
// Intentionally not Three.js, to keep the page fast. To upgrade, mount a Three.js scene on #air.
(()=>{const c=document.getElementById('air');if(!c)return;const x=c.getContext('2d');
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,mobile=innerWidth<900;
 let W,H,dpr=Math.min(devicePixelRatio||1,2),vis=true;
 const rs=()=>{W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)};rs();addEventListener('resize',rs);
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(c);
 const N=mobile?18:42,P=Array.from({length:N},()=>({x:Math.random(),y:.55+Math.random()*.2,s:.0005+Math.random()*.0015,r:1+Math.random()*2.5}));
 const cols=['#ffffff','#F4B6B8','#E5232B'];
 function frame(t){if(!reduce)requestAnimationFrame(frame);if(!vis)return;x.clearRect(0,0,W,H);
  for(let k=0;k<(mobile?2:3);k++){x.beginPath();const g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'#fff0');g.addColorStop(.4,cols[1]);g.addColorStop(.8,cols[2]);g.addColorStop(1,'#E5232B00');
   x.strokeStyle=g;x.lineWidth=6-k*2;x.lineCap='round';
   for(let i=0;i<=40;i++){const f=i/40,px=W*(.1+.85*f),py=H*(.56+.04*k)+Math.sin(i*.28+t/700+k)*H*.04*f+f*H*.1*(k+1);i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
  P.forEach(p=>{if(!reduce){p.x+=p.s;p.y+=p.s*.5}if(p.x>1){p.x=.1;p.y=.55+Math.random()*.1}x.globalAlpha=.7;x.fillStyle=cols[(p.r|0)%3];x.beginPath();x.arc(p.x*W,p.y*H+Math.sin(t/500+p.x*9)*6,p.r,0,7);x.fill()});x.globalAlpha=1}
 requestAnimationFrame(frame)})();