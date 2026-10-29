import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Crop,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Eye,
  Layers,
  Settings2
} from 'lucide-react';

export type SupportedRatio = '16:9' | '21:9' | '4:3' | '1:1';
export type SupportedSize = '1080p' | '720p' | '800px' | '2k';

interface RatioOption {
  id: SupportedRatio;
  label: string;
  sublabel: string;
  ratio: number;
}

interface SizeOption {
  id: SupportedSize;
  label: string;
  maxDimension: number;
  quality: number;
  description: string;
}

const RATIO_OPTIONS: RatioOption[] = [
  { id: '16:9', label: '16:9 Widescreen', sublabel: 'बॅनर / शोकेस (Standard HD)', ratio: 16 / 9 },
  { id: '21:9', label: '21:9 Cinematic', sublabel: 'अल्ट्रा-वाईड सिनेमा (Panoramic)', ratio: 21 / 9 },
  { id: '4:3', label: '4:3 Editorial', sublabel: 'क्लासिक फॉरमॅट (Presentation)', ratio: 4 / 3 },
  { id: '1:1', label: '1:1 Square', sublabel: 'स्क्वेअर लोगो / हेडशॉट', ratio: 1 / 1 }
];

const SIZE_OPTIONS: SizeOption[] = [
  { id: '1080p', label: 'Full HD (1080p)', maxDimension: 1080, quality: 0.84, description: 'सर्वोत्तम स्पष्टता व बॅनरसाठी आदर्श' },
  { id: '720p', label: 'Standard HD (720p)', maxDimension: 850, quality: 0.82, description: 'वेगवान लोडिंग आणि उत्तम गुणवत्ता' },
  { id: '800px', label: 'Web Compact (800px)', maxDimension: 680, quality: 0.80, description: 'अल्ट्रा-फास्ट मोबाईल ऑप्टिमाइझ' },
  { id: '2k', label: 'Ultra HD Crisp', maxDimension: 1200, quality: 0.85, description: 'लक्झरी स्क्रीनसाठी ऑप्टिमाइझ रिझोल्यूशन' }
];

interface MediaImageUploaderProps {
  value: string; // The current data URL or image string
  onChange: (dataUrl: string, ratio: SupportedRatio) => void;
  defaultRatio?: SupportedRatio;
  defaultSize?: SupportedSize;
  label?: string;
  helperText?: string;
  aspectRatioHint?: string;
  required?: boolean;
}

