import { useState, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  LinearProgress,
  Alert,
  InputLabel,
  FormControl,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import PrintIcon from '@mui/icons-material/Print';

// ---------------------------------------------------------------------------
// Bilingual UI strings
// ---------------------------------------------------------------------------
const uiStrings: Record<string, Record<string, string>> = {
  en: {
    title: 'Passport Photo Tool',
    subtitle: 'Prepare print-ready passport photos entirely in your browser.',
    uploadTitle: 'Upload a Photo',
    uploadHint: 'Drag and drop an image here, or click to select a file',
    uploadButton: 'Select Photo',
    country: 'Country / Region',
    targetSize: 'Target size',
    processButton: 'Remove Background & Resize',
    processing: 'Removing background...',
    processingResize: 'Resizing and cropping...',
    processComplete: 'Processing complete',
    processError: 'Background removal failed. Using original photo as fallback.',
    original: 'Original',
    processed: 'Processed',
    paperSize: 'Paper Size',
    copies: 'Number of Copies',
    copiesRange: '1 to 8',
    generateLayout: 'Generate Print Layout',
    layoutPreview: 'Print Layout Preview',
    download: 'Download PNG',
    startOver: 'Start Over',
    step1: 'Step 1: Upload',
    step2: 'Step 2: Configure',
    step3: 'Step 3: Process',
    step4: 'Step 4: Print Layout',
    privacyNote: 'Privacy Note',
    privacyText:
      'All processing happens locally in your browser. Your photos are never uploaded to any server.',
    fitsOnPaper: 'photos fit on this paper size.',
    maxCopiesNote: 'Maximum copies that fit:',
  },
  zh: {
    title: '证件照工具',
    subtitle: '完全在浏览器中制作可打印的证件照。',
    uploadTitle: '上传照片',
    uploadHint: '将图片拖放到此处，或点击选择文件',
    uploadButton: '选择照片',
    country: '国家 / 地区',
    targetSize: '目标尺寸',
    processButton: '去除背景并调整大小',
    processing: '正在去除背景...',
    processingResize: '正在裁剪和调整大小...',
    processComplete: '处理完成',
    processError: '背景去除失败，将使用原始照片作为替代。',
    original: '原始照片',
    processed: '处理后',
    paperSize: '纸张大小',
    copies: '照片数量',
    copiesRange: '1 至 8',
    generateLayout: '生成打印布局',
    layoutPreview: '打印布局预览',
    download: '下载 PNG',
    startOver: '重新开始',
    step1: '第一步：上传',
    step2: '第二步：配置',
    step3: '第三步：处理',
    step4: '第四步：打印布局',
    privacyNote: '隐私声明',
    privacyText: '所有处理都在您的浏览器中本地完成。您的照片不会上传到任何服务器。',
    fitsOnPaper: '张照片可放入此纸张。',
    maxCopiesNote: '最多可放入：',
  },
};

// ---------------------------------------------------------------------------
// Country presets
// ---------------------------------------------------------------------------
interface CountryPreset {
  label: string;
  labelZh: string;
  widthPx: number;
  heightPx: number;
  description: string;
}

const COUNTRY_PRESETS: Record<string, CountryPreset> = {
  us: {
    label: 'US Passport',
    labelZh: '美国护照',
    widthPx: 600,
    heightPx: 600,
    description: '2\u00d72 inch (600\u00d7600 px @ 300 DPI)',
  },
  uk: {
    label: 'UK Passport',
    labelZh: '英国护照',
    widthPx: 413,
    heightPx: 531,
    description: '35\u00d745 mm (413\u00d7531 px @ 300 DPI)',
  },
  eu: {
    label: 'EU / Schengen',
    labelZh: '欧盟 / 申根',
    widthPx: 413,
    heightPx: 531,
    description: '35\u00d745 mm (413\u00d7531 px @ 300 DPI)',
  },
  ca: {
    label: 'Canada',
    labelZh: '加拿大',
    widthPx: 591,
    heightPx: 827,
    description: '50\u00d770 mm (591\u00d7827 px @ 300 DPI)',
  },
  au: {
    label: 'Australia',
    labelZh: '澳大利亚',
    widthPx: 413,
    heightPx: 531,
    description: '35\u00d745 mm (413\u00d7531 px @ 300 DPI)',
  },
  cn: {
    label: 'China',
    labelZh: '中国',
    widthPx: 390,
    heightPx: 567,
    description: '33\u00d748 mm (390\u00d7567 px @ 300 DPI)',
  },
};

// ---------------------------------------------------------------------------
// Paper sizes
// ---------------------------------------------------------------------------
interface PaperSize {
  label: string;
  widthPx: number;
  heightPx: number;
}

const PAPER_SIZES: Record<string, PaperSize> = {
  '4x6': { label: '4\u00d76 inch', widthPx: 1200, heightPx: 1800 },
  a4: { label: 'A4', widthPx: 2480, heightPx: 3508 },
  letter: { label: 'US Letter', widthPx: 2550, heightPx: 3300 },
};

const PAPER_PADDING = 30;
const PHOTO_GAP = 20;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Calculate how many photos fit in a grid and their positions. */
function computeLayout(
  paperW: number,
  paperH: number,
  photoW: number,
  photoH: number,
  requestedCopies: number,
) {
  const usableW = paperW - PAPER_PADDING * 2;
  const usableH = paperH - PAPER_PADDING * 2;

  const cols = Math.floor((usableW + PHOTO_GAP) / (photoW + PHOTO_GAP));
  const rows = Math.floor((usableH + PHOTO_GAP) / (photoH + PHOTO_GAP));
  const maxFit = cols * rows;
  const count = Math.min(requestedCopies, maxFit);

  // Center the grid
  const gridW = cols * photoW + (cols - 1) * PHOTO_GAP;
  const gridH = rows * photoH + (rows - 1) * PHOTO_GAP;
  const offsetX = PAPER_PADDING + (usableW - gridW) / 2;
  const offsetY = PAPER_PADDING + (usableH - gridH) / 2;

  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      x: offsetX + col * (photoW + PHOTO_GAP),
      y: offsetY + row * (photoH + PHOTO_GAP),
    });
  }

  return { positions, maxFit, cols, rows };
}

