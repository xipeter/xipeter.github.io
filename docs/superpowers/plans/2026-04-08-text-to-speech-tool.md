# Text-to-Speech Article Reader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone browser-based text-to-speech tool at `/[lang]/tools/text-to-speech` that reads site articles aloud (or pasted text) using the Web Speech API, with voice selection, speed/volume controls, and sentence-by-sentence navigation.

**Architecture:** Single React component (`TextToSpeechTool.tsx`) rendered via an Astro page, following the existing PassportPhotoTool pattern. Content collection entry for SEO. All TTS logic uses the browser's Web Speech API — no backend needed.

**Tech Stack:** Astro 5, React 19, MUI v7, Web Speech API, react-markdown

**Spec:** `docs/superpowers/specs/2026-04-08-text-to-speech-tool-design.md`

---

### Task 1: Content Collection Entry

**Files:**
- Create: `src/content/tools/text-to-speech.md`

- [ ] **Step 1: Create the content markdown file**

```markdown
---
title: "Text to Speech Reader"
category: "utilities"
intro: "Free online text-to-speech tool that reads articles aloud in English and Chinese. Adjust voice, speed, and volume — runs entirely in your browser."
features:
  - "Read articles in English and Chinese with natural voices"
  - "Adjustable speed (0.5x–2.0x), volume, and voice selection"
  - "Sentence-by-sentence navigation with visual highlighting"
  - "Built-in article library or paste your own text"
  - "Works entirely in browser — no sign-up or API needed"
examples:
  - title: "Listen to Articles"
    description: "Select any article from the site and listen to it read aloud while following along with highlighted text."
  - title: "Paste Custom Text"
    description: "Paste any text — notes, emails, documents — and have it read aloud with your preferred voice and speed."
  - title: "Language Learning"
    description: "Listen to articles in English or Chinese to practice pronunciation and comprehension."
faq:
  - question: "Is this text-to-speech tool free?"
    answer: "Yes, completely free. It uses your browser's built-in speech synthesis engine — no API keys or accounts needed."
  - question: "What languages are supported?"
    answer: "English and Chinese are the primary languages. Additional languages may be available depending on your browser and operating system's installed voices."
  - question: "Can I adjust the reading speed?"
    answer: "Yes. Speed can be adjusted from 0.5x (half speed) to 2.0x (double speed) using the speed slider."
  - question: "Why do voices sound different on different devices?"
    answer: "The tool uses your browser's Web Speech API, which relies on text-to-speech voices installed on your operating system. Chrome typically has the best selection, followed by Safari and Edge."
  - question: "Can I use this with my own text?"
    answer: "Yes. Switch to the 'Paste Text' tab and enter any text you want read aloud — articles, notes, emails, or any other content."
  - question: "Does this work on mobile?"
    answer: "Yes. The Web Speech API is supported on most modern mobile browsers. Voice availability varies by device."
limitations:
  - "Voice quality and availability depends on your browser and operating system"
  - "Some browsers (especially Firefox) have limited voice options"
  - "Very long texts may have pauses between sentences due to browser speech limits"
  - "Cannot download audio — playback is real-time only"
relatedArticles:
  - "ai-coding-assistants-getting-started"
  - "browser-privacy-advantages"
seo:
  title: "Free Text to Speech Reader — Listen to Articles Online"
  description: "Free browser-based text-to-speech tool. Read articles aloud in English and Chinese with adjustable speed, voice, and volume. No sign-up required."
  keywords:
    - "text to speech"
    - "TTS reader"
    - "read aloud online"
    - "article reader"
    - "free text to speech"
    - "listen to articles"
    - "text to speech Chinese English"
adEligible: true
---

# Free Online Text to Speech Reader

Listen to articles and text read aloud — right in your browser. This text-to-speech tool uses your browser's built-in speech synthesis to convert written content into spoken audio with natural-sounding voices.

## How It Works

1. **Choose your content** — select an article from the site library or paste your own text
2. **Pick a voice** — choose from available voices on your device (male, female, different accents)
3. **Set your preferences** — adjust reading speed and volume to your comfort level
4. **Press play** — listen while following along with sentence highlighting

## Use Cases

### Accessibility
Text-to-speech makes written content accessible to users with visual impairments, reading difficulties, or dyslexia. Listen to articles hands-free while doing other tasks.

### Language Learning
Hearing text read aloud helps with pronunciation and comprehension. Switch between English and Chinese voices to practice both languages.

### Multitasking
Listen to technical articles while commuting, exercising, or cooking. Convert reading time into listening time without losing the content.

### Proofreading
Hearing your own writing read aloud is one of the best ways to catch errors, awkward phrasing, and flow issues that you might miss when reading silently.

## Tips for Best Results

- **Use Chrome or Edge** for the best voice quality and largest voice selection
- **Start at 1.0x speed** and gradually increase as you get comfortable
- **Try different voices** — quality varies significantly between voices on the same system
- **For Chinese text**, make sure you have Chinese voices installed on your system (most modern OS versions include them by default)

## Browser Compatibility

| Browser | Voice Quality | Voice Count | Notes |
|---------|--------------|-------------|-------|
| Chrome | Excellent | 20+ | Best overall experience, includes Google voices |
| Edge | Excellent | 20+ | Includes Microsoft natural voices |
| Safari | Good | 10+ | Solid macOS/iOS support |
| Firefox | Limited | 5-10 | Fewer voices, but functional |

## Privacy

This tool runs entirely in your browser. Your text is never sent to any server — all speech synthesis happens locally on your device using the Web Speech API.
```

