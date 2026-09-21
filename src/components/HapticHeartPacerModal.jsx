import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Volume2, VolumeX } from 'lucide-react';

export default function HapticHeartPacerModal({ onClose }) {
  const [isActive, setIsActive] = useState(false);
  const [bpm] = useState(60); // 60 BPM exacto
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  // Inicializar y desbloquear AudioContext en evento táctil directo
  const unlockAudioContext = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {}
  };

  // Sonido biológico auténtico de dos tiempos ("Lub-Dub")
  // Calibrado con armónicos (110 Hz - 170 Hz) para sonar con cuerpo en altavoces de iPhone y Android
  const playHeartBeatAcoustic = () => {
    if (!soundEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // ==========================================
      // TIEMPO 1: "LUB" (Cierre de válvulas AV)
      // ==========================================
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      // Frecuencia inicial audible en celular con caída fisiológica
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(70, now + 0.12);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // ==========================================
      // TIEMPO 2: "DUB" (160ms después, sístole)
      // ==========================================
      const t2 = now + 0.16;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(160, t2);
      osc2.frequency.exponentialRampToValueAtTime(80, t2 + 0.10);

      gain2.gain.setValueAtTime(0.001, t2);
      gain2.gain.linearRampToValueAtTime(0.14, t2 + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.13);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.14);

    } catch (e) {}
  };

  const triggerPulse = () => {
    // 1. Vibración háptica doble para Android PWA / APK
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([45, 70, 35]); // Doble pulso físico que acompaña el "lub-dub"
      } catch (e) {}
    }

    // 2. Pulso acústico audible
    playHeartBeatAcoustic();
  };

  const handleToggleActive = () => {
    unlockAudioContext();
    if (!isActive) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      triggerPulse();
      intervalRef.current = setInterval(triggerPulse, 1000); // 60 BPM = 1 ciclo cada 1000ms
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, soundEnabled]);

  return (
    <div className="fixed inset-0 bg-[#090507]/95 backdrop-blur-2xl z-50 flex flex-col justify-between items-center p-6 text-stone-100 overflow-hidden animate-fadeIn select-none">
      
      {/* Cabecera */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2 z-20">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full glass-panel hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-all tap-bounce cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="glass-pill px-3.5 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] text-rose-300 uppercase flex items-center gap-1.5 shadow-inner-light">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" /> Marcapasos Háptico • {bpm} BPM
        </span>

        <button 
          onClick={() => {
            unlockAudioContext();
            setSoundEnabled(!soundEnabled);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all tap-bounce cursor-pointer ${
            soundEnabled ? 'bg-rose-950/80 text-rose-200 border border-rose-500/40 shadow-glow-sage' : 'glass-panel text-stone-400'
          }`}
          title={soundEnabled ? 'Silenciar latido' : 'Activar latido'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* ÁREA CENTRAL: ONDAS CARDÍACAS Y NÚCLEO HÁPTICO */}
      <div className="relative flex flex-col items-center justify-center my-auto w-80 h-80 text-center">
        
        {/* Onda expansiva animada */}
        <div 
          className={`absolute w-72 h-72 rounded-full border border-rose-500/30 pointer-events-none transition-all duration-1000 ${
            isActive ? 'scale-125 opacity-25 animate-ping' : 'scale-90 opacity-10'
          }`} 
        />
        <div 
          className={`absolute w-60 h-60 rounded-full border border-rose-500/20 pointer-events-none transition-all duration-700 ${
            isActive ? 'scale-110 opacity-30' : 'scale-95 opacity-5'
          }`} 
        />

        {/* Círculo Interactivo de Presión */}
        <button
          onClick={handleToggleActive}
          className={`relative z-10 w-48 h-48 rounded-full border-2 flex flex-col items-center justify-center shadow-2xl transition-all duration-500 tap-bounce cursor-pointer ${
            isActive 
              ? 'bg-gradient-to-b from-[#2b0e14] via-[#1a070a] to-[#0d0305] border-rose-400/60 shadow-rose-950/80 scale-105' 
              : 'glass-panel border-white/20 hover:border-white/40 scale-100'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-transform duration-300 ${
            isActive ? 'scale-110 text-rose-400' : 'text-stone-400'
          }`}>
            <Heart className={`w-8 h-8 transition-transform ${isActive ? 'fill-rose-500 text-rose-400 animate-pulse' : ''}`} />
          </div>

          <span className="text-xs font-serif italic text-white tracking-wide">
            {isActive ? 'Sincronizando' : 'Iniciar Ritmo'}
          </span>
          
          <span className="text-[10px] text-stone-400 font-mono mt-0.5">
            {isActive ? '60 pulsos / min' : 'Toca para activar'}
          </span>
        </button>

      </div>

      {/* Guía inferior */}
      <div className="w-full max-w-xs text-center z-20 pb-4 space-y-3">
        <p className="text-xs font-light text-stone-300 leading-relaxed min-h-[2.5rem]">
          {isActive 
            ? 'Coloca tu pulgar sobre el círculo o tu mano sobre el pecho. Deja que tu respiración y corazón copien este pulso lento.'
            : 'Un compás biológico a 60 pulsos por minuto que ayuda a regular la taquicardia del estrés por coherencia vagal.'}
        </p>

        <button 
          onClick={onClose}
          className="text-[11px] tracking-wider uppercase text-stone-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
        >
          Finalizar
        </button>
      </div>

    </div>
  );
}