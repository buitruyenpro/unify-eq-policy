(() => {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));

  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const boxImg = lightbox.querySelector('img');
    const close = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
    document.querySelectorAll('.gallery-card').forEach(card => card.addEventListener('click', () => {
      boxImg.src = card.querySelector('img').src;
      boxImg.alt = card.querySelector('img').alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // Mathematical hero visualizer: harmonic waveform + radial spectrum + Lissajous curve.
  const visualizer = document.getElementById('unify-music-visualizer');
  if (visualizer) {
    const ctx = visualizer.getContext('2d', { alpha: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = true;
    let frameId = 0;

    const resize = () => {
      const rect = visualizer.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      visualizer.width = Math.round(width * dpr);
      visualizer.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rgba = (hex, alpha) => {
      const value = hex.replace('#', '');
      const bigint = parseInt(value, 16);
      return `rgba(${(bigint >> 16) & 255},${(bigint >> 8) & 255},${bigint & 255},${alpha})`;
    };

    const drawRing = (cx, cy, radius, color, alpha, dash = []) => {
      ctx.save();
      ctx.strokeStyle = rgba(color, alpha);
      ctx.lineWidth = 1;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const draw = timeStamp => {
      if (!running) return;
      const t = reduceMotion ? 1.8 : timeStamp * 0.001;
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.405;
      const minSide = Math.min(width, height);
      const baseRadius = Math.min(minSide * 0.205, 124);

      // Soft mathematical field around the center.
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 2.35);
      halo.addColorStop(0, 'rgba(0,229,255,.12)');
      halo.addColorStop(.34, 'rgba(22,140,255,.055)');
      halo.addColorStop(.67, 'rgba(155,92,255,.035)');
      halo.addColorStop(1, 'rgba(255,60,172,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      drawRing(cx, cy, baseRadius * .72, '#8ef7ff', .24, [2, 7]);
      drawRing(cx, cy, baseRadius * 1.02, '#00e5ff', .22);
      drawRing(cx, cy, baseRadius * 1.34, '#168cff', .18, [3, 8]);
      drawRing(cx, cy, baseRadius * 1.67, '#9b5cff', .14);
      drawRing(cx, cy, baseRadius * 1.98, '#ff3cac', .11, [1, 10]);

      // Radial spectrum: a sum of periodic functions creates organic bar motion.
      const bars = width < 520 ? 72 : 96;
      ctx.save();
      ctx.lineCap = 'round';
      for (let i = 0; i < bars; i += 1) {
        const theta = (i / bars) * Math.PI * 2 - Math.PI / 2;
        const harmonic =
          .52 +
          .20 * Math.sin(theta * 3 + t * 1.35) +
          .13 * Math.sin(theta * 7 - t * .82) +
          .08 * Math.cos(theta * 11 + t * 1.9);
        const pulse = .5 + .5 * Math.sin(t * 1.8 + i * .19);
        const length = baseRadius * (.17 + Math.max(.08, harmonic) * .27 + pulse * .035);
        const r0 = baseRadius * 1.13;
        const r1 = r0 + length;
        const x0 = cx + Math.cos(theta) * r0;
        const y0 = cy + Math.sin(theta) * r0;
        const x1 = cx + Math.cos(theta) * r1;
        const y1 = cy + Math.sin(theta) * r1;
        const hue = 184 + (i / bars) * 126;
        ctx.strokeStyle = `hsla(${hue},100%,66%,${.27 + Math.max(0, harmonic) * .48})`;
        ctx.lineWidth = i % 4 === 0 ? 2.2 : 1.25;
        ctx.shadowColor = `hsla(${hue},100%,60%,.55)`;
        ctx.shadowBlur = i % 3 === 0 ? 9 : 4;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      ctx.restore();

      // Lissajous ribbon: x = A sin(3u + phase), y = B sin(4u).
      const drawLissajous = (phase, colorA, colorB, alpha, scale) => {
        const gradient = ctx.createLinearGradient(cx - baseRadius, cy, cx + baseRadius, cy);
        gradient.addColorStop(0, rgba(colorA, alpha));
        gradient.addColorStop(.5, 'rgba(255,255,255,.75)');
        gradient.addColorStop(1, rgba(colorB, alpha));
        ctx.save();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.35;
        ctx.shadowColor = rgba(colorA, .7);
        ctx.shadowBlur = 10;
        ctx.beginPath();
        const points = 420;
        for (let j = 0; j <= points; j += 1) {
          const u = (j / points) * Math.PI * 2;
          const envelope = .84 + .16 * Math.cos(u * 5 - t * .55);
          const x = cx + Math.sin(3 * u + phase + t * .26) * baseRadius * scale * envelope;
          const y = cy + Math.sin(4 * u + t * .13) * baseRadius * scale * .70;
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      };
      drawLissajous(0, '#00e5ff', '#8b68ff', .78, .98);
      drawLissajous(Math.PI / 3, '#ff3cac', '#00e5ff', .48, .84);

      // Orbiting particles follow deterministic parametric paths.
      ctx.save();
      for (let i = 0; i < 22; i += 1) {
        const u = (i / 22) * Math.PI * 2 + t * (.12 + (i % 3) * .018);
        const orbit = baseRadius * (1.28 + .22 * Math.sin(i * 2.1 + t * .6));
        const x = cx + Math.cos(u * 1.07) * orbit;
        const y = cy + Math.sin(u * .93) * orbit * .68;
        const radius = 1.2 + (i % 4) * .45;
        const color = i % 3 === 0 ? '#ff3cac' : i % 3 === 1 ? '#00e5ff' : '#9b5cff';
        ctx.fillStyle = rgba(color, .45 + (i % 5) * .09);
        ctx.shadowColor = color;
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Harmonic waveform at the lower visual field.
      const waveY = height * .735;
      const waveLeft = width * .08;
      const waveRight = width * .92;
      const waveWidth = waveRight - waveLeft;
      const waveGradient = ctx.createLinearGradient(waveLeft, 0, waveRight, 0);
      waveGradient.addColorStop(0, 'rgba(0,229,255,0)');
      waveGradient.addColorStop(.15, 'rgba(0,229,255,.8)');
      waveGradient.addColorStop(.52, 'rgba(139,104,255,.95)');
      waveGradient.addColorStop(.83, 'rgba(255,60,172,.82)');
      waveGradient.addColorStop(1, 'rgba(255,60,172,0)');
      ctx.save();
      ctx.strokeStyle = waveGradient;
      ctx.lineWidth = 1.35;
      ctx.shadowColor = '#00dfff';
      ctx.shadowBlur = 9;
      ctx.beginPath();
      const wavePoints = Math.max(220, Math.round(waveWidth));
      for (let i = 0; i <= wavePoints; i += 1) {
        const p = i / wavePoints;
        const x = waveLeft + p * waveWidth;
        const envelope = Math.pow(Math.sin(Math.PI * p), .55);
        const signal =
          Math.sin(p * Math.PI * 18 + t * 2.1) * .48 +
          Math.sin(p * Math.PI * 43 - t * 1.15) * .22 +
          Math.sin(p * Math.PI * 71 + t * .72) * .12;
        const y = waveY + signal * envelope * 19;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Tiny frequency ticks and labels around the outer ring.
      ctx.save();
      ctx.font = '600 8px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const frequencies = ['31', '63', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];
      frequencies.forEach((label, index) => {
        const theta = (index / frequencies.length) * Math.PI * 2 - Math.PI / 2;
        const radius = baseRadius * 2.18;
        const x = cx + Math.cos(theta) * radius;
        const y = cy + Math.sin(theta) * radius * .82;
        ctx.fillStyle = index % 2 ? 'rgba(196,207,223,.42)' : 'rgba(89,236,255,.52)';
        ctx.fillText(label, x, y);
      });
      ctx.restore();

      if (!reduceMotion) frameId = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduceMotion) frameId = requestAnimationFrame(draw);
      if (!running) cancelAnimationFrame(frameId);
    };

    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(visualizer);
    else window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    frameId = requestAnimationFrame(draw);
  }

})();
