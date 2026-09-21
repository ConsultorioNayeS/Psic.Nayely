import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';

export default function MoodCheckInModal({ mood, onClose, onSave }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState('');

  const availableTags = [
    'Trabajo', 'Familia', 'Pareja', 'Insomnio', 
    'Salud', 'Sobrecarga', 'Finanzas', 'Tiempo a solas'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    onSave({
      mood: mood.label,
      tags: selectedTags,
      note: note.trim(),
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    onClose();
  };

  const Icon = mood.icon;

  return (
  <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
    <div className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[36px] p-6 space-y-5 shadow-2xl border border-stone-200">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${mood.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Check-in Emocional</span>
              <h3 className="text-base font-semibold text-stone-800">
                Te sientes: <span className="text-[#436146]">{mood.label}</span>
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-400 text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Disparadores / Contexto */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-600 block">
            ¿Qué influyó principalmente en cómo te sientes?
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected 
                      ? 'bg-[#436146] text-white shadow-sm scale-105' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nota Breve opcional */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-600 block">
            Nota de desahogo <span className="text-stone-400 font-normal">(opcional)</span>:
          </label>
          <textarea
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="¿Qué pensamiento ronda por tu cabeza en este momento?"
            className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800 text-xs resize-none"
          />
        </div>

        {/* Botón Guardar */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Guardar en mi espacio seguro
        </button>

      </div>
    </div>
  );
}