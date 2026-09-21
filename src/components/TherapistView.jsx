import React, { useState } from 'react';
import { 
  ShieldCheck, Plus, ChevronRight, Users, Calendar, 
  UserPlus, Search, Headphones, Play, Pause 
} from 'lucide-react';
import PatientRecordModal from './PatientRecordModal';
import UploadAudioModal from './UploadAudioModal';
import NewAppointmentModal from './NewAppointmentModal';
import EditAppointmentModal from './EditAppointmentModal';
import NewPatientModal from './NewPatientModal';
import VisualAgendaView from './VisualAgendaView';
import SessionCheckoutModal from './SessionCheckoutModal';
import PreSessionBriefingModal from './PreSessionBriefingModal';

export default function TherapistView({ 
  audioLibrary = [], 
  appointments = [], 
  patients = [],
  tasks = [],
  sessionTopics = [],
  epiphanies = [],
  moodCheckIns = [],
  clinicalNotes = [],
  onAddClinicalNote,
  onAddAudio, 
  onAddTaskToPatient,
  onDeleteTask,
  onToggleTask,
  onAddEpiphany,
  onScheduleAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  onSavePatient,
  onUpdatePatient,
  onDeletePatient,
  onCompleteSession
}) {
  const [activeTab, setActiveTab] = useState('agenda');

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [checkoutAppointment, setCheckoutAppointment] = useState(null);
  const [preSessionAppointment, setPreSessionAppointment] = useState(null);

  const [patientSearch, setPatientSearch] = useState('');
  const [audioFilter, setAudioFilter] = useState('Todos');
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    (p.motivo && p.motivo.toLowerCase().includes(patientSearch.toLowerCase()))
  );

  const filteredAudios = audioFilter === 'Todos'
    ? audioLibrary
    : audioLibrary.filter(a => a.category === audioFilter);

  const handleSendWhatsAppReminder = (apt) => {
    const patient = patients.find(p => p.id === apt.patientId || p.id === apt.patient_id);
    const rawPhone = apt.patientPhone || apt.patient_phone || patient?.phone || '';
    const firstName = patient?.firstName || apt.patientFirstName || apt.patientName.split(' ')[0];

    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '52' + cleanPhone;

    const leaf = '\u{1F33F}';
    const heart = '\u{1F90D}';
    const cal = '\u{1F5D3}\u{FE0F}';
    const clock = '\u{23F0}';
    const pin = '\u{1F4CD}';
    const sparkles = '\u{2728}';
    const dove = '\u{1F54A}\u{FE0F}';

    const text = `${leaf} *Psicóloga Nayely | Espacio Terapéutico* ${heart}\n\nHola *${firstName}*, paso a recordarte con mucho cariño nuestra sesión de hoy:\n\n${cal} *Fecha:* ${apt.date}\n${clock} *Horario:* ${apt.time}\n${pin} *Modalidad:* ${apt.modality}\n\nPor favor respóndeme con un *SÍ* para confirmar que nos vemos, o avísame si surge algún imprevisto.\n\n${sparkles} _Nos vemos muy pronto para continuar cuidando de tu bienestar._ ${dove}`;

    const waUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen pb-28 select-none bg-[#faf8f5]">
      
      {/* Cabecera */}
      <header className="px-6 py-4 glass-panel border-b border-white/70 sticky top-0 z-30 flex justify-between items-center shadow-ambient">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#335236] uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-700" /> Consultorio Clínico Privado
          </span>
          <h1 className="text-xl font-serif text-stone-900 tracking-tight">
            Psicóloga <span className="italic font-normal text-[#2a422d]">Nayely</span>
          </h1>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-[#2a422d] text-white flex items-center justify-center font-serif text-xs font-semibold shadow-sm">
          NY
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="p-5 space-y-5 flex-1 animate-fadeIn">
        
        {/* PESTAÑA 1: AGENDA */}
        {activeTab === 'agenda' && (
          <VisualAgendaView 
            appointments={appointments}
            onEditAppointment={(apt) => setEditingAppointment(apt)}
            onSendWhatsApp={handleSendWhatsAppReminder}
            onOpenNewAppointment={() => setShowAppointmentModal(true)}
            onOpenCheckout={(apt) => setCheckoutAppointment(apt)}
            onOpenPreSession={(apt) => setPreSessionAppointment(apt)}
          />
        )}

        {/* PESTAÑA 2: ARCHIVERO DE PACIENTES */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <div>
                <h2 className="text-lg font-serif text-stone-900">Expedientes Clínicos</h2>
                <p className="text-xs text-stone-400 font-light">{patients.length} expedientes activos bajo resguardo</p>
              </div>
              <button
                onClick={() => setShowNewPatientModal(true)}
                className="px-3.5 py-2 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-2xl text-xs font-medium flex items-center gap-1.5 shadow-luxe tap-bounce transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> Nuevo Paciente
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Buscar por nombre, motivo o antecedente..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200/80 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#335236]/30 shadow-ambient"
              />
            </div>

            <div className="space-y-2.5 pt-1">
              {filteredPatients.length === 0 ? (
                <div className="glass-panel text-center py-10 text-stone-400 text-xs rounded-3xl border border-dashed border-stone-200">
                  No se encontraron expedientes con ese término.
                </div>
              ) : (
                filteredPatients.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className="glass-panel p-4 rounded-3xl border border-stone-200/80 shadow-ambient hover:shadow-luxe hover:border-[#335236]/40 transition-all cursor-pointer flex justify-between items-center group tap-bounce"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 group-hover:text-[#2a422d] transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                          {p.age} años
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-1 font-light">{p.motivo}</p>
                      <span className="text-[10px] text-[#4e7e52] font-semibold mt-1 block">
                        📞 {p.phone || 'Sin número asignado'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 3: FONOTECA */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <div>
                <h2 className="text-lg font-serif text-stone-900">Estudio de Voz y Fonoteca</h2>
                <p className="text-xs text-stone-400 font-light">{audioLibrary.length} meditaciones publicadas</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-3.5 py-2 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-2xl text-xs font-medium flex items-center gap-1.5 shadow-luxe tap-bounce transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Subir Audio
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {['Todos', 'Ansiedad', 'Insomnio', 'Autoestima', 'Respiración'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setAudioFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all tap-bounce cursor-pointer ${
                    audioFilter === cat
                      ? 'bg-[#2a422d] text-white shadow-sm'
                      : 'glass-panel text-stone-600 hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2.5 pt-1">
              {filteredAudios.map(audio => {
                const isPlaying = playingAudioId === audio.id;
                return (
                  <div 
                    key={audio.id}
                    className={`p-4 rounded-3xl border transition-all flex items-center gap-3.5 ${
                      isPlaying 
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-sm' 
                        : 'glass-panel border-stone-200/80 shadow-ambient'
                    }`}
                  >
                    <button
                      onClick={() => setPlayingAudioId(isPlaying ? null : audio.id)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform tap-bounce cursor-pointer ${
                        isPlaying ? 'bg-emerald-600 text-white shadow-glow-sage' : 'bg-[#2a422d] text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-semibold text-stone-900 truncate">{audio.title}</h4>
                        <span className="text-[10px] text-stone-400 font-mono ml-2">{audio.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-stone-100 px-2 py-0.5 rounded-full text-stone-600 font-medium">
                          {audio.category}
                        </span>
                        <span className="text-[10px] text-stone-400 font-light">
                          {audio.date}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Barra de Navegación */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-panel border-t border-white/80 px-8 py-3 flex justify-between items-center z-40 shadow-ambient">
        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center gap-1 transition-all tap-bounce cursor-pointer ${
            activeTab === 'agenda' ? 'text-[#2a422d] font-semibold scale-105' : 'text-stone-400 hover:text-stone-600 font-normal'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Agenda</span>
        </button>

        <button
          onClick={() => setActiveTab('patients')}
          className={`flex flex-col items-center gap-1 transition-all tap-bounce cursor-pointer ${
            activeTab === 'patients' ? 'text-[#2a422d] font-semibold scale-105' : 'text-stone-400 hover:text-stone-600 font-normal'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Archivero</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex flex-col items-center gap-1 transition-all tap-bounce cursor-pointer ${
            activeTab === 'audio' ? 'text-[#2a422d] font-semibold scale-105' : 'text-stone-400 hover:text-stone-600 font-normal'
          }`}
        >
          <Headphones className="w-5 h-5" />
          <span className="text-[10px]">Fonoteca</span>
        </button>
      </nav>

      {/* Modales Clínicos */}
      {preSessionAppointment && (
        <PreSessionBriefingModal
          appointment={preSessionAppointment}
          patient={patients.find(p => p.id === (preSessionAppointment.patientId || preSessionAppointment.patient_id)) || patients[0]}
          sessionTopics={sessionTopics.filter(s => s.patient_id === (preSessionAppointment.patientId || preSessionAppointment.patient_id))}
          tasks={tasks.filter(t => t.patient_id === (preSessionAppointment.patientId || preSessionAppointment.patient_id))}
          moodCheckIns={moodCheckIns.filter(m => m.patient_id === (preSessionAppointment.patientId || preSessionAppointment.patient_id))}
          onClose={() => setPreSessionAppointment(null)}
          onStartSession={(apt) => {
            setPreSessionAppointment(null);
            setCheckoutAppointment(apt);
          }}
        />
      )}

      {checkoutAppointment && (
        <SessionCheckoutModal
          appointment={checkoutAppointment}
          onClose={() => setCheckoutAppointment(null)}
          onCompleteSession={onCompleteSession}
        />
      )}

      {selectedPatient && (
        <PatientRecordModal 
          patient={selectedPatient} 
          tasks={tasks.filter(t => t.patient_id === selectedPatient.id)}
          sessionTopics={sessionTopics.filter(s => s.patient_id === selectedPatient.id)}
          epiphanies={epiphanies.filter(e => e.patient_id === selectedPatient.id)}
          clinicalNotes={clinicalNotes.filter(n => n.patient_id === selectedPatient.id)} // REPARADO: Notas reales pasadas al expediente
          completedSessionsCount={appointments.filter(a => (a.patient_id === selectedPatient.id || a.patientId === selectedPatient.id) && a.status === 'Completada').length}
          onAddClinicalNote={onAddClinicalNote}
          onClose={() => setSelectedPatient(null)} 
          onAddTask={onAddTaskToPatient}
          onDeleteTask={onDeleteTask}
          onToggleTask={onToggleTask}
          onAddEpiphany={onAddEpiphany}
          onUpdatePatient={(updated) => {
            if (onUpdatePatient) onUpdatePatient(updated);
            setSelectedPatient(updated);
          }}
          onDeletePatient={(id) => {
            if (onDeletePatient) onDeletePatient(id);
            setSelectedPatient(null);
          }}
        />
      )}

      {showUploadModal && (
        <UploadAudioModal 
          onClose={() => setShowUploadModal(false)}
          onUpload={onAddAudio}
        />
      )}

      {showAppointmentModal && (
        <NewAppointmentModal 
          patients={patients}
          onClose={() => setShowAppointmentModal(false)}
          onSchedule={onScheduleAppointment}
        />
      )}

      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onUpdate={onUpdateAppointment}
          onDelete={onDeleteAppointment}
        />
      )}

      {showNewPatientModal && (
        <NewPatientModal
          onClose={() => setShowNewPatientModal(false)}
          onSavePatient={onSavePatient}
        />
      )}

    </div>
  );
}