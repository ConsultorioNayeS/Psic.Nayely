import React, { useState } from 'react';
import { X, Star, Plus, ArrowLeft, Trophy, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MicroVictoriesModal({ victories = [], onAddVictory, onClose }) {
  const [text, setText] = useState('');
  const [tag, setTag] = useState('Límites');

  const tags = ['Límites', 'Autocuidado', 'Emociones', 'Valentía', 'Paz'];

  const triggerSoftConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8c6d48', '#52796f', '#e0b588', '#f5ebe0']
      });
    } catch (e) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddVictory({
      id: Date.now(),
      text: text.trim(),
      tag: tag,
      date: 'Hoy'
    });

    triggerSoftConfetti();
    setText('');
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-t-[36px] sm:rounded-[36px] max-h-[88vh] flex flex-col shadow-2xl border border-amber-100 overflow-hidden text-stone-800">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-stone-200/70 flex justify-between items-center bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors mr-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Mis Avances Reales</span>
              <h3 className="text-sm font-semibold text-stone-800">Victorias Silenciosas</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-stone-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          
          <p className="text-stone-600 font-light leading-relaxed">
            En terapia, los mayores logros son invisibles para el mundo: decir que no sin culpa, salir de la cama, llorar sin juzgarte. Regístralos aquí:
          </p>

          {/* Formulario para registrar victoria */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <label className="font-semibold text-stone-700 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> ¿Qué victoria silenciosa lograste hoy?
            </label>
            <textarea
              rows="2"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ej: Hoy no pedí disculpas 5 veces cuando di mi opinión..."
              className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 text-xs resize-none"
            />

            <div className="flex justify-between items-center gap-2">
              <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
                {tags.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                      tag === t 
                        ? 'bg-amber-700 text-white shadow-xs' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-xl text-xs flex items-center gap-1 shadow-xs transition-all flex-shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Celebrar
              </button>
            </div>
          </form>

          {/* Lista de Victorias */}
          <div className="space-y-2.5">
            <span className="font-semibold text-stone-400 text-[10px] uppercase tracking-wider block px-1">
              Mis Victorias Archivadas ({victories.length})
            </span>

            {victories.map(v => (
              <div 
                key={v.id}
                className="bg-white border border-amber-100 p-3.5 rounded-2xl shadow-2xs flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-[10px] mb-0.5">
                    <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                      {v.tag}
                    </span>
                    <span className="text-stone-400">{v.date}</span>
                  </div>
                  <p className="text-xs text-stone-800 font-medium leading-relaxed">
                    {v.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}