- [ ] **Step 2: Verify the content collection picks it up**

Run: `cd /Users/zxi/Ai/tool && npx astro build 2>&1 | head -20`

Expected: No schema validation errors for the new tools entry.

- [ ] **Step 3: Commit**

```bash
git add src/content/tools/text-to-speech.md
git commit -m "feat: add text-to-speech tool content collection entry"
```

---

### Task 2: i18n Translation Keys

**Files:**
- Modify: `src/i18n/en.json` (add `toolsContent.tts` section)
- Modify: `src/i18n/zh.json` (add `toolsContent.tts` section)

- [ ] **Step 1: Add English translation keys**

In `src/i18n/en.json`, add a new `tts` key inside `toolsContent` (after the `passport` entry):

```json
"tts": {
  "title": "Text to Speech Reader",
  "pageTitle": "Free Text to Speech Reader — Listen to Articles Online",
  "description": "Free browser-based text-to-speech tool. Read articles aloud in English and Chinese with adjustable speed, voice, and volume. No sign-up required.",
  "features": {
    "voices": "Multiple voices including male and female options",
    "speed": "Adjustable speed from 0.5x to 2.0x",
    "articles": "Built-in article library"
  }
}
```

- [ ] **Step 2: Add Chinese translation keys**

In `src/i18n/zh.json`, add a matching `tts` key inside `toolsContent`:

```json
"tts": {
  "title": "文字转语音朗读器",
  "pageTitle": "免费在线文字转语音 — 听文章朗读",
  "description": "免费浏览器文字转语音工具。支持中英文朗读，可调节语速、音量和声音选择。无需注册。",
  "features": {
    "voices": "多种声音选择，包括男声和女声",
    "speed": "语速可从 0.5 倍调节到 2.0 倍",
    "articles": "内置文章库"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/en.json src/i18n/zh.json
git commit -m "feat: add i18n keys for text-to-speech tool"
```

---

### Task 3: React Component — TextToSpeechTool.tsx

**Files:**
- Create: `src/components/tools/TextToSpeechTool.tsx`

This is the main task. The component handles all TTS logic and UI in a single file.

- [ ] **Step 1: Create the component file with imports, types, and UI strings**

Create `src/components/tools/TextToSpeechTool.tsx`:

```tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  Slider,
  IconButton,
  Tab,
  Tabs,
  TextField,
  FormControl,
  InputLabel,
  Alert,
  Paper,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import ReactMarkdown from 'react-markdown';

interface Article {
  slug: string;
  title: string;
  body: string;
}

interface Props {
  locale: string;
  articles: Article[];
}

const uiStrings: Record<string, Record<string, string>> = {
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
    privacyNote: 'All speech synthesis happens locally in your browser. Your text is never sent to any server.',
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

// Split text into sentences, handling English and Chinese punctuation
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?。！？\n])\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Strip markdown to plain text for TTS
function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')       // headings
    .replace(/\*\*(.+?)\*\*/g, '$1')   // bold
    .replace(/\*(.+?)\*/g, '$1')       // italic
    .replace(/`(.+?)`/g, '$1')         // inline code
    .replace(/```[\s\S]*?```/g, '')    // code blocks
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .replace(/!\[.*?\]\(.+?\)/g, '')   // images
    .replace(/^\s*[-*+]\s+/gm, '')     // list markers
    .replace(/^\s*\d+\.\s+/gm, '')     // ordered list markers
    .replace(/^\|.*\|$/gm, '')         // table rows
    .replace(/^\s*[-|:]+\s*$/gm, '')   // table separators
    .replace(/\n{2,}/g, '\n')
    .trim();
}
```

