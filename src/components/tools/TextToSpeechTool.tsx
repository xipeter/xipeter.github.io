import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Slider,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import ReactMarkdown from 'react-markdown';

// ---------------------------------------------------------------------------
// Bilingual UI strings
// ---------------------------------------------------------------------------
const uiStrings = {
  en: {
    title: 'Text to Speech Reader',
    subtitle: 'Listen to articles or paste your own text. Runs entirely in your browser.',
    selectArticle: 'Select Article',
    pasteText: 'Paste Text',
    chooseArticle: 'Choose an article...',
    pasteHint: 'Paste or type your text here...',
    voice: 'Voice',
    speed: 'Speed',
    volume: 'Volume',
    play: 'Play',
    pause: 'Pause',
    prevSentence: 'Previous sentence',
    nextSentence: 'Next sentence',
    sentence: 'Sentence',
    of: 'of',
    noVoices: 'No voices available. Please try a different browser.',
    unsupported: 'Your browser does not support text-to-speech. Please try Chrome, Edge, or Safari.',
    noText: 'Select an article or paste text to get started.',
    privacyNote:
      'All speech synthesis happens locally in your browser. Your text is never sent to any server.',
  },
  zh: {
    title: '文字转语音朗读器',
    subtitle: '收听文章朗读或粘贴自己的文字。完全在浏览器中运行。',
    selectArticle: '选择文章',
    pasteText: '粘贴文字',
    chooseArticle: '选择一篇文章...',
    pasteHint: '在此粘贴或输入文字...',
    voice: '声音',
    speed: '语速',
    volume: '音量',
    play: '播放',
    pause: '暂停',
    prevSentence: '上一句',
    nextSentence: '下一句',
    sentence: '句子',
    of: '/',
    noVoices: '没有可用的声音。请尝试使用其他浏览器。',
    unsupported: '您的浏览器不支持文字转语音。请尝试使用 Chrome、Edge 或 Safari。',
    noText: '选择一篇文章或粘贴文字以开始。',
    privacyNote: '所有语音合成均在浏览器本地完成。您的文字不会发送到任何服务器。',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripMarkdown(md: string): string {
  return md
    // Code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    // Headings
    .replace(/^#{1,6}\s+/gm, '')
    // Bold / italic
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    // Images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Links
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Table rows (lines with pipes)
    .replace(/^\|.*\|$/gm, '')
    // Horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // List markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Blockquotes
    .replace(/^>\s*/gm, '')
    // Extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?。！？\n])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

interface Article {
  slug: string;
  title: string;
  body: string; // raw markdown
}

interface Props {
  locale: string;
  articles: Article[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TextToSpeechTool({ locale, articles }: Props) {
  const t = uiStrings[locale as keyof typeof uiStrings] ?? uiStrings.en;

  // --- State ----------------------------------------------------------------
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [debouncedPasteText, setDebouncedPasteText] = useState('');
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [markdownContent, setMarkdownContent] = useState('');

  // Refs to mirror state for use inside async callbacks
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const currentSentenceIndexRef = useRef(0);
  const speedRef = useRef(1.0);
  const volumeRef = useRef(0.8);
  const selectedVoiceURIRef = useRef('');
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(isPaused);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync with state
  useEffect(() => {
    sentencesRef.current = sentences;
  }, [sentences]);

  useEffect(() => {
    currentSentenceIndexRef.current = currentSentenceIndex;
  }, [currentSentenceIndex]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    selectedVoiceURIRef.current = selectedVoiceURI;
  }, [selectedVoiceURI]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    voicesRef.current = voices;
  }, [voices]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedPasteText(pasteText), 500);
    return () => clearTimeout(id);
  }, [pasteText]);

  // --- Voice loading --------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length === 0) return;

      setVoices(available);
      voicesRef.current = available;

      // Pick a default voice matching locale
      const lang = locale.startsWith('zh') ? 'zh' : 'en';
      const preferred = available.find(
        (v) =>
          v.lang.toLowerCase().startsWith(lang) &&
          (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('microsoft')),
      );
      const fallback = available.find((v) => v.lang.toLowerCase().startsWith(lang));
      const defaultVoice = preferred ?? fallback ?? available[0];
      if (defaultVoice) {
        setSelectedVoiceURI(defaultVoice.voiceURI);
        selectedVoiceURIRef.current = defaultVoice.voiceURI;
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      synthRef.current?.cancel();
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [locale]);

  // --- Speech engine --------------------------------------------------------
  const stopPlayback = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsPaused(false);
  }, []);

  const speakSentence = useCallback((index: number) => {
    if (!synthRef.current || index < 0) return;

    // Prevent onend handler of cancelled utterance from advancing
    const wasPlaying = isPlayingRef.current;
    isPlayingRef.current = false;
    synthRef.current.cancel();
    isPlayingRef.current = wasPlaying;

    const currentSentences = sentencesRef.current;
    if (index < 0 || index >= currentSentences.length) return;

    const utterance = new SpeechSynthesisUtterance(currentSentences[index]);

    // Set voice
    const voice = voicesRef.current.find((v) => v.voiceURI === selectedVoiceURIRef.current);
    if (voice) utterance.voice = voice;

    utterance.rate = speedRef.current;
    utterance.volume = volumeRef.current;

    utterance.onend = () => {
      if (!isPlayingRef.current) return;
      const nextIndex = index + 1;
      if (nextIndex < sentencesRef.current.length) {
        setCurrentSentenceIndex(nextIndex);
        currentSentenceIndexRef.current = nextIndex;
        speakSentence(nextIndex);
      } else {
        // Reached end
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsPaused(false);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
  }, []); // no deps — uses refs only

  const handlePlay = useCallback(() => {
    if (isPausedRef.current && synthRef.current) {
      synthRef.current.resume();
      setIsPlaying(true);
      isPlayingRef.current = true;
      setIsPaused(false);
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      setIsPaused(false);
      speakSentence(currentSentenceIndexRef.current);
    }
  }, [speakSentence]);

  const handlePause = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.pause();
    }
    setIsPaused(true);
    isPausedRef.current = true;
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  const handlePrev = useCallback(() => {
    const newIndex = Math.max(0, currentSentenceIndexRef.current - 1);
    setCurrentSentenceIndex(newIndex);
    currentSentenceIndexRef.current = newIndex;
    if (isPlayingRef.current) {
      speakSentence(newIndex);
    }
  }, [speakSentence]);

  const handleNext = useCallback(() => {
    const newIndex = Math.min(
      sentencesRef.current.length - 1,
      currentSentenceIndexRef.current + 1,
    );
    setCurrentSentenceIndex(newIndex);
    currentSentenceIndexRef.current = newIndex;
    if (isPlayingRef.current) {
      speakSentence(newIndex);
    }
  }, [speakSentence]);

  const handleVoiceChange = useCallback(
    (uri: string) => {
      setSelectedVoiceURI(uri);
      selectedVoiceURIRef.current = uri;
      if (isPlayingRef.current) {
        speakSentence(currentSentenceIndexRef.current);
      }
    },
    [speakSentence],
  );

  const handleSpeedChange = useCallback(
    (_: Event, value: number | number[]) => {
      const v = Array.isArray(value) ? value[0] : value;
      setSpeed(v);
      speedRef.current = v;
      if (isPlayingRef.current) {
        speakSentence(currentSentenceIndexRef.current);
      }
    },
    [speakSentence],
  );

  const handleVolumeChange = useCallback(
    (_: Event, value: number | number[]) => {
      const v = Array.isArray(value) ? value[0] : value;
      setVolume(v);
      volumeRef.current = v;
      if (isPlayingRef.current) {
        speakSentence(currentSentenceIndexRef.current);
      }
    },
    [speakSentence],
  );

  // --- Content processing ---------------------------------------------------
  useEffect(() => {
    stopPlayback();
    setCurrentSentenceIndex(0);
    currentSentenceIndexRef.current = 0;

    if (tabIndex === 0) {
      // Article tab
      const article = articles.find((a) => a.slug === selectedArticleSlug);
      if (article) {
        setMarkdownContent(article.body);
        const plain = stripMarkdown(article.body);
        const s = splitSentences(plain);
        setSentences(s);
        sentencesRef.current = s;
      } else {
        setMarkdownContent('');
        setSentences([]);
        sentencesRef.current = [];
      }
    } else {
      // Paste tab
      setMarkdownContent('');
      if (debouncedPasteText.trim()) {
        const s = splitSentences(debouncedPasteText);
        setSentences(s);
        sentencesRef.current = s;
      } else {
        setSentences([]);
        sentencesRef.current = [];
      }
    }
  }, [tabIndex, selectedArticleSlug, debouncedPasteText, articles]);

  // --- Auto-scroll ----------------------------------------------------------
  useEffect(() => {
    const highlighted = contentRef.current?.querySelector('[data-highlighted="true"]');
    if (highlighted) {
      highlighted.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentSentenceIndex]);

  // --- Progress bar ---------------------------------------------------------
  const progressPct =
    sentences.length > 0
      ? (currentSentenceIndex / Math.max(1, sentences.length - 1)) * 100
      : 0;

  // --- Unsupported fallback -------------------------------------------------
  if (!supported) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">{t.unsupported}</Alert>
      </Container>
    );
  }

  // --- Render ---------------------------------------------------------------
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom fontWeight={700}>
        {t.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {t.subtitle}
      </Typography>

      {/* Sticky Player Bar */}
      <Paper
        elevation={4}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: '#1976d2',
          color: 'white',
          p: 2,
          mt: 3,
          borderRadius: 2,
        }}
      >
        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handlePrev}
            disabled={sentences.length === 0}
            title={t.prevSentence}
            sx={{ minWidth: 40, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
          >
            <SkipPreviousIcon />
          </Button>

          {isPlaying ? (
            <Button
              variant="contained"
              size="small"
              onClick={handlePause}
              title={t.pause}
              sx={{ minWidth: 40, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
            >
              <PauseIcon />
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={handlePlay}
              disabled={sentences.length === 0}
              title={t.play}
              sx={{ minWidth: 40, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
            >
              <PlayArrowIcon />
            </Button>
          )}

          <Button
            variant="contained"
            size="small"
            onClick={handleNext}
            disabled={sentences.length === 0}
            title={t.nextSentence}
            sx={{ minWidth: 40, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
          >
            <SkipNextIcon />
          </Button>

          <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>
            {t.sentence} {sentences.length > 0 ? currentSentenceIndex + 1 : 0} {t.of} {sentences.length}
          </Typography>
        </Box>

        {/* Progress bar */}
        <Box
          sx={{
            height: 6,
            bgcolor: 'rgba(255,255,255,0.3)',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: `${progressPct}%`,
              bgcolor: 'white',
              borderRadius: 3,
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Paper>

      {/* Controls Row */}
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Voice dropdown */}
          <FormControl sx={{ minWidth: 220 }} size="small">
            <InputLabel id="voice-label">{t.voice}</InputLabel>
            <Select
              labelId="voice-label"
              label={t.voice}
              value={selectedVoiceURI}
              onChange={(e) => handleVoiceChange(e.target.value as string)}
            >
              {voices.length === 0 ? (
                <MenuItem value="">{t.noVoices}</MenuItem>
              ) : (
                voices.map((v) => (
                  <MenuItem key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Speed slider */}
          <Box sx={{ minWidth: 180 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <SpeedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {t.speed}: {speed.toFixed(1)}x
              </Typography>
            </Box>
            <Slider
              value={speed}
              min={0.5}
              max={2.0}
              step={0.1}
              onChange={handleSpeedChange}
              size="small"
              sx={{ width: '100%' }}
            />
          </Box>

          {/* Volume slider */}
          <Box sx={{ minWidth: 180 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <VolumeUpIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {t.volume}: {Math.round(volume * 100)}%
              </Typography>
            </Box>
            <Slider
              value={volume}
              min={0}
              max={1}
              step={0.05}
              onChange={handleVolumeChange}
              size="small"
              sx={{ width: '100%' }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Input Tabs */}
      <Paper variant="outlined" sx={{ mt: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v as number)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label={t.selectArticle} />
          <Tab label={t.pasteText} />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {tabIndex === 0 ? (
            <Select
              fullWidth
              size="small"
              value={selectedArticleSlug}
              onChange={(e) => setSelectedArticleSlug(e.target.value as string)}
              displayEmpty
              renderValue={(val) =>
                val
                  ? articles.find(a => a.slug === val)?.title ?? String(val)
                  : <em style={{ color: '#aaa' }}>{t.chooseArticle}</em>
              }
            >
              {articles.map((a) => (
                <MenuItem key={a.slug} value={a.slug}>
                  {a.title}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <TextField
              multiline
              rows={5}
              fullWidth
              placeholder={t.pasteHint}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              size="small"
            />
          )}
        </Box>
      </Paper>

      {/* Content Display */}
      <Paper
        variant="outlined"
        ref={contentRef}
        sx={{ p: 2, mt: 2, maxHeight: 500, overflow: 'auto' }}
      >
        {sentences.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            {t.noText}
          </Typography>
        ) : tabIndex === 1 ? (
          // Paste mode: render sentence spans
          <Typography variant="body1" component="div" sx={{ lineHeight: 1.8 }}>
            {sentences.map((sentence, idx) => (
              <span
                key={idx}
                data-highlighted={idx === currentSentenceIndex ? 'true' : 'false'}
                style={{
                  background: idx === currentSentenceIndex ? '#e3f2fd' : 'transparent',
                  borderRadius: 3,
                  padding: '1px 2px',
                  transition: 'background 0.2s',
                }}
              >
                {sentence}{' '}
              </span>
            ))}
          </Typography>
        ) : (
          // Article/markdown mode
          <ReactMarkdown
            components={{
              p: ({ children, ...rest }) => {
                const text = extractText(children);
                const isHighlighted =
                  sentences.length > 0 &&
                  currentSentenceIndex < sentences.length &&
                  text.includes(sentences[currentSentenceIndex]);
                return (
                  <p
                    {...rest}
                    data-highlighted={isHighlighted ? 'true' : 'false'}
                    style={{
                      background: isHighlighted ? '#e3f2fd' : 'transparent',
                      borderRadius: 4,
                      padding: isHighlighted ? '2px 4px' : undefined,
                      transition: 'background 0.2s',
                    }}
                  >
                    {children}
                  </p>
                );
              },
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        )}
      </Paper>

      {/* Privacy note */}
      <Paper variant="outlined" sx={{ p: 2, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary">
          {t.privacyNote}
        </Typography>
      </Paper>
    </Container>
  );
}

// ---------------------------------------------------------------------------
// Util: extract plain text from React children for markdown paragraph highlight
// ---------------------------------------------------------------------------
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in (children as object)) {
    const el = children as { props: { children?: React.ReactNode } };
    return extractText(el.props.children);
  }
  return '';
}
