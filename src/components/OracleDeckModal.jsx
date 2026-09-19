import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, ArrowLeft, Heart, Quote, Layers } from 'lucide-react';

export default function OracleDeckModal({ onClose }) {
  const cards = [
    {
      theme: 'Autocompasión',
      text: 'Hoy no tienes que resolver toda tu vida ni descifrar el futuro. Tu única tarea es habitar este día con amabilidad.',
      guide: 'Pausa tu exigencia'
    },
    {
      theme: 'Límites Sanos',
      text: 'Decir "no" con calma no te hace una mala persona. Te hace una persona honesta que cuida su propia energía.',
      guide: 'Honra tus límites'
    },
    {
      theme: 'Manejo de Emociones',
      text: 'Las emociones son olas: no puedes evitar que lleguen a la orilla, pero puedes aprender a no ahogarte en ellas.',
      guide: 'Respira la ola'
    },
    {
      theme: 'Sobrepensamiento',
      text: 'Tu mente es experta en inventar catástrofes para intentar protegerte. Dale las gracias por cuidarte y regresa al presente.',
      guide: 'Regresa al cuerpo'
    },
    {
      theme: 'Descanso',
      text: 'El descanso no es una recompensa que te tienes que ganar después de agotarte; es una necesidad biológica sagrada.',
      guide: 'Permítete parar'
    },
    {
      theme: 'Validación Interna',
      text: 'Tu valor como ser humano sigue intacto, incluso en los días donde no tuviste fuerzas para ser productiva.',
      guide: 'Ya eres suficiente'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const drawNewCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * cards.length);
      } while (nextIndex === currentIndex && cards.length > 1);
      setCurrentIndex(nextIndex);
      setIsFlipping(false);
    }, 300);
  };

  const current = cards[currentIndex];

  return (
    <div className="fixed inset-0 bg-[#071310]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-[#faf7f2] rounded-[40px] p-6 shadow-2xl border border-[#e8dfd1] flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Cabecera */}
        <div className="w-full flex justify-between items-center mb-4">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8c6d48] bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full">
            Baraja de Autocompasión
          </span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-stone-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-stone-500 font-light mb-4">
          Cierra los ojos un segundo, respira hondo y descubre tu recordatorio de hoy:
        </p>

        {/* LA CARTA DE LINO CON GIRO SUAVE */}
        <div 
          className={`w-full aspect-[4/5] max-h-[320px] bg-white rounded-3xl p-6 border-2 border-[#e6dac9] shadow-xl flex flex-col justify-between items-center relative transition-all duration-300 ${
            isFlipping ? 'scale-95 opacity-50 rotate-3' : 'scale-100 opacity-100 rotate-0'
          }`}
          style={{
            backgroundImage: 'radial-gradient(#8c6d48 0.5px, transparent 0.5px)',
            backgroundSize: '16px 16px',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Sello superior */}
          <div className="w-full flex justify-between items-center text-[10px] text-[#8c6d48] font-semibold tracking-wider uppercase border-b border-[#f0e7dc] pb-2">
            <span>Dra. Nayely</span>
            <span className="bg-[#f7f0e6] px-2 py-0.5 rounded-full">{current.theme}</span>
          </div>

          {/* Texto central en tipografía editorial */}
          <div className="my-auto py-3 space-y-2">
            <Quote className="w-5 h-5 text-[#8c6d48]/40 mx-auto" />
            <p className="text-sm font-serif italic text-stone-800 leading-relaxed">
              “{current.text}”
            </p>
          </div>

          {/* Guía inferior */}
          <div className="w-full pt-2 border-t border-[#f0e7dc] flex justify-between items-center text-[10px] text-stone-400">
            <span className="text-[#8c6d48] font-medium">{current.guide}</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-100" />
          </div>
        </div>

        {/* Botón Sacar otra carta */}
        <button
          onClick={drawNewCard}
          disabled={isFlipping}
          className="mt-6 w-full py-3 bg-[#436146] hover:bg-[#253827] active:scale-98 text-white rounded-2xl font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
          Sacar otra reflexión
        </button>

      </div>
    </div>
  );
}