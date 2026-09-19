import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Wind, Sparkles, Droplets, RefreshCw } from 'lucide-react';

export default function ThoughtDissolverModal({ onClose }) {
  const [thought, setThought] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [isDissolved, setIsDissolved] = useState(false);

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  // Generador acústico de cuenco tibetano y gota de agua
  const playWaterChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Tono fundamental relajante 528 Hz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 4.5);
    } catch (e) {}
  };

  // Simulación de partículas de agua y ondas expansivas en Canvas
  useEffect(() => {
    if (!isDissolving) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Crear partículas a partir del texto
    const particles = [];
    const numParticles = 140;

    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.2;
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 160,
        y: height / 2 + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3, // ligera flotación hacia arriba
        radius: 1.5 + Math.random() * 3.5,
        alpha: 1,
        color: i % 2 === 0 ? 'rgba(45, 212, 191, ' : 'rgba(94, 234, 212, ',
        waveOffset: Math.random() * Math.PI * 2
      });
    }

    // Ondas de agua concéntricas
    let waveRadius1 = 10;
    let waveRadius2 = 5;
    let waveAlpha1 = 0.8;
    let waveAlpha2 = 0.5;

    let startTime = performance.now();

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Dibujar ondas de agua expansivas
      waveRadius1 += 1.8;
      waveAlpha1 = Math.max(0, 1 - waveRadius1 / (width * 0.55));

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, waveRadius1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(45, 212, 191, ${waveAlpha1 * 0.4})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (waveRadius1 > 40) {
        waveRadius2 += 1.6;
        waveAlpha2 = Math.max(0, 1 - waveRadius2 / (width * 0.55));
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, waveRadius2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(52, 211, 153, ${waveAlpha2 * 0.35})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Dibujar y dispersar gotas de agua
      let aliveCount = 0;
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time * 0.003 + p.waveOffset) * 0.6;
        p.y += p.vy + Math.cos(time * 0.003 + p.waveOffset) * 0.4;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.alpha -= 0.007;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.alpha + ')';
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(45, 212, 191, 0.6)';
          ctx.fill();
        }
      });

      if (aliveCount > 0 && performance.now() - startTime < 3200) {
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
    <div className="fixed inset-0 bg-[#040f0d]/95 backdrop-blur-2xl z-50 flex flex-col justify-between items-center p-6 text-white overflow-hidden animate-fadeIn select-none">
      
      {/* Barra superior */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2 z-20">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[10px] font-semibold tracking-widest text-teal-300 uppercase bg-teal-950/70 border border-teal-500/30 px-3.5 py-1 rounded-full flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-teal-400" /> Defusión Cognitiva ACT
        </span>
        <div className="w-10" />
      </div>

      {/* ÁREA CENTRAL */}
      <div className="w-full max-w-sm my-auto flex flex-col items-center text-center space-y-6 relative">
        
        {!isDissolved ? (
          <>
            <div className="space-y-1 z-10">
              <h3 className="text-base font-light text-white">Disolver Pensamiento en el Agua</h3>
              <p className="text-xs text-teal-100/70 font-light">
                Los pensamientos son eventos mentales pasajeros, no verdades absolutas.
              </p>
            </div>

            {/* ESTANQUE DE AGUA INTERACTIVO */}
            <div className="relative w-full aspect-square max-w-[290px] rounded-full flex items-center justify-center p-6 mx-auto">
              
              {/* Resplandor acuático profundo */}
              <div className="absolute inset-0 rounded-full bg-teal-500/10 filter blur-2xl animate-pulse" />
              
              {/* Borde exterior del estanque */}
              <div className="absolute inset-2 rounded-full border border-teal-500/25 bg-gradient-to-b from-[#08221d]/80 to-[#041411]/90 backdrop-blur-md shadow-inner" />

              {/* CANVAS DE DISOLUCIÓN LÍQUIDA */}
              {isDissolving && (
                <canvas 
                  ref={canvasRef} 
                  width={300} 
                  height={300} 
                  className="absolute inset-0 z-20 pointer-events-none rounded-full"
                />
              )}

              {/* TEXTO DEL PACIENTE (Visible solo antes de disolver) */}
              {!isDissolving && (
                <div className="relative z-10 w-full px-4">
                  <textarea
                    rows="3"
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    placeholder="Escribe aquí el pensamiento o miedo recurrente que quieres soltar..."
                    className="w-full bg-transparent text-center text-xs text-white placeholder-teal-200/40 focus:outline-none resize-none font-light leading-relaxed"
                  />
                  <span className="block text-[10px] text-teal-300/40 uppercase tracking-widest mt-2">
                    Toca para escribir
                  </span>
                </div>
              )}
            </div>

            {/* BOTÓN DE SOLTAR */}
            <div className="w-full space-y-2 z-10">
              <button
                disabled={isDissolving || !thought.trim()}
                onClick={handleStartDissolve}
                className={`w-full py-3.5 rounded-2xl font-medium text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  thought.trim() && !isDissolving
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-teal-950/50 cursor-pointer'
                    : 'bg-white/10 text-stone-500 cursor-not-allowed'
                }`}
              >
                {isDissolving ? (
                  <span className="flex items-center gap-2 text-teal-200 animate-pulse">
                    <Droplets className="w-4 h-4 animate-bounce" /> Disolviéndose en el agua...
                  </span>
                ) : (
                  <>
                    <Wind className="w-4 h-4" /> Soltar y disolver en el agua
                  </>
                )}
              </button>

              <p className="text-[10px] text-teal-200/50 font-light">
                Respira profundo mientras contemplas cómo se desvanece la marea.
              </p>
            </div>
          </>
        ) : (
          /* ESTADO TRAS DISOLVER: SERENIDAD TOTAL */
          <div className="space-y-6 animate-fadeIn py-6">
            <div className="w-20 h-20 rounded-full bg-teal-500/15 border border-teal-400/30 flex items-center justify-center mx-auto text-teal-300 shadow-xl shadow-teal-900/30">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
              <h3 className="text-lg font-light text-white">Pensamiento disuelto</h3>
              <p className="text-xs text-teal-100/80 leading-relaxed font-light">
                Ese pensamiento ya no tiene peso sobre ti. Ha regresado al agua y tu mente vuelve a estar despejada.
              </p>
            </div>

            <div className="flex gap-2.5 w-full pt-4">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-stone-200 rounded-2xl text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Soltar otro
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl text-xs font-medium transition-all cursor-pointer shadow-md"
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