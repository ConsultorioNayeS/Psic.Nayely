import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, Play, BellRing, Sparkles } from 'lucide-react';

export default function BreathingModal({ onClose }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [phase, setPhase] = useState('inhale'); // 'inhale' | 'hold' | 'exhale'
  const [timer, setTimer] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef(null);

  const getAudioCtx = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Cuenco Tibetano Puro y Calibrado en Frecuencias Áureas
  const playSacredBowl = (currentPhase) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // Frecuencias: Inhalar (432 Hz - Oxígeno y expansión), Sostener (324 Hz - Quietud), Exhalar (216 Hz - Descarga)
      const freq = currentPhase === 'inhale' ? 432 : currentPhase === 'hold' ? 324 : 216;
      const duration = currentPhase === 'exhale' ? 7.5 : currentPhase === 'hold' ? 6.5 : 4.2;

      // 1. Tono Fundamental
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.09, now + 0.12);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + duration + 0.5);

      // 2. Sobretono Brillante (Octava armónica suave)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.02, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.6));

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + duration);
    } catch (e) {}
  };

  useEffect(() => {
    if (!hasStarted) return;
    playSacredBowl(phase);
  }, [phase, hasStarted, soundEnabled]);

  // Cronómetro del ciclo 4-7-8
  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) return prev - 1;
        if (phase === 'inhale') {
          setPhase('hold');
          return 7;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 8;
        } else {
          setPhase('inhale');
          setCycle((c) => c + 1);
          return 4;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, phase]);

  const handleStart = () => {
    setHasStarted(true);
    setPhase('inhale');
    setTimer(4);
    playSacredBowl('inhale');
  };

  const phaseVisuals = {
    inhale: {
      title: 'Inhala',
      detail: 'Expande suavemente tu pecho mientras el orbe florece...',
      scale: 1.55,
      opacity: 0.75,
      duration: 4000,
      glow: 'rgba(94, 234, 212, 0.35)',
    },
    hold: {
      title: 'Sostén',
      detail: 'Permanece en la quietud de tus pulmones llenos...',
      scale: 1.62,
      opacity: 0.85,
      duration: 7000,
      glow: 'rgba(251, 191, 36, 0.3)',
    },
    exhale: {
      title: 'Exhala',
      detail: 'Suelta todo el aire por la boca, liberando la tensión...',
      scale: 0.72,
      opacity: 0.3,
      duration: 8000,
      glow: 'rgba(167, 139, 250, 0.25)',
    }
  };

  const currentVisual = !hasStarted ? {
    title: 'Pausa',
    detail: 'Ponte en postura cómoda, relaja los hombros e inicia.',
    scale: 0.75,
    opacity: 0.25,
    duration: 1000,
    glow: 'rgba(45, 212, 191, 0.15)',
  } : phaseVisuals[phase];

  return (
    <div className="fixed inset-0 bg-[#071310]/95 backdrop-blur-2xl z-50 flex flex-col justify-between items-center p-6 text-stone-100 select-none animate-fadeIn">
      
      {/* Barra superior limpia */}
      <div className="w-full max-w-sm flex items-center justify-between z-20 pt-2">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full glass-panel hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-all tap-bounce cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="glass-pill px-3.5 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold text-emerald-300 flex items-center gap-1.5 shadow-inner-light">
          <BellRing className="w-3 h-3 text-emerald-400" />
          {hasStarted ? `Ciclo ${cycle} • ${currentVisual.title}` : 'Respiración 4-7-8 • Cuencos'}
        </span>

        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all tap-bounce cursor-pointer ${
            soundEnabled ? 'bg-emerald-600 text-white shadow-glow-sage' : 'glass-panel text-stone-400'
          }`}
          title={soundEnabled ? 'Silenciar cuencos' : 'Activar cuencos'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Orbe Central Calm */}
      <div className="relative flex items-center justify-center my-auto w-80 h-80">
        
        <div 
          className="absolute w-72 h-72 rounded-full filter blur-3xl pointer-events-none transition-all"
          style={{
            backgroundColor: currentVisual.glow,
            transform: `scale(${currentVisual.scale * 1.3})`,
            transitionDuration: `${currentVisual.duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />

        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border border-emerald-400/20 pointer-events-none transition-all"
            style={{
              width: `${ring * 95}px`,
              height: `${ring * 95}px`,
              transform: `scale(${currentVisual.scale * (1 + ring * 0.1)})`,
              opacity: currentVisual.opacity / ring,
              transitionDuration: `${currentVisual.duration}ms`,
              transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
        ))}

        {!hasStarted ? (
          <button
            onClick={handleStart}
            className="relative z-10 w-36 h-36 rounded-full glass-panel border border-emerald-300/30 flex flex-col items-center justify-center text-center shadow-luxe hover:scale-105 active:scale-95 transition-all tap-bounce cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 mb-1 group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 ml-0.5 fill-emerald-300" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-emerald-100 uppercase">
              Comenzar
            </span>
            <span className="text-[9px] text-stone-400 font-light font-mono">Técnica 4-7-8</span>
          </button>
        ) : (
          <div 
            className="relative z-10 w-32 h-32 rounded-full glass-panel border border-emerald-300/40 flex flex-col items-center justify-center text-center shadow-2xl transition-all"
            style={{
              transform: `scale(${phase === 'exhale' ? 0.92 : 1.05})`,
              transitionDuration: `${currentVisual.duration}ms`
            }}
          >
            <span className="text-4xl font-light font-mono text-white tracking-tight">
              {timer}
            </span>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-emerald-300 mt-1">
              {currentVisual.title}
            </span>
          </div>
        )}

      </div>

      {/* Guía Inferior */}
      <div className="w-full max-w-xs text-center z-20 pb-4 space-y-3">
        <p className="text-xs font-light text-stone-300 min-h-[2.5rem] leading-relaxed transition-opacity duration-500 font-serif italic">
          {currentVisual.detail}
        </p>

        <button 
          onClick={onClose}
          className="text-[11px] tracking-wider uppercase text-stone-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
        >
          {hasStarted ? 'Finalizar sesión' : 'Cerrar'}
        </button>
      </div>

    </div>
  );
}