- [ ] **Step 2: Add the component function with state and speech engine logic**

Append to the same file, right after the `stripMarkdown` function:

```tsx
export function TextToSpeechTool({ locale, articles }: Props) {
  const t = uiStrings[locale] ?? uiStrings.en;
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // State
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
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [markdownContent, setMarkdownContent] = useState('');

  // Refs for latest state in callbacks
  const sentencesRef = useRef(sentences);
  sentencesRef.current = sentences;
  const currentIndexRef = useRef(currentSentenceIndex);
  currentIndexRef.current = currentSentenceIndex;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  const selectedVoiceURIRef = useRef(selectedVoiceURI);
  selectedVoiceURIRef.current = selectedVoiceURI;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const v = synthRef.current!.getVoices();
      if (v.length > 0) {
        setVoices(v);
        // Pick a default voice matching locale
        const langPrefix = locale === 'zh' ? 'zh' : 'en';
        const preferred = v.find(
          voice => voice.lang.startsWith(langPrefix) && /google|microsoft/i.test(voice.name)
        ) ?? v.find(voice => voice.lang.startsWith(langPrefix)) ?? v[0];
        setSelectedVoiceURI(preferred.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, [locale]);

  // Process text when article or paste content changes
  useEffect(() => {
    let text = '';
    let md = '';
    if (tabIndex === 0 && selectedArticleSlug) {
      const article = articles.find(a => a.slug === selectedArticleSlug);
      if (article) {
        md = article.body;
        text = stripMarkdown(article.body);
      }
    } else if (tabIndex === 1 && pasteText) {
      md = pasteText;
      text = pasteText;
    }
    setMarkdownContent(md);
    setSentences(splitSentences(text));
    setCurrentSentenceIndex(0);
    stop();
  }, [tabIndex, selectedArticleSlug, pasteText, articles]);

  // Speak a specific sentence
  const speakSentence = useCallback((index: number) => {
    if (!synthRef.current || index >= sentencesRef.current.length) {
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(sentencesRef.current[index]);
    const voice = synthRef.current.getVoices().find(v => v.voiceURI === selectedVoiceURIRef.current);
    if (voice) utterance.voice = voice;
    utterance.rate = speedRef.current;
    utterance.volume = volumeRef.current;

    utterance.onend = () => {
      const nextIndex = currentIndexRef.current + 1;
      if (nextIndex < sentencesRef.current.length && isPlayingRef.current) {
        setCurrentSentenceIndex(nextIndex);
        speakSentence(nextIndex);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, []);

  const play = useCallback(() => {
    if (!synthRef.current || sentences.length === 0) return;
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(true);
    setIsPaused(false);
    speakSentence(currentSentenceIndex);
  }, [isPaused, currentSentenceIndex, sentences.length, speakSentence]);

  const pause = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const prevSentence = useCallback(() => {
    const newIndex = Math.max(0, currentSentenceIndex - 1);
    setCurrentSentenceIndex(newIndex);
    if (isPlaying || isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
      speakSentence(newIndex);
    }
  }, [currentSentenceIndex, isPlaying, isPaused, speakSentence]);

  const nextSentence = useCallback(() => {
    const newIndex = Math.min(sentences.length - 1, currentSentenceIndex + 1);
    setCurrentSentenceIndex(newIndex);
    if (isPlaying || isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
      speakSentence(newIndex);
    }
  }, [currentSentenceIndex, sentences.length, isPlaying, isPaused, speakSentence]);

  // When voice/speed/volume change during playback, restart current sentence
  const handleVoiceChange = useCallback((voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    if (isPlaying) {
      // Will pick up new voice via ref on next speakSentence call
      speakSentence(currentSentenceIndex);
    }
  }, [isPlaying, currentSentenceIndex, speakSentence]);

  const handleSpeedChange = useCallback((_: Event, value: number | number[]) => {
    setSpeed(value as number);
    if (isPlaying) {
      speakSentence(currentSentenceIndex);
    }
  }, [isPlaying, currentSentenceIndex, speakSentence]);

  const handleVolumeChange = useCallback((_: Event, value: number | number[]) => {
    setVolume(value as number);
    if (isPlaying) {
      speakSentence(currentSentenceIndex);
    }
  }, [isPlaying, currentSentenceIndex, speakSentence]);
```

