import React, { useState } from 'react';
import { 
  Calendar, Wind, Heart, ChevronRight, CheckCircle2, 
  Sun, Smile, Meh, AlertCircle, Frown, Headphones, 
  Sparkles, Inbox, BookOpen, Compass, Droplets, Trophy, Feather,
  Home, Flower2, Bookmark, Play
} from 'lucide-react';
import BreathingModal from './BreathingModal';
import GroundingSOSModal from './GroundingSOSModal';
import MoodCheckInModal from './MoodCheckInModal';
import AudioLibraryModal from './AudioLibraryModal';
import SessionVaultModal from './SessionVaultModal';
import EpiphanyVaultModal from './EpiphanyVaultModal';
import OracleDeckModal from './OracleDeckModal';
import ThoughtDissolverModal from './ThoughtDissolverModal';
import MicroVictoriesModal from './MicroVictoriesModal';
import SelfRescueMirrorModal from './SelfRescueMirrorModal';
import HapticHeartPacerModal from './HapticHeartPacerModal';
import InnerGardenModal from './InnerGardenModal';

export default function PatientView({ 
  currentPatient, 
  audioLibrary = [], 
  tasks = [], 
  sessionTopics = [], 
  epiphanies = [], 
  victories = [], 
  rescueLetter = null, 
  moodCheckIns = [],
  completedSessionsCount = 0, // <-- REPARADO: Recibe el número real de sesiones asistidas
  onSaveMoodCheckIn,
  patientStatus = 'active',
  onToggleTask, 
  onAddSessionTopic, 
  onDeleteSessionTopic, 
  onAddEpiphany, 
  onAddVictory, 
  onSaveRescueLetter, 
  upcomingAppointment 
}) {
  const [patientTab, setPatientTab] = useState('today');

  // Modales
  const [showBreathing, setShowBreathing] = useState(false);
  const [showAudios, setShowAudios] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [showSessionVault, setShowSessionVault] = useState(false);
  const [showEpiphanies, setShowEpiphanies] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [showDissolver, setShowDissolver] = useState(false);
  const [showVictories, setShowVictories] = useState(false);
  const [showRescueMirror, setShowRescueMirror] = useState(false);
  const [rescueModalMode, setRescueModalMode] = useState('read');
  const [showHapticPacer, setShowHapticPacer] = useState(false);
  const [showGarden, setShowGarden] = useState(false);
  const [activeMoodModal, setActiveMoodModal] = useState(null);
  const [showRescueBanner, setShowRescueBanner] = useState(false);

  const patientDisplayName = currentPatient?.firstName || currentPatient?.name?.split(' ')[0] || 'Paciente';
  const patientInitial = patientDisplayName.charAt(0).toUpperCase();

  // El registro más reciente proviene EXCLUSIVAMENTE de los datos reales del paciente
  const recentCheckIn = moodCheckIns.length > 0 ? moodCheckIns[0] : null;

  const moods = [
    { label: 'Radiante', icon: Sun, color: 'text-amber-600 bg-amber-50/80 border-amber-200' },
    { label: 'En Paz', icon: Smile, color: 'text-emerald-700 bg-emerald-50/80 border-emerald-200' },
    { label: 'Neutral', icon: Meh, color: 'text-stone-600 bg-stone-50/80 border-stone-200' },
    { label: 'Abrumado', icon: AlertCircle, color: 'text-rose-600 bg-rose-50/80 border-rose-200' },
    { label: 'Triste', icon: Frown, color: 'text-sky-600 bg-sky-50/80 border-sky-200' },
  ];

  const latestEpiphany = epiphanies[0]?.insight || "Descansar antes del agotamiento no es rendirse, es cuidarme.";

  const handleSaveMoodCheckIn = (entry) => {
    if (onSaveMoodCheckIn) {
      onSaveMoodCheckIn(entry);
    }
    if ((entry.mood === 'Abrumado' || entry.mood === 'Triste') && rescueLetter) {
      setShowRescueBanner(true);
    }
  };

  if (patientStatus === 'suspended') {
    return (
      <div className="p-8 min-h-screen flex flex-col justify-center items-center text-center space-y-5 animate-fadeIn select-none bg-[#faf8f5]">
        <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-xs">
          <h2 className="text-xl font-serif text-stone-800">Ciclo Terapéutico Concluido</h2>
          <p className="text-xs text-stone-500 font-light leading-relaxed">
            Tu proceso en este espacio ha sido cerrado con gratitud. Puedes contactar a la Psicóloga Nayely cuando lo desees.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-28 select-none bg-[#faf8f5] overflow-x-hidden">
      
      {/* Cabecera Zen */}
      <header className="px-6 pt-6 pb-4 flex justify-between items-start sticky top-0 z-30 bg-[#faf8f5]/80 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4e7e52] block">
            {patientStatus === 'graduated' ? 'Cofre de Vida • Graduado' : 'Santuario de Calma'}
          </span>
          <h1 className="text-2xl font-serif text-stone-900 tracking-tight mt-0.5">
            Hola, <span className="italic font-normal text-[#2a422d]">{patientDisplayName}</span>
          </h1>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200/80 flex items-center justify-center text-[#2a422d] font-serif text-sm shadow-sm">
          {patientInitial}
        </div>
      </header>

      {/* Banner de Rescate en Días Grises */}
      {showRescueBanner && rescueLetter && (
        <div className="mx-6 mt-2 glass-panel border border-amber-300/80 rounded-3xl p-4 shadow-ambient flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100/80 text-[#996f30] flex items-center justify-center flex-shrink-0">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-800">Un recordatorio para este día...</h4>
              <p className="text-[11px] text-stone-500 font-light">Tu yo en paz te dejó una carta de rescate.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowRescueBanner(false);
              setRescueModalMode('read');
              setShowRescueMirror(true);
            }}
            className="px-3 py-1.5 bg-[#996f30] text-white rounded-xl text-[11px] font-medium tap-bounce cursor-pointer shadow-xs"
          >
            Abrir
          </button>
        </div>
      )}

      {/* =========================================================================
          PESTAÑA 1: «HOY»
         ========================================================================= */}
      {patientTab === 'today' && (
        <main className="px-6 py-4 space-y-7 flex-1 animate-fadeIn">
          
          {/* ORBE DE PRESENCIA VIVA */}
          <div className="relative flex flex-col items-center justify-center pt-2 pb-4 text-center">
            <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-emerald-100/60 via-teal-50/50 to-transparent blur-2xl animate-breathe-aurora pointer-events-none" />

            <button
              onClick={() => setShowBreathing(true)}
              className="relative z-10 w-44 h-44 rounded-full bg-white/85 backdrop-blur-xl border border-white/90 shadow-luxe flex flex-col items-center justify-center group tap-bounce cursor-pointer transition-all duration-500 hover:scale-105"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#335236] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                <Wind className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                Pausa Consciente
              </span>
              <span className="text-[10px] text-stone-400 font-light mt-0.5 flex items-center gap-1">
                <Play className="w-2.5 h-2.5 fill-current" /> Toca para respirar
              </span>
            </button>

            <p className="text-xs font-serif italic text-stone-500 mt-4 max-w-xs leading-relaxed">
              “Inhala serenidad, exhala lo que no puedes controlar hoy.”
            </p>
          </div>

          {/* Próxima Sesión con Nayely */}
          {patientStatus !== 'graduated' && upcomingAppointment && (
            <div className="relative rounded-3xl p-5 bg-white/80 border border-stone-200/80 shadow-ambient space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#4e7e52]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Próximo Encuentro
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#2a422d] border border-emerald-200/60">
                  {upcomingAppointment.modality}
                </span>
              </div>

              <div className="pt-1">
                <h3 className="text-base font-serif text-stone-900">
                  {upcomingAppointment.date}
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Horario reservado: <strong className="text-stone-700 font-medium">{upcomingAppointment.time}</strong>
                </p>
              </div>
            </div>
          )}

          {/* ¿Cómo late tu corazón hoy? (100% REAL) */}
          <section className="space-y-3 pt-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-serif italic text-stone-700">
                ¿Cómo late tu corazón en este instante?
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
                {recentCheckIn ? 'Registrado' : 'Pendiente'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {moods.map((m, idx) => {
                const Icon = m.icon;
                const isSelected = recentCheckIn?.mood === m.label;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveMoodModal(m)}
                    className={`py-3 px-1 rounded-2xl border transition-all flex flex-col items-center justify-center tap-bounce cursor-pointer ${
                      isSelected 
                        ? `${m.color} shadow-sm scale-105 font-semibold` 
                        : 'bg-white/70 border-stone-200/70 text-stone-400 hover:bg-white hover:text-stone-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-[10px]">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Si no hay check-in aún, muestra instrucción honesta. Si existe, muestra los datos genuinos */}
            {recentCheckIn ? (
              <div className="mt-2 pt-2.5 border-t border-stone-100 text-xs bg-stone-50/60 p-3 rounded-2xl">
                <div className="flex justify-between items-center text-[10px] text-stone-400 mb-1">
                  <span>Último registro real:</span>
                  <span className="font-semibold text-[#4e7e52]">
                    {recentCheckIn.created_at ? new Date(recentCheckIn.created_at).toLocaleDateString('es-MX', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : 'Hoy'}
                  </span>
                </div>
                {recentCheckIn.note && (
                  <p className="text-[11px] text-stone-600 italic font-serif">“{recentCheckIn.note}”</p>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 font-light text-center pt-1 italic">
                Aún no has registrado tu pulso emocional. Toca una opción arriba cuando lo desees.
              </p>
            )}
          </section>

          {/* Tareas de la Semana */}
          <section className="space-y-2.5 pt-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-serif text-stone-700">
                Ejercicios de autorregulación
              </span>
              <span className="text-[10px] font-medium text-[#4e7e52]">
                {tasks.filter(t => t.done).length} de {tasks.length}
              </span>
            </div>

            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="p-5 text-center text-xs text-stone-400 bg-white/60 rounded-2xl border border-dashed border-stone-200 font-light">
                  Todo al día. No hay pendientes por ahora.
                </div>
              ) : (
                tasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => onToggleTask && onToggleTask(task.id)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer tap-bounce ${
                      task.done 
                        ? 'bg-stone-100/40 border-stone-200/60 text-stone-400 line-through' 
                        : 'bg-white border-stone-200/80 text-stone-800 shadow-ambient'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ${
                      task.done ? 'text-emerald-600' : 'text-stone-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium block leading-snug">{task.title}</span>
                      <span className="inline-block mt-1 text-[9px] px-2 py-0.2 rounded-full bg-stone-100 text-stone-500 no-underline">
                        {task.tag}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </main>
      )}

      {/* PESTAÑAS RESTANTES: SANTUARIO Y MI PROCESO */}
      {patientTab === 'sanctuary' && (
        <main className="px-6 py-4 space-y-4 flex-1 animate-fadeIn">
          <div 
            onClick={() => setShowOracle(true)}
            className="rounded-3xl p-5 bg-gradient-to-r from-[#fcfbf9] to-[#f6f1e8] border border-amber-200/80 shadow-ambient flex items-center justify-between cursor-pointer tap-bounce group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100/80 text-[#996f30] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#996f30] block">
                  Reflexión de Hoy
                </span>
                <h4 className="text-xs font-semibold text-stone-800">Baraja de Autocompasión</h4>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Toca para descubrir tu mensaje</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setShowBreathing(true)}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-ambient flex flex-col justify-between cursor-pointer tap-bounce hover:border-emerald-300 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#335236] flex items-center justify-center mb-3">
                <Wind className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-800">Respiración 4-7-8</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Cuencos tibetanos</p>
              </div>
            </div>

            <div 
              onClick={() => setShowHapticPacer(true)}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-ambient flex flex-col justify-between cursor-pointer tap-bounce hover:border-rose-300 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 fill-rose-100" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-800">Marcapasos Calma</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Sincroniza tu pulso a 60</p>
              </div>
            </div>

            <div 
              onClick={() => setShowDissolver(true)}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-ambient flex flex-col justify-between cursor-pointer tap-bounce hover:border-teal-300 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-800">Soltar Pensamiento</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Defusión en agua</p>
              </div>
            </div>

            <div 
              onClick={() => setShowGarden(true)}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-ambient flex flex-col justify-between cursor-pointer tap-bounce hover:border-emerald-300 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#335236] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-800">Jardín Interior</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Florece con tu avance</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setShowAudios(true)}
            className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-ambient flex items-center justify-between cursor-pointer tap-bounce group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-800">Rincón Sonoro de Nayely</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">{audioLibrary.length} meditaciones y guías de voz</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </main>
      )}

      {patientTab === 'journal' && (
        <main className="px-6 py-4 space-y-4 flex-1 animate-fadeIn">
          <div 
            onClick={() => setShowEpiphanies(true)}
            className="rounded-3xl p-5 bg-gradient-to-br from-[#fbf9f5] to-[#f4ede3] border border-[#e5dcce] shadow-ambient cursor-pointer tap-bounce"
          >
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#7a5522] mb-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Cuaderno de Sabiduría
              </span>
              <span className="bg-white/80 border border-stone-200 px-2 py-0.5 rounded-full text-stone-600">
                {epiphanies.length} aprendizajes
              </span>
            </div>
            <p className="text-xs font-serif italic text-stone-800 leading-relaxed">
              “{latestEpiphany}”
            </p>
          </div>

          <div 
            onClick={() => {
              setRescueModalMode(rescueLetter ? 'read' : 'write');
              setShowRescueMirror(true);
            }}
            className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-ambient flex items-center justify-between cursor-pointer tap-bounce"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100/70 text-[#7a5522] flex items-center justify-center flex-shrink-0">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-stone-800">Espejo de Auto-Rescate</h4>
                  <span className="text-[9px] bg-amber-100 text-[#7a5522] font-semibold px-2 py-0.2 rounded-full">
                    {rescueLetter ? 'Carta guardada' : 'Escribir'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Mensaje de tu yo en calma para días nublados</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>

          <div 
            onClick={() => setShowVictories(true)}
            className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-ambient flex items-center justify-between cursor-pointer tap-bounce"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-800">Mis Victorias Silenciosas</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">{victories.length} logros invisibles para el mundo</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>

          {patientStatus !== 'graduated' && (
            <div 
              onClick={() => setShowSessionVault(true)}
              className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-ambient flex items-center justify-between cursor-pointer tap-bounce"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center flex-shrink-0">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-800">Buzón para mi Sesión</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">Temas que deseas tratar con Nayely</p>
                </div>
              </div>
              <span className="text-[10px] bg-stone-100 text-stone-700 font-medium px-2.5 py-0.5 rounded-full">
                {sessionTopics.length} notas
              </span>
            </div>
          )}
        </main>
      )}

      {/* Cápsula Flotante de Anclaje SOS */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setShowSOS(true)}
          className="glass-panel text-stone-800 hover:text-stone-900 px-4 py-2 rounded-full shadow-luxe flex items-center gap-2.5 text-xs font-medium tracking-wide tap-bounce cursor-pointer border border-white/80"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <Compass className="w-3.5 h-3.5 text-[#335236]" />
          <span>Pausa de Anclaje • 5-4-3-2-1</span>
        </button>
      </div>

      {/* Barra de Navegación Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-panel border-t border-white/70 px-8 py-3 flex justify-between items-center z-40 shadow-ambient">
        <button
          onClick={() => setPatientTab('today')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer tap-bounce ${
            patientTab === 'today' ? 'text-[#2a422d] font-semibold scale-105' : 'text-stone-400 hover:text-stone-600 font-normal'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Hoy</span>
        </button>

        <button
          onClick={() => setPatientTab('sanctuary')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer tap-bounce ${
            patientTab === 'sanctuary' ? 'text-[#2a422d] font-semibold scale-105' : 'text-stone-400 hover:text-stone-600 font-normal'
          }`}
        >
          <Flower2 className="w-5 h-5" />
          <span className="text-[10px]">Santuario</span>
        </button>

        <button
          onClick={() => setPatientTab('journal')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer tap-bounce ${
            patientTab === 'journal' ? 'text-[#2a422d] font-semibold scale-105' : 'text-stone-400 hover:text-stone-600 font-normal'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px]">Mi Proceso</span>
        </button>
      </nav>

      {/* Modales */}
      {showBreathing && <BreathingModal onClose={() => setShowBreathing(false)} />}
      {showAudios && <AudioLibraryModal audioLibrary={audioLibrary} onClose={() => setShowAudios(false)} />}
      {showSOS && <GroundingSOSModal onClose={() => setShowSOS(false)} />}
      {showSessionVault && (
        <SessionVaultModal 
          topics={sessionTopics} 
          onAddTopic={onAddSessionTopic}
          onDeleteTopic={onDeleteSessionTopic}
          onClose={() => setShowSessionVault(false)} 
        />
      )}
      {showEpiphanies && (
        <EpiphanyVaultModal 
          epiphanies={epiphanies}
          onAddEpiphany={onAddEpiphany}
          onClose={() => setShowEpiphanies(false)} 
        />
      )}
      {showOracle && <OracleDeckModal onClose={() => setShowOracle(false)} />}
      {showDissolver && <ThoughtDissolverModal onClose={() => setShowDissolver(false)} />}
      {showVictories && (
        <MicroVictoriesModal 
          victories={victories}
          onAddVictory={onAddVictory}
          onClose={() => setShowVictories(false)} 
        />
      )}
      {showRescueMirror && (
        <SelfRescueMirrorModal
          rescueLetter={rescueLetter}
          initialMode={rescueModalMode}
          onSaveLetter={onSaveRescueLetter}
          onClose={() => setShowRescueMirror(false)} 
        />
      )}
      {showHapticPacer && <HapticHeartPacerModal onClose={() => setShowHapticPacer(false)} />}
      {showGarden && (
    <InnerGardenModal 
      tasksCount={tasks.filter(t => t.done).length} 
      victoriesCount={victories.length} 
      sessionsCount={completedSessionsCount} // <-- REPARADO: Conteo dinámico real
      onClose={() => setShowGarden(false)} 
    />
  )}
      {activeMoodModal && (
        <MoodCheckInModal 
          mood={activeMoodModal} 
          onClose={() => setActiveMoodModal(null)}
          onSave={handleSaveMoodCheckIn} 
        />
      )}

    </div>
  );
}