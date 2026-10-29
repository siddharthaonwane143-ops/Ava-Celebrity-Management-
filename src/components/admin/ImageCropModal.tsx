import React, { useState, useEffect, useRef } from 'react';
import {
  Crop,
  Check,
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  Sparkles,
  Layers
} from 'lucide-react';

export type AspectRatioType = '1:1' | '3:4' | '4:5' | '9:16' | '16:9' | '21:9' | '4:3';

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  initialAspectRatio?: AspectRatioType;
  title?: string;
  onClose: () => void;
  onApplyCrop: (croppedDataUrl: string, selectedRatio: AspectRatioType) => void;
}

const RATIO_CONFIGS: Record<AspectRatioType, { label: string; ratio: number; width: number; height: number; description: string }> = {
  '16:9': {
    label: '16:9 Widescreen',
    ratio: 16 / 9,
    width: 440,
    height: 247,
    description: 'Widescreen Trailer, Banner & Film Poster (सिनेमॅटिक बॅनर)'
  },
  '21:9': {
    label: '21:9 Cinematic',
    ratio: 21 / 9,
    width: 480,
    height: 205,
    description: 'Ultra-Wide Cinematic Panoramic Banner (अल्ट्रा-वाईड सिनेमा)'
  },
  '4:3': {
    label: '4:3 Editorial',
    ratio: 4 / 3,
    width: 400,
    height: 300,
    description: 'Editorial Classic Campaign Format (क्लासिक कॅम्पेन)'
  },
  '1:1': {
    label: '1:1 Square',
    ratio: 1 / 1,
    width: 340,
    height: 340,
    description: 'Square Headshot & Spotlight Badge (स्क्वेअर प्रोफाईल/बॅनर)'
  },
  '3:4': {
    label: '3:4 Portrait',
    ratio: 3 / 4,
    width: 300,
    height: 400,
    description: 'Industry Standard Casting & Portfolio (अभिनेत्री/अभिनेता)'
  },
  '4:5': {
    label: '4:5 Feed',
    ratio: 4 / 5,
    width: 320,
    height: 400,
    description: 'Instagram & Social Feed Framing (इन्स्टाग्राम पोर्ट्रेट)'
  },
  '9:16': {
    label: '9:16 Reel Cover',
    ratio: 9 / 16,
    width: 250,
    height: 444,
    description: 'Vertical Reel, Story & Full-Length (रील्स कव्हर)'
  }
};

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageUrl,
  initialAspectRatio = '3:4',
  title = 'Professional Image Aspect Ratio & Crop Tool',
  onClose,
  onApplyCrop
}) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(initialAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageNaturalSize, setImageNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedRatio(initialAspectRatio);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setPreviewDataUrl(null);
  }, [initialAspectRatio, imageUrl, isOpen]);

  if (!isOpen || !imageUrl) return null;

  const currentConfig = RATIO_CONFIGS[selectedRatio];

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Preset alignments
  const alignTo = (position: 'top' | 'center' | 'bottom') => {
    if (!cropContainerRef.current || !imageRef.current) return;
    const containerHeight = currentConfig.height;
    const imgCurrentHeight = imageRef.current.clientHeight * zoom;

    if (position === 'top') {
      setPan((p) => ({ ...p, y: 0 }));
    } else if (position === 'center') {
      setPan({ x: 0, y: 0 });
    } else if (position === 'bottom') {
      const diff = (imgCurrentHeight - containerHeight) / 2;
      setPan((p) => ({ ...p, y: -diff }));
    }
  };

  // Execute Canvas Crop
  const generateCroppedImage = (): string | null => {
    if (!imageRef.current || !cropContainerRef.current) return null;
    const img = imageRef.current;
    const container = cropContainerRef.current;

    // Optimized target dimensions for crisp retina display and instant Firestore persistence (<80KB payload)
    let targetWidth = 720;
    let targetHeight = Math.round(720 / currentConfig.ratio);

    if (selectedRatio === '9:16') {
      targetWidth = 540;
      targetHeight = 960;
    } else if (selectedRatio === '16:9') {
      targetWidth = 960;
      targetHeight = 540;
    } else if (selectedRatio === '1:1') {
      targetWidth = 720;
      targetHeight = 720;
    } else if (selectedRatio === '4:5') {
      targetWidth = 648;
      targetHeight = 810;
    } else if (selectedRatio === '3:4') {
      targetWidth = 675;
      targetHeight = 900;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background fill (rich dark velvet backing if translucent)
    ctx.fillStyle = '#0B0B10';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Compute transformation from container viewport to canvas
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    // Scale ratio between on-screen crop box and final high-res canvas
    const scaleFactor = targetWidth / containerRect.width;

    // Offset of image inside crop container
    const offsetX = (imgRect.left - containerRect.left) * scaleFactor;
    const offsetY = (imgRect.top - containerRect.top) * scaleFactor;
    const drawWidth = imgRect.width * scaleFactor;
    const drawHeight = imgRect.height * scaleFactor;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    let dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    // Safety guard: if still > 300KB, re-encode with slightly higher compression
    if (dataUrl.length > 300 * 1024) {
      dataUrl = canvas.toDataURL('image/jpeg', 0.72);
    }
    return dataUrl;
  };

  const handleApply = () => {
    const cropped = generateCroppedImage();
    if (cropped) {
      onApplyCrop(cropped, selectedRatio);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="card-luxury rounded-2xl w-full max-w-4xl border border-[#D4AF37]/50 bg-[#0E0E14] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#171722] via-[#0E0E14] to-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F3D068] border border-[#D4AF37]/40 uppercase">
                  {selectedRatio}
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">
                इमेजचा योग्य रेशो निवडा (1:1, 3:4, 4:5, 9:16, 16:9), झूम करा व ड्रॅग करून चेहरा मध्यभागी सेट करा.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Aspect Ratio & Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
            {/* 1. Ratio Selector Buttons */}
            <div>
              <label className="text-xs font-cinzel font-bold text-[#F3D068] block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>1. Select Aspect Ratio (प्रमाण निवडा)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {(Object.keys(RATIO_CONFIGS) as AspectRatioType[]).map((key) => {
                  const cfg = RATIO_CONFIGS[key];
                  const isSelected = selectedRatio === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedRatio(key);
                        setPan({ x: 0, y: 0 });
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#D4AF37]/25 to-black border-[#D4AF37] text-white shadow-md'
                          : 'bg-[#151520] hover:bg-white/5 border-white/10 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[10px] font-bold ${
                            isSelected ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-gray-300'
                          }`}
                        >
                          {key}
                        </div>
                        <div>
                          <div className="text-xs font-semibold leading-tight">{cfg.label}</div>
                          <div className="text-[10px] text-gray-400">{cfg.description}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#F3D068] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Zoom & Alignment Controls */}
            <div className="p-4 rounded-xl bg-[#14141E] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Zoom Scale (आकार झूम)</span>
                </span>
                <span className="text-xs font-mono text-[#F3D068] font-bold">{zoom.toFixed(1)}x</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(1)))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center text-xs cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#D4AF37] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(1)))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white flex items-center justify-center text-xs cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Preset Alignment */}
              <div>
                <span className="text-[11px] text-gray-400 block mb-1.5 flex items-center gap-1">
                  <Move className="w-3 h-3 text-[#D4AF37]" />
                  <span>Quick Center / Face Align (चेहरा अलाइन करा):</span>
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => alignTo('top')}
                    className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 text-[11px] text-gray-200 hover:text-[#F3D068] transition cursor-pointer text-center"
                  >
                    Top (Face)
                  </button>
                  <button
                    type="button"
                    onClick={() => alignTo('center')}
                    className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 text-[11px] text-gray-200 hover:text-[#F3D068] transition cursor-pointer text-center"
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => alignTo('bottom')}
                    className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 text-[11px] text-gray-200 hover:text-[#F3D068] transition cursor-pointer text-center"
                  >
                    Bottom
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 bg-black/40 p-2 rounded-lg border border-white/5">
                💡 <strong>Tip:</strong> फोटोवर माउसने क्लिक करून ड्रॅग करा (Drag & Pan) जेणेकरून डोळे किंवा चेहरा परिपूर्ण सेंटरमध्ये येईल.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Canvas & Viewport (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center order-1 lg:order-2 space-y-3">
            <div className="w-full flex items-center justify-between text-xs text-gray-400 px-1">
              <span className="font-mono text-[#D4AF37]">
                Live Viewport: {currentConfig.label} ({currentConfig.width}x{currentConfig.height}px)
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Drag enabled
              </span>
            </div>

            {/* Crop Viewport Window */}
            <div
              className="relative p-3 bg-black/80 rounded-2xl border border-white/10 flex items-center justify-center w-full min-h-[380px] sm:min-h-[460px] overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                ref={cropContainerRef}
                style={{
                  width: `${currentConfig.width}px`,
                  height: `${currentConfig.height}px`,
                  maxHeight: '440px'
                }}
                className="relative rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl bg-[#08080C] cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* The Pan-able & Zoomable Image */}
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Crop Source"
                  crossOrigin="anonymous"
                  onLoad={handleImageLoad}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                  }}
                  className="w-full h-full object-contain pointer-events-none select-none max-w-none"
                />

                {/* Rule of Thirds Guide Grid */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-40">
                  <div className="border-r border-b border-[#D4AF37]/50" />
                  <div className="border-r border-b border-[#D4AF37]/50" />
                  <div className="border-b border-[#D4AF37]/50" />
                  <div className="border-r border-b border-[#D4AF37]/50" />
                  <div className="border-r border-b border-[#D4AF37]/50" />
                  <div className="border-b border-[#D4AF37]/50" />
                  <div className="border-r border-[#D4AF37]/50" />
                  <div className="border-r border-[#D4AF37]/50" />
                  <div />
                </div>

                {/* Ratio Tag in Corner */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-[#D4AF37]/60 text-[9px] font-mono text-[#F3D068] font-bold pointer-events-none">
                  {selectedRatio}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 text-center font-mono">
              Natural Size: {imageNaturalSize.width} × {imageNaturalSize.height}px • Output: High-Definition Crisp Master
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#12121A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setPan({ x: 0, y: 0 });
              setZoom(1);
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-semibold cursor-pointer transition flex items-center justify-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reset Position (मूळ स्थिती)</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-none btn-gold px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition"
            >
              <Check className="w-4 h-4 text-black" />
              <span>Apply Cropped Image ({selectedRatio})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
