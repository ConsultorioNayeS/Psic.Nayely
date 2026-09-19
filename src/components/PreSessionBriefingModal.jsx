import React from 'react';
import { 
  X, Wind, Headphones, Heart, Inbox, CheckCircle2, 
  AlertTriangle, Sparkles, ArrowRight, Sun, Smile, Meh, AlertCircle, Frown 
} from 'lucide-react';

export default function PreSessionBriefingModal({ 
  appointment, 
  patient, 
  sessionTopics = [], 
  tasks = [],
  onClose,
  onStartSession
}) {
  // Configuración unificada exacta de "Cómo late tu corazón hoy"
  const moodStyles = {
    'Radiante': { icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    'En Paz': { icon: Smile, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    'Neutral': { icon: Meh, color: 'text-stone-500 bg-stone-50 border-stone-200' },
    'Abrumado': { icon: AlertCircle, color: 'text-rose-500 bg-rose-50 border-rose-200' },
    'Triste': { icon: Frown, color: 'text-sky-500 bg-sky-50 border-sky-200' },
  };

  // Historial emocional de la semana
  const moodHistory = [
    { day: 'Lun', mood: 'Neutral', tag: 'Cansancio laboral', note: 'Día largo en oficina sin pausas.' },
    { day: 'Mar', mood: 'Abrumado', tag: 'Presión / Juntas', note: 'Junta difícil con directores, sentí opresión en el pecho.', alert: true },
    { day: 'Mié', mood: 'En Paz', tag: 'Sueño reparador', note: 'Dormí mejor aplicando la técnica de respiración 4-7-8.' },
    { day: 'Hoy', mood: 'En Paz', tag: 'Autocuidado', note: 'Lista para mi consulta con la Psic. Nayely.' }
  ];

  const telemetry = {
    sosActivations: 1,
    sosLastDate: 'Martes, 11:20 PM',
    breathingSessions: 4,
    audiosListened: 2
  };

  const completedTasks = tasks.filter(t => t.done).length;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-[36px] p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200/70">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Radiografía Pre-Sesión (3 min)
            </span>
            <h3 className="text-base font-semibold text-stone-900 mt-1">
              Preparación: {appointment.patientName}
            </h3>
            <p className="text-[11px] text-stone-400">Consulta de las {appointment.time} • Psic. Nayely</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 text-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido del Briefing */}
        <div className="p-1 overflow-y-auto space-y-4 flex-1 text-xs pt-3">
          
          {/* 1. Alerta si activó la pausa de anclaje */}
          {telemetry.sosActivations > 0 && (
            <div className="bg-amber-50/90 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Evento de Activación Fisiológica
                </span>
                <p className="text-stone-800 text-[11px] leading-relaxed mt-0.5 font-medium">
                  Activó la <strong>Pausa de Anclaje 5-4-3-2-1</strong> el <strong>{telemetry.sosLastDate}</strong>.
                </p>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  Recomendación: Explorar qué detonó la crisis nocturna del martes.
                </span>
              </div>
            </div>
          )}

          {/* 2. Telemetría de autorregulación */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs text-center">
              <Wind className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-base font-bold text-stone-800 block">{telemetry.breathingSessions}</span>
              <span className="text-[10px] text-stone-400 block">Respiraciones 4-7-8</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs text-center">
              <Headphones className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <span className="text-base font-bold text-stone-800 block">{telemetry.audiosListened}</span>
              <span className="text-[10px] text-stone-400 block">Audios escuchados</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs text-center">
              <CheckCircle2 className="w-4 h-4 text-[#436146] mx-auto mb-1" />
              <span className="text-base font-bold text-stone-800 block">{completedTasks}/{tasks.length}</span>
              <span className="text-[10px] text-stone-400 block">Tareas realizadas</span>
            </div>
          </div>

          {/* 3. HISTORIAL DE "¿CÓMO LATE TU CORAZÓN HOY?" (CON LOS MISMOS ÍCONOS EXACTOS) */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs space-y-2.5">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
              <Heart className="w-4 h-4 text-rose-500" /> Registro Emocional de la Semana (Corazón):
            </span>

            <div className="space-y-2">
              {moodHistory.map((entry, idx) => {
                const style = moodStyles[entry.mood] || moodStyles['Neutral'];
                const MoodIcon = style.icon;

                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                      entry.alert 
                        ? 'bg-rose-50/50 border-rose-200' 
                        : 'bg-stone-50/50 border-stone-200/70'
                    }`}
                  >
                    {/* El mismo avatar con ícono y color exacto de la pestaña del paciente */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${style.color}`}>
                      <MoodIcon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center text-[10px] mb-0.5">
                        <span className="font-bold text-stone-800">{entry.day} • {entry.mood}</span>
                        <span className="bg-white border border-stone-200 text-stone-600 px-2 py-0.2 rounded-full font-medium">
                          {entry.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 italic">
                        “{entry.note}”
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Temas que el paciente preparó en su buzón */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs space-y-2">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-xs">
  <Inbox className="w-4 h-4 text-amber-700" /> Temas que {patient?.firstName || patient?.name?.split(' ')[0] || 'el paciente'} depositó para hoy:
</span>

            {sessionTopics.length === 0 ? (
              <p className="text-stone-400 text-[11px] italic">No hay temas en su buzón.</p>
            ) : (
              <div className="space-y-1.5 pt-1">
                {sessionTopics.map(topic => (
                  <div 
                    key={topic.id}
                    className={`p-2.5 rounded-xl border text-[11px] ${
                      topic.priority 
                        ? 'bg-amber-50/70 border-amber-300 font-medium text-stone-900' 
                        : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] mb-0.5">
                      <span className="bg-white border border-stone-200 px-1.5 py-0.2 rounded font-semibold text-stone-600">
                        {topic.tag}
                      </span>
                      {topic.priority && <span className="text-amber-800 font-bold">★ Prioritario</span>}
                    </div>
                    {topic.text}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Botón de Entrada */}
        <div className="pt-3 border-t border-stone-200/70">
          <button
            onClick={() => {
              onClose();
              onStartSession(appointment);
            }}
            className="w-full py-3 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Iniciar Consulta con esta Información <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}