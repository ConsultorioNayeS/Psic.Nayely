import React, { useState } from 'react';
import { 
  X, Calendar, Clock, Video, UserCheck, Check, 
  MessageCircle, Phone, Copy, CheckCheck 
} from 'lucide-react';

export default function NewAppointmentModal({ patients = [], onClose, onSchedule }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || 1);
  const todayRaw = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayRaw);
  const [time, setTime] = useState('17:00');
  const [modality, setModality] = useState('Presencial');
  const [openWhatsAppDirectly, setOpenWhatsAppDirectly] = useState(true);
  const [copied, setCopied] = useState(false);

  const currentPatient = patients.find(p => p.id === Number(selectedPatientId)) || patients[0] || {
    id: 1,
    name: 'Paciente',
    firstName: 'Paciente',
    phone: ''
  };

  const formatPhoneForWhatsApp = (rawPhone) => {
    if (!rawPhone) return '';
    let cleaned = rawPhone.replace(/\D/g, '');
    if (cleaned.length === 10) cleaned = '52' + cleaned;
    return cleaned;
  };

  const buildWhatsAppMessage = (formattedDate, formattedTime, firstName) => {
    const leaf = '\u{1F33F}';
    const heart = '\u{1F90D}';
    const cal = '\u{1F5D3}\u{FE0F}';
    const clock = '\u{23F0}';
    const pin = '\u{1F4CD}';
    const sparkles = '\u{2728}';
    const dove = '\u{1F54A}\u{FE0F}';

    return `${leaf} *Psicóloga Nayely | Espacio Terapéutico* ${heart}\n\nHola *${firstName}*, te escribo para confirmar nuestra próxima sesión programada:\n\n${cal} *Fecha:* ${formattedDate}\n${clock} *Horario:* ${formattedTime}\n${pin} *Modalidad:* ${modality}\n\n━━━━━━━━━━━━━━━━━━━━\n*¿Nos confirmas tu asistencia?*\nPor favor respóndeme con un *SÍ* a este mensaje para apartar tu lugar, o indícame con la palabra *CAMBIO* si necesitas ajustar el día u horario.\n━━━━━━━━━━━━━━━━━━━━\n\n${sparkles} _Tu espacio y tiempo están reservados especialmente para ti. ¡Nos vemos pronto!_ ${dove}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dateObj = new Date(date + 'T00:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = dateObj.toLocaleDateString('es-MX', options);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hourNum + 11) % 12 + 1) + ':' + minutes + ' ' + ampm;

    const firstName = currentPatient.firstName || currentPatient.name.split(' ')[0];

    onSchedule({
      id: Date.now(),
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientFirstName: firstName,
      patientPhone: currentPatient.phone,
      date: capitalizedDate,
      rawDate: date,
      time: formattedHour,
      modality: modality,
      location: modality,
      status: 'Confirmada'
    });

    if (openWhatsAppDirectly && currentPatient.phone) {
      const cleanPhone = formatPhoneForWhatsApp(currentPatient.phone);
      const message = buildWhatsAppMessage(capitalizedDate, formattedHour, firstName);
      const directUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
      window.open(directUrl, '_blank');
    }

    onClose();
  };

  const handleCopyMessage = () => {
    const dateObj = new Date(date + 'T00:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = dateObj.toLocaleDateString('es-MX', options);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hourNum + 11) % 12 + 1) + ':' + minutes + ' ' + ampm;
    const firstName = currentPatient.firstName || currentPatient.name.split(' ')[0];

    const message = buildWhatsAppMessage(capitalizedDate, formattedHour, firstName);
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/65 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-sm glass-panel rounded-[36px] p-6 space-y-5 shadow-2xl border border-stone-200/80">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#335236] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#335236] block">Agenda Clínica</span>
              <h3 className="text-base font-serif text-stone-900">Programar Cita</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-500 text-xs transition-colors tap-bounce cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-stone-700">Paciente:</label>
              <span className="text-[11px] text-[#4e7e52] font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3" /> {currentPatient?.phone || 'Sin teléfono'}
              </span>
            </div>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full p-3 rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#335236]/30 text-stone-800 font-medium cursor-pointer"
            >
              {patients.length === 0 ? (
                <option value="1">No hay pacientes registrados</option>
              ) : (
                patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" /> Fecha:
              </label>
              <input 
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#335236]/30 text-stone-800 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" /> Hora:
              </label>
              <input 
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#335236]/30 text-stone-800 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700 block">Modalidad de Sesión:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setModality('Presencial')}
                className={`p-2.5 rounded-2xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all tap-bounce cursor-pointer ${
                  modality === 'Presencial'
                    ? 'bg-[#2a422d] text-white border-[#2a422d] shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Presencial
              </button>

              <button
                type="button"
                onClick={() => setModality('En línea')}
                className={`p-2.5 rounded-2xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all tap-bounce cursor-pointer ${
                  modality === 'En línea'
                    ? 'bg-[#2a422d] text-white border-[#2a422d] shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> En línea
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 cursor-pointer">
              <input 
                type="checkbox" 
                checked={openWhatsAppDirectly}
                onChange={(e) => setOpenWhatsAppDirectly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-[#2a422d]"
              />
              <span className="text-[11px] text-stone-700 flex items-center gap-1.5 font-medium">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> 
                Abrir WhatsApp con confirmación al guardar
              </span>
            </label>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="w-full text-center text-[10px] text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 py-1 transition-colors tap-bounce cursor-pointer"
            >
              {copied ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> ¡Texto de WhatsApp copiado al portapapeles!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copiar texto de confirmación manualmente
                </span>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-2xl font-medium shadow-luxe transition-all flex items-center justify-center gap-1.5 pt-3 tap-bounce cursor-pointer"
          >
            <Check className="w-4 h-4" /> Agendar y Notificar al Paciente
          </button>
        </form>

      </div>
    </div>
  );
}