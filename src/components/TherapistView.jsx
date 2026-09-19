import React, { useState } from 'react';
import { 
  ShieldCheck, Plus, ChevronRight, Music, Users, Calendar, 
  Clock, MapPin, MessageCircle, Edit3, UserPlus, Search, 
  Headphones, Play, Pause, CheckCircle2 
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
  onAddAudio, 
  onAddTaskToPatient,
  onDeleteTask,
  onToggleTask,
  onAddEpiphany,
  onScheduleAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  onSavePatient,
  onUpdatePatient, // <-- RECIBE FUNCIÓN DE ACTUALIZAR PACIENTE
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
    const patient = patients.find(p => p.id === apt.patientId);
    const rawPhone = apt.patientPhone || patient?.phone || '';
    const firstName = patient?.firstName || apt.patientFirstName || apt.patientName.split(' ')[0];

    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '52' + cleanPhone;

    const locationText = apt.modality === 'Presencial' 
      ? `en el consultorio: *${apt.location}*` 
      : `vía *${apt.location}*`;

    const text = `Hola ${firstName}, te saluda la Psic. Nayely para recordarte nuestra sesión terapéutica programada para el *${apt.date}* a las *${apt.time}* ${locationText}. Nos vemos pronto para continuar con tu proceso.`;
    const encoded = encodeURIComponent(text);

    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encoded}` 
      : `https://wa.me/?text=${encoded}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      
      {/* Cabecera Oficial */}
      <header className="p-5 border-b border-stone-200/80 bg-white flex justify-between items-center sticky top-11 z-30 shadow-xs">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-[#436146] uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Panel Clínico Privado
          </span>
          <h1 className="text-lg font-light text-stone-800">
            Psic. <span className="font-semibold text-stone-900">Nayely</span>
          </h1>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-[#436146] text-white flex items-center justify-center text-xs font-semibold shadow-sm">
          NY
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
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

        {/* PESTAÑA 2: EXPEDIENTES GENERALES */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-semibold text-stone-800">Expedientes Clínicos</h2>
                <p className="text-xs text-stone-400">Historial completo y antecedentes</p>
              </div>
              <button
                onClick={() => setShowNewPatientModal(true)}
                className="px-3.5 py-2 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Nuevo Paciente
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Buscar en el archivero por nombre o motivo..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            <div className="space-y-2.5 pt-1">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs bg-white rounded-3xl border border-dashed border-stone-200">
                  No se encontraron expedientes.
                </div>
              ) : (
                filteredPatients.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-stone-800 group-hover:text-[#436146] transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-md font-medium">
                          {p.age} años
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{p.motivo}</p>
                      <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
                        📞 {p.phone || 'Sin número'}
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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-semibold text-stone-800">Mi Fonoteca</h2>
                <p className="text-xs text-stone-400">{audioLibrary.length} meditaciones publicadas</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-3.5 py-2 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Subir Audio
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['Todos', 'Ansiedad', 'Insomnio', 'Autoestima', 'Respiración'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setAudioFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    audioFilter === cat
                      ? 'bg-[#436146] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
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
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-sm' 
                        : 'bg-white border-stone-200/80 shadow-sm hover:border-emerald-500/30'
                    }`}
                  >
                    <button
                      onClick={() => setPlayingAudioId(isPlaying ? null : audio.id)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 cursor-pointer ${
                        isPlaying ? 'bg-emerald-600 text-white shadow-md' : 'bg-[#436146] text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-semibold text-stone-800 truncate">{audio.title}</h4>
                        <span className="text-[10px] text-stone-400 font-mono ml-2">{audio.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-stone-100 px-2 py-0.5 rounded-full text-stone-500 font-medium">
                          {audio.category}
                        </span>
                        <span className="text-[10px] text-stone-400">
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

      {/* BARRA INFERIOR */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-6 py-2.5 flex justify-between items-center z-40 shadow-lg">
        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeTab === 'agenda' ? 'text-[#436146] scale-105' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'agenda' ? 'bg-emerald-50' : ''}`}>
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold">Agenda</span>
        </button>

        <button
          onClick={() => setActiveTab('patients')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeTab === 'patients' ? 'text-[#436146] scale-105' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'patients' ? 'bg-emerald-50' : ''}`}>
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold">Archivero</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
            activeTab === 'audio' ? 'text-[#436146] scale-105' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'audio' ? 'bg-emerald-50' : ''}`}>
            <Headphones className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold">Fonoteca</span>
        </button>
      </nav>

      {/* MODAL RADIOGRAFÍA PRE-SESIÓN */}
      {preSessionAppointment && (
        <PreSessionBriefingModal
          appointment={preSessionAppointment}
          patient={patients.find(p => p.id === preSessionAppointment.patientId) || patients[0]}
          sessionTopics={sessionTopics}
          tasks={tasks}
          onClose={() => setPreSessionAppointment(null)}
          onStartSession={(apt) => {
            setPreSessionAppointment(null);
            setCheckoutAppointment(apt);
          }}
        />
      )}

      {/* MODAL CIERRE DE SESIÓN */}
      {checkoutAppointment && (
        <SessionCheckoutModal
          appointment={checkoutAppointment}
          onClose={() => setCheckoutAppointment(null)}
          onCompleteSession={onCompleteSession}
        />
      )}

      {/* MODAL FICHA CLÍNICA MAESTRA */}
      {selectedPatient && (
        <PatientRecordModal 
          patient={selectedPatient} 
          tasks={tasks}
          sessionTopics={sessionTopics}
          epiphanies={epiphanies}
          onClose={() => setSelectedPatient(null)} 
          onAddTask={onAddTaskToPatient}
          onDeleteTask={onDeleteTask}
          onToggleTask={onToggleTask}
          onAddEpiphany={onAddEpiphany}
          onUpdatePatient={(updated) => {
            if (onUpdatePatient) onUpdatePatient(updated);
            setSelectedPatient(updated); // Actualiza la vista inmediata
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