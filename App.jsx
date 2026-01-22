import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, AlertCircle, Download, Loader2, ArrowRight, Youtube, Twitter, ChevronDown, Upload, X, Pencil, Check, Scissors, Shirt, Package, Video, FileText, Camera, User, Headphones, ImagePlus, Layers, UserPlus, Palette, Zap, Play, Copy, Instagram, Smartphone } from 'lucide-react';

const TikTokIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const App = () => {
  const [activeTool, setActiveTool] = useState('prompt-extract');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [scriptOutput, setScriptOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const tools = [
    { id: 'prompt-extract', name: 'Ekstrak Prompt', icon: <Scissors size={20} />, desc: 'Ambil prompt dari gambar' },
    { id: 'virtual-tryon', name: 'Virtual Try-On', icon: <Shirt size={20} />, desc: 'Coba pakaian virtual' },
    { id: 'product-photo', name: 'Foto Produk', icon: <Camera size={20} />, desc: 'Generate foto produk' },
    { id: 'video-script-image', name: 'Script Video', icon: <Video size={20} />, desc: 'Dari gambar ke script' },
    { id: 'video-script-product', name: 'Script Produk', icon: <FileText size={20} />, desc: 'Script untuk brand' },
  ];

  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const fileInputRef = useRef(null);

  const [aspectRatio, setAspectRatio] = useState('');
  const [gender, setGender] = useState('');
  const [artStyle, setArtStyle] = useState('');
  const [lighting, setLighting] = useState('');
  const [cameraAngle, setCameraAngle] = useState('');
  const [mood, setMood] = useState('');
  const [background, setBackground] = useState('');
  const [videoFormat, setVideoFormat] = useState('reels');
  const [pose, setPose] = useState('');

  const [uploadedImages, setUploadedImages] = useState({
    main: null,
    model: null,
    costume: null,
    face: null,
    bottoms: null,
    background: null,
    reference: null,
  });

  const aspectRatioOptions = [
    { value: '', label: 'Pilih' },
    { value: '1:1', label: '1:1 (Kotak)' },
    { value: '16:9', label: '16:9 (Lanskap)' },
    { value: '9:16', label: '9:16 (Potret)' },
    { value: '4:3', label: '4:3 (Standar)' },
    { value: '3:4', label: '3:4 (Potret Standar)' },
  ];

  const genderOptions = [
    { value: '', label: 'Pilih' },
    { value: 'male', label: 'Pria' },
    { value: 'female', label: 'Wanita' },
    { value: 'non-binary', label: 'Non-biner' },
  ];

  const artStyleOptions = [
    { value: '', label: 'Pilih' },
    { value: 'realistic', label: 'Realistis/Fotorealistis' },
    { value: 'cartoon', label: 'Kartun' },
    { value: 'anime', label: 'Anime' },
    { value: '3d-render', label: 'Render 3D' },
    { value: 'watercolor', label: 'Cat Air' },
    { value: 'minimalist', label: 'Minimalis' },
  ];

  const lightingOptions = [
    { value: '', label: 'Pilih' },
    { value: 'natural', label: 'Cahaya Alami' },
    { value: 'studio', label: 'Pencahayaan Studio' },
    { value: 'cinematic', label: 'Sinematik' },
    { value: 'golden-hour', label: 'Golden Hour' },
    { value: 'soft', label: 'Lembut/Difusi' },
  ];

  const cameraAngleOptions = [
    { value: '', label: 'Pilih' },
    { value: 'close-up', label: 'Jarak Dekat' },
    { value: 'portrait', label: 'Potret' },
    { value: 'full-body', label: 'Seluruh Badan' },
    { value: 'wide-shot', label: 'Sudut Lebar' },
  ];

  const moodOptions = [
    { value: '', label: 'Pilih' },
    { value: 'happy', label: 'Bahagia' },
    { value: 'elegant', label: 'Elegan' },
    { value: 'casual', label: 'Kasual' },
    { value: 'professional', label: 'Profesional' },
  ];

  const poseOptions = [
    { value: '', label: 'Pilih' },
    { value: 'standing-front', label: 'Berdiri Depan' },
    { value: 'standing-side', label: 'Berdiri Samping' },
    { value: 'standing-3q', label: 'Berdiri 3/4' },
    { value: 'walking', label: 'Berjalan' },
    { value: 'sitting', label: 'Duduk' },
    { value: 'sitting-crossleg', label: 'Duduk Bersila' },
    { value: 'sitting-chair', label: 'Duduk Kursi' },
    { value: 'sitting-edge', label: 'Duduk Tepi' },
    { value: 'dynamic-action', label: 'Aksi Dinamis' },
    { value: 'pose-hand-hip', label: 'Pose Tangan di Pinggul' },
    { value: 'pose-one-leg', label: 'Berdiri Satu Kaki' },
  ];

  const backgroundOptions = [
    { value: '', label: 'Pilih' },
    { value: 'plain-studio', label: 'Polos/Studio' },
    { value: 'nature', label: 'Alam/Luar Ruangan' },
    { value: 'urban', label: 'Perkotaan' },
    { value: 'indoor', label: 'Dalam Ruangan' },
    { value: 'gradient', label: 'Gradien' },
  ];

  const videoFormatOptions = [
    { value: 'reels', label: 'Instagram Reels', icon: <Instagram size={16} /> },
    { value: 'tiktok', label: 'TikTok', icon: <TikTokIcon size={16} /> },
    { value: 'shorts', label: 'YouTube Shorts', icon: <Youtube size={16} /> },
  ];

  const productStyleOptions = [
    { value: '', label: 'Pilih' },
    { value: 'luxury', label: 'Luxury/Premium' },
    { value: 'minimalist', label: 'Minimalis' },
    { value: 'commercial', label: 'Komersial' },
    { value: 'lifestyle', label: 'Gaya Hidup' },
    { value: 'streetwear', label: 'Streetwear' },
    { value: 'editorial', label: 'Editorial' },
  ];

  const IMAGE_COUNT = 4;

  const getAspectRatioStyle = (ratio) => {
    if (!ratio) return 'aspect-square';
    const ratioMap = {
      '1:1': 'aspect-square',
      '16:9': 'aspect-video',
      '9:16': 'aspect-[9/16]',
      '4:3': 'aspect-[4/3]',
      '3:4': 'aspect-[3/4]',
    };
    return ratioMap[ratio] || 'aspect-square';
  };

  const buildEnhancedPrompt = () => {
    let enhancedPrompt = prompt;
    const additions = [];

    if (gender && gender !== 'no-person') {
      additions.push(`${gender} subject`);
    }
    if (artStyle) {
      const styleLabel = artStyleOptions.find(o => o.value === artStyle)?.label || artStyle;
      additions.push(`${styleLabel} style`);
    }
    if (lighting) {
      const lightLabel = lightingOptions.find(o => o.value === lighting)?.label || lighting;
      additions.push(`${lightLabel}`);
    }
    if (cameraAngle) {
      const angleLabel = cameraAngleOptions.find(o => o.value === cameraAngle)?.label || cameraAngle;
      additions.push(`${angleLabel}`);
    }
    if (mood) {
      const moodLabel = moodOptions.find(o => o.value === mood)?.label || mood;
      additions.push(`${moodLabel} atmosphere`);
    }
    if (background) {
      const bgLabel = backgroundOptions.find(o => o.value === background)?.label || background;
      additions.push(`${bgLabel} background`);
    }

    if (additions.length > 0) {
      enhancedPrompt = `${prompt}, ${additions.join(', ')}`;
    }

    return enhancedPrompt;
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 4 * 1024 * 1024;

    if (!validTypes.includes(file.type) || file.size > maxSize) {
      setError('File tidak valid. Gunakan JPEG, PNG, atau WebP dengan ukuran maksimal 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const base64 = dataUrl.split(',')[1];
      setUploadedImages(prev => ({ ...prev, [field]: { base64, mimeType: file.type, preview: dataUrl } }));
      setError(null);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeUploadedImage = (field) => {
    setUploadedImages(prev => ({ ...prev, [field]: null }));
  };

  const downloadImage = (url, index) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `nano-gen-${index}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateImages = async () => {
    if (!prompt.trim() && !uploadedImages.main) return;

    setLoading(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedImageIndex(null);

    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    const enhancedPrompt = buildEnhancedPrompt();

    const fetchOneImage = async (index) => {
      const generationConfig = { responseModalities: ["IMAGE"] };
      if (aspectRatio) {
        generationConfig.imageGenerationConfig = { aspectRatio };
      }

      const parts = [];
      if (uploadedImages.main) {
        parts.push({ inline_data: { mime_type: uploadedImages.main.mimeType, data: uploadedImages.main.base64 } });
      }
      parts.push({ text: enhancedPrompt });

      const payload = { contents: [{ parts }], generationConfig };

      try {
        const fetchWithRetry = async (retries = 2) => {
          try {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res;
          } catch (e) {
            if (retries > 0) {
              await new Promise(r => setTimeout(r, 1000));
              return fetchWithRetry(retries - 1);
            }
            throw e;
          }
        };

        const response = await fetchWithRetry();
        const result = await response.json();
        const candidates = result.candidates;
        if (candidates && candidates.length > 0) {
          const imagePart = candidates[0].content.parts.find(p => p.inlineData);
          if (imagePart) {
            return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
          }
        }
        return null;
      } catch (err) {
        console.error(`Failed to generate image ${index + 1}`, err);
        return null;
      }
    };

    try {
      const promises = Array(IMAGE_COUNT).fill(0).map((_, i) => fetchOneImage(i));
      const results = await Promise.all(promises);
      const successfulImages = results.filter(img => img !== null);

      if (successfulImages.length === 0) {
        throw new Error("Gagal membuat gambar. Silakan coba lagi.");
      }

      setGeneratedImages(successfulImages);
      setSelectedImageIndex(0);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const extractPrompt = async () => {
    if (!uploadedImages.main) {
      setError('Silakan upload gambar terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedResult(null);

    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [
          { inline_data: { mime_type: uploadedImages.main.mimeType, data: uploadedImages.main.base64 } },
          { text: "Describe this image in detail. Include: subject, style, lighting, colors, composition, mood, and any text visible. Write the description in Indonesian. Format as a detailed image prompt that can be used for AI image generation." }
        ]
      }]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      const candidates = result.candidates;
      if (candidates && candidates.length > 0) {
        const textPart = candidates[0].content.parts.find(p => p.text);
        if (textPart) {
          setGeneratedResult(textPart.text);
        } else {
          throw new Error('Tidak ada teks dalam respons.');
        }
      } else {
        throw new Error('Gagal mengekstrak prompt.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengekstrak prompt');
    } finally {
      setLoading(false);
    }
  };

  const generateVideoScript = async (type) => {
    if (!prompt.trim() && !uploadedImages.reference) {
      setError('Silakan masukkan prompt atau upload gambar.');
      return;
    }

    setLoading(true);
    setError(null);
    setScriptOutput('');

    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'image-based') {
      systemPrompt = `Kamu adalah spesialis konten kreatif untuk media sosial. Buat script video yang engaging untuk ${videoFormatOptions.find(f => f.value === videoFormat)?.label || 'Instagram Reels'}.
      
Format output (gunakan format ini):
---JUDUL:[Judul video yang menarik]
---
[DURASI] [DESKRIPSI SCENE]
[VOICEOVER/NARRASI]
---
[END SCENE]

PENTING:
- Total durasi: 15-30 detik
- Gunakan kata-kata yang catchy
- Sertakan CTA (Call to Action)
- Format sesuai standar ${videoFormatOptions.find(f => f.value === videoFormat)?.label || 'Reels'}`;

      userPrompt = uploadedImages.reference 
        ? `Buat script video berdasarkan gambar ini dan prompt: "${prompt}". Gambar menggambarkan: [akan dianalisis AI]`
        : `Buat script video dengan tema: "${prompt}"`;
    } else {
      systemPrompt = `Kamu adalah spesialis marketing dan content creator. Buat script video produk yang professional untuk ${videoFormatOptions.find(f => f.value === videoFormat)?.label || 'Reels'}.

Format output:
---JUDUL:[Judul yang menarik]
---
[DURASI] [SCENE]
[VOICEOVER]
[TIPS/TRIK jika perlu]
---
[END SCENE]

Sertakan:
- Hook yang kuat di awal
- Benefit produk
- CTA yang jelas
- Hashtag relevan`;

      userPrompt = `Buat script video untuk produk/brand: "${prompt}"`;
    }

    const payload = {
      contents: [{
        parts: [
          ...(uploadedImages.reference ? [{ inline_data: { mime_type: uploadedImages.reference.mimeType, data: uploadedImages.reference.base64 } }] : []),
          { text: `${systemPrompt}\n\n${userPrompt}` }
        ]
      }]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      const candidates = result.candidates;
      if (candidates && candidates.length > 0) {
        const textPart = candidates[0].content.parts.find(p => p.text);
        if (textPart) {
          setScriptOutput(textPart.text);
        } else {
          throw new Error('Tidak ada teks dalam respons.');
        }
      } else {
        throw new Error('Gagal membuat script.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat membuat script');
    } finally {
      setLoading(false);
    }
  };

  const brutalCard = "bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-xl overflow-hidden";
  const brutalBtn = "border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_#000000] transition-all font-bold uppercase tracking-wide";
  const brutalInput = "w-full bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:shadow-[4px_4px_0px_0px_#000000] outline-none transition-all p-4 text-black placeholder-gray-500 font-medium rounded-lg";
  const brutalSelect = "w-full bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:shadow-[4px_4px_0px_0px_#000000] outline-none transition-all p-3 text-black font-medium rounded-lg appearance-none cursor-pointer";

  const SelectField = ({ label, value, onChange, options, className = '' }) => (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-xs font-bold uppercase text-gray-600">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={brutalSelect} disabled={loading}>
          {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
      </div>
    </div>
  );

  const UploadField = ({ label, field, required = false, hint }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase text-gray-600">{label}</span>
        {required && <span className="text-xs font-bold text-red-500">*</span>}
      </div>
      {!uploadedImages[field] ? (
        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleImageUpload(e, field)}
            className="hidden"
            disabled={loading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className={`w-full ${brutalBtn} px-4 py-4 rounded-lg flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 ${loading ? 'opacity-50' : ''}`}
          >
            <Upload size={18} />
            <span>UNGGAH</span>
          </button>
        </div>
      ) : (
        <div className="relative group">
          <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
            <img src={uploadedImages[field].preview} alt={label} className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => removeUploadedImage(field)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full border-2 border-black flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );

  const renderToolContent = () => {
    switch (activeTool) {
      case 'prompt-extract':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className={`${brutalCard} p-6 md:p-8 space-y-6`}>
                <div className="space-y-2">
                  <h2 className="text-xl font-black uppercase tracking-tight">Ekstrak Prompt dari Gambar</h2>
                  <p className="text-sm font-medium text-gray-500">Upload gambar untuk mengekstrak prompt yang dapat digunakan untuk AI image generation.</p>
                </div>

                <UploadField label="Gambar Sumber" field="main" required={true} />

                <div className="flex items-center justify-end pt-2">
                  <button
                    onClick={extractPrompt}
                    disabled={loading || !uploadedImages.main}
                    className={`${brutalBtn} px-6 py-3 rounded-lg flex items-center gap-2 ${loading || !uploadedImages.main ? 'bg-gray-200 text-gray-400 border-gray-400 shadow-none translate-y-0 cursor-not-allowed' : 'bg-[#A7F3D0] text-black'}`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Scissors size={20} />}
                    <span>{loading ? 'MEMPROSES...' : 'EKSTRAK PROMPT'}</span>
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border-2 border-black flex items-start gap-3 rounded-lg">
                    <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    <p className="font-bold text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`${brutalCard} p-6 h-full flex flex-col`}>
                <h3 className="font-black text-lg uppercase mb-4">Hasil Prompt</h3>
                {generatedResult ? (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex-1 p-4 bg-gray-50 rounded-lg border-2 border-black border-dashed">
                      <p className="text-sm font-medium text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedResult}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(generatedResult)}
                      className={`${brutalBtn} px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${copied ? 'bg-green-400' : 'bg-[#A7F3D0]'}`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      <span>{copied ? 'DISALIN!' : 'SALIN PROMPT'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <Scissors size={48} className="mb-4 opacity-20" />
                    <p className="font-bold text-sm">HASIL AKAN MUNCUL DISINI</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'virtual-tryon':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className={`${brutalCard} p-6 md:p-8 space-y-6`}>
                <div className="space-y-2">
                  <h2 className="text-xl font-black uppercase tracking-tight">Virtual Try-On</h2>
                  <p className="text-sm font-medium text-gray-500">Coba pakaian secara virtual dengan upload foto model dan produk.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <UploadField label="Foto Model" field="model" required={true} hint="Foto全身 dengan postur baik" />
                  <UploadField label="Foto Pakaian" field="costume" required={true} hint="Foto produk yang ingin dicoba" />
                  <UploadField label="Referensi Wajah" field="face" hint="Untuk menjaga konsistensi wajah" />
                  <UploadField label="Referensi Bawah" field="bottoms" hint="Celana/rok yang ingin dicocokkan" />
                  <UploadField label="Background" field="background" hint="Latar belakang opsional" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="Pose Model" value={pose} onChange={setPose} options={poseOptions} />
                  <SelectField label="Rasio Aspek" value={aspectRatio} onChange={setAspectRatio} options={aspectRatioOptions} />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-600">Prompt Tambahan</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tambahkan detail seperti: gaya rambut, make-up, aksesoris..."
                    className={`${brutalInput} min-h-[80px] resize-none`}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    onClick={generateImages}
                    disabled={loading || !uploadedImages.model || !uploadedImages.costume}
                    className={`${brutalBtn} px-6 py-3 rounded-lg flex items-center gap-2 ${loading || !uploadedImages.model || !uploadedImages.costume ? 'bg-gray-200 text-gray-400 border-gray-400 shadow-none translate-y-0 cursor-not-allowed' : 'bg-[#A7F3D0] text-black'}`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    <span>{loading ? 'MEMPROSES...' : 'BUAT TRY-ON'}</span>
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border-2 border-black flex items-start gap-3 rounded-lg">
                    <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    <p className="font-bold text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`${brutalCard} p-6 h-full flex flex-col`}>
                <h3 className="font-black text-lg uppercase mb-4">Pratinjau</h3>
                {selectedImageIndex !== null && generatedImages[selectedImageIndex] ? (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className={`rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000000] ${getAspectRatioStyle(aspectRatio)} relative`}>
                      <img src={generatedImages[selectedImageIndex]} alt="Selected" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => downloadImage(generatedImages[selectedImageIndex], selectedImageIndex)}
                      className={`w-full ${brutalBtn} bg-white px-4 py-3 rounded-lg flex items-center justify-center gap-2`}
                    >
                      <Download size={18} />
                      <span>UNDUH</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <Shirt size={48} className="mb-4 opacity-20" />
                    <p className="font-bold text-sm">PILIH HASIL</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'product-photo':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className={`${brutalCard} p-6 md:p-8 space-y-6`}>
                <div className="space-y-2">
                  <h2 className="text-xl font-black uppercase tracking-tight">Foto Produk</h2>
                  <p className="text-sm font-medium text-gray-500">Generate foto produk professional untuk brand Anda.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <UploadField label="Foto Produk" field="main" required={true} hint="Foto produk dengan background bersih" />
                  <UploadField label="Background Referensi" field="background" hint="Contoh background yang diinginkan" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SelectField label="Gaya Foto" value={artStyle} onChange={setArtStyle} options={productStyleOptions} />
                  <SelectField label="Rasio Aspek" value={aspectRatio} onChange={setAspectRatio} options={aspectRatioOptions} />
                  <SelectField label="Pencahayaan" value={lighting} onChange={setLighting} options={lightingOptions} />
                  <SelectField label="Suasana" value={mood} onChange={setMood} options={moodOptions} />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-600">Prompt Tambahan</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Jelaskan style yang diinginkan, misalnya: commercial photography, product on marble table, soft lighting..."
                    className={`${brutalInput} min-h-[80px] resize-none`}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    onClick={generateImages}
                    disabled={loading || !uploadedImages.main}
                    className={`${brutalBtn} px-6 py-3 rounded-lg flex items-center gap-2 ${loading || !uploadedImages.main ? 'bg-gray-200 text-gray-400 border-gray-400 shadow-none translate-y-0 cursor-not-allowed' : 'bg-[#FCD34D] text-black'}`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    <span>{loading ? 'MEMPROSES...' : 'GENERATE FOTO'}</span>
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border-2 border-black flex items-start gap-3 rounded-lg">
                    <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    <p className="font-bold text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`${brutalCard} p-6 h-full flex flex-col`}>
                <h3 className="font-black text-lg uppercase mb-4">Pratinjau</h3>
                {selectedImageIndex !== null && generatedImages[selectedImageIndex] ? (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className={`rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000000] ${getAspectRatioStyle(aspectRatio)} relative`}>
                      <img src={generatedImages[selectedImageIndex]} alt="Selected" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => downloadImage(generatedImages[selectedImageIndex], selectedImageIndex)}
                      className={`w-full ${brutalBtn} bg-white px-4 py-3 rounded-lg flex items-center justify-center gap-2`}
                    >
                      <Download size={18} />
                      <span>UNDUH HD</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <Camera size={48} className="mb-4 opacity-20" />
                    <p className="font-bold text-sm">PILIH HASIL</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'video-script-image':
      case 'video-script-product':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className={`${brutalCard} p-6 md:p-8 space-y-6`}>
                <div className="space-y-2">
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    {activeTool === 'video-script-image' ? 'Script Video dari Gambar' : 'Script Video Produk'}
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    {activeTool === 'video-script-image' 
                      ? 'Buat script video kreatif berdasarkan gambar dan prompt.'
                      : 'Buat script video marketing untuk brand atau produk Anda.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <UploadField 
                    label={activeTool === 'video-script-image' ? "Gambar Referensi" : "Foto Produk"} 
                    field="reference" 
                    required={activeTool === 'video-script-product'}
                    hint={activeTool === 'video-script-image' ? "Gambar yang ingin dijadikan inspirasi" : "Foto produk untuk script"} 
                  />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-gray-600">Format Video</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {videoFormatOptions.map(format => (
                        <button
                          key={format.value}
                          onClick={() => setVideoFormat(format.value)}
                          className={`${brutalBtn} px-3 py-2 rounded-lg flex flex-col items-center gap-1 text-xs ${videoFormat === format.value ? 'bg-[#FCD34D]' : 'bg-gray-50'}`}
                        >
                          {format.icon}
                          <span>{format.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-600">
                    {activeTool === 'video-script-image' ? 'Prompt / Topik Video' : 'Deskripsi Produk/Brand'}
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={activeTool === 'video-script-image' 
                      ? "Contoh: Tutorial make-up tampilan natural, styling tips untuk outfit casual..."
                      : "Contoh: Jersey futsal premium dengan teknologi breathable fabric, brand: SportMax..."}
                    className={`${brutalInput} min-h-[120px] resize-none`}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    onClick={() => generateVideoScript(activeTool === 'video-script-image' ? 'image-based' : 'product-based')}
                    disabled={loading || (!prompt.trim() && activeTool === 'video-script-product')}
                    className={`${brutalBtn} px-6 py-3 rounded-lg flex items-center gap-2 ${loading || (!prompt.trim() && activeTool === 'video-script-product') ? 'bg-gray-200 text-gray-400 border-gray-400 shadow-none translate-y-0 cursor-not-allowed' : 'bg-[#60A5FA] text-white'}`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Video size={20} />}
                    <span>{loading ? 'MEMPROSES...' : 'BUAT SCRIPT'}</span>
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border-2 border-black flex items-start gap-3 rounded-lg">
                    <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    <p className="font-bold text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`${brutalCard} p-6 h-full flex flex-col`}>
                <h3 className="font-black text-lg uppercase mb-4">Script Hasil</h3>
                {scriptOutput ? (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex-1 p-4 bg-gray-50 rounded-lg border-2 border-black border-dashed overflow-auto max-h-[400px]">
                      <p className="text-sm font-medium text-gray-800 whitespace-pre-wrap leading-relaxed">{scriptOutput}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(scriptOutput)}
                      className={`${brutalBtn} px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${copied ? 'bg-green-400' : 'bg-[#60A5FA] text-white'}`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      <span>{copied ? 'DISALIN!' : 'SALIN SCRIPT'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <FileText size={48} className="mb-4 opacity-20" />
                    <p className="font-bold text-sm text-center px-4">SCRIPT AKAN<br/>MUNCUL DISINI</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] text-black font-sans p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        
        {/* Header Bar with Tool Navigation */}
        <div className={`${brutalCard} p-4`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FCD34D] rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
                <Sparkles size={24} className="text-black" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight">NanoGen AI</h1>
                <p className="text-xs font-medium text-gray-500">Multi-Tool Creative Suite</p>
              </div>
            </div>

            {/* Tool Navigation - Icon Grid */}
            <div className="flex flex-wrap justify-center gap-2">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`${brutalBtn} px-4 py-3 rounded-lg flex items-center gap-2 text-sm transition-all
                    ${activeTool === tool.id 
                      ? 'bg-[#FCD34D] translate-y-0 shadow-[4px_4px_0px_0px_#000000]' 
                      : 'bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <span className={activeTool === tool.id ? '' : 'text-gray-600'}>
                    {tool.icon}
                  </span>
                  <span className="hidden sm:inline">{tool.name}</span>
                </button>
              ))}
            </div>

            {/* Social Links */}
            <div className="hidden md:flex items-center gap-2">
              <a href="https://youtube.com/@aidityasadhakim" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black rounded-full bg-[#FF0000] text-white hover:bg-white hover:text-black transition-colors">
                <Youtube size={18} />
              </a>
              <a href="https://tiktok.com/@itakumiii" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black rounded-full bg-black text-white hover:bg-white hover:text-black transition-colors">
                <TikTokIcon size={18} />
              </a>
              <a href="https://twitter.com/AAidityas" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black rounded-full bg-[#1DA1F2] text-white hover:bg-white hover:text-black transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Active Tool Indicator */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-gray-500 uppercase">Tool Aktif:</span>
          <span className="text-sm font-black text-black uppercase bg-[#FCD34D] px-3 py-1 rounded-lg border-2 border-black">
            {tools.find(t => t.id === activeTool)?.name}
          </span>
        </div>

        {/* Tool Content */}
        {renderToolContent()}

        {/* Generated Results - For Image Tools */}
        {['virtual-tryon', 'product-photo'].includes(activeTool) && generatedImages.length > 0 && (
          <div className={`${brutalCard} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-black animate-pulse"></div>
                Hasil Gambar
              </h3>
              <span className="text-sm font-bold text-gray-500">ID: {Date.now().toString().slice(-6)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`group relative ${getAspectRatioStyle(aspectRatio)} rounded-xl overflow-hidden cursor-pointer border-2 transition-all
                    ${selectedImageIndex === idx
                      ? 'border-black shadow-[4px_4px_0px_0px_#000000] scale-[1.01] z-10'
                      : 'border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_#000000]'
                    }
                  `}
                >
                  <img src={img} alt={`Gen ${idx}`} className="w-full h-full object-cover" />
                  {selectedImageIndex === idx && (
                    <div className="absolute inset-0 ring-4 ring-inset ring-[#FCD34D]"></div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 text-white text-xs font-bold translate-y-full group-hover:translate-y-0 transition-transform">
                    Varian #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
