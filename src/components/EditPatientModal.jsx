import React, { useState } from 'react';
import { X, Edit3, Save, Phone, AlertCircle, ShieldCheck, Mail } from 'lucide-react';

export default function EditPatientModal({ patient, onClose, onUpdatePatient }) {
  const [formData, setFormData] = useState({
    firstName: patient.firstName || patient.name?.split(' ')[0] || '',
    paternalLastName: patient.paternalLastName || patient.name?.split(' ')[1] || '',
    maternalLastName: patient.maternalLastName || patient.name?.split(' ')[2] || '',
    email: patient.email || '',
    age: patient.age || '',
    occupation: patient.occupation || '',
    phone: patient.phone || '',
    emergencyContactName: patient.emergencyContact?.name || '',
    emergencyContactRelation: patient.emergencyContact?.relation || '',
    emergencyContactPhone: patient.emergencyContact?.phone || '',
    motivo: patient.motivo || '',
    medication: patient.medication || '',
    previousTherapy: patient.previousTherapy || 'No',
    therapeuticGoals: patient.therapeuticGoals || '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.paternalLastName.trim()} ${formData.maternalLastName.trim()}`.trim();

    onUpdatePatient({
      ...patient,
      firstName: formData.firstName.trim(),
      paternalLastName: formData.paternalLastName.trim(),
      maternalLastName: formData.maternalLastName.trim(),
      name: fullName,
      email: formData.email.trim().toLowerCase(),
      age: formData.age,
      occupation: formData.occupation,
      phone: formData.phone,
      emergencyContact: {
        name: formData.emergencyContactName,
        relation: formData.emergencyContactRelation,
        phone: formData.emergencyContactPhone,
      },
      motivo: formData.motivo,
      medication: formData.medication,
      previousTherapy: formData.previousTherapy,
      therapeuticGoals: formData.therapeuticGoals,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-fadeIn select-none">
      <div className="w-full max-w-md bg-[#faf8f5] rounded-[36px] flex flex-col max-h-[92vh] shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Cabecera */}
        <div className="p-5 border-b border-stone-200/70 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#436146]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#436146]">Expediente Clínico</span>
              <h3 className="text-sm font-semibold text-stone-800">Editar Datos del Paciente</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 text-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* DATOS PERSONALES */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3">
            <span className="font-semibold text-stone-700 block text-[11px] uppercase tracking-wider">
              Datos Personales
            </span>

            <div>
              <label className="text-stone-600 block mb-1 font-medium">Nombre(s) *</label>
              <input 
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-600 block mb-1 font-medium">Apellido Paterno</label>
                <input 
                  type="text"
                  value={formData.paternalLastName}
                  onChange={(e) => handleChange('paternalLastName', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146]"
                />
              </div>
              <div>
                <label className="text-stone-600 block mb-1 font-medium">Apellido Materno</label>
                <input 
                  type="text"
                  value={formData.maternalLastName}
                  onChange={(e) => handleChange('maternalLastName', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-600 block mb-1 font-medium">Teléfono (WhatsApp)</label>
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146]"
                />
              </div>
              <div>
                <label className="text-stone-600 block mb-1 font-medium flex items-center gap-1">
                  <Mail className="w-3 h-3 text-emerald-700" /> Correo de Acceso
                </label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-600 block mb-1 font-medium">Edad</label>
                <input 
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146]"
                />
              </div>
              <div>
                <label className="text-stone-600 block mb-1 font-medium">Ocupación</label>
                <input 
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146]"
                />
              </div>
            </div>
          </div>

          {/* CONTACTO DE EMERGENCIA */}
          <div className="bg-white p-4 rounded-3xl border border-rose-200/80 shadow-2xs space-y-3">
            <span className="font-semibold text-rose-800 flex items-center gap-1 text-[11px] uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Contacto de Emergencia
            </span>

            <div>
              <label className="text-stone-600 block mb-1 font-medium">Nombre Completo:</label>
              <input 
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-600 block mb-1 font-medium">Parentesco:</label>
                <input 
                  type="text"
                  value={formData.emergencyContactRelation}
                  onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="text-stone-600 block mb-1 font-medium">Teléfono SOS:</label>
                <input 
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>
          </div>

          {/* DIAGNÓSTICO Y TRATAMIENTO */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3">
            <span className="font-semibold text-stone-700 block text-[11px] uppercase tracking-wider">
              Diagnóstico y Tratamiento
            </span>

            <div>
              <label className="text-stone-600 block mb-1 font-medium">Motivo de Consulta:</label>
              <textarea 
                rows="2"
                value={formData.motivo}
                onChange={(e) => handleChange('motivo', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146] resize-none"
              />
            </div>

            <div>
              <label className="text-stone-600 block mb-1 font-medium">Medicación Actual:</label>
              <input 
                type="text"
                value={formData.medication}
                onChange={(e) => handleChange('medication', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146]"
              />
            </div>

            <div>
              <label className="text-stone-600 block mb-1 font-medium">Objetivos Terapéuticos:</label>
              <textarea 
                rows="2"
                value={formData.therapeuticGoals}
                onChange={(e) => handleChange('therapeuticGoals', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146] resize-none"
              />
            </div>
          </div>

          {/* Botón Guardar */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Guardar Cambios en el Expediente
          </button>
        </form>

      </div>
    </div>
  );
}