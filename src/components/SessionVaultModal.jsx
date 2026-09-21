import React, { useState } from 'react';
import { X, Inbox, Plus, Trash2, ArrowLeft, Check } from 'lucide-react';

export default function SessionVaultModal({ topics = [], onAddTopic, onDeleteTopic, onClose }) {
  const [newTopic, setNewTopic] = useState('');
  const [selectedTag, setSelectedTag] = useState('Emocional');
  const [isPriority, setIsPriority] = useState(false);

  const tags = ['Emocional', 'Trabajo', 'Familia', 'Pareja', 'Ansiedad', 'Sueño'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    onAddTopic({
      id: Date.now(),
      text: newTopic.trim(),
      tag: selectedTag,
      priority: isPriority,
      date: 'Anotado hoy'
    });

    setNewTopic('');
    setIsPriority(false);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/65 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-sm glass-panel rounded-[36px] sm:rounded-[40px] max-h-[88vh] flex flex-col shadow-2xl border border-stone-200/80 overflow-hidden text-stone-800">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-stone-200/70 flex justify-between items-center bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors tap-bounce mr-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#335236] block">
                Entre Sesiones
              </span>
              <h3 className="text-base font-serif text-stone-900">Buzón para Nayely</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-400 tap-bounce cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs no-scrollbar">
          
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 text-stone-700 leading-relaxed font-light">
            No cargues todo en tu mente durante la semana. Anota aquí lo que detone tu malestar; Nayely lo verá en su pantalla en tu próxima sesión.
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-3xl border border-stone-200/80 shadow-ambient">
            <label className="font-semibold text-stone-700 block text-[11px] uppercase tracking-wider">
              ¿Qué tema quieres tratar con Nayely?
            </label>
            <textarea
              rows="2"
              required
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Ej: Sentí angustia cuando mi jefe me llamó la atención frente al equipo..."
              className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-[#335236]/30 text-stone-800 text-xs resize-none font-light"
            />

            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all tap-bounce cursor-pointer ${
                    selectedTag === tag 
                      ? 'bg-[#2a422d] text-white shadow-xs' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-1.5 text-stone-600 cursor-pointer text-[11px]">
                <input 
                  type="checkbox"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="rounded text-[#2a422d] focus:ring-[#2a422d] accent-[#2a422d]"
                />
                <span>Tema prioritario</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-xl font-medium flex items-center gap-1 shadow-sm transition-all text-xs tap-bounce cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Depositar
              </button>
            </div>
          </form>

          {/* Lista de Temas */}
          <div className="space-y-2.5">
            <span className="font-semibold text-stone-400 text-[10px] uppercase tracking-wider block px-1">
              Temas guardados ({topics.length})
            </span>

            {topics.length === 0 ? (
              <div className="text-center py-6 text-stone-400 bg-white/60 rounded-2xl border border-dashed border-stone-200 font-light">
                Tu buzón está vacío. Cuando ocurra algo en tu semana, anótalo aquí.
              </div>
            ) : (
              topics.map(t => (
                <div 
                  key={t.id} 
                  className={`p-3.5 rounded-2xl border transition-all flex justify-between items-start gap-3 ${
                    t.priority 
                      ? 'bg-amber-50/70 border-amber-300 shadow-sm' 
                      : 'bg-white border-stone-200/80 shadow-ambient'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.2 rounded-full font-medium">
                        {t.tag}
                      </span>
                      {t.priority && (
                        <span className="text-[9px] bg-amber-100 text-[#7a5522] px-2 py-0.2 rounded-full font-bold">
                          Prioritario
                        </span>
                      )}
                      <span className="text-[10px] text-stone-400 font-mono">{t.date}</span>
                    </div>
                    <p className="text-stone-800 text-xs leading-relaxed font-light">{t.text}</p>
                  </div>

                  <button 
                    onClick={() => onDeleteTopic(t.id)}
                    className="text-stone-300 hover:text-rose-500 transition-colors p-1 tap-bounce cursor-pointer"
                    title="Eliminar tema"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}