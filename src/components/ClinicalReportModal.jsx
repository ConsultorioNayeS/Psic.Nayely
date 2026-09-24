import React, { useState, useEffect } from 'react';
import { 
  X, Printer, ShieldCheck, Award, Building, 
  FileCheck, Loader2, CheckCircle2, RotateCcw,
  Edit3, Eye, Compass, AlertTriangle, Stethoscope
} from 'lucide-react';

const sanitizeHTML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export default function ClinicalReportModal({ 
  patient, 
  completedSessionsCount = 0, 
  clinicalNotes = [],
  moodCheckIns = [],
  tasks = [],
  epiphanies = [],
  sessionTopics = [],
  onClose 
}) {
  const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();

  // Datos Institucionales Oficiales de Nayely
  const THERAPIST_FULL_NAME = 'Psicóloga Nayely Monserrat Stamatio Contreras';
  const THERAPIST_CEDULA = '12233756';
  const THERAPIST_UNIVERSITY = 'Universidad Michoacana de San Nicolás de Hidalgo';
  const THERAPIST_TITLE = 'Licenciatura en Psicología';

  const isMale = patient.gender === 'Masculino';
  const article = isMale ? 'El paciente' : 'La paciente';
  const interested = isMale ? 'el interesado' : 'la interesada';

  const [reportType, setReportType] = useState('evolucion'); // 'evolucion' | 'asistencia' | 'alta'
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'edit'
  const [recipient, setRecipient] = useState('A QUIEN CORRESPONDA');
  const [reportFolio] = useState(`EXP-${patient.id || '2026'}-${Math.floor(100 + Math.random() * 900)}`);

  // Ejes Clínicos Estandarizados (Sin sesgo positivo por defecto)
  const [motivoConsulta, setMotivoConsulta] = useState(patient.motivo || 'Evaluación y atención psicoterapéutica individual.');
  const [metodologia, setMetodologia] = useState('Intervención psicoterapéutica individual con enfoque Cognitivo-Conductual y contextual (ACT), evaluación continua del afecto y prescripción de tareas conductuales extramuros.');
  const [evolucionTriangulada, setEvolucionTriangulada] = useState('');
  const [impresionDiagnostica, setImpresionDiagnostica] = useState(patient.initialHypothesis || 'En proceso de delimitación diagnóstica.');
  const [logrosYHerramientas, setLogrosYHerramientas] = useState('En proceso de identificación y consolidación de recursos adaptativos.');
  const [direccionTratamiento, setDireccionTratamiento] = useState('Establecer encuadre de autorregulación y delimitar estresores precipitantes.');
  
  // PRONÓSTICO DINÁMICO: No asume "favorable" si apenas inicia
  const [pronostico, setPrognosis] = useState(
    completedSessionsCount <= 2 
      ? 'Reservado a evolución (Fase exploratoria inicial)' 
      : 'En evaluación continua con base en el apego terapéutico'
  );
  
  const [recomendaciones, setRecomendaciones] = useState('Mantener asistencia regular a las sesiones programadas y dar seguimiento a las indicaciones clínicas.');

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const completedTasksCount = tasks.filter(t => t.done).length;
  const adherencePercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // Orden cronológico estricto (de la más antigua a la más nueva)
  const getChronologicalNotes = () => {
    return [...clinicalNotes].sort((a, b) => {
      const timeA = new Date(a.created_at || a.date).getTime() || 0;
      const timeB = new Date(b.created_at || b.date).getTime() || 0;
      return timeA - timeB;
    });
  };

  // Motor de Respaldo Clínico Objetivo (Sin inventar mejorías)
  const buildLocalFallback = (type) => {
    const sorted = getChronologicalNotes();
    const sessionsStr = completedSessionsCount > 0 
      ? `A lo largo de ${completedSessionsCount} sesión(es) documentadas formalmente`
      : `Durante las sesiones de admisión y exploración inicial`;

    let trajectory = '';
    if (sorted.length > 0) {
      const firstNote = sorted[0].text;
      const lastNote = sorted[sorted.length - 1].text;
      trajectory = ` En sesión inicial se registró: "${firstNote}". En valoración reciente se consigna: "${lastNote}".`;
    }

    if (type === 'asistencia') {
      return `${article} ${patient.name}, de ${patient.age || 'edad no especificada'} años de edad, asiste a consulta psicoterapéutica individual en este consultorio. A la fecha, ${sessionsStr.toLowerCase()}. Se expide la presente a petición de parte para los fines legales, laborales o académicos que a ${interested} convengan.`;
    }

    if (type === 'alta') {
      return `${article} ${patient.name} ha concluido satisfactoriamente su proceso terapéutico tras ${completedSessionsCount} sesiones. Habiendo remitido los síntomas iniciales y consolidado recursos autónomos, se dictamina su ALTA TERAPÉUTICA.`;
    }

    // Si lleva pocas sesiones, NO inventa que va favorable
    if (completedSessionsCount <= 2) {
      return `${article} ${patient.name} acude por "${patient.motivo || 'motivo clínico'}". ${sessionsStr}, el proceso se sitúa en FASE EXPLORATORIA Y DE ENCUADRE DIAGNÓSTICO.${trajectory} Dada la temporalidad inicial, el pronóstico se mantiene reservado a la respuesta al tratamiento y apego a las indicaciones.`;
    }

    const evaluacionApego = adherencePercent >= 70 
      ? `evidenciando adecuada adherencia terapéutica (${adherencePercent}%) y respuesta adaptativa gradual.`
      : `registrando un apego parcial (${adherencePercent}%), requiriéndose reforzar la adherencia conductual extramuros.`;

    return `${article} ${patient.name} acude por "${patient.motivo || 'motivo clínico'}". ${sessionsStr}, se documenta el seguimiento terapéutico correspondiente.${trajectory} Clínicamente se observa un proceso activo, ${evaluacionApego}`;
  };

  // Motor IA Clínico Anti-Sesgo de Complacencia
  const runClinicalTriangulation = async (type = reportType) => {
    setIsSynthesizing(true);
    setSyncStatus('Evaluando objetivamente apego, notas y estado clínico...');

    const chronologicalNotes = getChronologicalNotes();

    const therapistChronology = chronologicalNotes.length > 0 
      ? chronologicalNotes.map((n, idx) => `[SESIÓN ${idx + 1} - ${n.date || 'S/F'}]: ${sanitizeHTML(n.text)}`).join('\n')
      : 'Sin notas previas registradas; paciente en admisión.';

    const moodEvidence = moodCheckIns.length > 0
      ? moodCheckIns.slice(0, 8).map(m => `Estado: ${m.mood} | Factores: ${m.tags?.join(', ') || 'N/A'} | Registro: "${sanitizeHTML(m.note) || 'S/N'}"`).join('\n')
      : 'Sin registros de pulso reportados.';

    const epiphaniesEvidence = epiphanies.length > 0
      ? epiphanies.map(e => `• Reestructuración: "${sanitizeHTML(e.insight)}"`).join('\n')
      : 'Sin reestructuraciones cognitivas archivadas.';

    const tasksEvidence = tasks.length > 0
      ? `Prescritas: ${tasks.length} | Concluidas: ${completedTasksCount} (${adherencePercent}% de cumplimiento real).`
      : 'Sin tareas prescritas aún.';

    const topicsEvidence = sessionTopics.length > 0
      ? sessionTopics.map(t => `[${t.tag}]: ${t.text}`).join('; ')
      : 'Sin temas adicionales en buzón.';

    const prompt = `Actúa como la Psicóloga Clínica Nayely Monserrat Stamatio Contreras (Cédula Profesional 12233756, UMSNH).
Tu deber deontológico y legal (NOM-004-SSA3-2012) es emitir un dictamen psicológico RIGUROSO, VERÍDICO Y CARENTE DE SESGO OPTIMISTA.

CANDADOS OBLIGATORIOS DE JUICIO CLÍNICO:
1. PROHIBICIÓN DE SESGO DE COMPLACENCIA: No actúes como motivador ni asumas que todo va 'favorable' por defecto. Si el paciente no ha avanzado, faltó a tareas, reporta estados depresivos/ansiedad persistentes, o tiene un apego bajo (<60%), DEBES señalarlo con rigor profesional.
2. MUESTRA TEMPRANA: Si el paciente tiene solo 1 o 2 sesiones, está PROHIBIDO dictaminar 'evolución favorable consolidada'. Debe calificarse como 'Fase inicial de encuadre y exploración diagnóstica' y el pronóstico debe ser 'Reservado a evolución'.
3. CRITERIO DE PRONÓSTICO:
   - 'Favorable': Únicamente si hay evidencia documentada de mejoría y apego > 75%.
   - 'Reservado a evolución y apego': Si hay inconsistencia, crisis activas o estresores severos.
   - 'Estacionario / En fase diagnóstica': Si es inicio de tratamiento o hay meseta clínica.
   - 'Requiere interconsulta psiquiátrica': Si hay descompensación o refractariedad.
4. Si las notas contienen expresiones informales, tradúcelas a psicopatología técnica y digna.

DATOS:
- Paciente: ${sanitizeHTML(patient.name)}, ${patient.age || 'N/E'} años, Sexo: ${patient.gender}, Ocupación: ${sanitizeHTML(patient.occupation) || 'No especificada'}
- Motivo de admisión: ${sanitizeHTML(patient.motivo) || 'Consulta psicológica'}
- Medicación actual: ${sanitizeHTML(patient.medication) || 'Ninguna'}
- Sesiones asistidas: ${completedSessionsCount}
- Tareas completadas: ${completedTasksCount} de ${tasks.length} (${adherencePercent}% de apego real)
- Tipo de documento: ${type === 'asistencia' ? 'Constancia Oficial de Asistencia' : type === 'alta' ? 'Dictamen de Alta Psicoterapéutica' : 'Informe Clínico Integral de Evolución Psicológica'}
- Dirigido a: ${sanitizeHTML(recipient)}

HISTORIAL CRONOLÓGICO DE NOTAS DE NAYELY:
${therapistChronology}

REGISTROS DEL PACIENTE EN APP:
- Estados de ánimo:
${moodEvidence}
- Reestructuraciones cognitivas:
${epiphaniesEvidence}
- Cumplimiento conductual:
${tasksEvidence}
- Temas en buzón:
${topicsEvidence}

Devuelve ÚNICAMENTE un JSON con estas claves (sin markdown):
{
  "motivoConsulta": "Definición técnica formal del motivo de consulta y sintomatología.",
  "metodologia": "Técnicas clínicas implementadas conforme al enfoque C-C y contextual.",
  "evolucionTriangulada": "Juicio clínico verídico y no condescendiente que evalúa el progreso real o estancamiento según la evidencia.",
  "impresionDiagnostica": "Diagnóstico estructurado compatible con CIE-11 / DSM-5-TR.",
  "logrosYHerramientas": "Recursos consolidados reales (o en proceso si es muestra temprana).",
  "direccionTratamiento": "Directriz terapéutica para Nayely: puntos ciegos y objetivos de las próximas consultas.",
  "pronostico": "Pronóstico clínico fundamentado (Favorable, Reservado, Estacionario o Canalización).",
  "recomendaciones": "Indicaciones terapéuticas formales."
}`;

    const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let success = false;

    for (const model of models) {
      if (success) break;
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1, // Cero divagación
              maxOutputTokens: 1400,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);

          if (parsed.motivoConsulta) setMotivoConsulta(parsed.motivoConsulta);
          if (parsed.metodologia) setMetodologia(parsed.metodologia);
          if (parsed.evolucionTriangulada) setEvolucionTriangulada(parsed.evolucionTriangulada);
          if (parsed.impresionDiagnostica) setImpresionDiagnostica(parsed.impresionDiagnostica);
          if (parsed.logrosYHerramientas) setLogrosYHerramientas(parsed.logrosYHerramientas);
          if (parsed.direccionTratamiento) setDireccionTratamiento(parsed.direccionTratamiento);
          if (parsed.pronostico) setPrognosis(parsed.pronostico);
          if (parsed.recomendaciones) setRecomendaciones(parsed.recomendaciones);

          success = true;
          setSyncStatus('✓ Dictamen evaluado con criterio clínico objetivo (Anti-sesgo)');
          setTimeout(() => setSyncStatus(''), 4500);
        }
      } catch (e) {
        console.warn(`Intento con ${model} falló, intentando alternativa...`, e);
      }
    }

    if (!success) {
      setEvolucionTriangulada(buildLocalFallback(type));
      setSyncStatus('✓ Dictamen estructurado con datos del expediente');
      setTimeout(() => setSyncStatus(''), 4500);
    }

    setIsSynthesizing(false);
  };

  useEffect(() => {
    runClinicalTriangulation(reportType);
  }, []);

  const handleTemplateChange = (type) => {
    setReportType(type);
    runClinicalTriangulation(type);
  };

  // Impresión Aislada Profesional
  const handlePrintIsolated = () => {
    const documentTitle = reportType === 'evolucion' 
      ? 'INFORME CLÍNICO DE EVALUACIÓN Y EVOLUCIÓN PSICOLÓGICA'
      : reportType === 'asistencia'
        ? 'CONSTANCIA OFICIAL DE ATENCIÓN Y TRATAMIENTO PSICOTERAPÉUTICO'
        : 'DICTAMEN CLÍNICO DE CONCLUSIÓN Y ALTA PSICOTERAPÉUTICA';

    const fechaHoy = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

    const safeName = sanitizeHTML(patient.name);
    const safeRecipient = sanitizeHTML(recipient);
    const safeOccupation = sanitizeHTML(patient.occupation) || 'No especificada';
    const safeMotivo = sanitizeHTML(motivoConsulta);
    const safeMetodologia = sanitizeHTML(metodologia);
    const safeEvolucion = sanitizeHTML(evolucionTriangulada).replace(/\n/g, '<br/>');
    const safeLogros = sanitizeHTML(logrosYHerramientas);
    const safeDireccion = sanitizeHTML(direccionTratamiento);
    const safeDiagnostico = sanitizeHTML(impresionDiagnostica);
    const safePronostico = sanitizeHTML(pronostico);
    const safeRecomendaciones = sanitizeHTML(recomendaciones);

    const printHTML = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Dictamen Clínico - ${safeName}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: letter portrait;
              margin: 16mm 15mm;
            }
            * { box-sizing: border-box; }
            body {
              font-family: 'Newsreader', Georgia, serif;
              color: #1a1a1a;
              background: #ffffff;
              font-size: 10.5pt;
              line-height: 1.48;
              margin: 0;
              padding: 0;
            }
            h1, h2, h3, .sans { font-family: 'Plus Jakarta Sans', sans-serif; }
            .header-bar {
              border-bottom: 2.5px solid #253827;
              padding-bottom: 10px;
              margin-bottom: 14px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .title-section { text-align: center; margin-bottom: 14px; }
            .title-section h2 {
              font-size: 11.5pt;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #253827;
              margin: 0 0 4px 0;
              text-decoration: underline;
              text-underline-offset: 3px;
            }
            .recipient {
              font-size: 9.5pt;
              font-weight: 700;
              text-transform: uppercase;
              color: #333;
            }
            .patient-box {
              background: #fbf9f6;
              border: 1px solid #e5e0d8;
              border-radius: 6px;
              padding: 8px 12px;
              margin-bottom: 12px;
              font-size: 9.5pt;
              line-height: 1.5;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px;
            }
            .section { margin-bottom: 9px; }
            .section-label {
              font-family: 'Plus Jakarta Sans', sans-serif;
              font-size: 9pt;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.04em;
              color: #253827;
              margin-bottom: 2px;
              display: block;
            }
            .section-body {
              text-align: justify;
              margin: 0;
              font-size: 10pt;
              line-height: 1.5;
            }
            .italic-box {
              font-style: italic;
              background: #fdfbf7;
              border-left: 3px solid #b88a44;
              padding: 5px 8px;
              margin-top: 2px;
            }
            .legal-disclaimer {
              font-size: 8pt;
              color: #555;
              text-align: justify;
              line-height: 1.35;
              border-top: 1px solid #ddd;
              padding-top: 8px;
              margin-top: 12px;
            }
            .signature-block {
              margin-top: 24px;
              text-align: center;
              page-break-inside: avoid;
            }
            .signature-line {
              border-bottom: 1.5px solid #222;
              width: 200px;
              margin: 0 auto 4px auto;
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div>
              <h1 style="font-size: 12pt; margin: 0 0 2px 0; color: #253827; font-family: 'Newsreader', serif; font-weight: bold; text-transform: uppercase;">
                ${THERAPIST_FULL_NAME}
              </h1>
              <div class="sans" style="font-size: 8.5pt; font-weight: 600; color: #333;">
                ${THERAPIST_TITLE}
              </div>
              <div class="sans" style="font-size: 8pt; color: #666;">
                Cédula Profesional Federal: <strong style="color: #111;">${THERAPIST_CEDULA}</strong>
              </div>
              <div class="sans" style="font-size: 7.5pt; color: #777;">
                ${THERAPIST_UNIVERSITY}
              </div>
            </div>

            <div style="text-align: right; font-size: 8pt; color: #555;" class="sans">
              <div style="background: #f0ede8; border: 1px solid #dcd7ce; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #222; display: inline-block; margin-bottom: 2px;">
                Folio: ${reportFolio}
              </div>
              <div>Fecha: ${fechaHoy}</div>
              <div style="color: #2e6035; font-weight: 600;">✓ Dictamen Oficial Validado</div>
            </div>
          </div>

          <div class="title-section">
            <h2>${documentTitle}</h2>
            <div class="recipient">DIRIGIDO A: ${safeRecipient}</div>
          </div>

          <div class="patient-box">
            <div class="grid-2">
              <div><strong>${article}:</strong> ${safeName}</div>
              <div><strong>Edad:</strong> ${patient.age || 'No especificada'} años</div>
            </div>
            <div class="grid-2" style="margin-top: 3px;">
              <div><strong>Sexo:</strong> ${isMale ? 'Masculino' : 'Femenino'}</div>
              <div><strong>Ocupación:</strong> ${safeOccupation}</div>
            </div>
            <div class="grid-2" style="margin-top: 3px; border-top: 1px solid #e8e2d8; padding-top: 3px;">
              <div><strong>Sesiones Documentadas:</strong> ${completedSessionsCount} sesión(es)</div>
              <div><strong>Adherencia Conductual:</strong> ${adherencePercent}% documentado</div>
            </div>
          </div>

          <div class="section">
            <span class="section-label">I. Motivo de Consulta y Línea Base de Apertura:</span>
            <p class="section-body">${safeMotivo}</p>
          </div>

          <div class="section">
            <span class="section-label">II. Abordaje Metodológico e Intervención:</span>
            <p class="section-body">${safeMetodologia}</p>
          </div>

          <div class="section">
            <span class="section-label">III. Evolución Longitudinal y Análisis Triangulado:</span>
            <p class="section-body">${safeEvolucion}</p>
          </div>

          <div class="section">
            <span class="section-label">IV. Logros y Recursos Psicológicos Consolidados:</span>
            <div class="italic-box">${safeLogros}</div>
          </div>

          <div class="grid-2 section" style="margin-top: 4px;">
            <div>
              <span class="section-label">V. Impresión Diagnóstica (CIE-11 / DSM-5-TR):</span>
              <p class="section-body">${safeDiagnostico}</p>
            </div>
            <div>
              <span class="section-label">VI. Pronóstico Clínico:</span>
              <p class="section-body">${safePronostico}</p>
            </div>
          </div>

          <div class="section">
            <span class="section-label">VII. Dirección del Tratamiento e Indicaciones:</span>
            <p class="section-body">${safeDireccion}. ${safeRecomendaciones}</p>
          </div>

          <div class="legal-disclaimer">
            Se expide el presente dictamen a petición de parte interesada para los fines legales, laborales, académicos o personales que a sus legítimos derechos convengan. Información amparada bajo el secreto profesional y la Norma Oficial Mexicana NOM-004-SSA3-2012 del Expediente Clínico vigente en los Estados Unidos Mexicanos.
          </div>

          <div class="signature-block">
            <div class="signature-line"></div>
            <div style="font-weight: bold; font-size: 10.5pt; color: #111;">${THERAPIST_FULL_NAME}</div>
            <div class="sans" style="font-size: 8.5pt; color: #444; font-weight: 600;">${THERAPIST_TITLE}</div>
            <div class="sans" style="font-size: 8pt; color: #666;">Cédula Profesional Federal: ${THERAPIST_CEDULA}</div>
            <div class="sans" style="font-size: 7.5pt; color: #888;">${THERAPIST_UNIVERSITY}</div>
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(printHTML);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 450);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn select-none">
      <div className="w-full max-w-2xl bg-white rounded-[32px] p-5 sm:p-7 shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ================= CONTROLES SUPERIORES RESPONSIVOS ================= */}
        <div className="flex flex-col gap-2.5 pb-3 border-b border-stone-200">
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#335236] flex items-center gap-1.5 font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Dictamen Clínico Estandarizado NOM-004
              </span>
              <h3 className="text-base font-serif text-stone-900">Análisis Longitudinal y Juicio Clínico</h3>
            </div>

            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 tap-bounce cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex bg-stone-100 p-0.5 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all tap-bounce cursor-pointer ${
                  viewMode === 'preview' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-500'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Vista Previa
              </button>
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all tap-bounce cursor-pointer ${
                  viewMode === 'edit' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-500'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar Texto
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => runClinicalTriangulation(reportType)}
                disabled={isSynthesizing}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl tap-bounce cursor-pointer transition-all disabled:opacity-50"
                title="Volver a analizar cronología de notas"
              >
                {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin text-[#335236]" /> : <RotateCcw className="w-4 h-4 text-[#335236]" />}
              </button>

              <button
                onClick={handlePrintIsolated}
                className="px-4 py-2 bg-[#2a422d] hover:bg-[#1d2f20] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm tap-bounce cursor-pointer transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Descargar / Imprimir PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-2xl text-[11px]">
            <button
              onClick={() => handleTemplateChange('evolucion')}
              className={`py-1.5 px-1 rounded-xl font-medium transition-all tap-bounce cursor-pointer text-center truncate ${
                reportType === 'evolucion' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-500'
              }`}
            >
              Informe Integral
            </button>
            <button
              onClick={() => handleTemplateChange('asistencia')}
              className={`py-1.5 px-1 rounded-xl font-medium transition-all tap-bounce cursor-pointer text-center truncate ${
                reportType === 'asistencia' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-500'
              }`}
            >
              Constancia ({completedSessionsCount} ses.)
            </button>
            <button
              onClick={() => handleTemplateChange('alta')}
              className={`py-1.5 px-1 rounded-xl font-medium transition-all tap-bounce cursor-pointer text-center truncate ${
                reportType === 'alta' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-500'
              }`}
            >
              Alta Clínica
            </button>
          </div>

          {syncStatus && (
            <div className="bg-emerald-50 border border-emerald-200 text-[#2a422d] text-[11px] px-3 py-1 rounded-xl flex items-center gap-1.5 animate-fadeIn font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

        </div>

        {/* ================= CONTENEDOR EN PANTALLA ================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-stone-900 bg-white no-scrollbar text-xs">
          
          {/* Membrete Oficial */}
          <div className="border-b-2 border-[#2a422d] pb-3 flex justify-between items-start">
            <div className="space-y-0.5">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#2a422d] font-serif uppercase">
                {THERAPIST_FULL_NAME}
              </h1>
              <p className="text-xs text-stone-800 font-semibold">
                {THERAPIST_TITLE}
              </p>
              <p className="text-[11px] text-stone-600 font-medium">
                Cédula Profesional Federal: <strong className="text-stone-900 font-mono">{THERAPIST_CEDULA}</strong>
              </p>
              <p className="text-[10px] text-stone-500">
                {THERAPIST_UNIVERSITY}
              </p>
            </div>

            <div className="text-right text-[10px] text-stone-500 space-y-0.5">
              <span className="font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-bold block text-stone-800">
                Folio: {reportFolio}
              </span>
              <p className="pt-0.5">Fecha: {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <span className="text-emerald-800 font-semibold flex items-center justify-end gap-1">
                <FileCheck className="w-3 h-3 text-emerald-700" /> Dictamen Validado
              </span>
            </div>
          </div>

          <div className="text-center py-0.5">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#2a422d] underline underline-offset-4 font-serif">
              {reportType === 'evolucion' && 'INFORME CLÍNICO DE EVALUACIÓN Y EVOLUCIÓN PSICOLÓGICA'}
              {reportType === 'asistencia' && 'CONSTANCIA OFICIAL DE ATENCIÓN Y TRATAMIENTO PSICOTERAPÉUTICO'}
              {reportType === 'alta' && 'DICTAMEN CLÍNICO DE CONCLUSIÓN Y ALTA PSICOTERAPÉUTICA'}
            </h2>
            
            <div className="mt-2 flex justify-center items-center gap-1.5">
              <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">DIRIGIDO A:</span>
              {viewMode === 'edit' ? (
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="text-xs uppercase font-bold text-stone-900 border-b border-stone-300 focus:outline-none focus:border-[#335236] text-center px-1.5 py-0.5"
                />
              ) : (
                <span className="text-xs uppercase font-bold text-stone-900 border-b border-stone-300 pb-0.5">
                  {recipient}
                </span>
              )}
            </div>
          </div>

          {/* Ficha de Identificación */}
          <div className="bg-stone-50/90 p-3.5 rounded-2xl border border-stone-200/90 text-[11px] leading-relaxed">
            <div className="grid grid-cols-2 gap-2">
              <p><strong>{article}:</strong> {patient.name}</p>
              <p><strong>Edad:</strong> {patient.age || 'No especificada'} años</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <p><strong>Sexo:</strong> {isMale ? 'Masculino' : 'Femenino'}</p>
              <p><strong>Ocupación:</strong> {patient.occupation || 'No especificada'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200">
              <p><strong>Sesiones Documentadas:</strong> <strong className="text-emerald-900 font-mono">{completedSessionsCount} sesión(es)</strong></p>
              <p><strong>Adherencia Conductual:</strong> <strong className="text-emerald-900 font-mono">{adherencePercent}% documentado</strong></p>
            </div>
          </div>

          {/* I. MOTIVO DE CONSULTA Y LÍNEA BASE */}
          <div className="space-y-0.5">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
              I. Motivo de Consulta y Línea Base de Apertura:
            </span>
            {viewMode === 'edit' ? (
              <textarea
                rows="2"
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-serif leading-relaxed"
              />
            ) : (
              <p className="text-xs text-stone-800 font-serif leading-relaxed text-justify">
                {motivoConsulta}
              </p>
            )}
          </div>

          {/* II. METODOLOGÍA */}
          <div className="space-y-0.5">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
              II. Abordaje Metodológico e Intervención Clínica:
            </span>
            {viewMode === 'edit' ? (
              <textarea
                rows="2"
                value={metodologia}
                onChange={(e) => setMetodologia(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-serif leading-relaxed"
              />
            ) : (
              <p className="text-xs text-stone-800 font-serif leading-relaxed text-justify">
                {metodologia}
              </p>
            )}
          </div>

          {/* III. EVOLUCIÓN LONGITUDINAL TRIANGULADA (ANTI-SESGO) */}
          <div className="space-y-0.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
                III. Evolución Psicoterapéutica Longitudinal:
              </span>
              <span className="text-[10px] text-stone-400 font-mono italic">
                {clinicalNotes.length} notas cronológicas
              </span>
            </div>
            {viewMode === 'edit' ? (
              <textarea
                rows="5"
                value={evolucionTriangulada}
                onChange={(e) => setEvolucionTriangulada(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-serif leading-relaxed shadow-inner"
              />
            ) : (
              <p className="text-xs text-stone-800 font-serif leading-relaxed text-justify whitespace-pre-line">
                {evolucionTriangulada}
              </p>
            )}
          </div>

          {/* IV. LOGROS CONSOLIDADOS */}
          <div className="space-y-0.5">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
              IV. Logros y Recursos Psicológicos Consolidados:
            </span>
            {viewMode === 'edit' ? (
              <textarea
                rows="2"
                value={logrosYHerramientas}
                onChange={(e) => setLogrosYHerramientas(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50/70 text-xs font-serif italic"
              />
            ) : (
              <p className="text-xs text-stone-800 font-serif italic bg-stone-50/70 p-2.5 rounded-xl border border-stone-200 leading-relaxed">
                {logrosYHerramientas}
              </p>
            )}
          </div>

          {/* V. DIAGNÓSTICO */}
          <div className="space-y-0.5">
            <span className="font-bold text-stone-800 uppercase text-[10px] block">V. Impresión Diagnóstica (CIE-11 / DSM-5-TR):</span>
            {viewMode === 'edit' ? (
              <input
                type="text"
                value={impresionDiagnostica}
                onChange={(e) => setImpresionDiagnostica(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-200 text-xs"
              />
            ) : (
              <p className="text-xs text-stone-800 font-serif">{impresionDiagnostica}</p>
            )}
          </div>

          {/* VI. PRONÓSTICO CLÍNICO CON SELECTOR RÁPIDO */}
          <div className="space-y-1 pt-1">
            <span className="font-bold text-stone-800 uppercase text-[10px] block">VI. Pronóstico Clínico Estandarizado:</span>
            
            {/* Píldoras de Criterio Clínico Rápido para Nayely (Ocultas en impresión) */}
            <div className="flex flex-wrap gap-1.5 print:hidden">
              <button
                type="button"
                onClick={() => setPrognosis('Favorable, sujeto a la continuidad y apego al tratamiento psicoterapéutico.')}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 tap-bounce cursor-pointer"
              >
                🟢 Favorable
              </button>
              <button
                type="button"
                onClick={() => setPrognosis('Reservado a evolución y apego (Presencia de estresores activos y adherencia irregular).')}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 tap-bounce cursor-pointer"
              >
                🟡 Reservado a Apego
              </button>
              <button
                type="button"
                onClick={() => setPrognosis('Estacionario en fase exploratoria inicial (Se requiere mayor temporalidad para pronóstico definitivo).')}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200 tap-bounce cursor-pointer"
              >
                ⚪ Estacionario / Exploración
              </button>
              <button
                type="button"
                onClick={() => setPrognosis('Reservado a desfavorable (Requiere valoración e interconsulta con Psiquiatría).')}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 tap-bounce cursor-pointer"
              >
                🔴 Interconsulta Psiquiátrica
              </button>
            </div>

            {viewMode === 'edit' ? (
              <input
                type="text"
                value={pronostico}
                onChange={(e) => setPrognosis(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-200 text-xs font-serif"
              />
            ) : (
              <p className="text-xs text-stone-800 font-serif font-medium">{pronostico}</p>
            )}
          </div>

          {/* VII. GUÍA CLÍNICA Y RECOMENDACIONES */}
          <div className="space-y-1 pt-1">
            <span className="font-bold text-[#2a422d] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#335236]" /> VII. Dirección Terapéutica y Focos de Atención Próxima:
            </span>
            {viewMode === 'edit' ? (
              <textarea
                rows="2"
                value={direccionTratamiento}
                onChange={(e) => setDireccionTratamiento(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs font-serif leading-relaxed"
              />
            ) : (
              <p className="text-xs text-stone-800 font-serif leading-relaxed bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                {direccionTratamiento}
              </p>
            )}
          </div>

          <div className="space-y-0.5">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
              VIII. Recomendaciones e Indicaciones Generales:
            </span>
            {viewMode === 'edit' ? (
              <textarea
                rows="2"
                value={recomendaciones}
                onChange={(e) => setRecomendaciones(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-serif leading-relaxed"
              />
            ) : (
              <p className="text-xs text-stone-800 font-serif leading-relaxed text-justify">
                {recomendaciones}
              </p>
            )}
          </div>

          {/* Leyenda Legal NOM-004 */}
          <p className="text-[9.5px] text-stone-500 leading-relaxed text-justify pt-1 font-light border-t border-stone-200">
            Se expide el presente dictamen a petición de parte interesada para los fines legales, laborales, académicos o personales que a sus legítimos derechos convengan. Información amparada bajo el secreto profesional y la Norma Oficial Mexicana NOM-004-SSA3-2012 del Expediente Clínico vigente en los Estados Unidos Mexicanos.
          </p>

          {/* Bloque de Firma Oficial */}
          <div className="pt-5 flex justify-center text-center">
            <div className="w-64 space-y-0.5 relative">
              <div className="border-b-2 border-stone-800 h-8 w-44 mx-auto" />
              <p className="text-xs font-bold text-stone-900 mt-1 font-serif">
                {THERAPIST_FULL_NAME}
              </p>
              <p className="text-[10px] text-stone-700 font-semibold">{THERAPIST_TITLE}</p>
              <p className="text-[9px] text-stone-500 font-mono">Cédula Profesional Federal: {THERAPIST_CEDULA}</p>
              <p className="text-[9px] text-stone-400">{THERAPIST_UNIVERSITY}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}