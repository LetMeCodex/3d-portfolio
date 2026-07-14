import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/* split text into animated char spans */
function splitChars(el: HTMLElement) {
  const text = el.textContent || '';
  el.innerHTML = text
    .split('')
    .map((c) =>
      `<span style="opacity:0;display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`
    )
    .join('');
  return Array.from(el.querySelectorAll<HTMLElement>('span'));
}

export function WizardScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const didRun  = useRef(false);

  useEffect(() => {
    if (didRun.current || !wrapRef.current) return;
    const wrap = wrapRef.current;

    const run = () => {
      if (didRun.current) return;
      didRun.current = true;

      /* element refs */
      const dialogBox  = wrap.querySelector<HTMLElement>('#wz-dialog')!;
      const nameEl     = wrap.querySelector<HTMLElement>('#wz-name')!;
      const profileEl  = wrap.querySelector<HTMLElement>('#wz-profile')!;
      const alive      = wrap.querySelector<HTMLElement>('#wz-alive')!;
      const text1El    = wrap.querySelector<HTMLElement>('#wz-t1')!;
      const text2El    = wrap.querySelector<HTMLElement>('#wz-t2')!;
      const text3El    = wrap.querySelector<HTMLElement>('#wz-t3')!;
      const text4El    = wrap.querySelector<HTMLElement>('#wz-t4')!;
      const bodyPixels = Array.from(wrap.querySelectorAll<SVGRectElement>('#wz-body rect'));
      const eballPix   = Array.from(wrap.querySelectorAll<SVGRectElement>('#wz-eball rect'));
      const fballPix   = Array.from(wrap.querySelectorAll<SVGRectElement>('#wz-fball rect'));

      /* split each text span */
      const c1 = splitChars(text1El);
      const c2 = splitChars(text2El);
      const c3 = splitChars(text3El);
      const c4 = splitChars(text4El);

      /* energy ball bobbing loop (starts after main tl) */
      const bobTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      bobTl.to('#wz-eball', { duration: 0.6, y: -8, ease: 'sine.inOut' }, 0);
      bobTl.to('#wz-fball', { duration: 0.6, y: 8,  ease: 'sine.inOut' }, 0);

      /* main timeline */
      const tl = gsap.timeline({
        onComplete: () => {
          bobTl.play();
          gsap.to(alive, { backgroundColor: '#aaa', boxShadow: 'none', duration: 0.5 });
        },
      });

      /* 1. show dialog box */
      tl.to(dialogBox, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });

      /* 2. typewriter line 1 */
      tl.to(c1, { opacity: 1, duration: 0.06, stagger: 0.06 });

      /* 3. reveal body pixels */
      tl.to(bodyPixels, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.002 }, '<+0.4');

      /* 4. typewriter lines 2 + 3 */
      tl.to(c2, { opacity: 1, duration: 0.06, stagger: 0.06 }, '+=0.3');
      tl.to(c3, { opacity: 1, duration: 0.06, stagger: 0.06 }, '+=0.3');

      /* 5. show name + profile with typewriter line 4 */
      tl.to([nameEl, profileEl], { opacity: 1, duration: 0.4 }, '+=0.5');
      tl.to(c4, { opacity: 1, duration: 0.06, stagger: 0.06 }, '<');

      /* 6. pop in energy balls */
      tl.to(eballPix, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.003 }, '+=0.4');
      tl.to(fballPix, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.003 }, '<');
    };

    /* trigger when 30 % of section is in view */
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { run(); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(wrap);
    return () => obs.disconnect();
  }, []);

  /* ── pixel colour palette ── */
  const skin  = '#fddcb3';
  const skin2 = '#f08651';
  const robe  = '#4c798a';
  const hat   = '#2f2f2f';
  const hair  = '#3b1f0a';
  const eyes  = '#111';
  const elec  = '#0096c6';
  const elecH = '#c7fdff';
  const fire  = '#ff6506';
  const fireY = '#ffd50f';
  const fireW = '#ffff4b';
  const w     = 7.5;  /* pixel size */

  /* helper to make a pixel rect */
  const px = (x: number, y: number, f: string, k: string | number) => (
    <rect key={k} x={x} y={y} width={w} height={w} fill={f}
      stroke="#000" strokeWidth={0.3} strokeMiterlimit={10}
      style={{ opacity: 0, transformOrigin: `${x + w / 2}px ${y + w / 2}px`, transform: 'scale(0)' }} />
  );

  return (
    <section
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 480,
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0d3352 0%, #091b2d 60%, #050e1a 100%)',
      }}
    >
      {/* ── Dialog Box ── */}
      <div
        id="wz-dialog"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -58%)',
          background: 'rgba(0,0,0,0.62)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6,
          padding: '18px 20px 16px',
          maxWidth: 540,
          width: 'calc(100% - 40px)',
          zIndex: 30,
          opacity: 0,
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          color: '#fff',
        }}
      >
        {/* profile + alive dot */}
        <div
          id="wz-profile"
          style={{
            position: 'absolute', top: 0, right: 0,
            width: 60, height: 60,
            background: 'linear-gradient(135deg,#E84855,#ff8a00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
            opacity: 0,
            borderRadius: '0 6px 0 6px',
          }}
        >
          🌸
          <span
            id="wz-alive"
            style={{
              position: 'absolute', top: -3, right: -3,
              width: 10, height: 10,
              borderRadius: '50%',
              background: '#00ff15',
              boxShadow: '0 0 0 3px rgba(0,255,21,0.3)',
            }}
          />
        </div>

        {/* name */}
        <h3
          id="wz-name"
          style={{
            margin: '0 0 10px',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.06em',
            opacity: 0,
            color: '#fff',
          }}
        >
          Disha Jain
        </h3>

        {/* typewriter lines */}
        <p style={{ margin: 0, fontSize: 13, lineHeight: '22px' }}>
          <span id="wz-t1">Hey there! 👋  Let me tell you about myself.</span>
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: '22px' }}>
          <span id="wz-t2" style={{ color: '#89CFF0', fontWeight: 600 }}>I'm Disha — designer, dancer, foodie & eternal learner.</span>
        </p>
        <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: '22px' }}>
          <span id="wz-t3">I turn ideas into visuals that </span>
          <span id="wz-t4" style={{ color: '#E84855', fontWeight: 700 }}>speak, connect & leave an impact.</span>
        </p>
      </div>

      {/* ── Pixel Character SVG ── */}
      <svg
        id="wz-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 443.5 518.5"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: '48%',
          minHeight: 200,
          overflow: 'visible',
        }}
      >
        {/* ── BODY GROUP ── */}
        <g id="wz-body">
          {/* Hat */}
          {[240.5,233,225.5,218,210.5,203].map(x=>px(x,60.5,hat,`h0${x}`))}
          {[255.5,248,240.5,233,225.5,218].map(x=>px(x,53,hat,`h1${x}`))}
          {[270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188].map(x=>px(x,68,hat,`h2${x}`))}
          {[270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5].map(x=>px(x,75.5,hat,`h3${x}`))}
          {/* Hair */}
          {[263,255.5,248,240.5,233,225.5,218,210.5].map(x=>px(x,83,hair,`hr${x}`))}
          {/* Face */}
          {[263,255.5,248,240.5,233,225.5,218,210.5,203,195.5].map(x=>px(x,90.5,skin,`f0${x}`))}
          {[270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188].map(x=>px(x,98,skin,`f1${x}`))}
          {/* Eyes */}
          {px(255.5,98,eyes,'ey0')}{px(210.5,98,eyes,'ey1')}
          {[270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188].map(x=>px(x,105.5,skin,`f2${x}`))}
          {[263,255.5,248,240.5,233,225.5,218,210.5,203].map(x=>px(x,113,skin,`f3${x}`))}
          {/* Mouth */}
          {px(255.5,113,'#c55','m0')}{px(225.5,113,'#c55','m1')}
          {/* Neck / torso */}
          {[248,240.5,233,225.5].map(x=>px(x,120.5,skin,`n0${x}`))}
          {[255.5,248,240.5,233,225.5,218,210.5].map(x=>px(x,128,robe,`r0${x}`))}
          {[270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5].map(x=>px(x,135.5,robe,`r1${x}`))}
          {[278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188].map(x=>px(x,143,robe,`r2${x}`))}
          {[285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5].map(x=>px(x,150.5,robe,`r3${x}`))}
          {[293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173].map(x=>px(x,158,robe,`r4${x}`))}
          {[300.5,293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173,165.5].map(x=>px(x,165.5,robe,`r5${x}`))}
          {/* Arms + lower robe rows */}
          {[300.5,293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173,165.5,158].map(x=>px(x,173,robe,`r6${x}`))}
          {[308,300.5,293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173,165.5,158,150.5].map(x=>px(x,180.5,robe,`r7${x}`))}
          {/* Hands */}
          {[330.5,323,315.5].map(x=>px(x,180.5,skin,`hd${x}`))}
          {[143,135.5,128].map(x=>px(x,180.5,skin,`hl${x}`))}
          {/* Lower body / robe bottom rows */}
          {[315.5,308,300.5,293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173,165.5,158,150.5].map(x=>px(x,188,robe,`rb0${x}`))}
          {[315.5,308,300.5,293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173,165.5,158,150.5].map(x=>px(x,195.5,robe,`rb1${x}`))}
          {[308,300.5,293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173,165.5,158].map(x=>px(x,203,robe,`rb2${x}`))}
          {[300.5,293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173,165.5].map(x=>px(x,210.5,robe,`rb3${x}`))}
          {[293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173].map(x=>px(x,218,robe,`rb4${x}`))}
          {[285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188].map(x=>px(x,225.5,robe,`rb5${x}`))}
          {[278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5].map(x=>px(x,233,robe,`rb6${x}`))}
          {[270.5,263,255.5,248,240.5,233,225.5,218,210.5,203].map(x=>px(x,240.5,robe,`rb7${x}`))}
          {/* Feet base */}
          {[338,330.5,323,315.5,308,300.5,293,285.5,278,270.5,263,255.5,248,240.5,233,225.5,218,210.5,203,195.5,188,180.5,173,165.5,158,150.5,143,135.5].map(x=>px(x,510.5,'#717272',`ft${x}`))}
        </g>

        {/* ── ELECTRIC BALL (left) ── */}
        <g id="wz-eball">
          {[
            {x:113,y:90.5,f:elecH},{x:105.5,y:90.5,f:'#fff'},{x:98,y:90.5,f:'#fff'},{x:90.5,y:90.5,f:elecH},{x:83,y:90.5,f:elecH},{x:75.5,y:90.5,f:elecH},{x:68,y:90.5,f:elecH},{x:60.5,y:90.5,f:elec},{x:53,y:90.5,f:elec},{x:45.5,y:90.5,f:'#fff'},{x:38,y:90.5,f:'#fff'},
            {x:120.5,y:98,f:elec},{x:113,y:98,f:elecH},{x:105.5,y:98,f:'#2bdaff'},{x:98,y:98,f:elecH},{x:90.5,y:98,f:'#2bdaff'},{x:83,y:98,f:elecH},{x:75.5,y:98,f:'#2bdaff'},{x:68,y:98,f:elecH},{x:60.5,y:98,f:'#2bdaff'},{x:53,y:98,f:elec},{x:45.5,y:98,f:elec},{x:38,y:98,f:elecH},{x:30.5,y:98,f:elec},
            {x:135.5,y:120.5,f:elec},{x:128,y:120.5,f:elecH},{x:120.5,y:120.5,f:elec},{x:113,y:120.5,f:elec},{x:105.5,y:120.5,f:elec},{x:98,y:120.5,f:'#fff'},{x:90.5,y:120.5,f:elec},{x:83,y:120.5,f:'#fff'},{x:75.5,y:120.5,f:elec},{x:68,y:120.5,f:'#fff'},{x:60.5,y:120.5,f:elec},{x:53,y:120.5,f:elec},{x:45.5,y:120.5,f:elec},{x:38,y:120.5,f:elecH},{x:30.5,y:120.5,f:elec},
            {x:150.5,y:180.5,f:'#fff'},{x:143,y:180.5,f:'#fff'},{x:98,y:180.5,f:elec},{x:90.5,y:180.5,f:elec},{x:83,y:180.5,f:elec},{x:75.5,y:180.5,f:elec},{x:68,y:180.5,f:elec},{x:60.5,y:180.5,f:'#fff'},
          ].map((r,i)=>(<rect key={`eb${i}`} x={r.x} y={r.y} width={w} height={w} fill={r.f} stroke="#000" strokeWidth={0.3} strokeMiterlimit={10} style={{opacity:0,transformOrigin:`${r.x+w/2}px ${r.y+w/2}px`,transform:'scale(0)'}} />))}
        </g>

        {/* ── FIRE BALL (right) ── */}
        <g id="wz-fball">
          {[
            {x:375.5,y:165.5,f:fire},{x:368,y:165.5,f:fire},{x:360.5,y:165.5,f:fire},{x:353,y:165.5,f:fire},{x:345.5,y:165.5,f:fire},{x:338,y:165.5,f:fire},{x:330.5,y:165.5,f:fire},
            {x:390.5,y:158,f:fire},{x:383,y:158,f:fire},{x:375.5,y:158,f:fire},{x:368,y:158,f:fire},{x:360.5,y:158,f:fire},{x:353,y:158,f:fire},{x:345.5,y:158,f:fire},{x:338,y:158,f:fireY},{x:330.5,y:158,f:fire},{x:323,y:158,f:fire},
            {x:398,y:150.5,f:fire},{x:390.5,y:150.5,f:fire},{x:383,y:150.5,f:fireY},{x:375.5,y:150.5,f:fireY},{x:368,y:150.5,f:fireY},{x:360.5,y:150.5,f:fireY},{x:353,y:150.5,f:fireY},{x:345.5,y:150.5,f:fireY},{x:338,y:150.5,f:fireY},{x:330.5,y:150.5,f:fireY},{x:323,y:150.5,f:fire},{x:315.5,y:150.5,f:fire},{x:308,y:150.5,f:fire},{x:300.5,y:150.5,f:fire},
            {x:413,y:143,f:fire},{x:405.5,y:143,f:fire},{x:398,y:143,f:fireY},{x:390.5,y:143,f:fireY},{x:383,y:143,f:fireY},{x:375.5,y:143,f:fireW},{x:368,y:143,f:fireW},{x:360.5,y:143,f:fireW},{x:353,y:143,f:fireW},{x:345.5,y:143,f:fireW},{x:338,y:143,f:fireW},{x:330.5,y:143,f:fireW},{x:323,y:143,f:fireY},{x:315.5,y:143,f:fire},{x:308,y:143,f:fire},{x:300.5,y:143,f:fire},{x:293,y:143,f:fire},
            {x:420.5,y:135.5,f:fire},{x:413,y:135.5,f:fire},{x:405.5,y:135.5,f:fire},{x:398,y:135.5,f:fire},{x:390.5,y:135.5,f:'#8d201c'},{x:383,y:135.5,f:'#8d201c'},{x:375.5,y:135.5,f:'#8d201c'},{x:368,y:135.5,f:fireW},{x:360.5,y:135.5,f:'#fff'},{x:353,y:135.5,f:'#8d201c'},{x:345.5,y:135.5,f:'#fff'},{x:338,y:135.5,f:fireW},{x:330.5,y:135.5,f:'#8d201c'},{x:323,y:135.5,f:'#8d201c'},{x:315.5,y:135.5,f:'#8d201c'},{x:308,y:135.5,f:fire},{x:300.5,y:135.5,f:fire},{x:293,y:135.5,f:fire},
            {x:398,y:98,f:fireY},{x:390.5,y:98,f:fireW},{x:383,y:98,f:fireW},{x:375.5,y:98,f:fireW},{x:368,y:98,f:fireW},{x:360.5,y:98,f:'#fff'},{x:353,y:98,f:'#fff'},{x:345.5,y:98,f:'#fff'},{x:338,y:98,f:fireW},{x:330.5,y:98,f:fireW},{x:323,y:98,f:fireW},{x:315.5,y:98,f:fireY},{x:308,y:98,f:fire},{x:300.5,y:98,f:fire},
            {x:390.5,y:0.5,f:fire},
          ].map((r,i)=>(<rect key={`fb${i}`} x={r.x} y={r.y} width={w} height={w} fill={r.f} stroke="#000" strokeWidth={0.3} strokeMiterlimit={10} style={{opacity:0,transformOrigin:`${r.x+w/2}px ${r.y+w/2}px`,transform:'scale(0)'}} />))}
        </g>
      </svg>

      {/* credit */}
      <span style={{position:'absolute',bottom:6,right:10,fontSize:9,opacity:0.25,color:'#fff',fontFamily:'monospace'}}>
        inspired by Alaric Baraou
      </span>
    </section>
  );
}
