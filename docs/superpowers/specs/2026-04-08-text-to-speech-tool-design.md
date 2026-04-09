# Text-to-Speech Article Reader Tool — Design Spec

## Overview

A standalone browser-based text-to-speech tool at `/[lang]/tools/text-to-speech` that reads articles aloud and supports arbitrary pasted text. Uses the Web Speech API (no backend, fully client-side). Follows the existing PassportPhotoTool pattern — single React component with MUI, content collection entry for SEO.

## Goals

1. Add a high-value interactive tool to the site (supports AdSense "content value" requirements)
2. Make existing articles more accessible and engaging
3. Support English and Chinese with appropriate voices
4. Zero cost — no API keys, no backend, runs entirely in the browser

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/[lang]/tools/text-to-speech.astro` | Astro page — layout, SEO meta, JSON-LD, renders React component |
| `src/components/tools/TextToSpeechTool.tsx` | Single React component — all TTS UI and logic |
| `src/content/tools/text-to-speech.md` | Content collection entry — title, features, FAQ, SEO keywords, body content |

## Files to Modify

| File | Change |
|------|--------|
| `src/i18n/en.json` | Add TTS tool translation keys (page title, meta description) |
| `src/i18n/zh.json` | Add TTS tool Chinese translation keys |

## UI Layout

Top-to-bottom, compact player bar pattern (inspired by Spotify/podcast apps):

### 1. Sticky Player Bar
- Primary color (`#1976d2`) background, sticky at top of the tool area
- **Prev sentence** button (⏮) — cancel current, go back one sentence
- **Play/Pause** button (▶/⏸) — main control, larger than others
- **Next sentence** button (⏭) — cancel current, skip forward one sentence
- **Progress bar** — visual indicator of sentence progress through the text
- **Sentence counter** — "Sentence 4 / 12"

### 2. Controls Row
- **Voice selector** — MUI Select dropdown, populated from `speechSynthesis.getVoices()`, filtered by locale by default
- **Speed slider** — Range 0.5x to 2.0x, default 1.0x, step 0.1
- **Volume slider** — Range 0 to 1, default 0.8

### 3. Input Tabs
- **Tab 1: "Select Article"** — MUI Select dropdown listing all articles for the current locale. Astro page passes article data (title + raw markdown body) as props at build time.
- **Tab 2: "Paste Text"** — MUI TextField (multiline textarea) for arbitrary text input

### 4. Content Display
- Rendered markdown using `react-markdown` (already in project dependencies)
- Current sentence highlighted with a colored background span
- Scrolls to keep the highlighted sentence visible
- When in "Paste Text" mode, renders the pasted text as plain paragraphs

## Speech Engine Design

### Text Processing
1. Extract plain text from the markdown content (strip formatting)
2. Split into sentences using regex: `/(?<=[.!?。！？\n])\s+/` — handles English and Chinese punctuation
3. Store as `sentences: string[]` array

### Utterance Management
- Each sentence is spoken as a separate `SpeechSynthesisUtterance`
- On `utterance.onend` → advance `currentSentenceIndex` and speak next sentence
- On `utterance.onerror` → stop playback, show error state
- Changing voice/speed/volume mid-playback: cancel current utterance, re-create with new settings, resume from current sentence

### State
```typescript
// All managed via useState/useRef in the single component
const [isPlaying, setIsPlaying] = useState(false);
const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
const [sentences, setSentences] = useState<string[]>([]);
const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
const [speed, setSpeed] = useState(1.0);
const [volume, setVolume] = useState(0.8);
const [inputMode, setInputMode] = useState<'article' | 'paste'>('article');
const [selectedArticleSlug, setSelectedArticleSlug] = useState('');
const [pasteText, setPasteText] = useState('');
const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
```

### Sentence Highlighting
- Map `currentSentenceIndex` back to the original markdown text
- Use a custom react-markdown renderer that wraps the active sentence in a highlight `<span>`
- Auto-scroll the content display to keep the highlighted sentence in view

## Controls Behavior