- [ ] **Step 3: Add the JSX render — player bar, controls, tabs, and content display**

Append to the component function (before the closing brace), continuing `TextToSpeechTool`:

```tsx
  // Auto-scroll to highlighted sentence
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contentRef.current) {
      const highlighted = contentRef.current.querySelector('[data-highlighted="true"]');
      if (highlighted) {
        highlighted.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentSentenceIndex]);

  // Render markdown with sentence highlighting
  const renderContent = () => {
    if (!markdownContent) {
      return (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t.noText}
        </Typography>
      );
    }

    if (tabIndex === 1) {
      // Plain text mode: split into paragraphs and highlight sentences
      const plainSentences = splitSentences(pasteText);
      return (
        <Box sx={{ lineHeight: 1.8, fontSize: '1rem' }}>
          {plainSentences.map((sentence, i) => (
            <span
              key={i}
              data-highlighted={i === currentSentenceIndex ? 'true' : 'false'}
              style={{
                backgroundColor: i === currentSentenceIndex ? '#e3f2fd' : 'transparent',
                padding: i === currentSentenceIndex ? '2px 4px' : '0',
                borderRadius: i === currentSentenceIndex ? '4px' : '0',
                transition: 'background-color 0.2s',
              }}
            >
              {sentence}{' '}
            </span>
          ))}
        </Box>
      );
    }

    // Markdown mode with highlighting
    const plainText = stripMarkdown(markdownContent);
    const currentSentence = sentences[currentSentenceIndex] ?? '';

    return (
      <Box sx={{ lineHeight: 1.8, '& h1, & h2, & h3': { mt: 3, mb: 1 }, '& p': { mb: 1.5, color: 'text.secondary' }, '& ul, & ol': { mb: 1.5, pl: 3, color: 'text.secondary' }, '& code': { bgcolor: 'grey.100', px: 0.5, borderRadius: 1, fontSize: '0.875rem' }, '& pre': { bgcolor: 'grey.100', p: 2, borderRadius: 2, overflow: 'auto', mb: 1.5 }, '& blockquote': { borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, my: 2, color: 'text.secondary', fontStyle: 'italic' }, '& a': { color: 'primary.main' }, '& table': { width: '100%', borderCollapse: 'collapse', mb: 1.5 }, '& th, & td': { border: '1px solid', borderColor: 'divider', p: 1, textAlign: 'left' }, '& th': { bgcolor: 'grey.50', fontWeight: 600 } }}>
        <ReactMarkdown
          components={{
            p: ({ children }) => {
              const text = typeof children === 'string' ? children : 
                Array.isArray(children) ? children.map(c => typeof c === 'string' ? c : '').join('') : '';
              const isHighlighted = currentSentence && text.includes(currentSentence);
              return (
                <p data-highlighted={isHighlighted ? 'true' : 'false'} style={{
                  backgroundColor: isHighlighted ? '#e3f2fd' : 'transparent',
                  padding: isHighlighted ? '4px 8px' : '0',
                  borderRadius: isHighlighted ? '6px' : '0',
                  transition: 'background-color 0.3s',
                }}>
                  {children}
                </p>
              );
            },
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </Box>
    );
  };

  if (!supported) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">{t.unsupported}</Alert>
      </Container>
    );
  }

  const progress = sentences.length > 0 ? (currentSentenceIndex / (sentences.length - 1)) * 100 : 0;

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
        {t.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t.subtitle}
      </Typography>

      {/* Sticky Player Bar */}
      <Paper
        elevation={3}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          px: 2,
          py: 1.5,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <IconButton
          onClick={prevSentence}
          disabled={sentences.length === 0}
          size="small"
          sx={{ color: 'white', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
          aria-label={t.prevSentence}
        >
          <SkipPreviousIcon />
        </IconButton>

        <IconButton
          onClick={isPlaying ? pause : play}
          disabled={sentences.length === 0}
          sx={{
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.15)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
            '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
            width: 44,
            height: 44,
          }}
          aria-label={isPlaying ? t.pause : t.play}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>

        <IconButton
          onClick={nextSentence}
          disabled={sentences.length === 0}
          size="small"
          sx={{ color: 'white', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
          aria-label={t.nextSentence}
        >
          <SkipNextIcon />
        </IconButton>

        {/* Progress bar */}
        <Box sx={{ flex: 1, mx: 1 }}>
          <Box sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', bgcolor: 'white', borderRadius: 2, width: `${progress}%`, transition: 'width 0.3s' }} />
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', minWidth: 70, textAlign: 'right' }}>
          {sentences.length > 0
            ? `${t.sentence} ${currentSentenceIndex + 1} ${t.of} ${sentences.length}`
            : ''}
        </Typography>
      </Paper>

      {/* Controls Row */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Voice selector */}
        <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
          <InputLabel>{t.voice}</InputLabel>
          <Select
            value={selectedVoiceURI}
            label={t.voice}
            onChange={(e) => handleVoiceChange(e.target.value)}
          >
            {voices.map(v => (
              <MenuItem key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </MenuItem>
            ))}
          </Select>
          {voices.length === 0 && (
            <Typography variant="caption" color="warning.main" sx={{ mt: 0.5 }}>{t.noVoices}</Typography>
          )}
        </FormControl>

        {/* Speed slider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 160 }}>
          <SpeedIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 38 }}>
            {t.speed}
          </Typography>
          <Slider
            value={speed}
            onChange={handleSpeedChange}
            min={0.5}
            max={2.0}
            step={0.1}
            size="small"
            sx={{ width: 80 }}
            aria-label={t.speed}
          />
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 30 }}>
            {speed.toFixed(1)}x
          </Typography>
        </Box>

        {/* Volume slider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 140 }}>
          <VolumeUpIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 20 }}>
            {t.volume}
          </Typography>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.05}
            size="small"
            sx={{ width: 80 }}
            aria-label={t.volume}
          />
        </Box>
      </Paper>

      {/* Input Tabs */}
      <Paper variant="outlined" sx={{ mb: 2, overflow: 'hidden' }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => { stop(); setTabIndex(v); }}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`📚 ${t.selectArticle}`} />
          <Tab label={`📝 ${t.pasteText}`} />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {tabIndex === 0 ? (
            <FormControl fullWidth size="small">
              <Select
                value={selectedArticleSlug}
                onChange={(e) => setSelectedArticleSlug(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>{t.chooseArticle}</MenuItem>
                {articles.map(a => (
                  <MenuItem key={a.slug} value={a.slug}>{a.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={10}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={t.pasteHint}
              variant="outlined"
              size="small"
            />
          )}
        </Box>
      </Paper>

      {/* Content Display */}
      <Paper variant="outlined" sx={{ p: 3, mb: 2, maxHeight: 500, overflow: 'auto' }} ref={contentRef}>
        {renderContent()}
      </Paper>

      {/* Privacy note */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
        🔒 {t.privacyNote}
      </Typography>
    </Container>
  );
}
```

