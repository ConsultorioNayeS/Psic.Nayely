import React, { useState, useRef } from 'react';
import { 
  X, UploadCloud, Music, Sparkles, Clock, 
  Volume2, Play, Pause, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function UploadAudioModal({ onClose, onUpload }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ansiedad');
  const [duration, setDuration] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const audioRef = useRef(null);
  const categories = ['Ansiedad', 'Insomnio', 'Autoestima', 'Respiración', 'Duelo'];

  // Selección de archivo y cálculo automático de duración y peso
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de peso óptimo (máx 20 MB)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 20) {
      setErrorMessage(`El archivo pesa ${fileSizeMB.toFixed(1)} MB. Te recomendamos usar MP3 o M4A comprimido (menos de 15 MB) para no gastar los datos de tus pacientes.`);
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);

    // Crear URL temporal para pre-escucha y extracción de duración
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Calcular duración exacta automáticamente
    const tempAudio = new Audio(objectUrl);
    tempAudio.onloadedmetadata = () => {
      const totalSeconds = Math.round(tempAudio.duration);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`);
    };
  };

  const handleTogglePreview = () => {
    if (!audioRef.current) return;
    if (isPlayingPreview) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedFile) {
      setErrorMessage('Por favor selecciona un archivo de audio y escribe su título.');
      return;
    }

    setIsUploading(true);
    setUploadProgress('Optimizando y subiendo archivo a la nube...');

    try {
      // 1. Limpiar nombre de archivo (sin caracteres raros ni espacios)
      const cleanFileName = selectedFile.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-]/g, '_');
      
      const storagePath = `${Date.now()}_${cleanFileName}`;

      // 2. Subir al Bucket "audios" en Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audios')
        .upload(storagePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedFile.type || 'audio/mpeg'
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setUploadProgress('Generando enlace de transmisión para pacientes...');

      // 3. Obtener URL pública para reproducción
      const { data: { publicUrl } } = supabase.storage
        .from('audios')
        .getPublicUrl(storagePath);

      // 4. Enviar a la base de datos
      await onUpload({
        title: title.trim(),
        category: category,
        duration: duration || '3:00 min',
        audio_url: publicUrl,
        date: 'Hoy',
        author: 'Psic. Nayely'
      });

      onClose();
    } catch (err) {
      console.error('Error al subir audio:', err);
      setErrorMessage(`No se pudo subir el archivo: ${err.message}. Asegúrate de haber corrido el código SQL en Supabase.`);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-[#faf8f5] rounded-[36px] p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-200/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#436146]">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#436146]">Estudio de Voz</span>
              <h3 className="text-sm font-semibold text-stone-900">Subir Audio Terapéutico</h3>
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
        <form onSubmit={handleSubmit} className="p-1 overflow-y-auto space-y-4 flex-1 text-xs pt-3">
          
          {/* Título */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700 block text-[11px] uppercase tracking-wider">
              Título del Audio:
            </label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Calma para momentos de sobrepensamiento"
              className="w-full p-3 rounded-2xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#436146]"
            />
          </div>

          {/* Categorías */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700 block text-[11px] uppercase tracking-wider">
              Categoría Terapéutica:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    category === cat 
                      ? 'bg-[#436146] text-white shadow-xs' 
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Archivo de Audio */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700 block text-[11px] uppercase tracking-wider">
              Archivo de Audio o Nota de Voz:
            </label>

            <label className="border-2 border-dashed border-stone-200 hover:border-emerald-500/50 bg-white rounded-3xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all group">
              <UploadCloud className="w-7 h-7 text-stone-400 group-hover:text-[#436146] transition-colors mb-1.5" />
              
              <span className="text-xs font-semibold text-stone-800 text-center truncate max-w-[240px]">
                {selectedFile ? selectedFile.name : 'Toca para seleccionar audio del celular o PC'}
              </span>
              
              <span className="text-[10px] text-stone-400 mt-1">
                {selectedFile 
                  ? `Peso: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • ${duration || 'Calculando duración...'}`
                  : 'MP3, M4A, WAV o notas de voz grabadas (hasta 20 MB)'}
              </span>

              <input 
                type="file" 
                accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg"
                className="hidden" 
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {/* Reproductor de Pre-escucha (Para que Nayely confirme la calidad) */}
          {previewUrl && (
            <div className="bg-emerald-50/80 border border-emerald-200/80 p-3 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleTogglePreview}
                  className="w-9 h-9 rounded-full bg-[#436146] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
                >
                  {isPlayingPreview ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <div>
                  <span className="text-xs font-semibold text-stone-800 block">Pre-escucha</span>
                  <span className="text-[10px] text-emerald-800 font-medium">{duration || 'Calculando...'}</span>
                </div>
              </div>

              <span className="text-[10px] text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                Calidad Óptima
              </span>

              <audio 
                ref={audioRef}
                src={previewUrl}
                onEnded={() => setIsPlayingPreview(false)}
                className="hidden"
              />
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] leading-relaxed flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Botón Guardar / Subir */}
          <button
            type="submit"
            disabled={isUploading || !selectedFile || !title.trim()}
            className="w-full py-3.5 bg-[#436146] hover:bg-[#253827] text-white rounded-2xl font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed pt-3"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" /> {uploadProgress}
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Publicar en la Fonoteca
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}