import React from 'react';
import { ArrowLeft, Sparkles, Trophy, Heart, Calendar, CheckCircle2, Sprout } from 'lucide-react';

export default function InnerGardenModal({ 
  tasksCount = 0, 
  victoriesCount = 0, 
  sessionsCount = 1,
  onClose 
}) {
  const growthStage = Math.min(5, Math.floor((tasksCount + victoriesCount + sessionsCount) / 2) + 1);

  return (
  <div className="fixed inset-0 bg-[#081512]/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn select-none">
    <div className="w-full max-w-md bg-[#faf8f5] rounded-[32px] sm:rounded-[36px] max-h-[90vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden text-stone-800">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-stone-200/70 flex justify-between items-center bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors tap-bounce mr-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#335236] block">
                Metáfora de Transformación
              </span>
              <h3 className="text-base font-serif text-stone-900">Mi Jardín Interior</h3>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 text-[#2a422d] font-semibold px-2.5 py-1 rounded-full border border-emerald-200/70 flex items-center gap-1">
            <Sprout className="w-3 h-3 text-emerald-600" /> Nivel {growthStage} de Florecimiento
          </span>
        </div>

        {/* Contenido del Santuario */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-center no-scrollbar">
          
          <p className="text-stone-600 font-light leading-relaxed max-w-xs mx-auto">
            Cada sesión atendida, cada respiración y cada victoria silenciosa nutren tu árbol interior junto a la Psic. Nayely.
          </p>

          {/* ILUSTRACIÓN BOTÁNICA DEL ÁRBOL DINÁMICO */}
          <div className="relative w-64 h-64 mx-auto bg-gradient-to-b from-emerald-50/70 via-white to-stone-50 rounded-full border border-emerald-200/70 flex items-center justify-center p-4 shadow-ambient">
            
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Raíces y Suelo Fértil */}
              <ellipse cx="100" cy="180" rx="64" ry="11" fill="#e7decfa0" />
              <path d="M93 180 Q100 160 100 140 Q100 160 107 180" stroke="#6d5438" strokeWidth="4.5" fill="none" strokeLinecap="round" />

              {/* Tronco Central */}
              <path d="M100 170 C97 130 94 110 100 90" stroke="#7a5c3e" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M98 120 Q78 105 68 95" stroke="#7a5c3e" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M102 110 Q122 95 132 85" stroke="#7a5c3e" strokeWidth="4.5" strokeLinecap="round" fill="none" />

              {/* Follaje Expansivo (Crece con los ejercicios) */}
              <circle cx="100" cy="72" r={26 + growthStage * 5} fill="#335236" opacity="0.88" />
              <circle cx="74" cy="84" r={21 + growthStage * 4} fill="#4e7e52" opacity="0.82" />
              <circle cx="126" cy="78" r={23 + growthStage * 4} fill="#2a422d" opacity="0.88" />
              <circle cx="100" cy="52" r={19 + growthStage * 3} fill="#6f9e71" opacity="0.8" />

              {/* Flores en Pan de Oro (Nacen con cada Victoria Silenciosa) */}
              {victoriesCount > 0 && (
                <>
                  <circle cx="84" cy="68" r="4.5" fill="#f59e0b" />
                  <circle cx="116" cy="64" r="4.5" fill="#fbbf24" />
                  <circle cx="100" cy="88" r="5" fill="#f59e0b" />
                </>
              )}
              {victoriesCount > 2 && (
                <>
                  <circle cx="68" cy="94" r="4" fill="#fbbf24" />
                  <circle cx="132" cy="84" r="4" fill="#fbbf24" />
                  <circle cx="100" cy="40" r="4" fill="#f59e0b" />
                </>
              )}
            </svg>

            {/* Espora de luz ambiente */}
            <div className="absolute top-5 right-8 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
          </div>

          {/* Estadísticas de Arraigo en Cerámica Marfil */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 text-left">
            <div className="glass-panel p-3.5 rounded-2xl border border-stone-200/80 shadow-ambient">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Sesiones:</span>
              <span className="text-base font-serif font-semibold text-stone-900 block mt-0.5">{sessionsCount}</span>
              <span className="text-[9px] text-[#335236] font-medium">Nutren el tronco</span>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-stone-200/80 shadow-ambient">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Ejercicios:</span>
              <span className="text-base font-serif font-semibold text-stone-900 block mt-0.5">{tasksCount}</span>
              <span className="text-[9px] text-emerald-700 font-medium">Brotan hojas</span>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-stone-200/80 shadow-ambient">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Victorias:</span>
              <span className="text-base font-serif font-semibold text-stone-900 block mt-0.5">{victoriesCount}</span>
              <span className="text-[9px] text-amber-700 font-medium">Flores de oro</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}