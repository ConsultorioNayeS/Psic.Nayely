import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, Droplets, Play, Sparkles } from 'lucide-react';

export default function BreathingModal({ onClose }) {
  // Estado para saber si el paciente ya presionó 'Comenzar'
  const [hasStarted, setHasStarted] = useState(false);

  const [phase, setPhase] = useState('inhale'); // 'inhale' | 'hold' | 'exhale'
  const [timer, setTimer] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef(null);

  // Cuencos armónicos acústicos por fase
  const playWaterChime = (frequency, duration = 3.5) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + duration);
    } catch (e) {}
  };

  // Tocar sonido solo si ya comenzó el ejercicio
  useEffect(() => {
    if (!hasStarted) return;
    if (phase === 'inhale') playWaterChime(432, 4.0);      // Tono celeste (oxígeno)
    else if (phase === 'hold') playWaterChime(324, 4.5);   // Tono áureo (pausa)
    else if (phase === 'exhale') playWaterChime(216, 6.0); // Tono violeta (descarga)
  }, [phase, hasStarted, soundEnabled]);

  // Cronómetro sincronizado (SOLO corre tras pulsar Comenzar)
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

  // Iniciar la sesión al pulsar el botón central
  const handleStart = () => {
    setHasStarted(true);
    setPhase('inhale');
    setTimer(4);
    playWaterChime(432, 4.0); // Primer cuenco al arrancar
  };

  // CONFIGURACIÓN DE FÍSICA Y COLOR (INICIA DESINFLADO EN 'IDLE')
  const getPhaseConfig = () => {
    if (!hasStarted) {
      // ESTADO INICIAL: TOTALMENTE RECOGIDO / DESINFLADO
      return {
        title: 'Listo',
        instruction: 'Ponte en una postura cómoda, relaja los hombros y presiona Comenzar.',
        scale: 0.68,          // Totalmente desinflado / pequeño
        rippleScale: 0.95,
        rippleOpacity: 0.2,
        petalDistance: 12,
        petalGradient: 'radial-gradient(circle, rgba(45, 212, 191, 0.45) 0%, rgba(13, 148, 136, 0.15) 60%, transparent 80%)',
        waterGlow: 'rgba(45, 212, 191, 0.15)',
        ringBorder: 'border-teal-500/25',
        centerBg: 'bg-[#061e1b]/95',
        centerBorder: 'border-teal-400/40',
        badgeBg: 'bg-teal-950/70 border-teal-500/30 text-teal-300',
        textColor: 'text-teal-300',
        duration: 1000,
      };
    }

    switch (phase) {
      case 'inhale':
        return {
          title: 'Inhala',
          instruction: 'Toma aire mientras la flor se abre... siente la marea expandirse en tu pecho.',
          scale: 1.68,        // CRECIMIENTO VISIBLE Y GRANDE
          rippleScale: 2.15,
          rippleOpacity: 0.65,
          petalDistance: 74,
          // FASE 1: CELESTE OCÉANO & MENTA VIVA
          petalGradient: 'radial-gradient(circle, rgba(56, 189, 248, 0.8) 0%, rgba(45, 212, 191, 0.4) 60%, transparent 80%)',
          waterGlow: 'rgba(56, 189, 248, 0.45)',
          ringBorder: 'border-sky-400/60',
          centerBg: 'bg-[#041a24]/90',
          centerBorder: 'border-sky-400/50',
          badgeBg: 'bg-sky-950/70 border-sky-400/40 text-sky-300',
          textColor: 'text-sky-300',
          duration: 4000,     // Florece durante 4 segundos completos
        };
      case 'hold':
        return {
          title: 'Sostén',
          instruction: 'Siente la quietud de un lago sin viento... el agua sostiene tu energía.',
          scale: 1.72,
          rippleScale: 2.25,
          rippleOpacity: 0.7,
          petalDistance: 78,
          // FASE 2: ORO AURORA & JADE RADIANTE
          petalGradient: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(52, 211, 153, 0.45) 60%, transparent 80%)',
          waterGlow: 'rgba(251, 191, 36, 0.45)',
          ringBorder: 'border-amber-400/60',
          centerBg: 'bg-[#1c1806]/90',
          centerBorder: 'border-amber-400/50',
          badgeBg: 'bg-amber-950/70 border-amber-400/40 text-amber-300',
          textColor: 'text-amber-300',
          duration: 7000,     // Se mantiene quieta 7 segundos
        };
      case 'exhale':
        return {
          title: 'Exhala',
          instruction: 'Suelta todo el aire por la boca... la flor se desinfla y vuelve a la calma.',
          scale: 0.68,        // SE DESINFLA POR COMPLETO
          rippleScale: 1.0,
          rippleOpacity: 0.25,
          petalDistance: 12,
          // FASE 3: LAVANDA CREPUSCULAR & VIOLETA
          petalGradient: 'radial-gradient(circle, rgba(168, 85, 247, 0.7) 0%, rgba(99, 102, 241, 0.35) 60%, transparent 80%)',
          waterGlow: 'rgba(168, 85, 247, 0.3)',
          ringBorder: 'border-purple-400/40',
          centerBg: 'bg-[#150720]/90',
          centerBorder: 'border-purple-400/40',
          badgeBg: 'bg-purple-950/70 border-purple-400/40 text-purple-300',
          textColor: 'text-purple-300',
          duration: 8000,     // Se repliega lentamente durante 8 segundos
        };
    }
  };

  const current = getPhaseConfig();

  return (
    <div className="fixed inset-0 bg-[#030d0b] z-50 flex flex-col justify-between items-center p-6 text-white overflow-hidden select-none animate-fadeIn">
      
      {/* Barra superior */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2 z-20">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Badge superior que muta de color con cada fase */}
        <span className={`text-[10px] tracking-widest uppercase font-semibold border px-3.5 py-1 rounded-full flex items-center gap-1.5 transition-all duration-1000 ${current.badgeBg}`}>
          <Droplets className="w-3 h-3" /> {hasStarted ? `Ciclo ${cycle} • ${current.title}` : 'Respiración Guiada'}
        </span>

        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            soundEnabled ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'bg-white/10 text-stone-400'
          }`}
          title={soundEnabled ? 'Silenciar cuencos' : 'Activar sonido'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* ÁREA CENTRAL: ONDAS Y LOTO CON COLOR DINÁMICO */}
      <div className="relative flex items-center justify-center my-auto w-80 h-80">
        
        {/* ONDA DE AGUA 1 */}
        <div 
          className={`absolute w-72 h-72 rounded-full border pointer-events-none transition-all ${current.ringBorder}`}
          style={{
            transform: `scale(${current.rippleScale})`,
            opacity: current.rippleOpacity,
            transitionDuration: `${current.duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />

        {/* ONDA DE AGUA 2 */}
        <div 
          className={`absolute w-60 h-60 rounded-full border-2 pointer-events-none transition-all ${current.ringBorder}`}
          style={{
            transform: `scale(${current.rippleScale * 0.85})`,
            opacity: current.rippleOpacity * 1.1,
            transitionDuration: `${current.duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />

        {/* RESPLANDOR CENTRAL FLUIDO */}
        <div 
          className="absolute w-64 h-64 rounded-full filter blur-3xl pointer-events-none transition-all"
          style={{
            backgroundColor: current.waterGlow,
            transform: `scale(${current.scale * 1.3})`,
            transitionDuration: `${current.duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />

        {/* 6 PÉTALOS CON GRADIENTE DINÁMICO */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <div
            key={i}
            className="absolute w-36 h-36 rounded-full pointer-events-none transition-all"
            style={{
              background: current.petalGradient,
              mixBlendMode: 'screen',
              transform: `
                rotate(${angle + (hasStarted && phase !== 'exhale' ? 35 : 0)}deg) 
                translate(${current.petalDistance}px) 
                scale(${current.scale})
              `,
              transitionDuration: `${current.duration}ms`,
              transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
        ))}

        {/* NÚCLEO CENTRAL INTERACTIVO */}
        {!hasStarted ? (
          /* BOTÓN INICIAL 'COMENZAR' */
          <button
            onClick={handleStart}
            className="relative z-10 w-32 h-32 rounded-full border border-teal-400/50 bg-[#061e1b]/95 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 mb-1 group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 ml-0.5 fill-teal-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Comenzar
            </span>
            <span className="text-[9px] text-teal-300/60 font-light mt-0.5">Técnica 4-7-8</span>
          </button>
        ) : (
          /* NÚCLEO CON NÚMERO Y FASE TRAS COMENZAR */
          <div 
            className={`relative z-10 w-28 h-28 rounded-full border backdrop-blur-md flex flex-col items-center justify-center text-center shadow-2xl transition-all ${current.centerBg} ${current.centerBorder}`}
            style={{
              transform: `scale(${phase === 'exhale' ? 0.9 : 1.05})`,
              transitionDuration: `${current.duration}ms`
            }}
          >
            <span className="text-3xl font-light tracking-tight text-white font-mono">
              {timer}
            </span>
            <span className={`text-[11px] uppercase tracking-widest font-semibold mt-0.5 transition-colors duration-1000 ${current.textColor}`}>
              {current.title}
            </span>
          </div>
        )}

      </div>

      {/* Pie de texto con guía calmada */}
      <div className="w-full max-w-xs text-center z-20 pb-4 space-y-3">
        <p className="text-xs font-light text-stone-300 min-h-[2.5rem] transition-all duration-700 leading-relaxed">
          {current.instruction}
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