- [ ] **Step 4: Verify the component compiles**

Run: `cd /Users/zxi/Ai/tool && npx astro check 2>&1 | tail -20`

Expected: No TypeScript errors in TextToSpeechTool.tsx.

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/TextToSpeechTool.tsx
git commit -m "feat: add TextToSpeechTool React component"
```

---

### Task 4: Astro Page

**Files:**
- Create: `src/pages/[lang]/tools/text-to-speech.astro`

- [ ] **Step 1: Create the Astro page**

Create `src/pages/[lang]/tools/text-to-speech.astro`:

```astro
---
import MainLayout from '../../../layouts/MainLayout.astro';
import { getTranslations } from '../../../i18n/index';
import { getCollection } from 'astro:content';
import { TextToSpeechTool } from '../../../components/tools/TextToSpeechTool';

export async function getStaticPaths() {
  return [
    { params: { lang: 'en' } },
    { params: { lang: 'zh' } }
  ];
}

const { lang } = Astro.params;
const t = getTranslations(lang);

const siteUrl = 'https://xipeter.github.io';
const pageUrl = `${siteUrl}/${lang}/tools/text-to-speech/`;

// Load articles for the article picker
const allArticles = await getCollection('articles');
const articleData = allArticles.map(a => ({
  slug: a.slug,
  title: a.data.title,
  body: a.body ?? '',
}));

const appJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": lang === 'en' ? "Text to Speech Reader" : "文字转语音朗读器",
  "description": t.toolsContent.tts.description,
  "url": pageUrl,
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any (Web Browser)",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Read articles aloud in English and Chinese",
    "Multiple voice options (male, female, different accents)",
    "Adjustable speed from 0.5x to 2.0x",
    "Volume control",
    "Sentence-by-sentence navigation",
    "Visual sentence highlighting",
    "Paste custom text support",
    "100% browser-based — no data sent to servers"
  ]
});

const faqItems = [
  {
    q: lang === 'en' ? "Is this text-to-speech tool free?" : "这个文字转语音工具免费吗？",
    a: lang === 'en'
      ? "Yes, completely free. It uses your browser's built-in speech synthesis — no API keys or accounts needed."
      : "是的，完全免费。它使用浏览器内置的语音合成引擎，无需 API 密钥或账户。"
  },
  {
    q: lang === 'en' ? "What languages are supported?" : "支持哪些语言？",
    a: lang === 'en'
      ? "English and Chinese are the primary languages. Additional languages depend on your browser and operating system."
      : "英语和中文是主要支持的语言。其他语言取决于您的浏览器和操作系统。"
  },
  {
    q: lang === 'en' ? "Can I adjust the reading speed?" : "可以调节朗读速度吗？",
    a: lang === 'en'
      ? "Yes, speed can be adjusted from 0.5x (slow) to 2.0x (fast) using the speed slider."
      : "可以，使用速度滑块可以将语速从 0.5 倍（慢速）调节到 2.0 倍（快速）。"
  },
  {
    q: lang === 'en' ? "Why do voices sound different on different devices?" : "为什么不同设备上声音不同？",
    a: lang === 'en'
      ? "The tool uses your browser's Web Speech API, which relies on voices installed on your operating system. Chrome typically has the best selection."
      : "该工具使用浏览器的 Web Speech API，依赖于操作系统上安装的语音。Chrome 通常拥有最佳的语音选择。"
  },
  {
    q: lang === 'en' ? "Can I use this with my own text?" : "可以用自己的文字吗？",
    a: lang === 'en'
      ? "Yes, switch to the 'Paste Text' tab to enter any text you want read aloud."
      : "可以，切换到"粘贴文字"标签页，输入任何您想朗读的文字。"
  }
];

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.a
    }
  }))
});
---

<MainLayout
  title={t.toolsContent.tts.pageTitle}
  description={t.toolsContent.tts.description}
  pageType="tool"
  locale={lang}
