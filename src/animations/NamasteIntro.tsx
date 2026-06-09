import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NamasteIntroProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function NamasteIntro({ onComplete }: NamasteIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [phase, setPhase] = useState<'particles' | 'text' | 'tagline' | 'exit'>('particles');
  const [showSkip, setShowSkip] = useState(false);

  const colors = ['#6366f1', '#a855f7', '#38bdf8', '#10b981', '#f59e0b', '#ec4899'];

  useEffect(() => {
    // Show skip button after 1s
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    // Phase transitions
    const t1 = setTimeout(() => setPhase('text'), 800);
    const t2 = setTimeout(() => setPhase('tagline'), 2500);
    const t3 = setTimeout(() => setPhase('exit'), 4500);
    const t4 = setTimeout(() => onComplete(), 5500);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticle = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 3;
      const life = 80 + Math.random() * 120;
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 200,
        y: cy + (Math.random() - 0.5) * 200,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 3,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life,
        maxLife: life,
      });
    };

    let frame = 0;
    const animate = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn particles
      if (frame % 2 === 0) spawnParticle();
      if (frame < 60 && frame % 1 === 0) spawnParticle();

      // Update & draw particles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01; // slight gravity
        p.vx *= 0.99;
        p.life--;
        p.alpha = (p.life / p.maxLife);
        p.size *= 0.999;

        ctx.save();
        ctx.globalAlpha = p.alpha * 0.8;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Central glow orb
      const t = frame / 100;
      const pulse = 1 + Math.sin(t * 3) * 0.1;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150 * pulse);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
      gradient.addColorStop(0.4, 'rgba(168, 85, 247, 0.15)');
      gradient.addColorStop(1, 'transparent');

      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 150 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Orbiting dots
      for (let i = 0; i < 6; i++) {
        const angle = (frame / 60 + (i * Math.PI * 2) / 6) * (i % 2 === 0 ? 1 : -1);
        const radius = 100 + i * 20;
        const ox = cx + Math.cos(angle) * radius;
        const oy = cy + Math.sin(angle) * radius;
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = colors[i % colors.length];
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      frame++;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#020617' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* Main Content */}
          <div className="relative z-10 text-center select-none">
            {/* Devanagari Namaste */}
            <AnimatePresence>
              {(phase === 'text' || phase === 'tagline') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, filter: 'blur(30px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.h1
                    className="font-cinzel text-7xl md:text-9xl font-black mb-2"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #a855f7, #38bdf8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: 'none',
                      filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.8))',
                    }}
                    animate={{
                      filter: [
                        'drop-shadow(0 0 20px rgba(99,102,241,0.5))',
                        'drop-shadow(0 0 60px rgba(168,85,247,0.8))',
                        'drop-shadow(0 0 40px rgba(99,102,241,0.6))',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    नमस्ते
                  </motion.h1>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-px mx-auto my-4"
                    style={{
                      width: '200px',
                      background: 'linear-gradient(90deg, transparent, #6366f1, #a855f7, transparent)',
                    }}
                  />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-slate-400 text-lg tracking-[0.3em] uppercase font-outfit"
                  >
                    Namaste
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence>
              {phase === 'tagline' && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="mt-8"
                >
                  <p className="font-cinzel text-xl md:text-2xl text-white mb-2">
                    Welcome to{' '}
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Financial Tool Hub
                    </span>
                  </p>
                  <p className="text-slate-500 text-sm tracking-widest uppercase">
                    Your Interactive Financial Universe
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skip Button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                whileHover={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setPhase('exit');
                  setTimeout(onComplete, 400);
                }}
                className="absolute bottom-8 right-8 text-slate-500 text-sm hover:text-white transition-colors flex items-center gap-2 font-outfit"
              >
                Skip intro
                <span className="text-xs opacity-60">→</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
