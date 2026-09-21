import React, { useState, useRef } from 'react';
import { X, Sparkles, RefreshCw, ArrowLeft, Heart, Quote, Compass } from 'lucide-react';

export default function OracleDeckModal({ onClose }) {
  const cards = [
    {
      theme: 'Autocompasión',
      text: 'Hoy no tienes que resolver toda tu vida ni descifrar el futuro. Tu única tarea es habitar este día con amabilidad hacia ti.',
      guide: 'Pausa tu nivel de exigencia',
      author: 'Psic. Nayely'
    },
    {
      theme: 'Límites Sanos',
      text: 'Decir "no" con serenidad no te convierte en una mala persona. Te convierte en un ser humano honesto que cuida su propia energía.',
      guide: 'Honra tu espacio vital',
      author: 'Psic. Nayely'
    },
    {
      theme: 'Manejo de Emociones',
      text: 'Las emociones son olas: no puedes evitar que rompan en la orilla, pero puedes aprender a no ahogarte en su resaca.',
      guide: 'Respira sobre la ola',
      author: 'Psic. Nayely'
    },
    {
      theme: 'Sobrepensamiento',
      text: 'Tu mente es experta en fabricar tormentas imaginarias para intentar protegerte. Agradécele la intención y regresa al cuerpo.',
      guide: 'Siente el suelo bajo tus pies',
      author: 'Psic. Nayely'
    },
    {
      theme: 'Descanso Sagrado',
      text: 'El descanso no es una recompensa que debes ganarte tras el agotamiento extremo; es una necesidad biológica sagrada.',
      guide: 'Permítete detener el reloj',
      author: 'Psic. Nayely'
    },
    {
      theme: 'Validación Interna',
      text: 'Tu valor como persona permanece intacto, incluso en los días lentos donde levantarte de la cama fue tu mayor proeza.',
      guide: 'Ya eres suficiente hoy',
      author: 'Psic. Nayely'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const audioCtxRef = useRef(null);

  // Sonido suave de deslizamiento de papel de arte
  const playCardBrush = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  };

  const drawNewCard = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(25); } catch (e) {}
    }
    playCardBrush();
    setIsFlipping(true);

    setTimeout(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * cards.length);
      } while (nextIndex === currentIndex && cards.length > 1);
      setCurrentIndex(nextIndex);
      setIsFlipping(false);
    }, 280);
  };

  const current = cards[currentIndex];

  return (
    <div className="fixed inset-0 bg-[#08120e]/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-sm glass-panel rounded-[40px] p-6 shadow-2xl border border-white/40 flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Cabecera */}
        <div className="w-full flex justify-between items-center mb-4">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-stone-600 text-xs transition-colors tap-bounce cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a5522] glass-pill px-3 py-1 rounded-full shadow-inner-light">
            Baraja de Autocompasión
          </span>

          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors tap-bounce cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-stone-500 font-light mb-4">
          Pausa un instante, inhala hondo y recibe tu recordatorio de hoy:
        </p>

        {/* CARTA DE LINO ITALIANO CON PAN DE ORO */}
        <div 
          className={`w-full aspect-[4/5] max-h-[330px] rounded-[32px] p-6 bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#f4eee1] border-2 border-[#e6dbc8] shadow-luxe flex flex-col justify-between items-center relative transition-all duration-300 ${
            isFlipping ? 'scale-95 opacity-40 rotate-2' : 'scale-100 opacity-100 rotate-0'
          }`}
          style={{
            backgroundImage: 'radial-gradient(#b88a44 0.6px, transparent 0.6px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Sello Superior */}
          <div className="w-full flex justify-between items-center text-[10px] text-[#7a5522] font-semibold tracking-wider uppercase border-b border-[#ebdcc7] pb-2.5">
            <span className="font-serif italic font-normal tracking-normal text-stone-700">{current.author}</span>
            <span className="bg-[#f0e3ce] px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest text-[#7a5522]">
              {current.theme}
            </span>
          </div>

          {/* Texto Central en Tipografía Editorial */}
          <div className="my-auto py-2 space-y-2.5">
            <Quote className="w-5 h-5 text-[#b88a44]/50 mx-auto" />
            <p className="text-sm font-serif italic text-stone-900 leading-relaxed px-1">
              “{current.text}”
            </p>
          </div>

          {/* Pie de Carta */}
          <div className="w-full pt-2.5 border-t border-[#ebdcc7] flex justify-between items-center text-[10px]">
            <span className="text-[#7a5522] font-medium flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#b88a44]" />
              {current.guide}
            </span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-100" />
          </div>
        </div>

        {/* Botón Sacar Otra Carta */}
        <button
          onClick={drawNewCard}
          disabled={isFlipping}
          className="mt-5 w-full py-3.5 bg-gradient-to-r from-[#2a422d] to-[#1d2f20] hover:from-[#335236] hover:to-[#223825] active:scale-98 text-white rounded-2xl font-medium text-xs shadow-luxe transition-all flex items-center justify-center gap-2 tap-bounce cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
          <span>Extraer otra reflexión</span>
        </button>

      </div>
    </div>
  );
}