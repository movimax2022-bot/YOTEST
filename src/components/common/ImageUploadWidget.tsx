import React, { useState, useRef } from 'react';
import {
  Upload,
  RefreshCw,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  RotateCw,
  ZoomIn,
  Sun,
  Contrast,
  Sliders,
  X,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';

export interface ImageUploadWidgetProps {
  currentImage?: string;
  onImageChange: (imageDataUrl: string) => void;
  onImageRemove?: () => void;
  label?: string;
  helperText?: string;
  aspectRatioPreset?: '1:1' | '16:9' | '21:9' | '4:3' | 'free';
  compact?: boolean;
  shape?: 'circle' | 'rounded' | 'banner';
  presetOptions?: { name: string; url: string }[];
  className?: string;
}

export const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  currentImage,
  onImageChange,
  onImageRemove,
  label = 'Fotografía o Imagen',
  helperText,
  aspectRatioPreset = 'free',
  compact = false,
  shape = 'rounded',
  presetOptions,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string>('');
  const [successToast, setSuccessToast] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  // Image adjustments state
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [brightness, setBrightness] = useState(100); // 100%
  const [contrast, setContrast] = useState(100); // 100%
  const [selectedRatio, setSelectedRatio] = useState<'1:1' | '16:9' | '21:9' | '4:3' | 'free'>(aspectRatioPreset);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setRawImageSrc(event.target.result);
        // Reset adjustments
        setZoom(1);
        setRotation(0);
        setBrightness(100);
        setContrast(100);
        setSelectedRatio(aspectRatioPreset);
        setIsEditorOpen(true);
      }
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleTriggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (onImageRemove) {
      onImageRemove();
    } else {
      onImageChange('');
    }
    setSuccessToast(false);
  };

  const handleApplyAdjustments = () => {
    if (!rawImageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Determine dimensions based on selected ratio
      let targetW = 800;
      let targetH = 800;

      if (selectedRatio === '1:1') {
        targetW = 600;
        targetH = 600;
      } else if (selectedRatio === '16:9') {
        targetW = 960;
        targetH = 540;
      } else if (selectedRatio === '21:9') {
        targetW = 1050;
        targetH = 450;
      } else if (selectedRatio === '4:3') {
        targetW = 800;
        targetH = 600;
      } else {
        targetW = Math.min(1000, img.naturalWidth || 800);
        targetH = Math.round(targetW * ((img.naturalHeight || 600) / (img.naturalWidth || 800)));
      }

      canvas.width = targetW;
      canvas.height = targetH;

      ctx.save();
      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // Translate to center for rotation and zoom
      ctx.translate(targetW / 2, targetH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Draw image centered
      const drawW = targetW;
      const drawH = targetH;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      ctx.restore();

      // Export compressed Data URL (persists in localStorage)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      onImageChange(compressedDataUrl);

      setIsEditorOpen(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3500);
    };
    img.src = rawImageSrc;
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onImageChange(urlInput.trim());
    setIsUrlModalOpen(false);
    setUrlInput('');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3500);
  };

  const previewClasses =
    shape === 'circle'
      ? 'w-24 h-24 rounded-full ring-4 ring-amber-400/30'
      : shape === 'banner'
      ? 'w-full h-36 sm:h-44 rounded-2xl ring-2 ring-slate-700/60'
      : compact
      ? 'w-16 h-16 rounded-xl ring-2 ring-slate-700/60'
      : 'w-full h-40 rounded-2xl ring-2 ring-slate-700/60';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden file input supporting mobile & desktop */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
      />

      {/* Label & Helper Header */}
      {label && (
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-white tracking-wide">{label}</label>
            {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
          </div>

          {currentImage && (
            <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Personalizada
            </span>
          )}
        </div>
      )}

      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>¡Imagen guardada y actualizada con éxito!</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(false)}
            className="text-emerald-400 hover:text-emerald-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Image Preview & Action Controls */}
      <div className={`p-4 rounded-2xl bg-[#141b26] border border-[#222d3d] flex ${compact ? 'flex-row items-center gap-4' : 'flex-col gap-3'}`}>
        {/* Preview Frame */}
        <div className="relative group overflow-hidden bg-slate-900 flex items-center justify-center shrink-0">
          {currentImage ? (
            <div className={`relative ${previewClasses} overflow-hidden bg-black/40`}>
              <img
                src={currentImage}
                alt="Vista previa personalizada"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerFilePicker}
                  title="Cambiar imagen"
                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-lg transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {onImageRemove && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    title="Eliminar imagen"
                    className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={handleTriggerFilePicker}
              className={`${previewClasses} border-2 border-dashed border-slate-700 hover:border-amber-400/80 cursor-pointer flex flex-col items-center justify-center text-slate-500 hover:text-amber-400 transition-colors bg-[#0f141d] p-3 text-center`}
            >
              <Upload className="w-6 h-6 mb-1 text-slate-400" />
              <span className="text-[11px] font-bold">Sin imagen asignada</span>
              <span className="text-[9px] text-slate-500">Toca para subir archivo</span>
            </div>
          )}
        </div>

        {/* Buttons Row explicitly fulfilling the prompt */}
        <div className="flex flex-wrap items-center gap-2 w-full">
          {/* Subir imagen button */}
          <button
            type="button"
            onClick={handleTriggerFilePicker}
            className="flex-1 min-w-[120px] px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{currentImage ? 'Cambiar imagen' : 'Subir imagen'}</span>
          </button>

          {/* Cambiar imagen / Recortar si ya existe */}
          {currentImage && (
            <button
              type="button"
              onClick={() => {
                setRawImageSrc(currentImage);
                setIsEditorOpen(true);
              }}
              title="Ajustar recorte, brillo o rotación"
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Ajustar</span>
            </button>
          )}

          {/* Eliminar imagen button */}
          {currentImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              title="Eliminar imagen actual"
              className="px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar imagen</span>
            </button>
          )}

          {/* Opciones adicionales: URL externa */}
          <button
            type="button"
            onClick={() => setIsUrlModalOpen(true)}
            title="Pegar enlace URL directo"
            className="px-2.5 py-2.5 rounded-xl bg-[#16202e] hover:bg-[#1d293b] text-slate-400 hover:text-slate-200 text-xs transition border border-slate-700/60"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Presets if provided */}
        {presetOptions && presetOptions.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 w-full">
            <span className="block text-[10px] text-slate-400 font-semibold mb-1.5">
              O elige una de nuestras imágenes predefinidas:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {presetOptions.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onImageChange(preset.url);
                    setSuccessToast(true);
                    setTimeout(() => setSuccessToast(false), 3000);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-[#111722] hover:bg-amber-500/10 hover:border-amber-400 border border-slate-800 text-[10px] text-slate-300 text-left truncate transition"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Editor de Recorte y Ajuste de Imagen */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#101622] border border-[#233147] rounded-3xl p-6 text-left max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white text-base">Ajustar & Recortar Imagen</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Box with live filters */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-black/60 border border-slate-700 flex items-center justify-center">
              <div
                className="overflow-hidden flex items-center justify-center transition-all"
                style={{
                  width:
                    selectedRatio === '1:1'
                      ? '220px'
                      : selectedRatio === '16:9'
                      ? '320px'
                      : selectedRatio === '21:9'
                      ? '340px'
                      : '280px',
                  height:
                    selectedRatio === '1:1'
                      ? '220px'
                      : selectedRatio === '16:9'
                      ? '180px'
                      : selectedRatio === '21:9'
                      ? '145px'
                      : '210px',
                  borderRadius: shape === 'circle' && selectedRatio === '1:1' ? '9999px' : '12px',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
                }}
              >
                <img
                  src={rawImageSrc}
                  alt="Editor recorte"
                  className="max-w-none transition-transform"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Grid guide watermark */}
              <div className="absolute inset-0 pointer-events-none border border-amber-400/20 rounded-2xl" />
            </div>

            {/* Controls */}
            <div className="space-y-4 bg-[#141d2a] p-4 rounded-2xl border border-slate-800">
              {/* Aspect Ratio Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-2">
                  Proporción de Recorte:
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {(['1:1', '16:9', '21:9', '4:3'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setSelectedRatio(ratio)}
                      className={`py-1.5 rounded-xl font-bold transition ${
                        selectedRatio === ratio
                          ? 'bg-amber-500 text-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {ratio === '1:1' ? '1:1 Cuadrado' : ratio === '16:9' ? '16:9 Panorámica' : ratio === '21:9' ? '21:9 Banner' : '4:3 Estándar'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom & Rotation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <ZoomIn className="w-3.5 h-3.5 text-amber-400" /> Zoom ({Math.round(zoom * 100)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <RotateCw className="w-3.5 h-3.5 text-amber-400" /> Rotación ({rotation}°)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotation(deg)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition ${
                          rotation === deg ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brightness & Contrast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <Sun className="w-3.5 h-3.5 text-amber-400" /> Brillo ({brightness}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1 font-semibold">
                      <Contrast className="w-3.5 h-3.5 text-amber-400" /> Contraste ({contrast}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                  setBrightness(100);
                  setContrast(100);
                }}
                className="text-xs text-slate-400 hover:text-white font-semibold underline"
              >
                Restablecer ajustes
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyAdjustments}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-lg flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar y Aplicar Imagen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Enlace URL Manual */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#101622] border border-[#233147] rounded-3xl p-6 text-left max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-amber-400" />
                Pegar Enlace Directo de Imagen
              </h3>
              <button
                type="button"
                onClick={() => setIsUrlModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Ingresa una dirección URL de imagen HTTPS (ejemplo: Unsplash, Cloudinary, etc.):
            </p>

            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#16202e] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUrlModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black"
              >
                Usar esta URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
