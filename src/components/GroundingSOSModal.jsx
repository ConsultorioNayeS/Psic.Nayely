import React, { useState } from 'react';
import { ArrowLeft, Check, Eye, Hand, Volume2, Sparkles, Heart, Compass } from 'lucide-react';

export default function GroundingSOSModal({ onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      num: '5',
      sense: 'La Vista',
      title: 'Cinco cosas que puedas ver',
      desc: 'Detén tu mirada a tu alrededor. Encuentra 5 detalles sutiles: la textura de una sombra, el reflejo de la luz, una planta, tus manos o un objeto cercano.',
      icon: Eye,
      accent: 'from-teal-400 to-emerald-400',
    },
    {
      num: '4',
      sense: 'El Tacto',
      title: 'Cuatro cosas que puedas tocar',
      desc: 'Conecta con la materia física: la tela de tu ropa, la firmeza del suelo bajo tus pies, la temperatura de tu mesa o tus propias manos entrelazadas.',
      icon: Hand,
      accent: 'from-emerald-400 to-teal-500',
    },
    {
      num: '3',
      sense: 'El Oído',
      title: 'Tres sonidos que puedas percibir',
      desc: 'Cierra los ojos un segundo. Escucha: el aire a tu alrededor, un sonido distante en la calle o el murmullo de tu propia respiración.',
      icon: Volume2,
      accent: 'from-amber-300 to-emerald-400',
    },
    {
      num: '2',
      sense: 'El Olfato',
      title: 'Dos aromas que puedas oler',
      desc: 'Inhala lento por tu nariz. ¿Hueles café, tu ropa limpia, crema en tus manos o el aire fresco? Si no hay olores, imagina tu aroma más reconfortante.',
      icon: Sparkles,
      accent: 'from-purple-300 to-teal-300',
    },
    {
      num: '1',
      sense: 'El Gusto',
      title: 'Un sabor en tu boca',
      desc: 'Presta atención a tu boca. Pasa saliva con calma, nota el sabor fresco de un sorbo de agua o la sensación en tu lengua.',
      icon: Heart,
      accent: 'from-rose-300 to-amber-300',
    },
  ];

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-[#061210]/95 backdrop-blur-xl z-50 flex flex-col justify-between items-center p-6 text-white overflow-hidden animate-fadeIn">
      
      {/* Cabecera Zen */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2 z-20">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-[11px] font-semibold tracking-widest text-emerald-300/80 uppercase bg-emerald-950/60 border border-emerald-500/20 px-3.5 py-1 rounded-full flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" /> Pausa de Anclaje
        </span>

        <div className="w-10" />
      </div>

      {/* Tarjeta Central Etérea */}
      <div className="w-full max-w-sm my-auto bg-gradient-to-b from-white/10 to-white/[0.03] border border-white/15 p-8 rounded-[40px] backdrop-blur-2xl flex flex-col items-center text-center shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Resplandor ambiental suave */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Número y Sentido */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#0a1b18] border border-emerald-400/30 flex items-center justify-center shadow-inner">
            <span className="text-4xl font-light tracking-tight text-white font-serif">{current.num}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#253827] text-white flex items-center justify-center shadow-lg border border-white/20">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-emerald-300/90 font-semibold block">
            {current.sense}
          </span>
          <h2 className="text-lg font-normal text-white">{current.title}</h2>
          <p className="text-xs text-stone-300 leading-relaxed font-light pt-1">
            {current.desc}
          </p>
        </div>

        {/* Indicador de 5 pasos sutil */}
        <div className="flex gap-2 w-full pt-1 justify-center">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${
                i === step 
                  ? 'w-8 bg-emerald-400 shadow-sm shadow-emerald-400/50' 
                  : i < step 
                    ? 'w-2 bg-emerald-700/60' 
                    : 'w-2 bg-white/15'
              }`}
            />
          ))}
        </div>

      </div>

      {/* Botón de Avance */}
      <div className="w-full max-w-sm pb-4 space-y-3 z-20">
        <button
          onClick={() => {
            if (isLast) {
              onClose();
            } else {
              setStep(step + 1);
            }
          }}
          className="w-full py-3.5 bg-[#436146] hover:bg-[#253827] active:scale-98 text-white rounded-2xl font-medium text-xs shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 border border-emerald-400/20"
        >
          {isLast ? (
            <>
              <Check className="w-4 h-4" /> Mi mente volvió al presente (Finalizar)
            </>
          ) : (
            'Hecho, siguiente sentido →'
          )}
        </button>

        <p className="text-[11px] text-center text-stone-400 font-light">
          Estás a salvo aquí y ahora. Respira a tu ritmo.
        </p>
      </div>

    </div>
  );
}