>
  <script type="application/ld+json" set:html={appJsonLd} />
  <script type="application/ld+json" set:html={faqJsonLd} />

  <TextToSpeechTool client:load locale={lang} articles={articleData} />

  <section class="seo-content">
    <h2>{lang === 'en' ? 'Free Online Text to Speech Reader' : '免费在线文字转语音朗读器'}</h2>
    <p>{lang === 'en'
      ? 'Listen to articles and text read aloud — right in your browser. This text-to-speech tool uses your browser\'s built-in speech synthesis to convert written content into spoken audio with natural-sounding voices. No sign-up, no API keys, completely free.'
      : '在浏览器中收听文章和文字朗读。这款文字转语音工具使用浏览器内置的语音合成技术，将文字内容转换为自然发音的语音。无需注册，无需 API 密钥，完全免费。'}</p>

    <h3>{lang === 'en' ? 'Use Cases' : '使用场景'}</h3>
    <ul>
      <li><strong>{lang === 'en' ? 'Accessibility' : '无障碍'}</strong> — {lang === 'en' ? 'Make written content accessible to users with visual impairments or reading difficulties' : '让有视觉障碍或阅读困难的用户也能获取文字内容'}</li>
      <li><strong>{lang === 'en' ? 'Language Learning' : '语言学习'}</strong> — {lang === 'en' ? 'Listen to articles in English or Chinese to practice pronunciation and comprehension' : '收听英语或中文文章，练习发音和理解能力'}</li>
      <li><strong>{lang === 'en' ? 'Multitasking' : '多任务处理'}</strong> — {lang === 'en' ? 'Listen to technical articles while commuting, exercising, or cooking' : '在通勤、锻炼或做饭时收听技术文章'}</li>
      <li><strong>{lang === 'en' ? 'Proofreading' : '校对'}</strong> — {lang === 'en' ? 'Hearing your writing read aloud helps catch errors and awkward phrasing' : '听自己的文字被朗读出来有助于发现错误和不当措辞'}</li>
    </ul>

    <h3>{lang === 'en' ? 'Tips for Best Results' : '最佳使用提示'}</h3>
    <ul>
      <li>{lang === 'en' ? 'Use Chrome or Edge for the best voice quality and largest voice selection' : '使用 Chrome 或 Edge 获得最佳语音质量和最多语音选择'}</li>
      <li>{lang === 'en' ? 'Start at 1.0x speed and gradually increase as you get comfortable' : '从 1.0 倍速开始，逐渐加快到您舒适的速度'}</li>
      <li>{lang === 'en' ? 'Try different voices — quality varies significantly between options' : '尝试不同的声音——不同选项之间的质量差异很大'}</li>
      <li>{lang === 'en' ? 'For Chinese text, ensure Chinese voices are installed on your system' : '对于中文文字，请确保系统上安装了中文语音'}</li>
    </ul>

    <h3>{lang === 'en' ? 'Frequently Asked Questions' : '常见问题'}</h3>
    <div class="faq-list">
      {faqItems.map(item => (
        <details class="faq-item">
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  </section>
</MainLayout>

<style>
  .seo-content {
    max-width: 800px;
    margin: var(--spacing-xl) auto 0;
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--border);
  }
  .seo-content h2 { font-size: 1.5rem; margin-bottom: var(--spacing-md); }
  .seo-content h3 { font-size: 1.25rem; margin-top: var(--spacing-xl); margin-bottom: var(--spacing-md); }
  .seo-content p { color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--spacing-md); }
  .seo-content ul { list-style: none; padding: 0; margin-bottom: var(--spacing-md); }
  .seo-content li { padding: var(--spacing-sm) 0; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
  .seo-content li strong { color: var(--text); }
  .faq-list { display: flex; flex-direction: column; gap: var(--spacing-sm); }
  .faq-item { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  .faq-item summary { padding: var(--spacing-md) var(--spacing-lg); font-weight: 600; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
  .faq-item summary::-webkit-details-marker { display: none; }
  .faq-item summary::after { content: '+'; font-size: 1.25rem; color: var(--text-secondary); }
  .faq-item[open] summary::after { content: '-'; }
  .faq-item[open] summary { border-bottom: 1px solid var(--border); }
  .faq-item p { padding: var(--spacing-md) var(--spacing-lg); color: var(--text-secondary); line-height: 1.7; margin: 0; }
</style>
```

- [ ] **Step 2: Build and verify**

Run: `cd /Users/zxi/Ai/tool && npx astro build 2>&1 | tail -30`

Expected: Successful build with no errors. The new page should appear in the output.

- [ ] **Step 3: Commit**

```bash
git add src/pages/[lang]/tools/text-to-speech.astro
git commit -m "feat: add text-to-speech Astro page with SEO and JSON-LD"
```

---

### Task 5: Manual Testing & Fixes

**Files:**
- Possibly modify: `src/components/tools/TextToSpeechTool.tsx`
- Possibly modify: `src/pages/[lang]/tools/text-to-speech.astro`

- [ ] **Step 1: Start the dev server**

Run: `cd /Users/zxi/Ai/tool && npx astro dev --port 4321`

Open `http://localhost:4321/en/tools/text-to-speech/` in the browser.

- [ ] **Step 2: Test checklist**

Verify each of these in the browser:

1. Page loads without console errors
2. Voice dropdown is populated (may take a moment)
3. Article dropdown lists all 11 articles
4. Selecting an article shows rendered markdown in content area
5. Clicking Play reads the first sentence aloud
6. Sentence counter updates as speech progresses
7. Prev/Next buttons navigate sentences
8. Speed slider changes reading speed
9. Volume slider changes volume
10. Voice selector changes the voice
11. Switching to "Paste Text" tab and entering text works
12. Switching to Chinese (`/zh/tools/text-to-speech/`) shows Chinese UI
13. Sticky player bar stays visible when scrolling content

- [ ] **Step 3: Fix any issues found**

Address any build errors, runtime errors, or UI issues discovered during testing.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: text-to-speech tool — tested and working"
```