export const MediaImageUploader: React.FC<MediaImageUploaderProps> = ({
  value,
  onChange,
  defaultRatio = '16:9',
  defaultSize = '1080p',
  label = 'Media Image (फक्त मीडिया फाईल अपलोड)',
  helperText = 'कम्प्युटर किंवा मोबाईल गॅलरीमधून इमेज निवडा. रेशो आणि साईझ निवडून थेट क्रॉप व सेव्ह करा.',
  required = false
}) => {
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<SupportedRatio>(defaultRatio);
  const [selectedSize, setSelectedSize] = useState<SupportedSize>(defaultSize);
  const [alignment, setAlignment] = useState<'center' | 'top' | 'bottom'>('center');
  const [zoom, setZoom] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; sizeKb: number } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const offscreenImgRef = useRef<HTMLImageElement | null>(null);

  // When value changes from external (e.g. edit item loaded), parse meta
  useEffect(() => {
    if (value && value.startsWith('data:image')) {
      const approxBytes = Math.round((value.length * 3) / 4);
      const img = new Image();
      img.onload = () => {
        setImageMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeKb: Math.round(approxBytes / 1024)
        });
      };
      img.src = value;
    }
  }, [value]);

  // Process image with canvas whenever ratio, size, alignment, or zoom changes
  const processCanvasImage = (sourceSrc: string, targetRatio: SupportedRatio, targetSize: SupportedSize, align: 'center' | 'top' | 'bottom', zoomLevel: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const ratioConfig = RATIO_OPTIONS.find((r) => r.id === targetRatio) || RATIO_OPTIONS[0];
        const sizeConfig = SIZE_OPTIONS.find((s) => s.id === targetSize) || SIZE_OPTIONS[0];

        const targetRatioVal = ratioConfig.ratio;

        // Calculate destination canvas dimensions
        let destW = sizeConfig.maxDimension;
        let destH = Math.round(destW / targetRatioVal);

        // Cap height if too large
        if (destH > 2160) {
          destH = 2160;
          destW = Math.round(destH * targetRatioVal);
        }

        const canvas = document.createElement('canvas');
        canvas.width = destW;
        canvas.height = destH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background dark velvet backing for transparent images
        ctx.fillStyle = '#08080C';
        ctx.fillRect(0, 0, destW, destH);

        // Calculate source crop rectangle
        const srcW = img.naturalWidth;
        const srcH = img.naturalHeight;
        const srcRatio = srcW / srcH;

        let cropW = srcW;
        let cropH = srcH;

        if (srcRatio > targetRatioVal) {
          // Source is wider than target ratio: crop sides
          cropW = srcH * targetRatioVal;
          cropH = srcH;
        } else {
          // Source is taller than target ratio: crop top/bottom
          cropW = srcW;
          cropH = srcW / targetRatioVal;
        }

        // Apply zoom to crop box (higher zoom = smaller crop window)
        cropW = cropW / zoomLevel;
        cropH = cropH / zoomLevel;

        // Calculate crop origin
        let cropX = (srcW - cropW) / 2;
        let cropY = (srcH - cropH) / 2;

        if (align === 'top') {
          cropY = 0;
        } else if (align === 'bottom') {
          cropY = srcH - cropH;
        }

        // Clamp inside bounds
        cropX = Math.max(0, Math.min(srcW - cropW, cropX));
        cropY = Math.max(0, Math.min(srcH - cropH, cropY));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, destW, destH);

        const dataUrl = canvas.toDataURL('image/jpeg', sizeConfig.quality);
        const approxBytes = Math.round((dataUrl.length * 3) / 4);

        setImageMeta({
          width: destW,
          height: destH,
          sizeKb: Math.round(approxBytes / 1024)
        });

        onChange(dataUrl, targetRatio);
      } catch (err) {
        console.error('Canvas processing error:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    img.src = sourceSrc;
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('कृपया फक्त इमेज फाईल (JPG, PNG, WebP) निवडा.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setRawImageSrc(result);
        processCanvasImage(result, selectedRatio, selectedSize, alignment, zoom);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRatioChange = (newRatio: SupportedRatio) => {
    setSelectedRatio(newRatio);
    const src = rawImageSrc || value;
    if (src) {
      processCanvasImage(src, newRatio, selectedSize, alignment, zoom);
    }
  };

  const handleSizeChange = (newSize: SupportedSize) => {
    setSelectedSize(newSize);
    const src = rawImageSrc || value;
    if (src) {
      processCanvasImage(src, selectedRatio, newSize, alignment, zoom);
    }
  };

  const handleAlignChange = (newAlign: 'center' | 'top' | 'bottom') => {
    setAlignment(newAlign);
    const src = rawImageSrc || value;
    if (src) {
      processCanvasImage(src, selectedRatio, selectedSize, newAlign, zoom);
    }
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    const src = rawImageSrc || value;
    if (src) {
      processCanvasImage(src, selectedRatio, selectedSize, alignment, newZoom);
    }
  };

  const handleClear = () => {
    setRawImageSrc(null);
    setImageMeta(null);
    onChange('', selectedRatio);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasImage = Boolean(value && value.trim().length > 0);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-200 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
          <span>{label}</span>
          {required && <span className="text-red-400 font-bold">*</span>}
        </label>
        <span className="text-[11px] font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
          Device Media Upload Only
        </span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Ratio Selector Tabs (16:9, 21:9, 4:3, 1:1) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span className="font-semibold text-gray-300">१. ॲस्पेक्ट रेशो निवडा (Aspect Ratio Selection):</span>
          <span className="text-[#F3D068] font-mono font-bold">{selectedRatio} Active</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {RATIO_OPTIONS.map((opt) => {
            const isSelected = selectedRatio === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleRatioChange(opt.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#151520] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold font-mono ${isSelected ? 'text-[#F3D068]' : 'text-gray-300'}`}>
                    {opt.id}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                </div>
                <div className="text-[10px] text-gray-300 font-medium truncate mt-0.5">
                  {opt.label.split(' ')[1] || opt.label}
                </div>
                <div className="text-[9px] text-gray-500 truncate mt-0.5">
                  {opt.sublabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size / Resolution Selector Tabs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span className="font-semibold text-gray-300">२. इमेज साईझ व रिझोल्यूशन (Size Selection):</span>
          <span className="text-[#F3D068] font-mono font-bold">{selectedSize} Quality</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((opt) => {
            const isSelected = selectedSize === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSizeChange(opt.id)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white'
                    : 'bg-[#151520] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold font-mono text-gray-200">
                  {opt.label}
                </div>
                <div className="text-[9px] text-gray-500 truncate mt-0.5">
                  {opt.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Drop Zone & Live Preview */}
      {!hasImage ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#12121A]/70 hover:bg-[#161622] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all group shadow-inner"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition-all">
            <Upload className="w-7 h-7" />
          </div>
          <p className="text-sm font-cinzel font-bold text-white group-hover:text-[#F3D068] transition">
            क्लिक करा किंवा इमेज ड्रॅग करा (Upload Media Image)
          </p>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {helperText}
          </p>
          <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-[#D4AF37] font-mono">
            <span>PNG, JPG, WebP</span>
            <span>•</span>
            <span>Auto {selectedRatio} Crop</span>
            <span>•</span>
            <span>{selectedSize} High-Res</span>
          </div>
        </div>
      ) : (
        /* Image Preview Box with Controls */
        <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#12121A] p-4 space-y-3 shadow-xl">
          <div className="relative rounded-xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center min-h-[200px] max-h-[360px]">
            <img
              src={value}
              alt="Uploaded Banner Media"
              className="max-h-[360px] w-auto max-w-full object-contain filter drop-shadow-md"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center text-xs text-[#F3D068] font-bold">
                <Sparkles className="w-5 h-5 animate-spin mr-2" />
                क्रॉप आणि ऑप्टिमाईज होत आहे...
              </div>
            )}
            {/* Aspect Ratio Badge Overlay */}
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#D4AF37]/40 text-[#F3D068] text-[10px] font-mono font-bold flex items-center gap-1.5 shadow">
              <Crop className="w-3 h-3 text-[#D4AF37]" />
              <span>{selectedRatio}</span>
              {imageMeta && (
                <span className="text-gray-300">
                  • {imageMeta.width}×{imageMeta.height} ({imageMeta.sizeKb} KB)
                </span>
              )}
            </div>
          </div>

          {/* Quick Fine-Tuning Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
            {/* Alignment Options */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-gray-400 mr-1">अलाइनमेंट:</span>
              <button
                type="button"
                onClick={() => handleAlignChange('top')}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                  alignment === 'top'
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Top / Face
              </button>
              <button
                type="button"
                onClick={() => handleAlignChange('center')}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                  alignment === 'center'
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Center
              </button>
              <button
                type="button"
                onClick={() => handleAlignChange('bottom')}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                  alignment === 'bottom'
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Bottom
              </button>
            </div>

            {/* Zoom Slider */}
            <div className="flex items-center gap-2 text-[11px]">
              <ZoomIn className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-400 text-[10px]">झूम:</span>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-20 accent-[#D4AF37] cursor-pointer"
              />
              <span className="text-gray-300 font-mono text-[10px]">{zoom.toFixed(2)}x</span>
            </div>

            {/* Actions: Replace / Delete */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Change Image</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs transition cursor-pointer"
                title="Remove Media"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
