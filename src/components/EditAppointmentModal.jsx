import React, { useState } from 'react';
import { X, Calendar, Clock, Video, UserCheck, Trash2, Check, MessageCircle } from 'lucide-react';

export default function EditAppointmentModal({ appointment, onClose, onUpdate, onDelete }) {
  const todayRaw = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(appointment.rawDate || appointment.raw_date || todayRaw);
  const [time, setTime] = useState('17:00');
  const [modality, setModality] = useState(appointment.modality || 'Presencial');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    const dateObj = new Date(date + 'T00:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = dateObj.toLocaleDateString('es-MX', options);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hourNum + 11) % 12 + 1) + ':' + minutes + ' ' + ampm;

    onUpdate({
      ...appointment,
      rawDate: date,
      raw_date: date,
      date: capitalizedDate,
      time: formattedHour,
      modality: modality,
      location: modality
    });

    onClose();
  };

  const handleNotifyRescheduleWhatsApp = () => {
    const firstName = appointment.patientFirstName || appointment.patientName.split(' ')[0];
    const text = `🌿 *Hola ${firstName}*, te saluda la *Psic. Nayely* 🤍\n\nTe confirmo que reprogramamos nuestra sesión terapéutica para el:\n🗓️ *${appointment.date}*\n⏰ *${appointment.time}*.\n\n¡Gracias por tu confianza y nos vemos pronto! ✨🕊️`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-stone-900/65 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-sm glass-panel rounded-[36px] p-6 space-y-5 shadow-2xl border border-stone-200/80">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200/70">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#335236] block">Gestionar Cita</span>
            <h3 className="text-base font-serif text-stone-900">{appointment.patientName}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-500 text-xs transition-colors tap-bounce cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" /> Nueva Fecha:
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
                <Clock className="w-3.5 h-3.5 text-stone-400" /> Nueva Hora:
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
            <label className="font-semibold text-stone-700 block">Modalidad:</label>
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

          <button
            type="submit"
            className="w-full py-3.5 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-2xl font-medium shadow-luxe transition-all flex items-center justify-center gap-1.5 tap-bounce cursor-pointer"
          >
            <Check className="w-4 h-4" /> Guardar Nueva Fecha
          </button>
        </form>

        <button
          type="button"
          onClick={handleNotifyRescheduleWhatsApp}
          className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-2xl font-medium text-xs flex items-center justify-center gap-1.5 border border-[#25D366]/30 transition-colors tap-bounce cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" /> Avisar reprogramación por WhatsApp
        </button>

        <div className="pt-2 border-t border-stone-200/70">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full text-center text-rose-600 hover:text-rose-700 text-xs font-medium py-1.5 flex items-center justify-center gap-1 tap-bounce cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Cancelar y eliminar esta cita
            </button>
          ) : (
            <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 space-y-2 text-center animate-fadeIn">
              <span className="text-[11px] text-rose-800 font-medium block">
                ¿Segura que deseas eliminar la cita de {appointment.patientName}?
              </span>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-1.5 bg-white border border-stone-200 rounded-xl text-stone-600 text-xs font-medium tap-bounce cursor-pointer"
                >
                  No, mantener
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(appointment.id);
                    onClose();
                  }}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium tap-bounce cursor-pointer shadow-xs"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}