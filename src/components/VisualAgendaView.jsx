import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, 
  MessageCircle, Edit3, Plus, CheckCircle2, FileText, 
  Eye, ChevronLeft, ChevronRight, UserCheck, Video 
} from 'lucide-react';

export default function VisualAgendaView({ 
  appointments = [], 
  onEditAppointment, 
  onSendWhatsApp, 
  onOpenNewAppointment,
  onOpenCheckout,
  onOpenPreSession
}) {
  const todayRaw = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(() => {
    if (appointments.length > 0) {
      return appointments[0].raw_date || appointments[0].rawDate || todayRaw;
    }
    return todayRaw;
  });

  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'all'

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + (weekOffset * 7));

  const weekDays = [-3, -2, -1, 0, 1, 2, 3].map(offset => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offset);
    const raw = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
    const dayNumber = d.getDate();
    const fullDateName = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const capitalized = fullDateName.charAt(0).toUpperCase() + fullDateName.slice(1);

    const count = appointments.filter(a => (a.raw_date === raw || a.rawDate === raw)).length;

    return {
      rawDate: raw,
      dayName,
      dayNumber,
      fullDateName: capitalized,
      appointmentCount: count
    };
  });

  const firstDayObj = new Date(weekDays[0].rawDate + 'T00:00:00');
  const lastDayObj = new Date(weekDays[6].rawDate + 'T00:00:00');

  const firstMonth = firstDayObj.toLocaleDateString('es-ES', { month: 'short' });
  const lastMonth = lastDayObj.toLocaleDateString('es-ES', { month: 'short' });
  const displayYear = lastDayObj.getFullYear();

  const monthYearDisplay = firstMonth === lastMonth
    ? `${firstMonth.toUpperCase()} ${displayYear}`
    : `${firstMonth.toUpperCase()} - ${lastMonth.toUpperCase()} ${displayYear}`;

  const appointmentsForSelectedDay = appointments.filter(a => 
    (a.raw_date === selectedDate || a.rawDate === selectedDate)
  );

  const currentDayInfo = weekDays.find(w => w.rawDate === selectedDate) || {
    fullDateName: 'Día seleccionado',
    appointmentCount: appointmentsForSelectedDay.length
  };

  return (
    <div className="space-y-4 select-none animate-fadeIn">
      
      {/* 1. Barra de Control Superior Ejecutiva */}
      <div className="flex justify-between items-center px-1 pt-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#335236] block">
            Clínica Boutique
          </span>
          <h2 className="text-lg font-serif text-stone-900">Agenda de Consultas</h2>
        </div>

        <button
          onClick={onOpenNewAppointment}
          className="px-4 py-2 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-2xl text-xs font-medium flex items-center gap-1.5 shadow-luxe tap-bounce transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* 2. Selector de Modo de Vista (Lineal & Limpio) */}
      <div className="flex bg-stone-200/50 p-1 rounded-2xl text-xs font-medium border border-stone-200/40">
        <button
          onClick={() => setViewMode('day')}
          className={`flex-1 py-1.5 rounded-xl transition-all tap-bounce cursor-pointer ${
            viewMode === 'day' 
              ? 'bg-white text-stone-900 font-semibold shadow-sm' 
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Vista por Día
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`flex-1 py-1.5 rounded-xl transition-all tap-bounce cursor-pointer ${
            viewMode === 'all' 
              ? 'bg-white text-stone-900 font-semibold shadow-sm' 
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Todas ({appointments.length})
        </button>
      </div>

      {viewMode === 'day' ? (
        <>
          {/* 3. Carrusel Semanal Marfil Hueso */}
          <div className="glass-panel p-4 rounded-[32px] border border-white/80 shadow-ambient space-y-3">
            
            {/* Navegación de Semana */}
            <div className="flex justify-between items-center pb-2 border-b border-stone-100 px-1">
              <button
                onClick={() => setWeekOffset(prev => prev - 1)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 tap-bounce cursor-pointer transition-colors"
                title="Semana anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-800 tracking-wider flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#335236]" />
                  {monthYearDisplay}
                </span>

                {weekOffset !== 0 && (
                  <button
                    onClick={() => {
                      setWeekOffset(0);
                      setSelectedDate(todayRaw);
                    }}
                    className="text-[10px] bg-emerald-100/70 text-[#2a422d] px-2 py-0.5 rounded-md font-bold tap-bounce cursor-pointer"
                  >
                    Hoy
                  </button>
                )}
              </div>

              <button
                onClick={() => setWeekOffset(prev => prev + 1)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 tap-bounce cursor-pointer transition-colors"
                title="Semana siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Los 7 días con respuesta elástica */}
            <div className="flex justify-between items-center gap-1.5 pt-1">
              {weekDays.map((item) => {
                const isSelected = item.rawDate === selectedDate;
                const isToday = item.rawDate === todayRaw;
                const hasAppointments = item.appointmentCount > 0;

                return (
                  <button
                    key={item.rawDate}
                    type="button"
                    onClick={() => setSelectedDate(item.rawDate)}
                    className={`flex-1 py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all tap-bounce cursor-pointer ${
                      isSelected 
                        ? 'bg-[#2a422d] text-white shadow-luxe scale-105' 
                        : isToday
                          ? 'bg-emerald-50/90 border border-emerald-300/80 text-[#2a422d]'
                          : 'bg-stone-50/60 hover:bg-stone-100 text-stone-600'
                    }`}
                  >
                    <span className={`text-[9px] font-bold tracking-wider ${
                      isSelected ? 'text-emerald-300' : 'text-stone-400'
                    }`}>
                      {item.dayName}
                    </span>

                    <span className="text-sm font-semibold my-0.5">
                      {item.dayNumber}
                    </span>

                    <div className="h-1.5 flex items-center justify-center">
                      {hasAppointments && (
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-emerald-400' : 'bg-[#4e7e52]'
                        }`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estado del día seleccionado */}
          <div className="flex justify-between items-center px-2">
            <div>
              <h3 className="text-sm font-serif text-stone-900">
                {currentDayInfo.fullDateName}
              </h3>
              <span className="text-[11px] text-stone-400 font-light">
                {appointmentsForSelectedDay.length === 0 
                  ? 'Sin consultas programadas' 
                  : `${appointmentsForSelectedDay.length} sesión${appointmentsForSelectedDay.length > 1 ? 'es' : ''}`}
              </span>
            </div>
          </div>

          {/* Listado de citas del día */}
          <div className="space-y-3">
            {appointmentsForSelectedDay.length === 0 ? (
              <div className="glass-panel p-8 rounded-3xl border border-dashed border-stone-200 text-center space-y-2">
                <CalendarIcon className="w-6 h-6 text-stone-300 mx-auto" />
                <p className="text-xs font-serif text-stone-600">Espacio disponible para consultas</p>
                <p className="text-[11px] text-stone-400 font-light">Toca en "+ Nueva Cita" para agendar a un paciente.</p>
              </div>
            ) : (
              appointmentsForSelectedDay.map(apt => renderAppointmentCard(apt))
            )}
          </div>
        </>
      ) : (
        /* Vista de todas las citas */
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl border border-dashed border-stone-200 text-center text-stone-400 text-xs font-light">
              No hay citas registradas en la agenda general.
            </div>
          ) : (
            appointments.map(apt => renderAppointmentCard(apt))
          )}
        </div>
      )}

    </div>
  );

  function renderAppointmentCard(apt) {
    const isCompleted = apt.status === 'Completada';
    const patientDisplayName = apt.patientName || apt.patient_name || 'Paciente';
    const isOnline = apt.modality === 'En línea';

    return (
      <div 
        key={apt.id}
        className="glass-panel rounded-[28px] p-4.5 border border-stone-200/80 shadow-ambient relative overflow-hidden flex flex-col space-y-3 transition-all hover:shadow-luxe"
      >
        {/* Línea de acento discreta */}
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
          isCompleted ? 'bg-emerald-500' : 'bg-[#335236]'
        }`} />

        <div className="pl-2 flex justify-between items-start">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-stone-900 tracking-tight">
              {patientDisplayName}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-stone-500 font-light">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3 text-stone-400" />
                {apt.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-stone-700">
                {isOnline ? <Video className="w-3 h-3 text-sky-600" /> : <UserCheck className="w-3 h-3 text-emerald-700" />}
                {apt.modality}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-stone-200/80 text-[#2a422d] shadow-sm inline-block">
              <Clock className="w-3 h-3 inline mr-1 text-stone-400" />
              {apt.time}
            </span>
            {isCompleted && (
              <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                ✓ Concluida
              </span>
            )}
          </div>
        </div>

        {/* Acciones Rápidas Ejecutivas */}
        <div className="pl-2 pt-2 border-t border-stone-100 space-y-2">
          
          <button
            onClick={() => onOpenPreSession(apt)}
            className="w-full py-2 px-3 bg-emerald-50/80 hover:bg-emerald-100/80 text-[#2a422d] font-medium text-xs rounded-xl border border-emerald-200/70 flex items-center justify-center gap-1.5 transition-all tap-bounce cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>Radiografía Pre-Sesión (Ver su semana)</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onOpenCheckout(apt)}
              className="flex-1 py-2 px-3 bg-[#2a422d] hover:bg-[#1d2f20] text-white font-medium text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all tap-bounce cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isCompleted ? 'Editar Notas' : 'Concluir y Anotar'}</span>
            </button>

            <button
              onClick={() => onSendWhatsApp(apt)}
              className="py-2 px-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-semibold text-xs rounded-xl border border-[#25D366]/30 flex items-center justify-center gap-1 transition-all tap-bounce cursor-pointer"
              title="Recordatorio por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={() => onEditAppointment(apt)}
              className="py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-all tap-bounce cursor-pointer"
              title="Reagendar"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    );
  }
}