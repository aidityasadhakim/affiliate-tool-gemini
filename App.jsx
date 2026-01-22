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
    { id: 'video-frames', name: 'Frame Video', icon: <Layers size={20} />, desc: '4 frame untuk video 8s' },
    { id: 'story-ads', name: 'Story Ads Natural', icon: <Instagram size={20} />, desc: '4 grid story natural ads' },
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
  const [voiceTone, setVoiceTone] = useState('');

  const [uploadedImages, setUploadedImages] = useState({
    main: null,
    model: null,
    costume: null,
    face: null,
    bottoms: null,
    background: null,
    reference: null,
  });

  // State for Video Frame Generator
  const [storyLine, setStoryLine] = useState('');
  const [referenceImages, setReferenceImages] = useState([]); // max 5 images
  const [videoFrames, setVideoFrames] = useState([]); // 4 generated frames
  const [frameGenerationProgress, setFrameGenerationProgress] = useState(0);
  const [regeneratingFrame, setRegeneratingFrame] = useState(null);

  // State for Story Ads Generator
  const [lifestyleSetting, setLifestyleSetting] = useState('');
  const [integrationStyle, setIntegrationStyle] = useState('');
  const [storyFrames, setStoryFrames] = useState([]); // 4 individual frames
  const [storyGridImage, setStoryGridImage] = useState(null); // merged 2x2 grid
  const [regeneratingStoryFrame, setRegeneratingStoryFrame] = useState(null);

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

  const voiceToneOptions = [
    { value: '', label: 'Pilih', hint: 'Pilih tone suara untuk narasi' },
    { value: 'casual', label: 'Kasual & Santai', hint: 'Bahasa sehari-hari, seperti ngobrol dengan teman' },
    { value: 'professional', label: 'Profesional', hint: 'Formal, bisnis, autoritatif dan expert' },
    { value: 'energetic', label: 'Energik & Semangat', hint: 'Penuh antusiasme, seru, dan action!' },
    { value: 'storytelling', label: 'Bercerita', hint: 'Narasi dengan alur cerita yang engaging' },
    { value: 'inspirational', label: 'Inspirasional', hint: 'Memotivasi dan membangkitkan semangat' },
    { value: 'humorous', label: 'Humoris', hint: 'Humor ringan dan menghibur' },
    { value: 'educational', label: 'Edukatif', hint: 'Informatif, jelas, step-by-step' },
    { value: 'emotional', label: 'Emosional', hint: 'Menyentuh perasaan dan membangun koneksi' },
    { value: 'asmr', label: 'ASMR/Lembut', hint: 'Suara tenang, pelan, menenangkan' },
    { value: 'dramatic', label: 'Dramatis', hint: 'Intens, penuh ketegangan dan suspense' },
    { value: 'minimalist', label: 'Minimalis/Simple', hint: 'Sederhana, langsung ke poin, tidak bertele-tele' },
    { value: 'conversational', label: 'Percakapan Interview', hint: 'Seperti wawancara atau Q&A natural' },
  ];

  const lifestyleSettingOptions = [
    { value: '', label: 'Pilih Setting Lifestyle' },
    { value: 'coffee-shop', label: 'Coffee Shop / Café' },
    { value: 'home-cozy', label: 'Home / Cozy Interior' },
    { value: 'gym-fitness', label: 'Gym / Fitness' },
    { value: 'office-workspace', label: 'Office / Workspace' },
    { value: 'travel-outdoor', label: 'Travel / Outdoor Adventure' },
    { value: 'restaurant-dining', label: 'Restaurant / Dining' },
    { value: 'shopping-retail', label: 'Shopping / Retail' },
    { value: 'beach-nature', label: 'Beach / Nature' },
    { value: 'urban-street', label: 'Urban / Street' },
    { value: 'studio-minimal', label: 'Studio / Minimal' },
  ];

  const integrationStyleOptions = [
    { value: '', label: 'Pilih Intensitas Brand' },
    { value: 'natural', label: 'Natural/Subtle - Produk blend alami' },
    { value: 'featured', label: 'Featured - Produk jadi fokus tapi tetap aesthetic' },
    { value: 'hero', label: 'Hero - Produk ditampilkan prominent' },
  ];

  const IMAGE_COUNT = 4;

  const getVoiceToneDescription = (tone) => {
    const descriptions = {
      casual: 'Gunakan bahasa sehari-hari, informal, seperti berbicara dengan teman. Gunakan kata "kamu", "nih", "banget", "gitu". Hindari bahasa formal.',
      professional: 'Gunakan bahasa formal, bisnis, dan autoritatif. Hindari slang. Nada percaya diri dan expert. Gunakan istilah profesional yang tepat.',
      energetic: 'Gunakan kalimat pendek, seru, penuh antusiasme! Banyak kata action dan emosi positif. Gunakan tanda seru! Cepat dan dinamis!',
      storytelling: 'Ceritakan dengan alur narasi yang jelas. Ada pembukaan yang menarik, konflik/masalah yang relatable, dan solusi/penutup yang memuaskan. Emosional dan engaging.',
      inspirational: 'Motivasi audience dengan kata-kata positif dan membangkitkan semangat. Fokus pada transformasi, potensi, dan impian. Gunakan kata-kata yang memberdayakan.',
      humorous: 'Gunakan humor ringan, jokes, wordplay, atau situasi lucu. Tetap relevan dengan topik dan tidak berlebihan. Buat audience tersenyum atau tertawa.',
      educational: 'Jelaskan dengan jelas, step-by-step, informatif. Gunakan fakta, data, dan contoh konkret. Struktur yang terorganisir dan mudah dipahami.',
      emotional: 'Sentuh emosi audience dengan storytelling emosional. Bangun koneksi personal dan empati. Gunakan pengalaman relatable dan perasaan universal.',
      asmr: 'Gunakan bahasa yang tenang, lembut, dan menenangkan. Deskripsi sensory yang detail. Tempo pelan dan suara yang soft. Buat suasana rileks.',
      dramatic: 'Gunakan bahasa yang intens dan penuh ketegangan. Build up suspense. Kontras yang kuat. Timing yang tepat untuk reveal atau twist.',
      minimalist: 'Sederhana dan langsung ke poin. Tidak bertele-tele. Kalimat singkat dan padat. Fokus pada pesan inti tanpa embel-embel.',
      conversational: 'Seperti percakapan natural atau wawancara. Gunakan pertanyaan dan jawaban. Interaktif dengan audience. Gunakan filler words seperti "jadi", "nah", "terus".',
    };
    return descriptions[tone] || '';
  };

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

  // Handler for multiple image upload (Video Frames tool)
  const handleMultipleImageUpload = (files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 4 * 1024 * 1024; // 4MB
    const maxImages = 5;

    if (referenceImages.length + files.length > maxImages) {
      setError(`Maksimal ${maxImages} gambar. Saat ini sudah ada ${referenceImages.length} gambar.`);
      return;
    }

    Array.from(files).forEach(file => {
      if (!validTypes.includes(file.type)) {
        setError('Format tidak didukung. Gunakan JPEG, PNG, atau WebP.');
        return;
      }
      if (file.size > maxSize) {
        setError('Ukuran file terlalu besar. Maksimal 4MB per gambar.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        const base64 = dataUrl.split(',')[1];
        const newImage = {
          id: Date.now() + Math.random(),
          base64,
          mimeType: file.type,
          preview: dataUrl,
          name: file.name
        };
        setReferenceImages(prev => [...prev, newImage]);
        setError(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReferenceImage = (imageId) => {
    setReferenceImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Extract visual context from uploaded images using Gemini Vision
  const extractVisualContext = async (images) => {
    if (!images || images.length === 0) return null;

    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const parts = [];
    images.forEach(img => {
      parts.push({ inline_data: { mime_type: img.mimeType, data: img.base64 } });
    });
    parts.push({
      text: `Analyze these images and extract key visual characteristics in a structured format. Provide:
1. Main subject(s) and their appearance
2. Art style and aesthetic
3. Color palette (dominant colors)
4. Lighting characteristics
5. Overall mood and atmosphere
6. Any distinctive visual elements

Be concise and specific. This will be used to maintain visual consistency across multiple generated images.`
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0) {
        const textPart = result.candidates[0].content.parts.find(p => p.text);
        return textPart ? textPart.text : null;
      }
      return null;
    } catch (err) {
      console.error('Failed to extract visual context:', err);
      return null;
    }
  };

  // Generate 4 video frames with consistency enforcement
  const generateVideoFrames = async () => {
    if (referenceImages.length === 0) {
      setError('Silakan upload minimal 1 gambar referensi.');
      return;
    }
    if (!storyLine.trim() || storyLine.trim().length < 50) {
      setError('Silakan masukkan storyline minimal 50 karakter.');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoFrames([]);
    setFrameGenerationProgress(0);

    const apiKey = "";
    const imageGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;
    const textGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    try {
      // Step 1: Extract visual context from uploaded images
      setFrameGenerationProgress(5);
      const visualContext = await extractVisualContext(referenceImages);

      if (!visualContext) {
        throw new Error('Gagal menganalisis gambar referensi.');
      }

      // Step 2: Parse storyline into 4 segments using AI
      setFrameGenerationProgress(10);
      const segmentPrompt = `Based on this storyline for an 8-second video, divide it into 4 sequential segments (2 seconds each).

Storyline: "${storyLine}"

Provide EXACTLY 4 scene descriptions in this format:
FRAME 1 (0-2s): [description]
FRAME 2 (2-4s): [description]
FRAME 3 (4-6s): [description]
FRAME 4 (6-8s): [description]

Make sure each frame flows naturally into the next. Be specific and visual.`;

      const segmentResponse = await fetch(textGenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: segmentPrompt }] }] }),
      });

      if (!segmentResponse.ok) throw new Error('Gagal memproses storyline.');

      const segmentResult = await segmentResponse.json();
      const segmentText = segmentResult.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;

      if (!segmentText) throw new Error('Gagal membuat segmentasi frame.');

      // Step 3: Generate each frame sequentially
      const frames = [];
      for (let i = 0; i < 4; i++) {
        setFrameGenerationProgress(10 + (i * 20));

        const framePrompt = `VISUAL CONTEXT (maintain consistency):
${visualContext}

FRAME ${i + 1}/4 for 8-second video (${i * 2}-${(i + 1) * 2} seconds):
${segmentText.split('FRAME')[i + 1] || `Scene ${i + 1} from: ${storyLine}`}

CRITICAL CONSISTENCY REQUIREMENTS:
1. Maintain EXACT same subject appearance as reference images
2. Keep CONSISTENT art style throughout
3. Preserve color palette and mood
4. Ensure visual continuity ${i > 0 ? 'from previous frame' : 'as opening shot'}
5. Match lighting and atmosphere
${aspectRatio ? `6. Aspect ratio: ${aspectRatio}` : ''}

Generate frame ${i + 1} that flows naturally ${i > 0 ? 'from the previous frame' : 'as the opening'}.`;

        const frame = await fetchOneVideoFrame(i, framePrompt, imageGenUrl, i > 0 ? frames[i - 1] : null);

        if (!frame) {
          throw new Error(`Gagal membuat frame ${i + 1}.`);
        }

        frames.push(frame);
        setVideoFrames(prev => [...prev, frame]);
        setFrameGenerationProgress(10 + ((i + 1) * 20));
      }

      setFrameGenerationProgress(100);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat membuat frame video');
    } finally {
      setLoading(false);
    }
  };

  // Fetch one video frame with retry logic
  const fetchOneVideoFrame = async (frameIndex, promptText, url, previousFrame = null) => {
    const generationConfig = { responseModalities: ["IMAGE"] };
    if (aspectRatio) {
      generationConfig.imageGenerationConfig = { aspectRatio };
    }

    const parts = [];

    // Include all reference images for consistency
    referenceImages.forEach(img => {
      parts.push({
        inline_data: { mime_type: img.mimeType, data: img.base64 }
      });
    });

    // Include previous frame for better continuity (strict consistency)
    if (previousFrame) {
      const prevFrameBase64 = previousFrame.split(',')[1];
      parts.push({
        inline_data: {
          mime_type: 'image/png',
          data: prevFrameBase64
        }
      });
    }

    // Add text prompt
    parts.push({ text: promptText });

    const payload = { contents: [{ parts }], generationConfig };

    const fetchWithRetry = async (retries = 2) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res;
      } catch (e) {
        if (retries > 0) {
          await new Promise(r => setTimeout(r, 1500));
          return fetchWithRetry(retries - 1);
        }
        throw e;
      }
    };

    try {
      const response = await fetchWithRetry();
      const result = await response.json();

      if (!result.candidates || result.candidates.length === 0) {
        return null;
      }

      const candidate = result.candidates[0];
      if (!candidate.content || !candidate.content.parts) {
        return null;
      }

      const imagePart = candidate.content.parts.find(p => p.inlineData);
      if (imagePart) {
        return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
      }
      return null;
    } catch (err) {
      console.error(`Failed to generate frame ${frameIndex + 1}:`, err);
      return null;
    }
  };

  // Regenerate individual frame
  const regenerateFrame = async (frameIndex) => {
    if (frameIndex < 0 || frameIndex >= videoFrames.length) return;

    setRegeneratingFrame(frameIndex);
    setError(null);

    const apiKey = "";
    const imageGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    try {
      const visualContext = await extractVisualContext(referenceImages);

      const framePrompt = `VISUAL CONTEXT (maintain consistency):
${visualContext}

FRAME ${frameIndex + 1}/4 for 8-second video (${frameIndex * 2}-${(frameIndex + 1) * 2} seconds):
Based on storyline: ${storyLine}

CRITICAL CONSISTENCY REQUIREMENTS:
1. Maintain EXACT same subject appearance as reference images
2. Keep CONSISTENT art style throughout
3. Preserve color palette and mood
4. Ensure visual continuity with other frames
5. Match lighting and atmosphere
${aspectRatio ? `6. Aspect ratio: ${aspectRatio}` : ''}

Generate frame ${frameIndex + 1} with high consistency to reference images.`;

      const previousFrame = frameIndex > 0 ? videoFrames[frameIndex - 1] : null;
      const newFrame = await fetchOneVideoFrame(frameIndex, framePrompt, imageGenUrl, previousFrame);

      if (!newFrame) {
        throw new Error(`Gagal meregenerasi frame ${frameIndex + 1}.`);
      }

      setVideoFrames(prev => {
        const updated = [...prev];
        updated[frameIndex] = newFrame;
        return updated;
      });
    } catch (err) {
      setError(err.message || `Gagal meregenerasi frame ${frameIndex + 1}`);
    } finally {
      setRegeneratingFrame(null);
    }
  };

  // Download all frames as ZIP (simple sequential download as fallback)
  const downloadAllFrames = () => {
    videoFrames.forEach((frame, idx) => {
      setTimeout(() => {
        downloadImage(frame, `frame-${idx + 1}`);
      }, idx * 500);
    });
  };

  // ============= STORY ADS NATURAL FUNCTIONS =============

  // Extract product/brand context from uploaded image using Gemini Vision
  const extractVisualContextForStory = async (productImage) => {
    if (!productImage) return null;

    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const parts = [];
    parts.push({ inline_data: { mime_type: productImage.mimeType, data: productImage.base64 } });
    parts.push({
      text: `Analyze this product/brand image and extract key information for creating natural lifestyle ads:
1. Product type and category (e.g., beverage, fashion, tech, beauty)
2. Visual characteristics (colors, style, packaging, design)
3. Brand aesthetic and mood (luxury, casual, minimal, playful, etc.)
4. Suggested lifestyle contexts that would fit naturally
5. Key visual elements to maintain consistency

Be specific and concise. This will be used to create natural Instagram Story ads where the product appears authentically in lifestyle settings.`
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0) {
        const textPart = result.candidates[0].content.parts.find(p => p.text);
        return textPart ? textPart.text : null;
      }
      return null;
    } catch (err) {
      console.error('Failed to extract product context:', err);
      return null;
    }
  };

  // Merge 4 images into seamless 2x2 grid
  const mergeToGrid = async (frames) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Instagram Story size 9:16, grid is 2x2
      // Each frame is 540x960 (9:16), grid is 1080x1920
      const frameWidth = 540;
      const frameHeight = 960;
      canvas.width = frameWidth * 2; // 1080
      canvas.height = frameHeight * 2; // 1920

      let loadedCount = 0;
      const images = [];

      frames.forEach((frameSrc, idx) => {
        const img = new Image();
        img.onload = () => {
          images[idx] = img;
          loadedCount++;

          if (loadedCount === 4) {
            // Draw all 4 images in 2x2 grid (seamless edge-to-edge)
            // Top-left
            ctx.drawImage(images[0], 0, 0, frameWidth, frameHeight);
            // Top-right
            ctx.drawImage(images[1], frameWidth, 0, frameWidth, frameHeight);
            // Bottom-left
            ctx.drawImage(images[2], 0, frameHeight, frameWidth, frameHeight);
            // Bottom-right
            ctx.drawImage(images[3], frameWidth, frameHeight, frameWidth, frameHeight);

            // Convert canvas to data URL
            resolve(canvas.toDataURL('image/png'));
          }
        };
        img.src = frameSrc;
      });
    });
  };

  // Generate 4 Instagram Story frames (natural lifestyle ads)
  const generateStoryAds = async () => {
    if (!uploadedImages.main) {
      setError('Silakan upload gambar produk terlebih dahulu.');
      return;
    }
    if (!lifestyleSetting) {
      setError('Silakan pilih setting lifestyle.');
      return;
    }
    if (!integrationStyle) {
      setError('Silakan pilih intensitas brand integration.');
      return;
    }

    setLoading(true);
    setError(null);
    setStoryFrames([]);
    setStoryGridImage(null);
    setFrameGenerationProgress(0);

    const apiKey = "";
    const imageGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    try {
      // Step 1: Extract product/brand context
      setFrameGenerationProgress(5);
      const productContext = await extractVisualContextForStory(uploadedImages.main);

      if (!productContext) {
        throw new Error('Gagal menganalisis produk.');
      }

      // Step 2: Get lifestyle setting label
      const lifestyleLabel = lifestyleSettingOptions.find(o => o.value === lifestyleSetting)?.label || lifestyleSetting;
      const integrationLabel = integrationStyleOptions.find(o => o.value === integrationStyle)?.label || integrationStyle;

      // Step 3: Define 4 different frame types (AI will intelligently choose angles)
      const frameTypes = [
        'Product close-up with lifestyle context',
        'Wide shot of the lifestyle setting with product naturally placed',
        'Person interaction shot (close-up or mid-shot)',
        'Full scene or person full body with product in use'
      ];

      // Shuffle frame types for randomization
      const shuffledTypes = frameTypes.sort(() => Math.random() - 0.5);

      // Step 4: Generate each frame
      const frames = [];
      for (let i = 0; i < 4; i++) {
        setFrameGenerationProgress(10 + (i * 20));

        const additionalPrompt = prompt.trim() ? `\nAdditional user requirements: ${prompt}` : '';

        const framePrompt = `Create a natural Instagram Story frame (9:16 aspect ratio) for lifestyle advertising.

PRODUCT CONTEXT:
${productContext}

LIFESTYLE SETTING: ${lifestyleLabel}
BRAND INTEGRATION: ${integrationLabel}

FRAME ${i + 1}/4 - ${shuffledTypes[i]}

CRITICAL REQUIREMENTS:
1. This must look like a REAL Instagram Story posted by a natural user (not an ad)
2. Make it authentic and relatable - like someone sharing their daily life
3. Aspect ratio: MUST be 9:16 (vertical, Instagram Story format)
4. Setting: ${lifestyleLabel}
5. Product integration: ${integrationLabel}
6. Frame type: ${shuffledTypes[i]}
7. Maintain STRICT VISUAL CONSISTENCY across all frames (same person, same color palette, same aesthetic, same time of day)
8. Professional photography quality but natural lighting
9. Realistic and organic product placement
10. Each frame should be thematically different but visually consistent${additionalPrompt}
11. Do not add text or hashtags to the image, just generate pure image

AI DECISION: Intelligently decide the best angle, composition, and context for this frame type in the given lifestyle setting. Make it look natural and authentic.`;

        // Build previous frames array based on current index
        // Frame 1: no previous frames
        // Frame 2: [frame 1]
        // Frame 3: [frame 2, frame 1]
        // Frame 4: [frame 3, frame 2]
        let previousFrames = [];
        if (i === 1) {
          previousFrames = [frames[0]]; // frame 1
        } else if (i === 2) {
          previousFrames = [frames[1], frames[0]]; // frame 2, frame 1
        } else if (i === 3) {
          previousFrames = [frames[2], frames[1]]; // frame 3, frame 2
        }

        const frame = await fetchOneStoryFrame(i, framePrompt, imageGenUrl, uploadedImages.main, previousFrames);

        if (!frame) {
          throw new Error(`Gagal membuat frame ${i + 1}.`);
        }

        frames.push(frame);
        setStoryFrames(prev => [...prev, frame]);
        setFrameGenerationProgress(10 + ((i + 1) * 20));
      }

      // Step 5: Merge frames into 2x2 grid
      setFrameGenerationProgress(95);
      const gridImage = await mergeToGrid(frames);
      setStoryGridImage(gridImage);
      setFrameGenerationProgress(100);

    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat membuat Story Ads');
    } finally {
      setLoading(false);
    }
  };

  // Fetch one story frame with retry logic
  const fetchOneStoryFrame = async (frameIndex, promptText, url, productImage, previousFrames = []) => {
    const generationConfig = { 
      responseModalities: ["IMAGE"],
      imageGenerationConfig: { aspectRatio: '9:16' } // Fixed to Instagram Story format
    };

    const parts = [];

    // Include product image for reference
    parts.push({
      inline_data: { 
        mime_type: productImage.mimeType, 
        data: productImage.base64 
      }
    });

    // Include multiple previous frames for better consistency
    if (previousFrames && previousFrames.length > 0) {
      previousFrames.forEach((prevFrame, idx) => {
        const prevFrameBase64 = prevFrame.split(',')[1];
        parts.push({
          inline_data: {
            mime_type: 'image/png',
            data: prevFrameBase64
          }
        });
      });
    }

    // Add text prompt
    parts.push({ text: promptText });

    const payload = { contents: [{ parts }], generationConfig };

    const fetchWithRetry = async (retries = 2) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res;
      } catch (e) {
        if (retries > 0) {
          await new Promise(r => setTimeout(r, 1500));
          return fetchWithRetry(retries - 1);
        }
        throw e;
      }
    };

    try {
      const response = await fetchWithRetry();
      const result = await response.json();

      if (!result.candidates || result.candidates.length === 0) {
        return null;
      }

      const candidate = result.candidates[0];
      if (!candidate.content || !candidate.content.parts) {
        return null;
      }

      const imagePart = candidate.content.parts.find(p => p.inlineData);
      if (imagePart) {
        return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
      }
      return null;
    } catch (err) {
      console.error(`Failed to generate story frame ${frameIndex + 1}:`, err);
      return null;
    }
  };

  // Regenerate individual story frame
  const regenerateStoryFrame = async (frameIndex) => {
    if (frameIndex < 0 || frameIndex >= storyFrames.length) return;

    setRegeneratingStoryFrame(frameIndex);
    setError(null);

    const apiKey = "";
    const imageGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    try {
      const productContext = await extractVisualContextForStory(uploadedImages.main);
      const lifestyleLabel = lifestyleSettingOptions.find(o => o.value === lifestyleSetting)?.label || lifestyleSetting;
      const integrationLabel = integrationStyleOptions.find(o => o.value === integrationStyle)?.label || integrationStyle;

      const additionalPrompt = prompt.trim() ? `\nAdditional user requirements: ${prompt}` : '';

      const framePrompt = `Create a natural Instagram Story frame (9:16 aspect ratio) for lifestyle advertising.

PRODUCT CONTEXT:
${productContext}

LIFESTYLE SETTING: ${lifestyleLabel}
BRAND INTEGRATION: ${integrationLabel}

FRAME ${frameIndex + 1}/4 - Regenerating with fresh perspective

CRITICAL REQUIREMENTS:
1. This must look like a REAL Instagram Story posted by a natural user (not an ad)
2. Make it authentic and relatable - like someone sharing their daily life
3. Aspect ratio: MUST be 9:16 (vertical, Instagram Story format)
4. Setting: ${lifestyleLabel}
5. Product integration: ${integrationLabel}
6. Maintain STRICT VISUAL CONSISTENCY with other frames (same person if applicable, same color palette, same aesthetic)
7. Professional photography quality but natural lighting
8. Realistic and organic product placement${additionalPrompt}
9. Do not add text or hashtags to the image, just generate pure image

AI DECISION: Intelligently decide the best angle, composition, and context for this frame. Make it look natural and authentic while maintaining visual consistency with other frames.`;

      // Build previous frames array based on current index (same logic as generation)
      // Frame 1: no previous frames
      // Frame 2: [frame 1]
      // Frame 3: [frame 2, frame 1]
      // Frame 4: [frame 3, frame 2]
      let previousFrames = [];
      if (frameIndex === 1) {
        previousFrames = [storyFrames[0]]; // frame 1
      } else if (frameIndex === 2) {
        previousFrames = [storyFrames[1], storyFrames[0]]; // frame 2, frame 1
      } else if (frameIndex === 3) {
        previousFrames = [storyFrames[2], storyFrames[1]]; // frame 3, frame 2
      }

      const newFrame = await fetchOneStoryFrame(frameIndex, framePrompt, imageGenUrl, uploadedImages.main, previousFrames);

      if (!newFrame) {
        throw new Error(`Gagal meregenerasi frame ${frameIndex + 1}.`);
      }

      // Update the frame in the array
      setStoryFrames(prev => {
        const updated = [...prev];
        updated[frameIndex] = newFrame;
        return updated;
      });

      // Regenerate the grid with new frame
      const updatedFrames = [...storyFrames];
      updatedFrames[frameIndex] = newFrame;
      const newGrid = await mergeToGrid(updatedFrames);
      setStoryGridImage(newGrid);

    } catch (err) {
      setError(err.message || `Gagal meregenerasi frame ${frameIndex + 1}`);
    } finally {
      setRegeneratingStoryFrame(null);
    }
  };

  // ============= END STORY ADS FUNCTIONS =============

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
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`HTTP ${res.status}`);
            }
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

        if (!result.candidates || result.candidates.length === 0) {
          return null;
        }

        const candidate = result.candidates[0];
        if (!candidate.content || !candidate.content.parts) {
          return null;
        }

        const imagePart = candidate.content.parts.find(p => p.inlineData);
        if (imagePart) {
          return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
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

  const generateVirtualTryOn = async () => {
    if (!uploadedImages.model || !uploadedImages.costume) {
      setError('Silakan upload foto model dan pakaian terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedImageIndex(null);

    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    // Build default prompt for virtual try-on
    let virtualTryOnPrompt = 'Create a realistic virtual try-on image showing the person wearing the clothing item. Maintain the person\'s appearance and body posture while naturally fitting the clothing.';

    if (pose) {
      const poseLabel = poseOptions.find(p => p.value === pose)?.label || pose;
      virtualTryOnPrompt += ` Person pose: ${poseLabel}.`;
    }

    // Add user's additional prompt
    if (prompt.trim()) {
      virtualTryOnPrompt += ` Additional requirements: ${prompt}`;
    }

    const fetchOneImage = async (index) => {
      const generationConfig = { responseModalities: ["IMAGE"] };
      if (aspectRatio) {
        generationConfig.imageGenerationConfig = { aspectRatio };
      }

      const parts = [];

      // Add model image (required)
      parts.push({
        inline_data: {
          mime_type: uploadedImages.model.mimeType,
          data: uploadedImages.model.base64
        }
      });

      // Add costume image (required)
      parts.push({
        inline_data: {
          mime_type: uploadedImages.costume.mimeType,
          data: uploadedImages.costume.base64
        }
      });

      // Add optional images
      if (uploadedImages.face) {
        parts.push({
          inline_data: {
            mime_type: uploadedImages.face.mimeType,
            data: uploadedImages.face.base64
          }
        });
      }

      if (uploadedImages.bottoms) {
        parts.push({
          inline_data: {
            mime_type: uploadedImages.bottoms.mimeType,
            data: uploadedImages.bottoms.base64
          }
        });
      }

      if (uploadedImages.background) {
        parts.push({
          inline_data: {
            mime_type: uploadedImages.background.mimeType,
            data: uploadedImages.background.base64
          }
        });
      }

      // Add text prompt
      parts.push({ text: virtualTryOnPrompt });

      const payload = { contents: [{ parts }], generationConfig };

      try {
        const fetchWithRetry = async (retries = 2) => {
          try {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`HTTP ${res.status}`);
            }
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

        if (!result.candidates || result.candidates.length === 0) {
          return null;
        }

        const candidate = result.candidates[0];
        if (!candidate.content || !candidate.content.parts) {
          return null;
        }

        const imagePart = candidate.content.parts.find(p => p.inlineData);
        if (imagePart) {
          return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
        }
        return null;
      } catch (err) {
        console.error(`Failed to generate virtual try-on ${index + 1}`, err);
        return null;
      }
    };

    try {
      const promises = Array(IMAGE_COUNT).fill(0).map((_, i) => fetchOneImage(i));
      const results = await Promise.all(promises);
      const successfulImages = results.filter(img => img !== null);

      if (successfulImages.length === 0) {
        throw new Error("Gagal membuat gambar virtual try-on. Silakan coba lagi atau periksa format gambar.");
      }

      setGeneratedImages(successfulImages);
      setSelectedImageIndex(0);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat membuat virtual try-on");
    } finally {
      setLoading(false);
    }
  };

  const generateProductPhoto = async () => {
    if (!uploadedImages.main) {
      setError('Silakan upload foto produk terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedImageIndex(null);

    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

    // Build default prompt for product photography
    let productPrompt = '';

    if (uploadedImages.background) {
      // When background is provided - EXPLICIT INSTRUCTION
      productPrompt = 'Create professional product photography by combining the provided images. The first image is the PRODUCT that needs to be featured. The second image is the BACKGROUND/SETTING where the product should be placed. Your task: Place the product naturally into this background setting. Requirements: (1) Match lighting between product and background, (2) Add realistic shadows and reflections, (3) Ensure proper perspective and scale, (4) Seamless integration - make it look like the product was originally photographed in that background. Maintain commercial photography quality.';

      // Add style parameters if provided
      if (artStyle) {
        const styleLabel = productStyleOptions.find(o => o.value === artStyle)?.label || artStyle;
        productPrompt += ` Photography style: ${styleLabel}.`;
      }
      if (lighting) {
        const lightLabel = lightingOptions.find(o => o.value === lighting)?.label || lighting;
        productPrompt += ` Adjust lighting to be: ${lightLabel}, while maintaining consistency with the background's existing lighting.`;
      }
      if (mood) {
        const moodLabel = moodOptions.find(o => o.value === mood)?.label || mood;
        productPrompt += ` Overall mood: ${moodLabel}.`;
      }
    } else {
      // When no background is provided - standard product photo
      productPrompt = 'Professional product photography with clean, professional background and commercial quality.';

      if (artStyle) {
        const styleLabel = productStyleOptions.find(o => o.value === artStyle)?.label || artStyle;
        productPrompt += ` Style: ${styleLabel}.`;
      }
      if (lighting) {
        const lightLabel = lightingOptions.find(o => o.value === lighting)?.label || lighting;
        productPrompt += ` Lighting: ${lightLabel}.`;
      }
      if (mood) {
        const moodLabel = moodOptions.find(o => o.value === mood)?.label || mood;
        productPrompt += ` Mood: ${moodLabel}.`;
      }
    }

    // Add user's additional prompt at the end
    if (prompt.trim()) {
      productPrompt += ` Additional requirements: ${prompt}`;
    }

    const fetchOneImage = async (index) => {
      const generationConfig = { responseModalities: ["IMAGE"] };
      if (aspectRatio) {
        generationConfig.imageGenerationConfig = { aspectRatio };
      }

      const parts = [];

      // Add product image (required)
      parts.push({
        inline_data: {
          mime_type: uploadedImages.main.mimeType,
          data: uploadedImages.main.base64
        }
      });

      // Add background reference if provided
      if (uploadedImages.background) {
        parts.push({
          inline_data: {
            mime_type: uploadedImages.background.mimeType,
            data: uploadedImages.background.base64
          }
        });
      }

      // Add text prompt
      parts.push({ text: productPrompt });

      const payload = { contents: [{ parts }], generationConfig };

      try {
        const fetchWithRetry = async (retries = 2) => {
          try {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`HTTP ${res.status}`);
            }
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

        if (!result.candidates || result.candidates.length === 0) {
          return null;
        }

        const candidate = result.candidates[0];
        if (!candidate.content || !candidate.content.parts) {
          return null;
        }

        const imagePart = candidate.content.parts.find(p => p.inlineData);
        if (imagePart) {
          return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
        }
        return null;
      } catch (err) {
        console.error(`Failed to generate product photo ${index + 1}`, err);
        return null;
      }
    };

    try {
      const promises = Array(IMAGE_COUNT).fill(0).map((_, i) => fetchOneImage(i));
      const results = await Promise.all(promises);
      const successfulImages = results.filter(img => img !== null);

      if (successfulImages.length === 0) {
        throw new Error("Gagal membuat foto produk. Silakan coba lagi atau periksa format gambar.");
      }

      setGeneratedImages(successfulImages);
      setSelectedImageIndex(0);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat membuat foto produk");
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'image-based') {
      systemPrompt = `Kamu adalah spesialis konten kreatif untuk media sosial. Buat script video yang engaging untuk ${videoFormatOptions.find(f => f.value === videoFormat)?.label || 'Instagram Reels'}.
${voiceTone ? `
TONE SUARA: ${voiceToneOptions.find(t => t.value === voiceTone)?.label}
${getVoiceToneDescription(voiceTone)}
` : ''}
Format output (gunakan format ini):
---JUDUL:[Judul video yang menarik]
---
[DURASI] [DESKRIPSI SCENE]
[VOICEOVER/NARRASI]
---
[END SCENE]

PENTING:
- Total durasi: maksimal 8 detik
- Jangan beri arahan untuk menambahkan teks atau hashtag kedalam video
- Jangan beri arahan untuk menambahkan teks overlay
- Script video ini akan digunakan sebagai dasar untuk LLM, sesuaikan outputnya untuk LLM
- Gunakan kata-kata yang catchy
- Sertakan CTA (Call to Action)
- Format sesuai standar ${videoFormatOptions.find(f => f.value === videoFormat)?.label || 'Reels'}${voiceTone ? `\n- WAJIB gunakan tone ${voiceToneOptions.find(t => t.value === voiceTone)?.label} dalam seluruh voiceover/narasi` : ''}`;

      userPrompt = uploadedImages.reference
        ? `Buat script video berdasarkan gambar ini dan prompt: "${prompt}". Gambar menggambarkan: [akan dianalisis AI]`
        : `Buat script video dengan tema: "${prompt}"`;
    } else {
      systemPrompt = `Kamu adalah spesialis marketing dan content creator. Buat script video produk yang professional untuk ${videoFormatOptions.find(f => f.value === videoFormat)?.label || 'Reels'}.
${voiceTone ? `
TONE SUARA: ${voiceToneOptions.find(t => t.value === voiceTone)?.label}
${getVoiceToneDescription(voiceTone)}
` : ''}
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
- CTA yang jelas${voiceTone ? `\n- WAJIB gunakan tone ${voiceToneOptions.find(t => t.value === voiceTone)?.label} dalam seluruh voiceover` : ''}`;

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

  const SelectField = ({ label, value, onChange, options, className = '', showHint = false }) => {
    const selectedOption = options.find(opt => opt.value === value);
    const hint = selectedOption?.hint;

    return (
      <div className={`space-y-1 ${className}`}>
        <label className="block text-xs font-bold uppercase text-gray-600">{label}</label>
        <div className="relative">
          <select value={value} onChange={(e) => onChange(e.target.value)} className={brutalSelect} disabled={loading}>
            {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
        </div>
        {showHint && hint && value && (
          <p className="text-xs text-gray-500 italic mt-1">{hint}</p>
        )}
      </div>
    );
  };

  const UploadField = ({ label, field, required = false, hint }) => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const validFile = files.find(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type));
        if (validFile) {
          handleImageUpload({ target: { files: [validFile] } }, field);
        } else {
          setError('Format tidak didukung. Gunakan JPEG, PNG, atau WebP.');
        }
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-gray-600">{label}</span>
          {required && <span className="text-xs font-bold text-red-500">*</span>}
        </div>
        {!uploadedImages[field] ? (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed transition-all rounded-lg overflow-hidden
              ${isDragging
                ? 'border-[#FCD34D] bg-[#FEF3C7]'
                : 'border-black hover:border-gray-400'
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleImageUpload(e, field)}
              className="hidden"
              disabled={loading}
            />
            <button
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className={`w-full ${brutalBtn} px-4 py-4 rounded-lg flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 ${loading ? 'opacity-50' : ''}`}
            >
              <Upload size={18} />
              <span>{isMobile ? 'KETUK UNTUK UPLOAD' : 'UNGGAH / TARIK GAMBAR DISINI'}</span>
            </button>

            {/* Drop indicator overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-[#FCD34D]/30 flex items-center justify-center">
                <div className="bg-black text-white px-6 py-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#FCD34D] font-bold animate-pulse">
                  LEPASKAN DISINI
                </div>
              </div>
            )}
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
  };

  const MultipleImageUploadField = () => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleMultipleImageUpload(files);
      }
    };

    const handleFileSelect = (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleMultipleImageUpload(Array.from(files));
      }
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-gray-600">Gambar Referensi</span>
            <span className="text-xs font-bold text-red-500">*</span>
          </div>
          <span className="text-xs font-bold text-gray-600 bg-[#FCD34D] px-2 py-1 rounded border border-black">
            {referenceImages.length}/5
          </span>
        </div>

        {referenceImages.length < 5 && (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed transition-all rounded-lg overflow-hidden
              ${isDragging
                ? 'border-[#FCD34D] bg-[#FEF3C7]'
                : 'border-black hover:border-gray-400'
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={loading}
            />
            <button
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className={`w-full ${brutalBtn} px-4 py-4 rounded-lg flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 ${loading ? 'opacity-50' : ''}`}
            >
              <ImagePlus size={18} />
              <span>{isMobile ? 'KETUK UNTUK UPLOAD' : 'UNGGAH GAMBAR (MAX 5)'}</span>
            </button>

            {isDragging && (
              <div className="absolute inset-0 bg-[#FCD34D]/30 flex items-center justify-center">
                <div className="bg-black text-white px-6 py-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#FCD34D] font-bold animate-pulse">
                  LEPASKAN DISINI
                </div>
              </div>
            )}
          </div>
        )}

        {referenceImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {referenceImages.map((img, idx) => (
              <div key={img.id} className="relative group">
                <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                  <img src={img.preview} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-1 -right-1 flex gap-1">
                  <div className="w-6 h-6 bg-black text-white rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <button
                    onClick={() => removeReferenceImage(img.id)}
                    className="w-6 h-6 bg-red-500 text-white rounded-full border-2 border-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500">
          Upload 1-5 gambar produk/model sebagai referensi visual. Semua gambar akan digunakan untuk menjaga konsistensi.
        </p>
      </div>
    );
  };

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
          <div className="space-y-6">
            <div className="space-y-6">
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
                    onClick={generateVirtualTryOn}
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
          </div>
        );

      case 'product-photo':
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <div className={`${brutalCard} p-6 md:p-8 space-y-6`}>
                <div className="space-y-2">
                  <h2 className="text-xl font-black uppercase tracking-tight">Foto Produk</h2>
                  <p className="text-sm font-medium text-gray-500">Generate foto produk professional untuk brand Anda.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <UploadField label="Foto Produk" field="main" required={true} hint="Foto produk dengan background bersih" />
                  <UploadField label="Background Referensi" field="background" hint="Produk akan ditempatkan di background ini" />
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
                    onClick={generateProductPhoto}
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

                <SelectField
                  label="Tone Suara (Opsional)"
                  value={voiceTone}
                  onChange={setVoiceTone}
                  options={voiceToneOptions}
                  showHint={true}
                  className=""
                />

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
                    <p className="font-bold text-sm text-center px-4">SCRIPT AKAN<br />MUNCUL DISINI</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'video-frames':
        return (
          <div className="space-y-6">
            {/* Input Section */}
            <div className={`${brutalCard} p-6 md:p-8 space-y-6`}>
              <div className="space-y-2">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <Layers size={24} />
                  Generator Frame Video
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  Upload gambar produk/model dan tulis storyline untuk generate 4 frame konsisten (video 8 detik)
                </p>
              </div>

              {/* Multiple Image Upload */}
              <MultipleImageUploadField />

              {/* Storyline Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase text-gray-600">Storyline Video</label>
                    <span className="text-xs font-bold text-red-500">*</span>
                  </div>
                  <span className={`text-xs font-bold ${storyLine.length > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
                    {storyLine.length}/1000
                  </span>
                </div>
                <textarea
                  value={storyLine}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setStoryLine(e.target.value);
                    }
                  }}
                  placeholder="Contoh: Kaos muncul dengan efek fade in elegan. Model mengenakan kaos sambil berjalan percaya diri di outdoor. Close-up detail kain premium. Ending dengan logo brand dan CTA 'Shop Now'."
                  className={`${brutalInput} min-h-[120px] resize-none`}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  Jelaskan alur cerita video Anda. AI akan membaginya menjadi 4 frame berurutan (masing-masing 2 detik).
                </p>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <SelectField
                  label="Rasio Aspek"
                  value={aspectRatio}
                  onChange={setAspectRatio}
                  options={aspectRatioOptions}
                />
                <SelectField
                  label="Gaya Visual"
                  value={artStyle}
                  onChange={setArtStyle}
                  options={artStyleOptions}
                />
                <SelectField
                  label="Suasana"
                  value={mood}
                  onChange={setMood}
                  options={moodOptions}
                />
              </div>

              {/* Generate Button */}
              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={generateVideoFrames}
                  disabled={loading || referenceImages.length === 0 || storyLine.trim().length < 50}
                  className={`${brutalBtn} px-6 py-3 rounded-lg flex items-center gap-2 ${loading || referenceImages.length === 0 || storyLine.trim().length < 50
                    ? 'bg-gray-200 text-gray-400 border-gray-400 shadow-none translate-y-0 cursor-not-allowed'
                    : 'bg-[#A78BFA] text-white'
                    }`}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                  <span>{loading ? 'MEMBUAT FRAME...' : 'GENERATE 4 FRAME'}</span>
                </button>
              </div>

              {/* Progress Indicator */}
              {loading && frameGenerationProgress > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      {frameGenerationProgress < 10 ? 'Menganalisis gambar...' :
                        frameGenerationProgress < 20 ? 'Membuat Frame 1/4' :
                          frameGenerationProgress < 40 ? 'Membuat Frame 2/4' :
                            frameGenerationProgress < 60 ? 'Membuat Frame 3/4' :
                              frameGenerationProgress < 90 ? 'Membuat Frame 4/4' : 'Selesai!'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(frameGenerationProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#A78BFA] to-[#FCD34D] transition-all duration-300"
                      style={{ width: `${frameGenerationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-100 border-2 border-black flex items-start gap-3 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 mt-0.5" />
                  <p className="font-bold text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Results: Timeline Display */}
            {videoFrames.length > 0 && (
              <div className={`${brutalCard} p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full border border-black animate-pulse"></div>
                    Timeline Frame (8 Detik)
                  </h3>
                  <button
                    onClick={downloadAllFrames}
                    className={`${brutalBtn} px-4 py-2 rounded-lg flex items-center gap-2 bg-[#FCD34D] text-black text-sm`}
                  >
                    <Download size={16} />
                    <span>UNDUH SEMUA</span>
                  </button>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {videoFrames.map((frame, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="relative group">
                        <div className={`relative ${getAspectRatioStyle(aspectRatio)} rounded-lg overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000000]`}>
                          <img
                            src={frame}
                            alt={`Frame ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Frame Number Badge */}
                          <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded-lg text-xs font-bold border-2 border-white">
                            Frame {idx + 1}
                          </div>

                          {/* Time Badge */}
                          <div className="absolute bottom-2 left-2 bg-white/95 px-3 py-1 rounded-lg text-xs font-bold border-2 border-black">
                            {idx * 2}-{(idx + 1) * 2}s
                          </div>

                          {/* Regenerate Overlay */}
                          {regeneratingFrame === idx && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                              <Loader2 className="animate-spin text-white" size={32} />
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <button
                            onClick={() => downloadImage(frame, `frame-${idx + 1}`)}
                            className={`${brutalBtn} px-3 py-2 rounded-lg flex items-center justify-center gap-1 bg-gray-50 text-xs`}
                          >
                            <Download size={14} />
                            <span>Unduh</span>
                          </button>
                          <button
                            onClick={() => regenerateFrame(idx)}
                            disabled={regeneratingFrame !== null || loading}
                            className={`${brutalBtn} px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-xs ${regeneratingFrame !== null || loading
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-[#A78BFA] text-white'
                              }`}
                          >
                            <Sparkles size={14} />
                            <span>Regen</span>
                          </button>
                        </div>
                      </div>

                      {/* Arrow between frames (except last) */}
                      {idx < 3 && (
                        <div className="hidden lg:flex justify-center absolute -right-6 top-1/3 transform">
                          <ArrowRight size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Info Box */}
                <div className="p-4 bg-[#FEF3C7] border-2 border-[#FCD34D] rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    <strong>💡 Tips:</strong> Gunakan tombol "Regen" untuk regenerate frame individual jika hasil kurang sesuai.
                    Download semua frame dan gunakan sebagai foundation untuk video generator Anda!
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'story-ads':
        return (
          <div className="space-y-6">
            {/* Input Section */}
            <div className={`${brutalCard} p-6 md:p-8 space-y-6`}>
              <div className="space-y-2">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <Instagram size={24} />
                  Instagram Story Ads Natural
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  Upload produk dan buat 4 grid story natural seperti user posting di Instagram Story. Output: 1 gambar grid 2x2 seamless.
                </p>
              </div>

              {/* Product Image Upload */}
              <UploadField
                label="Gambar Produk/Brand"
                field="main"
                required={true}
                hint="Upload foto produk yang ingin dipromosikan secara natural"
              />

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Lifestyle Setting"
                  value={lifestyleSetting}
                  onChange={setLifestyleSetting}
                  options={lifestyleSettingOptions}
                />
                <SelectField
                  label="Brand Integration"
                  value={integrationStyle}
                  onChange={setIntegrationStyle}
                  options={integrationStyleOptions}
                />
              </div>

              {/* Additional Prompt */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-gray-600">Prompt Tambahan (Opsional)</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Contoh: Gunakan warna pastel, tampilkan produk di tangan kiri, background minimalis..."
                  className={`${brutalInput} min-h-[80px] resize-none`}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  Tambahkan detail spesifik untuk customization (opsional). AI akan membuat 4 frame berbeda dengan konsistensi visual ketat.
                </p>
              </div>

              {/* Generate Button */}
              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={generateStoryAds}
                  disabled={loading || !uploadedImages.main || !lifestyleSetting || !integrationStyle}
                  className={`${brutalBtn} px-6 py-3 rounded-lg flex items-center gap-2 ${loading || !uploadedImages.main || !lifestyleSetting || !integrationStyle
                      ? 'bg-gray-200 text-gray-400 border-gray-400 shadow-none translate-y-0 cursor-not-allowed'
                      : 'bg-[#FCD34D] text-black'
                    }`}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Instagram size={20} />}
                  <span>{loading ? 'MEMBUAT STORY...' : 'GENERATE 4 GRID STORY'}</span>
                </button>
              </div>

              {/* Progress Indicator */}
              {loading && frameGenerationProgress > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      {frameGenerationProgress < 10 ? 'Menganalisis produk...' :
                        frameGenerationProgress < 30 ? 'Membuat Frame 1/4' :
                          frameGenerationProgress < 50 ? 'Membuat Frame 2/4' :
                            frameGenerationProgress < 70 ? 'Membuat Frame 3/4' :
                              frameGenerationProgress < 90 ? 'Membuat Frame 4/4' :
                                frameGenerationProgress < 95 ? 'Menggabungkan grid...' : 'Selesai!'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(frameGenerationProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FCD34D] to-[#A7F3D0] transition-all duration-300"
                      style={{ width: `${frameGenerationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-100 border-2 border-black flex items-start gap-3 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 mt-0.5" />
                  <p className="font-bold text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Results: Individual Frames + Grid */}
            {storyFrames.length > 0 && (
              <>
                {/* Individual Frames Section */}
                <div className={`${brutalCard} p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black uppercase flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full border border-black animate-pulse"></div>
                      Frame Individual (Regenerasi)
                    </h3>
                  </div>

                  {/* Individual Frames Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {storyFrames.map((frame, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="relative group">
                          <div className="relative aspect-[9/16] rounded-lg overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
                            <img
                              src={frame}
                              alt={`Story Frame ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Frame Number Badge */}
                            <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded-lg text-xs font-bold border-2 border-white">
                              Grid {idx + 1}
                            </div>

                            {/* Regenerate Overlay */}
                            {regeneratingStoryFrame === idx && (
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <Loader2 className="animate-spin text-white" size={32} />
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <button
                              onClick={() => downloadImage(frame, `story-frame-${idx + 1}`)}
                              className={`${brutalBtn} px-3 py-2 rounded-lg flex items-center justify-center gap-1 bg-gray-50 text-xs`}
                            >
                              <Download size={14} />
                              <span>Unduh</span>
                            </button>
                            <button
                              onClick={() => regenerateStoryFrame(idx)}
                              disabled={regeneratingStoryFrame !== null || loading}
                              className={`${brutalBtn} px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-xs ${regeneratingStoryFrame !== null || loading
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-[#FCD34D] text-black'
                                }`}
                            >
                              <Sparkles size={14} />
                              <span>Regen</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-[#FEF3C7] border-2 border-[#FCD34D] rounded-lg">
                    <p className="text-sm font-medium text-gray-700">
                      <strong>💡 Tips:</strong> Gunakan tombol "Regen" untuk regenerate frame individual jika hasil kurang sesuai. Grid utama akan otomatis diupdate!
                    </p>
                  </div>
                </div>

                {/* Main Grid Result */}
                {storyGridImage && (
                  <div className={`${brutalCard} p-6`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black uppercase flex items-center gap-2">
                        <Check size={24} className="text-green-600" />
                        Story Grid 2x2 (Final)
                      </h3>
                      <button
                        onClick={() => downloadImage(storyGridImage, 'story-grid-2x2')}
                        className={`${brutalBtn} px-4 py-2 rounded-lg flex items-center gap-2 bg-[#A7F3D0] text-black text-sm`}
                      >
                        <Download size={16} />
                        <span>UNDUH GRID</span>
                      </button>
                    </div>

                    {/* Grid Preview */}
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-full max-w-md rounded-xl overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_#000000]">
                        <img
                          src={storyGridImage}
                          alt="Story Grid 2x2"
                          className="w-full h-auto object-cover"
                        />
                      </div>

                      <div className="w-full max-w-md p-4 bg-[#A7F3D0] border-2 border-black rounded-lg">
                        <p className="text-sm font-bold text-black text-center">
                          ✨ Grid 2x2 seamless siap diupload ke Instagram Story! Format: 1080x1920px (9:16)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] text-black font-sans p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[1400px] mx-auto space-y-4">

        {/* Header Card - Logo + Social Links Only */}
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

            {/* Social Links */}
            <div className="flex items-center gap-2">
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

        {/* Tool Navigation Bar - Simple border style */}
        <div className="flex flex-wrap justify-center gap-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 text-sm border-2 border-black transition-all font-bold uppercase tracking-wide
                ${activeTool === tool.id
                  ? 'bg-[#FCD34D] shadow-[4px_4px_0px_0px_#000000] translate-y-0'
                  : 'bg-white shadow-[2px_2px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-y-[-1px]'
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Preview Section - Centered Below Grid */}
        {['virtual-tryon', 'product-photo'].includes(activeTool) && generatedImages.length > 0 && (
          <div className={`${brutalCard} p-6`}>
            <h3 className="text-xl font-black uppercase mb-6">Pratinjau Terpilih</h3>
            {selectedImageIndex !== null && generatedImages[selectedImageIndex] ? (
              <div className="flex flex-col items-center gap-6">
                <div className={`w-full max-w-2xl rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_#000000] ${getAspectRatioStyle(aspectRatio)}`}>
                  <img src={generatedImages[selectedImageIndex]} alt="Selected Preview" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => downloadImage(generatedImages[selectedImageIndex], selectedImageIndex)}
                  className={`${brutalBtn} bg-[#FCD34D] px-8 py-4 rounded-lg flex items-center justify-center gap-3 text-lg`}
                >
                  <Download size={24} />
                  <span>UNDUH GAMBAR HD</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 py-12">
                <ImageIcon size={64} className="mb-4 opacity-20" />
                <p className="font-bold text-lg">PILIH GAMBAR DARI GRID</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
