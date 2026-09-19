import React, { useState, useEffect } from 'react';
import PatientView from './components/PatientView';
import TherapistView from './components/TherapistView';
import AuthView from './components/AuthView';
import { supabase } from './lib/supabase';
import { LogOut } from 'lucide-react';

// ============ NORMALIZADORES (Supabase snake_case → camelCase frontend) ============
const normalizeAppointment = (apt) => {
  if (!apt) return apt;
  return {
    ...apt,
    rawDate: apt.raw_date || apt.rawDate || '',
    patientId: apt.patient_id || apt.patientId || null,
    patientName: apt.patient_name || apt.patientName || '',
    patientPhone: apt.patient_phone || apt.patientPhone || '',
  };
};

const normalizePatient = (p) => {
  if (!p) return p;
  return {
    ...p,
    firstName: p.first_name || p.firstName || '',
    paternalLastName: p.paternal_last_name || p.paternalLastName || '',
    maternalLastName: p.maternal_last_name || p.maternalLastName || '',
    emergencyContact: p.emergency_contact || p.emergencyContact || {},
    previousTherapy: p.previous_therapy || p.previousTherapy || 'No',
    therapeuticGoals: p.therapeutic_goals || p.therapeuticGoals || '',
  };
};

export default function App() {
  const THERAPIST_USER = 'nayely';
  const THERAPIST_PIN = '998877';

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nayely_auth_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState(true);

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientTasks, setPatientTasks] = useState([]);
  const [epiphanies, setEpiphanies] = useState([]);
  const [sessionTopics, setSessionTopics] = useState([]);
  const [victories, setVictories] = useState([]);
  const [rescueLetter, setRescueLetter] = useState(null);
  const [audioLibrary, setAudioLibrary] = useState([]);

  const fetchCloudData = async () => {
    try {
      const { data: pts } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
      if (pts) setPatients(pts.map(normalizePatient));

      const { data: apts } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
      if (apts) setAppointments(apts.map(normalizeAppointment));

      const { data: tsks } = await supabase.from('patient_tasks').select('*').order('created_at', { ascending: false });
      if (tsks) setPatientTasks(tsks);

      const { data: eps } = await supabase.from('epiphanies').select('*').order('created_at', { ascending: false });
      if (eps) setEpiphanies(eps);

      const { data: tops } = await supabase.from('session_topics').select('*').order('created_at', { ascending: false });
      if (tops) setSessionTopics(tops);

      const { data: vics } = await supabase.from('micro_victories').select('*').order('created_at', { ascending: false });
      if (vics) setVictories(vics);

      const { data: auds } = await supabase.from('audio_library').select('*').order('created_at', { ascending: false });
      if (auds) setAudioLibrary(auds);
    } catch (err) {
      console.error('Error al sincronizar con Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudData();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role === 'patient') {
      supabase
        .from('rescue_letters')
        .select('*')
        .eq('patient_id', currentUser.patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setRescueLetter(data[0]);
          } else {
            setRescueLetter(null);
          }
        });
    }
  }, [currentUser]);

  const handleLoginWithPin = (identifier, enteredPin) => {
    const cleanId = identifier.replace(/\D/g, '') || identifier.toLowerCase().trim();

    if (
      (cleanId === THERAPIST_USER || identifier.toLowerCase().includes('nayely')) &&
      enteredPin === THERAPIST_PIN
    ) {
      const authData = { role: 'therapist', name: 'Psic. Nayely', id: 'nayely' };
      setCurrentUser(authData);
      localStorage.setItem('nayely_auth_session', JSON.stringify(authData));
      return true;
    }

    const patientFound = patients.find(p => {
      const patientCleanPhone = p.phone?.replace(/\D/g, '') || '';
      return (patientCleanPhone === cleanId || p.email?.toLowerCase() === identifier.toLowerCase().trim()) && p.pin === enteredPin;
    });

    if (patientFound) {
      const authData = { role: 'patient', patientId: patientFound.id, name: patientFound.name };
      setCurrentUser(authData);
      localStorage.setItem('nayely_auth_session', JSON.stringify(authData));
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('nayely_auth_session');
    setCurrentUser(null);
  };

  // ================= OPERACIONES EN SUPABASE =================

  const handleSavePatient = async (newPatient) => {
    try {
      const pin = newPatient.pin || Math.floor(100000 + Math.random() * 900000).toString();
      const patientPayload = {
        first_name: newPatient.firstName,
        paternal_last_name: newPatient.paternalLastName,
        maternal_last_name: newPatient.maternalLastName,
        name: newPatient.name,
        phone: newPatient.phone,
        email: newPatient.email,
        pin: pin,
        age: newPatient.age,
        gender: newPatient.gender || 'Femenino',
        occupation: newPatient.occupation,
        status: 'active',
        emergency_contact: newPatient.emergencyContact,
        motivo: newPatient.motivo,
        medication: newPatient.medication,
        previous_therapy: newPatient.previousTherapy,
        therapeutic_goals: newPatient.therapeuticGoals,
      };

      const { data, error } = await supabase.from('patients').insert([patientPayload]).select();
      if (error) {
        console.error('Error guardando paciente:', error);
        alert(`No se pudo guardar el paciente: ${error.message}`);
        return false;
      }
      if (data && data[0]) {
        setPatients([normalizePatient(data[0]), ...patients]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      alert(`Error inesperado: ${err.message}`);
      return false;
    }
  };

  const handleUpdatePatient = async (updatedPatient) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({
          first_name: updatedPatient.firstName,
          paternal_last_name: updatedPatient.paternalLastName,
          maternal_last_name: updatedPatient.maternalLastName,
          name: updatedPatient.name,
          phone: updatedPatient.phone,
          email: updatedPatient.email,
          pin: updatedPatient.pin,
          age: updatedPatient.age,
          occupation: updatedPatient.occupation,
          status: updatedPatient.status,
          emergency_contact: updatedPatient.emergencyContact,
          motivo: updatedPatient.motivo,
          medication: updatedPatient.medication,
          therapeutic_goals: updatedPatient.therapeuticGoals,
        })
        .eq('id', updatedPatient.id);

      if (error) {
        console.error('Error actualizando paciente:', error);
        return false;
      }
      setPatients(patients.map(p => p.id === updatedPatient.id ? normalizePatient(updatedPatient) : p));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleScheduleAppointment = async (newAppointment) => {
    try {
      const payload = {
        patient_id: newAppointment.patientId,
        patient_name: newAppointment.patientName,
        patient_phone: newAppointment.patientPhone || '',
        date: newAppointment.date,
        raw_date: newAppointment.rawDate,
        time: newAppointment.time,
        modality: newAppointment.modality,
        location: newAppointment.location,
        status: 'Confirmada',
      };

      console.log('📅 Insertando cita en Supabase:', payload);

      const { data, error } = await supabase.from('appointments').insert([payload]).select();

      if (error) {
        console.error('❌ Error al agendar cita en Supabase:', error);
        alert(
          `No se pudo agendar la cita.\n\nDetalle: ${error.message}\n\n` +
          `Verifica en Supabase que la tabla "appointments" tenga las columnas:\n` +
          `patient_id, patient_name, patient_phone, date, raw_date, time, modality, location, status`
        );
        return false;
      }

      if (data && data[0]) {
        console.log('✅ Cita guardada:', data[0]);
        setAppointments([normalizeAppointment(data[0]), ...appointments]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('❌ Excepción al agendar cita:', err);
      alert(`Error inesperado al agendar: ${err.message}`);
      return false;
    }
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          date: updatedAppointment.date,
          raw_date: updatedAppointment.rawDate,
          time: updatedAppointment.time,
          modality: updatedAppointment.modality,
          location: updatedAppointment.location,
        })
        .eq('id', updatedAppointment.id);

      if (error) {
        console.error('Error al reagendar:', error);
        alert(`No se pudo reagendar: ${error.message}`);
        return false;
      }
      setAppointments(appointments.map(a => a.id === updatedAppointment.id ? normalizeAppointment(updatedAppointment) : a));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) {
        console.error('Error al eliminar:', error);
        alert(`No se pudo eliminar: ${error.message}`);
        return false;
      }
      setAppointments(appointments.filter(a => a.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleCompleteSession = async ({ appointmentId, patientId, clinicalNote, epiphanies: newEpiphanies = [], tasks: newTasks = [], date }) => {
    await supabase.from('appointments').update({ status: 'Completada' }).eq('id', appointmentId);
    setAppointments(appointments.map(a => a.id === appointmentId ? { ...a, status: 'Completada' } : a));

    await supabase.from('clinical_notes').insert([{ patient_id: patientId, date: date || 'Hoy', text: clinicalNote }]);

    if (newEpiphanies.length > 0) {
      const payloadEps = newEpiphanies.map(e => ({
        patient_id: patientId,
        insight: e.insight,
        context: e.context,
        date: e.date,
        author: 'Psic. Nayely',
      }));
      const { data: savedEps } = await supabase.from('epiphanies').insert(payloadEps).select();
      if (savedEps) setEpiphanies([...savedEps, ...epiphanies]);
    }

    if (newTasks.length > 0) {
      const payloadTasks = newTasks.map(t => ({
        patient_id: patientId,
        title: t.title,
        tag: t.tag,
        done: false,
      }));
      const { data: savedTasks } = await supabase.from('patient_tasks').insert(payloadTasks).select();
      if (savedTasks) setPatientTasks([...savedTasks, ...patientTasks]);
    }
  };

  const handleAddAudio = async (newAudio) => {
    const payload = {
      title: newAudio.title,
      category: newAudio.category,
      duration: newAudio.duration,
      author: 'Psic. Nayely',
      date: newAudio.date || 'Reciente',
    };
    const { data } = await supabase.from('audio_library').insert([payload]).select();
    if (data && data[0]) setAudioLibrary([data[0], ...audioLibrary]);
  };

  const handleAddTask = async (newTask) => {
    const payload = {
      patient_id: newTask.patientId || (currentUser?.role === 'patient' ? currentUser.patientId : null),
      title: newTask.title,
      tag: newTask.tag,
      done: false,
    };
    const { data } = await supabase.from('patient_tasks').insert([payload]).select();
    if (data && data[0]) setPatientTasks([data[0], ...patientTasks]);
  };

  const handleToggleTask = async (id) => {
    const task = patientTasks.find(t => t.id === id);
    if (!task) return;
    const newDone = !task.done;
    await supabase.from('patient_tasks').update({ done: newDone }).eq('id', id);
    setPatientTasks(patientTasks.map(t => t.id === id ? { ...t, done: newDone } : t));
  };

  const handleDeleteTask = async (id) => {
    await supabase.from('patient_tasks').delete().eq('id', id);
    setPatientTasks(patientTasks.filter(t => t.id !== id));
  };

  const handleAddSessionTopic = async (newTopic) => {
    const payload = {
      patient_id: currentUser?.patientId,
      text: newTopic.text,
      tag: newTopic.tag,
      priority: newTopic.priority,
      date: newTopic.date,
    };
    const { data } = await supabase.from('session_topics').insert([payload]).select();
    if (data && data[0]) setSessionTopics([data[0], ...sessionTopics]);
  };

  const handleDeleteSessionTopic = async (id) => {
    await supabase.from('session_topics').delete().eq('id', id);
    setSessionTopics(sessionTopics.filter(t => t.id !== id));
  };

  const handleAddEpiphany = async (newEpiphany) => {
    const payload = {
      patient_id: currentUser?.patientId,
      insight: newEpiphany.insight,
      context: newEpiphany.context,
      date: newEpiphany.date,
      author: newEpiphany.author || 'Paciente',
    };
    const { data } = await supabase.from('epiphanies').insert([payload]).select();
    if (data && data[0]) setEpiphanies([data[0], ...epiphanies]);
  };

  const handleAddVictory = async (newVictory) => {
    const payload = {
      patient_id: currentUser?.patientId,
      text: newVictory.text,
      tag: newVictory.tag,
      date: newVictory.date,
    };
    const { data } = await supabase.from('micro_victories').insert([payload]).select();
    if (data && data[0]) setVictories([data[0], ...victories]);
  };

  const handleSaveRescueLetter = async (letter) => {
    const payload = {
      patient_id: currentUser?.patientId,
      text: letter.text,
      anchors: letter.anchors,
      updated_at: letter.updatedAt,
    };
    const { data } = await supabase.from('rescue_letters').insert([payload]).select();
    if (data && data[0]) setRescueLetter(data[0]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-xs text-stone-400">
        Conectando con la clínica digital de la Psic. Nayely...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthView
        onLoginWithPin={handleLoginWithPin}
        therapistPin={THERAPIST_PIN}
      />
    );
  }

  const isTherapist = currentUser.role === 'therapist';
  const currentPatient = !isTherapist
    ? (patients.find(p => p.id === currentUser.patientId) || null)
    : null;

  const patientSpecificAppointments = currentPatient
    ? appointments.filter(a => a.patientId === currentPatient.id || a.patient_id === currentPatient.id)
    : [];
  const patientUpcomingAppointment = patientSpecificAppointments.find(a => a.status !== 'Completada');

  const patientSpecificTasks = currentPatient
    ? patientTasks.filter(t => t.patient_id === currentPatient.id || t.patientId === currentPatient.id)
    : [];

  const patientSpecificTopics = currentPatient
    ? sessionTopics.filter(s => s.patient_id === currentPatient.id || s.patientId === currentPatient.id)
    : [];

  const patientSpecificEpiphanies = currentPatient
    ? epiphanies.filter(e => e.patient_id === currentPatient.id || e.patientId === currentPatient.id)
    : [];

  const patientSpecificVictories = currentPatient
    ? victories.filter(v => v.patient_id === currentPatient.id || v.patientId === currentPatient.id)
    : [];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex justify-center selection:bg-emerald-100">
      <div className="w-full max-w-md bg-[#faf8f5] min-h-screen pb-20 relative shadow-xl border-x border-stone-200/50">

        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 border-b border-stone-200/80 flex items-center justify-between text-xs sticky top-0 z-40">
          <span className="text-[11px] text-stone-600 truncate max-w-[220px]">
            Sesión activa: <strong className="font-semibold text-stone-900">{currentUser.name}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="text-[10px] text-stone-500 hover:text-rose-600 font-medium flex items-center gap-1 bg-stone-100 hover:bg-rose-50 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3 h-3" /> Salir
          </button>
        </div>

        {!isTherapist ? (
          <PatientView
            patientName={currentUser.name}
            audioLibrary={audioLibrary}
            tasks={patientSpecificTasks}
            sessionTopics={patientSpecificTopics}
            epiphanies={patientSpecificEpiphanies}
            victories={patientSpecificVictories}
            rescueLetter={rescueLetter}
            patientStatus={currentPatient?.status || 'active'}
            onToggleTask={handleToggleTask}
            onAddSessionTopic={handleAddSessionTopic}
            onDeleteSessionTopic={handleDeleteSessionTopic}
            onAddEpiphany={handleAddEpiphany}
            onAddVictory={handleAddVictory}
            onSaveRescueLetter={handleSaveRescueLetter}
            upcomingAppointment={patientUpcomingAppointment}
          />
        ) : (
          <TherapistView
            audioLibrary={audioLibrary}
            appointments={appointments}
            patients={patients}
            tasks={patientTasks}
            sessionTopics={sessionTopics}
            epiphanies={epiphanies}
            onAddAudio={handleAddAudio}
            onAddTaskToPatient={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onAddEpiphany={handleAddEpiphany}
            onScheduleAppointment={handleScheduleAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onSavePatient={handleSavePatient}
            onUpdatePatient={handleUpdatePatient}
            onCompleteSession={handleCompleteSession}
          />
        )}

      </div>
    </div>
  );
}