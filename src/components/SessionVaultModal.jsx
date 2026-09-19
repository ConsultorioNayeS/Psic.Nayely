import React, { useState } from 'react';
import { X, Inbox, Plus, CheckCircle2, AlertCircle, Trash2, ArrowLeft } from 'lucide-react';

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
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[88vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Entre Sesiones</span>
              <h3 className="text-sm font-semibold text-stone-800">Buzón para mi Sesión con Nayely</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-400 text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Mensaje de Contención */}
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 text-stone-700 leading-relaxed font-light">
            No cargues todo en tu mente durante la semana. Anota aquí lo que detone tu ansiedad o quieras explorar; Nayely lo tendrá en su pantalla en tu próxima sesión.
          </div>

          {/* Formulario para Depositar Tema */}
          <form onSubmit={handleSubmit} className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
            <label className="font-semibold text-stone-700 block text-[11px] uppercase tracking-wider">
              ¿Qué tema quieres tratar con Nayely?
            </label>
            <textarea
              rows="2"
              required
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Ej: Sentí mucha angustia cuando mi jefe me llamó la atención frente al equipo..."
              className="w-full p-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 text-xs resize-none"
            />

            {/* Categorías */}
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                    selectedTag === tag 
                      ? 'bg-amber-700 text-white shadow-sm' 
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Prioridad */}
            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-1.5 text-stone-600 cursor-pointer text-[11px]">
                <input 
                  type="checkbox"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="rounded text-amber-700 focus:ring-amber-500 accent-amber-700"
                />
                <span>Marcar como tema prioritario</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-medium flex items-center gap-1 shadow-sm transition-all text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Depositar
              </button>
            </div>
          </form>

          {/* Lista de Temas Preparados */}
          <div className="space-y-2.5">
            <span className="font-semibold text-stone-400 text-[10px] uppercase tracking-wider block">
              Temas guardados para tu próxima cita ({topics.length})
            </span>

            {topics.length === 0 ? (
              <div className="text-center py-6 text-stone-400 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                Tu buzón está vacío. Cuando ocurra algo en tu semana, anótalo aquí.
              </div>
            ) : (
              topics.map(t => (
                <div 
                  key={t.id} 
                  className={`p-3.5 rounded-2xl border transition-all flex justify-between items-start gap-3 ${
                    t.priority 
                      ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/40' 
                      : 'bg-white border-stone-200/80 shadow-sm'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                        {t.tag}
                      </span>
                      {t.priority && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          Prioritario
                        </span>
                      )}
                      <span className="text-[10px] text-stone-400">{t.date}</span>
                    </div>
                    <p className="text-stone-800 leading-relaxed text-xs">{t.text}</p>
                  </div>

                  <button 
                    onClick={() => onDeleteTopic(t.id)}
                    className="text-stone-300 hover:text-rose-500 transition-colors p-1"
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