| Control | Action |
|---------|--------|
| Play | `speechSynthesis.speak(utterance)` for current sentence |
| Pause | `speechSynthesis.pause()` |
| Resume | `speechSynthesis.resume()` |
| Next | `speechSynthesis.cancel()`, increment index, speak |
| Prev | `speechSynthesis.cancel()`, decrement index (min 0), speak |
| Voice change | `speechSynthesis.cancel()`, set new voice, re-speak current sentence |
| Speed change | Applied to next utterance (or cancel + re-speak if currently playing) |
| Volume change | Applied to next utterance (or cancel + re-speak if currently playing) |

## Language & Voice Handling

- On mount, call `speechSynthesis.getVoices()` (and listen for `voiceschanged` event for async loading)
- Filter voices by page locale: `en` pages default-show English voices, `zh` pages default-show Chinese voices
- User can manually select any available voice regardless of locale
- Default voice: first voice matching the locale, preferring voices with "Google" or "Microsoft" in the name (higher quality)

## Article Integration

- Astro page uses `getCollection('articles')` at build time
- Filters articles by locale
- Passes array of `{ slug, title, body }` as a JSON prop to the React component
- On article selection, loads the body into the content display and re-processes sentences

## i18n

- UI strings defined inline in the component as `uiStrings` object with `en`/`zh` keys:
  - Play, Pause, Previous sentence, Next sentence, Select article, Paste text, Speed, Volume, Voice, "Select an article to listen to...", "Paste or type your text here...", etc.
- Page-level strings (title, description) added to `src/i18n/en.json` and `src/i18n/zh.json`

## SEO & Content Value

### Content Collection Entry (`text-to-speech.md`)
```yaml
title: "Text to Speech Reader"
category: "utilities"
intro: "Free online text-to-speech tool that reads articles aloud..."
features:
  - "Read articles in English and Chinese with natural voices"
  - "Adjustable speed, volume, and voice selection"
  - "Sentence-by-sentence navigation with visual highlighting"
  - "Built-in article library or paste your own text"
  - "Works entirely in browser — no sign-up or API needed"
faq:
  - question: "Is this text-to-speech tool free?"
    answer: "Yes, completely free. It uses your browser's built-in speech synthesis."
  - question: "What languages are supported?"
    answer: "English and Chinese are the primary languages. Additional languages depend on your browser and operating system."
  - question: "Can I adjust the reading speed?"
    answer: "Yes, speed can be adjusted from 0.5x (slow) to 2.0x (fast)."
  - question: "Why do voices sound different on different devices?"
    answer: "The tool uses your browser's Web Speech API, which relies on voices installed on your operating system."
  - question: "Can I use this with my own text?"
    answer: "Yes, switch to the 'Paste Text' tab to enter any text you want read aloud."
seo:
  title: "Free Text to Speech Reader — Listen to Articles Online"
  description: "Free browser-based text-to-speech tool. Read articles aloud in English and Chinese with adjustable speed, voice, and volume. No sign-up required."
  keywords: ["text to speech", "TTS reader", "read aloud", "article reader", "free TTS"]
adEligible: true
```

### JSON-LD Structured Data
- `WebApplication` schema (name, description, offers: free, operatingSystem: browser)
- `FAQPage` schema from FAQ items

### Body Content
Substantial markdown body below the tool explaining:
- What is text-to-speech and how it works
- Use cases (accessibility, language learning, multitasking, proofreading)
- Tips for best results (choosing voices, optimal speed settings)
- Browser compatibility notes

## Error Handling

- **No speech support:** Show MUI Alert — "Your browser doesn't support text-to-speech. Try Chrome, Edge, or Safari."
- **No voices available:** Show loading state, retry on `voiceschanged` event, fallback message after timeout
- **Empty text:** Disable play button, show hint text
- **Speech error:** Stop playback, show brief error alert, allow retry

## Browser Compatibility

Web Speech API is supported in:
- Chrome/Edge (best voice quality, most voices)
- Safari (good support)
- Firefox (limited voice selection)

The tool checks for `window.speechSynthesis` availability on mount and shows a compatibility message if unsupported.
