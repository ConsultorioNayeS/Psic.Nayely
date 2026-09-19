import React, { useState } from 'react';
import {
  Calendar, Wind, Heart, ChevronRight, CheckCircle2,
  Sun, Smile, Meh, AlertCircle, Frown, Headphones,
  Sparkles, Inbox, BookOpen, Compass, Droplets, Trophy, Feather
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

export default function PatientView({
  patientName = 'Paciente', // ⭐ NOMBRE DINÁMICO
  audioLibrary = [],
  tasks = [],
  sessionTopics = [],
  epiphanies = [],
  victories = [],
  rescueLetter = null,
  patientStatus = 'active',
  onToggleTask,
  onAddSessionTopic,
  onDeleteSessionTopic,
  onAddEpiphany,
  onAddVictory,
  onSaveRescueLetter,
  upcomingAppointment
}) {
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
  const [activeMoodModal, setActiveMoodModal] = useState(null);

  const [showRescueBanner, setShowRescueBanner] = useState(false);

  const [recentCheckIn, setRecentCheckIn] = useState({
    mood: 'En Paz',
    tags: ['Sueño reparador', 'Tiempo a solas'],
    note: 'Dormí 8 horas completas y salí a caminar.',
    date: 'Hoy, 8:30 AM'
  });

  const moods = [
    { label: 'Radiante', icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { label: 'En Paz', icon: Smile, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { label: 'Neutral', icon: Meh, color: 'text-stone-500 bg-stone-50 border-stone-200' },
    { label: 'Abrumado', icon: AlertCircle, color: 'text-rose-500 bg-rose-50 border-rose-200' },
    { label: 'Triste', icon: Frown, color: 'text-sky-500 bg-sky-50 border-sky-200' },
  ];

  // ⭐ NOMBRE Y AVATAR DINÁMICOS
  const firstName = patientName ? patientName.split(' ')[0] : 'Paciente';
  const patientInitials = patientName
    ? patientName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'PA';

  const latestEpiphany = epiphanies[0]?.insight || "Aprender a decir 'no' a los demás cuando estoy cansada es decirme 'sí' a mí misma.";

  const handleSaveMoodCheckIn = (entry) => {
    setRecentCheckIn(entry);
    if ((entry.mood === 'Abrumado' || entry.mood === 'Triste') && rescueLetter) {
      setShowRescueBanner(true);
    }
  };

  if (patientStatus === 'suspended') {
    return (
      <div className="p-8 min-h-screen flex flex-col justify-center items-center text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-xs">
          <h2 className="text-lg font-medium text-stone-800">Ciclo Terapéutico Concluido</h2>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            Tu proceso en este espacio privado ha sido cerrado. Si deseas reanudar tus sesiones con la Psic. Nayely, puedes contactarla directamente:
          </p>
        </div>
        <a
          href="https://wa.me/5215512345678?text=Hola%20Psic.%20Nayely,%20me%20gustar%C3%ADa%20retomar%20mis%20sesiones"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 bg-[#436146] text-white rounded-2xl text-xs font-medium shadow-md"
        >
          Contactar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-28">

      {/* 1. Saludo Cálido (AHORA DINÁMICO) */}
      <header className="flex justify-between items-start pt-2">
        <div>
          <span className="text-xs font-semibold tracking-wider text-[#436146] uppercase">
            {patientStatus === 'graduated' ? 'Cofre de Vida • Alta Terapéutica' : 'Espacio Seguro'}
          </span>
          <h1 className="text-2xl font-light tracking-tight text-stone-800">
            Hola, <span className="font-medium text-[#253827]">{firstName}</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {patientStatus === 'graduated'
              ? 'Has concluido tu proceso con éxito. Este espacio es tu santuario permanente.'
              : 'Respira profundo, este momento es para ti.'}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-500/20 flex items-center justify-center text-[#253827] font-medium text-xs">
          {patientInitials}
        </div>
      </header>

      {showRescueBanner && rescueLetter && (
        <div className="bg-gradient-to-r from-amber-50 to-[#faf5ee] border-2 border-amber-300/80 rounded-3xl p-4 shadow-md flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#8c6d48] flex items-center justify-center flex-shrink-0">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-800">Noto que hoy es un día nublado...</h4>
              <p className="text-[11px] text-stone-600">Tu yo en paz te dejó una carta de rescate para este momento.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowRescueBanner(false);
              setRescueModalMode('read');
              setShowRescueMirror(true);
            }}
            className="px-3 py-1.5 bg-[#8c6d48] hover:bg-[#735838] text-white rounded-xl text-[11px] font-semibold whitespace-nowrap cursor-pointer shadow-2xs"
          >
            Leer carta
          </button>
        </div>
      )}

      {/* 2. Baraja Diaria */}
      <div
        onClick={() => setShowOracle(true)}
        className="bg-gradient-to-r from-amber-50 to-[#faf5ee] border border-amber-200/80 rounded-3xl p-4 shadow-xs cursor-pointer hover:border-amber-400 transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-[#8c6d48] flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-800">Baraja de Autocompasión</span>
              <span className="text-[9px] bg-amber-200/60 text-amber-900 font-bold px-1.5 py-0.2 rounded-md">Diaria</span>
            </div>
            <p className="text-[11px] text-stone-500">Toca para descubrir tu reflexión de hoy con la Psic. Nayely</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
      </div>

      {/* 3. Próxima Cita */}
      {patientStatus !== 'graduated' && (
        <div className="bg-gradient-to-br from-[#436146] to-[#253827] text-white rounded-3xl p-5 shadow-lg shadow-emerald-950/10">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Próxima sesión con la Psic. Nayely</span>
          </div>
          <h3 className="text-lg font-medium">
            {upcomingAppointment ? upcomingAppointment.date : 'Sin cita programada'}
          </h3>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            {upcomingAppointment
              ? `${upcomingAppointment.time} • ${upcomingAppointment.location}`
              : 'Tu terapeuta te asignará tu próximo horario'}
          </p>
        </div>
      )}

      {/* 4. Santuario Terapéutico */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block px-1">
          Santuario Terapéutico
        </span>

        <div
          onClick={() => {
            setRescueModalMode(rescueLetter ? 'read' : 'write');
            setShowRescueMirror(true);
          }}
          className="bg-gradient-to-br from-[#fcfbf9] to-[#f5efe6] border border-[#e8ded0] rounded-3xl p-4 shadow-xs cursor-pointer hover:border-[#8c6d48]/60 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/70 text-[#8c6d48] flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-semibold text-stone-800">Espejo de Auto-Rescate</h4>
                <span className="text-[9px] bg-amber-200/50 text-[#8c6d48] font-bold px-2 py-0.2 rounded-full">
                  {rescueLetter ? 'Carta lista' : 'Escribir carta'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {rescueLetter
                  ? 'Palabras de tu yo en paz para cuando llegue la tormenta'
                  : 'Escríbele unas palabras a tu yo del futuro en tus días claros'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => setShowDissolver(true)}
            className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs cursor-pointer hover:border-teal-400 transition-all flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2">
              <Droplets className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-800">Soltar Pensamiento</h4>
              <p className="text-[10px] text-stone-400 mt-0.5">Defusión en el Agua</p>
            </div>
          </div>

          <div
            onClick={() => setShowVictories(true)}
            className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs cursor-pointer hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-800">Mis Victorias</h4>
              <p className="text-[10px] text-stone-400 mt-0.5">{victories.length} logros silenciosos</p>
            </div>
          </div>
        </div>

        {patientStatus !== 'graduated' && (
          <div
            onClick={() => setShowSessionVault(true)}
            className="bg-white border border-stone-200/80 rounded-2xl p-3.5 shadow-xs cursor-pointer hover:border-amber-400 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-stone-800">Buzón para mi Sesión</h4>
                <p className="text-[10px] text-stone-400">Guarda temas de tu semana para consulta</p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
              {sessionTopics.length} listos
            </span>
          </div>
        )}
      </div>

      {/* 5. Recursos de Bienestar */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          onClick={() => setShowBreathing(true)}
          className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs cursor-pointer hover:border-teal-500/50 transition-all flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 mb-2">
            <Wind className="w-5 h-5 text-teal-600 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-stone-800">Agua Serena 4-7-8</h4>
            <p className="text-[10px] text-stone-400 mt-0.5">Ondas y cuencos</p>
          </div>
        </div>

        <div
          onClick={() => setShowAudios(true)}
          className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs cursor-pointer hover:border-purple-400/50 transition-all flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mb-2">
            <Headphones className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-stone-800">Rincón Sonoro</h4>
            <p className="text-[10px] text-stone-400 mt-0.5">{audioLibrary.length} audios de Nayely</p>
          </div>
        </div>
      </div>

      {/* 6. Cuaderno de Sabiduría */}
      <div
        onClick={() => setShowEpiphanies(true)}
        className="bg-gradient-to-br from-[#fcfbf9] to-[#f5efe6] rounded-3xl p-5 border border-[#e8ded0] shadow-xs cursor-pointer hover:border-[#8c6d48]/50 transition-all group"
      >
        <div className="flex justify-between items-center text-[10px] text-[#8c6d48] font-bold uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#8c6d48]" /> Cuaderno de Sabiduría
          </span>
          <span className="bg-white/80 border border-[#e8ded0] px-2 py-0.5 rounded-full text-stone-500 font-medium">
            {epiphanies.length} notas
          </span>
        </div>
        <p className="text-xs font-serif italic text-stone-800 leading-relaxed">
          “{latestEpiphany}”
        </p>
      </div>

      {/* 7. Check-in Emocional */}
      <section className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-stone-800 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            ¿Cómo late tu corazón hoy?
          </h3>
          <span className="text-[10px] text-stone-400">Toca para registrar</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {moods.map((m, idx) => {
            const Icon = m.icon;
            const isSelected = recentCheckIn?.mood === m.label;
            return (
              <button
                key={idx}
                onClick={() => setActiveMoodModal(m)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-2xl border transition-all ${
                  isSelected
                    ? `${m.color} border-current shadow-xs scale-105 font-medium`
                    : 'border-stone-100 bg-stone-50/50 text-stone-400 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] leading-tight">{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 8. Tareas Asignadas */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Propuestas de la Psic. Nayely
          </h3>
          <span className="text-xs text-[#436146] font-medium">
            {tasks.filter(t => t.done).length} de {tasks.length} listas
          </span>
        </div>

        <div className="space-y-2.5">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => onToggleTask && onToggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                task.done
                  ? 'bg-stone-100/60 border-stone-200 text-stone-400 line-through'
                  : 'bg-white border-stone-200/80 text-stone-800 shadow-xs hover:border-emerald-500/30'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                task.done ? 'text-emerald-600' : 'text-stone-300'
              }`} />
              <div className="flex-1">
                <span className="text-xs font-medium block leading-snug">{task.title}</span>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 font-normal no-underline">
                  {task.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pausa de Anclaje Flotante */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowSOS(true)}
          className="bg-[#253827]/90 hover:bg-[#1a291c] active:scale-95 text-stone-200 px-4 py-2.5 rounded-full shadow-xl shadow-stone-900/25 flex items-center gap-2.5 text-xs font-medium tracking-wide transition-all border border-white/15 backdrop-blur-md cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <Compass className="w-3.5 h-3.5 text-emerald-300" />
          <span>Pausa de Anclaje • 5-4-3-2-1</span>
        </button>
      </div>

      {/* MODALES */}
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
    patientName={patientName}
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