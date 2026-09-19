import React, { useState } from 'react';
import { ArrowLeft, Headphones, Play, Pause, Sparkles } from 'lucide-react';

export default function AudioLibraryModal({ audioLibrary = [], onClose }) {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  const categories = ['Todos', 'Ansiedad', 'Insomnio', 'Autoestima', 'Respiración'];

  const filteredAudios = selectedFilter === 'Todos' 
    ? audioLibrary 
    : audioLibrary.filter(a => a.category === selectedFilter);

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fadeIn select-none">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Rincón Sonoro</span>
              <h2 className="text-base font-semibold text-stone-800 leading-tight">Voz de Nayely</h2>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-50 text-[#436146] font-medium px-2.5 py-1 rounded-full border border-emerald-100">
            {filteredAudios.length} audios
          </span>
        </div>

        {/* Barra de Filtros por Categoría */}
        <div className="px-5 py-3 border-b border-stone-100 bg-white">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedFilter === cat
                    ? 'bg-[#436146] text-white shadow-sm scale-105'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Audios con Scroll */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filteredAudios.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              No hay audios en esta categoría por el momento.
            </div>
          ) : (
            filteredAudios.map(audio => {
              const isPlaying = currentPlayingId === audio.id;
              return (
                <div 
                  key={audio.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                    isPlaying 
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-sm ring-1 ring-emerald-400/30' 
                      : 'bg-stone-50/80 border-stone-200/70 hover:border-emerald-500/40 hover:bg-white'
                  }`}
                >
                  <button
                    onClick={() => setCurrentPlayingId(isPlaying ? null : audio.id)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform active:scale-95 ${
                      isPlaying 
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                        : 'bg-[#436146] text-white hover:bg-[#253827]'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-semibold text-stone-800 truncate">{audio.title}</h4>
                      <span className="text-[10px] text-stone-400 font-mono ml-2">{audio.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded-full text-stone-500">
                        {audio.category}
                      </span>
                      {isPlaying && (
                        <span className="text-[10px] text-emerald-700 font-medium animate-pulse flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Reproduciendo...
                        </span>
                      )}
                    </div>

                    {/* Barra de progreso interactiva al reproducir */}
                    {isPlaying && (
                      <div className="mt-2.5 h-1.5 bg-emerald-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full w-1/3 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pie informativo */}
        <div className="p-3 text-center bg-stone-50 border-t border-stone-100 text-[11px] text-stone-400">
          Usa audífonos para una experiencia de relajación óptima.
        </div>

      </div>
    </div>
  );
}