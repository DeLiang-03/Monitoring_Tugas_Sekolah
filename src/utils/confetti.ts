// High-performance canvas-based confetti celebration effect

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  opacity: number;
}

export function triggerConfetti(durationMs = 2500) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'];
  const particles: Particle[] = [];
  const particleCount = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * (0.3 + Math.random() * 0.4),
      y: height * 0.4,
      w: 8 + Math.random() * 6,
      h: 12 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: -8 - Math.random() * 10,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 18,
      opacity: 1,
    });
  }

  const startTime = performance.now();

  function render(time: number) {
    if (!ctx) return;
    const elapsed = time - startTime;
    ctx.clearRect(0, 0, width, height);

    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.vRot;

      if (elapsed > durationMs * 0.5) {
        p.opacity = Math.max(0, 1 - (elapsed - durationMs * 0.5) / (durationMs * 0.5));
      }

      if (p.opacity > 0 && p.y < height + 50) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    if (alive && elapsed < durationMs) {
      requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(render);
}
