import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Wind, Sparkles, Droplets, RefreshCw } from 'lucide-react';

export default function ThoughtDissolverModal({ onClose }) {
  const [thought, setThought] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [isDissolved, setIsDissolved] = useState(false);

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const audioCtxRef = useRef(null);

  // Sintetizador de Cuenco Sagrado 528 Hz + Gota de Agua Armónica
  const playWaterChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // 1. Tono base Solfeggio 528 Hz (Transformación & Calma mental)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 4.8);

      // 2. Armónico sutil cristalino (1056 Hz)
      const harmonic = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmonic.type = 'sine';
      harmonic.frequency.setValueAtTime(1056, now);

      harmGain.gain.setValueAtTime(0.001, now);
      harmGain.gain.linearRampToValueAtTime(0.03, now + 0.05);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      harmonic.connect(harmGain);
      harmGain.connect(ctx.destination);
      harmonic.start(now);
      harmonic.stop(now + 2.5);
    } catch (e) {}
  };

  // Simulación física de ondas concéntricas y partículas líquidas en Canvas
  useEffect(() => {
    if (!isDissolving) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Crear partículas bioluminiscentes a partir del pensamiento
    const particles = [];
    const numParticles = 160;

    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 2.4;
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 170,
        y: height / 2 + (Math.random() - 0.5) * 70,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.35,
        radius: 1.2 + Math.random() * 3.2,
        alpha: 1,
        color: i % 3 === 0 ? 'rgba(94, 234, 212, ' : i % 3 === 1 ? 'rgba(52, 211, 153, ' : 'rgba(167, 243, 208, ',
        waveOffset: Math.random() * Math.PI * 2
      });
    }

    let waveRadius1 = 8;
    let waveRadius2 = 4;
    let waveAlpha1 = 0.85;
    let waveAlpha2 = 0.55;

    const startTime = performance.now();

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Ondas concéntricas fluidas
      waveRadius1 += 1.7;
      waveAlpha1 = Math.max(0, 1 - waveRadius1 / (width * 0.52));

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, waveRadius1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(94, 234, 212, ${waveAlpha1 * 0.45})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      if (waveRadius1 > 35) {
        waveRadius2 += 1.5;
        waveAlpha2 = Math.max(0, 1 - waveRadius2 / (width * 0.52));
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, waveRadius2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52, 211, 153, ${waveAlpha2 * 0.35})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Dispersión física de partículas
      let aliveCount = 0;
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time * 0.003 + p.waveOffset) * 0.55;
        p.y += p.vy + Math.cos(time * 0.003 + p.waveOffset) * 0.35;
        p.vx *= 0.988;
        p.vy *= 0.988;
        p.alpha -= 0.0068;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.alpha + ')';
          ctx.shadowBlur = 9;
          ctx.shadowColor = 'rgba(94, 234, 212, 0.5)';
          ctx.fill();
        }
      });

      if (aliveCount > 0 && performance.now() - startTime < 3400) {
        animationFrameId.current = requestAnimationFrame(render);
      } else {
        setIsDissolving(false);
        setIsDissolved(true);
      }
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isDissolving]);

  const handleStartDissolve = () => {
    if (!thought.trim()) return;
    setIsDissolving(true);
    playWaterChime();
  };

  const handleReset = () => {
    setThought('');
    setIsDissolved(false);
    setIsDissolving(false);
  };

  return (
    <div className="fixed inset-0 bg-[#04110e]/95 backdrop-blur-2xl z-50 flex flex-col justify-between items-center p-6 text-stone-100 overflow-hidden select-none animate-fadeIn">
      
      {/* Barra superior de control */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2 z-20">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full glass-panel hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-all tap-bounce cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="glass-pill px-3.5 py-1 rounded-full text-[10px] font-semibold tracking-widest text-teal-300 uppercase flex items-center gap-1.5 shadow-inner-light">
          <Droplets className="w-3.5 h-3.5 text-teal-400" /> Defusión Cognitiva ACT
        </span>
        <div className="w-10" />
      </div>

      {/* ÁREA CENTRAL: ESTANQUE BIOLUMINISCENTE */}
      <div className="w-full max-w-sm my-auto flex flex-col items-center text-center space-y-6 relative">
        
        {!isDissolved ? (
          <>
            <div className="space-y-1.5 z-10">
              <h3 className="text-xl font-serif text-white tracking-tight">Disolver en el Agua Serena</h3>
              <p className="text-xs text-teal-100/70 font-light max-w-xs mx-auto leading-relaxed">
                Un pensamiento es solo un evento mental pasajero, no una verdad absoluta ni una orden.
              </p>
            </div>

            {/* El Estanque Líquido */}
            <div className="relative w-full aspect-square max-w-[290px] rounded-full flex items-center justify-center p-6 mx-auto">
              
              {/* Halo profundo esmeralda */}
              <div className="absolute inset-0 rounded-full bg-teal-500/15 filter blur-3xl animate-pulse" />
              
              {/* Borde cerámico del estanque */}
              <div className="absolute inset-1 rounded-full border border-teal-500/30 bg-gradient-to-b from-[#08241f]/85 to-[#041512]/95 backdrop-blur-md shadow-inner" />

              {/* Canvas dinámico de partículas fluidas */}
              {isDissolving && (
                <canvas 
                  ref={canvasRef} 
                  width={300} 
                  height={300} 
                  className="absolute inset-0 z-20 pointer-events-none rounded-full"
                />
              )}

              {/* Texto del Paciente (Visible antes de disolver) */}
              {!isDissolving && (
                <div className="relative z-10 w-full px-5">
                  <textarea
                    rows="3"
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    placeholder="Escribe el pensamiento o miedo intrusivo que quieres soltar..."
                    className="w-full bg-transparent text-center text-xs text-stone-100 placeholder-teal-200/40 focus:outline-none resize-none font-light leading-relaxed font-serif"
                  />
                  <span className="block text-[10px] text-teal-300/40 uppercase tracking-widest mt-2 font-mono">
                    Toca para escribir
                  </span>
                </div>
              )}
            </div>

            {/* Botón de Disolución */}
            <div className="w-full space-y-2 z-10">
              <button
                disabled={isDissolving || !thought.trim()}
                onClick={handleStartDissolve}
                className={`w-full py-3.5 px-4 rounded-2xl font-medium text-xs shadow-luxe transition-all flex items-center justify-center gap-2 tap-bounce ${
                  thought.trim() && !isDissolving
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white cursor-pointer shadow-glow-sage'
                    : 'bg-white/10 text-stone-500 cursor-not-allowed border border-white/5'
                }`}
              >
                {isDissolving ? (
                  <span className="flex items-center gap-2 text-teal-100 animate-pulse">
                    <Droplets className="w-4 h-4 animate-bounce" /> Disolviéndose en la marea...
                  </span>
                ) : (
                  <>
                    <Wind className="w-4 h-4" /> Soltar y ver disolverse
                  </>
                )}
              </button>

              <p className="text-[10px] text-teal-200/50 font-light">
                Respira hondo mientras contemplas cómo se desvanece en el agua.
              </p>
            </div>
          </>
        ) : (
          /* ESTADO TRAS DISOLVER: CALMA Y DESPEJE */
          <div className="space-y-6 animate-fadeIn py-6">
            <div className="w-20 h-20 rounded-full bg-teal-500/15 border border-teal-400/30 flex items-center justify-center mx-auto text-teal-300 shadow-glow-sage">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
              <h3 className="text-2xl font-serif text-white tracking-tight">Pensamiento disuelto</h3>
              <p className="text-xs text-teal-100/80 leading-relaxed font-light">
                El peso que cargaba se ha integrado al flujo del agua. Tu mente vuelve a su centro seguro.
              </p>
            </div>

            <div className="flex gap-2.5 w-full pt-4">
              <button
                onClick={handleReset}
                className="flex-1 py-3 glass-panel hover:bg-white/20 text-stone-200 rounded-2xl text-xs font-medium transition-all tap-bounce cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Soltar otro
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-2xl text-xs font-medium transition-all tap-bounce cursor-pointer shadow-luxe"
              >
                Regresar en paz
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}