/** Load an image element from a blob URL. */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Center-crop an image to a target aspect ratio, then resize to exact dimensions. */
function cropAndResize(
  source: HTMLImageElement | HTMLCanvasElement,
  targetW: number,
  targetH: number,
): HTMLCanvasElement {
  const srcW = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const srcH = source instanceof HTMLImageElement ? source.naturalHeight : source.height;

  const targetAspect = targetW / targetH;
  const srcAspect = srcW / srcH;

  let cropW: number;
  let cropH: number;
  let cropX: number;
  let cropY: number;

  if (srcAspect > targetAspect) {
    // Source is wider — crop sides
    cropH = srcH;
    cropW = srcH * targetAspect;
    cropX = (srcW - cropW) / 2;
    cropY = 0;
  } else {
    // Source is taller — crop top/bottom
    cropW = srcW;
    cropH = srcW / targetAspect;
    cropX = 0;
    cropY = (srcH - cropH) / 2;
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);
  return canvas;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface PassportPhotoToolProps {
  locale?: string;
}

export const PassportPhotoTool = ({ locale = 'en' }: PassportPhotoToolProps) => {
  const t = uiStrings[locale] ?? uiStrings.en;

  // --- State ---------------------------------------------------------------
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [country, setCountry] = useState<string>('us');
  const [paperSize, setPaperSize] = useState<string>('4x6');
  const [copies, setCopies] = useState<number>(4);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [layoutUrl, setLayoutUrl] = useState<string | null>(null);
  const [layoutBlob, setLayoutBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [maxFitOnPaper, setMaxFitOnPaper] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // --- Handlers ------------------------------------------------------------

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    // Revoke previous URL to avoid memory leak
    setUploadedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setUploadedFile(file);
    // Reset downstream state
    setProcessedUrl(null);
    setProcessedCanvas(null);
    setLayoutUrl(null);
    setLayoutBlob(null);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleProcess = useCallback(async () => {
    if (!uploadedFile && !uploadedUrl) return;
    setIsProcessing(true);
    setError(null);
    setProcessingStage(t.processing);

    const preset = COUNTRY_PRESETS[country];
    let transparentBlob: Blob | null = null;

    try {
      // Dynamic import so tree-shaking works and initial bundle stays small
      const { removeBackground } = await import('@imgly/background-removal');
      transparentBlob = await removeBackground(uploadedFile as Blob);
    } catch {
      setError(t.processError);
    }

    setProcessingStage(t.processingResize);

    try {
      // Draw the result (or original) onto a white canvas
      const sourceUrl = transparentBlob
        ? URL.createObjectURL(transparentBlob)
        : uploadedUrl!;
      const img = await loadImage(sourceUrl);
      if (transparentBlob) URL.revokeObjectURL(sourceUrl);

      // White background canvas at the image's native size
      const whiteCanvas = document.createElement('canvas');
      whiteCanvas.width = img.naturalWidth;
      whiteCanvas.height = img.naturalHeight;
      const wCtx = whiteCanvas.getContext('2d')!;
      wCtx.fillStyle = '#ffffff';
      wCtx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);
      wCtx.drawImage(img, 0, 0);

      // Center-crop + resize
      const finalCanvas = cropAndResize(whiteCanvas, preset.widthPx, preset.heightPx);
      setProcessedCanvas(finalCanvas);

      const blob = await new Promise<Blob>((resolve, reject) => {
        finalCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
      });
      const url = URL.createObjectURL(blob);
      setProcessedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch {
      setError(t.processError);
    }

    setIsProcessing(false);
    setProcessingStage('');
  }, [uploadedFile, uploadedUrl, country, t]);

  const handleGenerateLayout = useCallback(() => {
    if (!processedCanvas) return;
    const preset = COUNTRY_PRESETS[country];
    const paper = PAPER_SIZES[paperSize];

    const { positions, maxFit } = computeLayout(
      paper.widthPx,
      paper.heightPx,
      preset.widthPx,
      preset.heightPx,
      copies,
    );
    setMaxFitOnPaper(maxFit);

    const canvas = document.createElement('canvas');
    canvas.width = paper.widthPx;
    canvas.height = paper.heightPx;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const pos of positions) {
      ctx.drawImage(processedCanvas, pos.x, pos.y, preset.widthPx, preset.heightPx);
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      setLayoutBlob(blob);
      const url = URL.createObjectURL(blob);
      setLayoutUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }, 'image/png');
  }, [processedCanvas, country, paperSize, copies]);

  const handleDownload = useCallback(() => {
    if (!layoutBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(layoutBlob);
    a.download = `passport-photo-${country}-${paperSize}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, [layoutBlob, country, paperSize]);

  const handleStartOver = useCallback(() => {
    setUploadedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setUploadedFile(null);
    setProcessedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setProcessedCanvas(null);
    setLayoutUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setLayoutBlob(null);
    setError(null);
    setCopies(4);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // --- Derived values ------------------------------------------------------
  const preset = COUNTRY_PRESETS[country];
  const paper = PAPER_SIZES[paperSize];
  const { maxFit: currentMaxFit } = computeLayout(
    paper.widthPx,
    paper.heightPx,
    preset.widthPx,
    preset.heightPx,
    copies,
  );

  // --- Render --------------------------------------------------------------
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        {t.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {t.subtitle}
      </Typography>

      {/* ---- Step 1: Upload ---- */}
      <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t.step1}
        </Typography>

        <Box
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed',
            borderColor: 'grey.400',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {t.uploadHint}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileInput}
          />
        </Box>

        {uploadedUrl && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img
              src={uploadedUrl}
              alt="Uploaded"
              style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
            />
          </Box>
        )}
      </Paper>

      {/* ---- Step 2: Configure ---- */}
      {uploadedUrl && (
        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t.step2}
          </Typography>

          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="country-label">{t.country}</InputLabel>
            <Select
              labelId="country-label"
              label={t.country}
              value={country}
              onChange={(e) => {
                setCountry(e.target.value as string);
                // Reset processed output when country changes
                setProcessedUrl(null);
                setProcessedCanvas(null);
                setLayoutUrl(null);
                setLayoutBlob(null);
              }}
            >
              {Object.entries(COUNTRY_PRESETS).map(([key, p]) => (
                <MenuItem key={key} value={key}>
                  {locale === 'zh' ? p.labelZh : p.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t.targetSize}: {preset.description}
          </Typography>

          <Button
            variant="contained"
            startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <CropOriginalIcon />}
            onClick={handleProcess}
            disabled={isProcessing}
            sx={{ mt: 2 }}
          >
            {isProcessing ? processingStage : t.processButton}
          </Button>

          {isProcessing && <LinearProgress sx={{ mt: 1 }} />}
          {error && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      )}

      {/* ---- Step 3: Comparison ---- */}
      {processedUrl && (
        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t.step3}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                {t.original}
              </Typography>
              <img
                src={uploadedUrl!}
                alt="Original"
                style={{ maxWidth: 250, maxHeight: 300, borderRadius: 8, border: '1px solid #ddd' }}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                {t.processed}
              </Typography>
              <img
                src={processedUrl}
                alt="Processed"
                style={{ maxWidth: 250, maxHeight: 300, borderRadius: 8, border: '1px solid #ddd' }}
              />
            </Box>
          </Box>
        </Paper>
      )}

      {/* ---- Step 4: Paper layout ---- */}
      {processedCanvas && (
        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t.step4}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel id="paper-label">{t.paperSize}</InputLabel>
              <Select
                labelId="paper-label"
                label={t.paperSize}
                value={paperSize}
                onChange={(e) => {
                  setPaperSize(e.target.value as string);
                  setLayoutUrl(null);
                  setLayoutBlob(null);
                }}
              >
                {Object.entries(PAPER_SIZES).map(([key, ps]) => (
                  <MenuItem key={key} value={key}>
                    {ps.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t.copies}
              type="number"
              value={copies}
              onChange={(e) => {
                const v = Math.max(1, Math.min(8, Number(e.target.value) || 1));
                setCopies(v);
                setLayoutUrl(null);
                setLayoutBlob(null);
              }}
              inputProps={{ min: 1, max: 8 }}
              helperText={`${t.maxCopiesNote} ${currentMaxFit}`}
              sx={{ width: 140 }}
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handleGenerateLayout}
            sx={{ mt: 2 }}
          >
            {t.generateLayout}
          </Button>

          {layoutUrl && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t.layoutPreview}
              </Typography>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  overflow: 'hidden',
                  maxWidth: '100%',
                }}
              >
                <img
                  src={layoutUrl}
                  alt="Print layout"
                  style={{ width: '100%', display: 'block' }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}>
                  {t.download}
                </Button>
                <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleStartOver}>
                  {t.startOver}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* ---- Privacy note ---- */}
      <Paper variant="outlined" sx={{ p: 2, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2">{t.privacyNote}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t.privacyText}
        </Typography>
      </Paper>
    </Container>
  );
};
