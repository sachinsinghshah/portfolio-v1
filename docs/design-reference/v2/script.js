/* ============================================================
   SACHIN — interaction layer
   ============================================================ */
(function(){
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(max-width: 860px)').matches || ('ontouchstart' in window);

  /* ---------- Constellation particles ---------- */
  const cv = document.getElementById('particles');
  if (cv && !reduce){
    const ctx = cv.getContext('2d');
    let W, H, parts = [], DPR = Math.min(devicePixelRatio || 1, 2);
    let COL = [[59,130,246],[139,92,246],[6,182,212]];
    let densityMult = 1, staticMode = false;
    function resize(){
      W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR;
      cv.style.width = innerWidth+'px'; cv.style.height = innerHeight+'px';
      const n = Math.round(Math.min(90, Math.floor(innerWidth*innerHeight/18000)) * densityMult);
      parts = Array.from({length:n}, ()=>({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-.5)*0.22*DPR, vy:(Math.random()-.5)*0.22*DPR,
        r:(Math.random()*1.6+0.5)*DPR, c: COL[Math.floor(Math.random()*COL.length)],
        a: Math.random()*0.5+0.25
      }));
    }
    const mouse = {x:-9999, y:-9999};
    addEventListener('mousemove', e=>{ mouse.x=e.clientX*DPR; mouse.y=e.clientY*DPR; });
    const LINK = 130*DPR;
    function tick(){
      ctx.clearRect(0,0,W,H);
      if(staticMode){ requestAnimationFrame(tick); return; }
      for (let i=0;i<parts.length;i++){
        const p = parts[i];
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
        // links
        for(let j=i+1;j<parts.length;j++){
          const q=parts[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.hypot(dx,dy);
          if(d<LINK){
            const o=(1-d/LINK)*0.5;
            ctx.strokeStyle=`rgba(${p.c[0]},${p.c[1]},${p.c[2]},${o})`;
            ctx.lineWidth=0.6*DPR; ctx.beginPath();
            ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
          }
        }
        // mouse link
        const mdx=p.x-mouse.x, mdy=p.y-mouse.y, md=Math.hypot(mdx,mdy);
        if(md<LINK*1.6){
          ctx.strokeStyle=`rgba(160,190,255,${(1-md/(LINK*1.6))*0.5})`;
          ctx.lineWidth=0.7*DPR; ctx.beginPath();
          ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y); ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7);
        ctx.fillStyle=`rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`; ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    resize(); addEventListener('resize', resize); tick();
    window.__particlesAPI = {
      recolor(cols){ COL = cols; parts.forEach(p=>{ p.c = COL[Math.floor(Math.random()*COL.length)]; }); },
      density(m){ densityMult = m; resize(); },
      setStatic(b){ staticMode = b; }
    };
  }

  /* ---------- Custom cursor ---------- */
  if(!touch){
    const dot = document.querySelector('.cur-dot');
    const ring = document.querySelector('.cur-ring');
    let mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my;
    addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`; });
    (function loop(){ rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18; ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    document.querySelectorAll('[data-hot], a, button, input, textarea').forEach(el=>{
      el.addEventListener('mouseenter', ()=>ring.classList.add('hot'));
      el.addEventListener('mouseleave', ()=>ring.classList.remove('hot'));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if(!touch){
    document.querySelectorAll('[data-mag]').forEach(el=>{
      el.addEventListener('mousemove', e=>{
        const r=el.getBoundingClientRect();
        const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
        el.style.transform=`translate(${x*0.28}px,${y*0.4}px)`;
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform=''; });
    });
  }

  /* ---------- 3D tilt ---------- */
  if(!touch){
    document.querySelectorAll('[data-tilt]').forEach(el=>{
      el.addEventListener('mousemove', e=>{
        const r=el.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
        el.style.transform=`perspective(900px) rotateY(${px*12}deg) rotateX(${-py*12}deg)`;
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform='perspective(900px) rotateY(0) rotateX(0)'; });
    });
  }

  /* ---------- Reveal on scroll + counters ---------- */
  const io = new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  function animCount(el){
    const target=+el.dataset.count, suf=el.dataset.suffix||'', dur=1500, t0=performance.now();
    function step(t){
      const p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*e)+suf;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const cio = new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting){ animCount(en.target); cio.unobserve(en.target); } });
  }, {threshold:0.5});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  /* ---------- Typed code lines (about) ---------- */
  const lines = document.querySelectorAll('#codeBlock .ln');
  if(lines.length){
    const cb = new IntersectionObserver((ents)=>{
      ents.forEach(en=>{ if(en.isIntersecting){
        lines.forEach((l,i)=>{ l.style.animationDelay=(i*0.12)+'s'; });
        cb.disconnect();
      }});
    }, {threshold:0.4});
    cb.observe(document.getElementById('codeBlock'));
  }

  /* ---------- Nav: solid bg + scroll spy ---------- */
  const nav = document.getElementById('nav');
  const navLinks = [...document.querySelectorAll('#navLinks a')];
  const secs = navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function onScroll(){
    nav.classList.toggle('solid', scrollY>40);
    let cur=secs[0]?.id;
    secs.forEach(s=>{ if(scrollY>=s.offsetTop-160) cur=s.id; });
    navLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+cur));
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---------- Mobile menu ---------- */
  const burger=document.getElementById('burger'), nl=document.getElementById('navLinks');
  if(burger){
    burger.addEventListener('click', ()=>{
      const open=nl.classList.toggle('open');
      nl.style.cssText = open
        ? 'display:flex;position:absolute;top:72px;right:20px;left:20px;flex-direction:column;background:rgba(7,12,28,.96);backdrop-filter:blur(16px);padding:14px;border:1px solid var(--line);border-radius:16px;gap:4px'
        : '';
    });
    nl.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{ if(nl.classList.contains('open')) burger.click(); }));
  }

  /* ---------- Hero parallax on chips ---------- */
  if(!touch && !reduce){
    const stage=document.querySelector('.stage');
    const floats=[...document.querySelectorAll('[data-float]')];
    if(stage){
      stage.addEventListener('mousemove', e=>{
        const r=stage.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-0.5, y=(e.clientY-r.top)/r.height-0.5;
        floats.forEach((f,i)=>{ const d=(i%3+1)*10; f.style.translate=`${x*d}px ${y*d}px`; });
        const av=document.querySelector('.avatar-main');
        if(av) av.style.translate=`${x*-14}px ${y*-14}px`;
      });
      stage.addEventListener('mouseleave', ()=>{ floats.forEach(f=>f.style.translate=''); const av=document.querySelector('.avatar-main'); if(av)av.style.translate=''; });
    }
  }

  /* ---------- Contact form ---------- */
  const form=document.getElementById('contactForm'), note=document.getElementById('formNote');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const data=new FormData(form);
      if(!data.get('name')||!data.get('email')||!data.get('message')){
        note.style.color='#ff6b8a'; note.textContent='⚠ Please fill in name, email and message.'; return;
      }
      note.style.color='var(--cyan)'; note.textContent='◆ Transmitting message...';
      const btn=form.querySelector('button'); btn.style.opacity='.7';
      setTimeout(()=>{ note.textContent='✓ Message sent! I\'ll get back to you soon.'; form.reset(); btn.style.opacity=''; }, 1300);
    });
  }
})();
