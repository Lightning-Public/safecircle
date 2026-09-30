# SafeCircle Runtime Fix + High-resolution Hero Plan

- Branch: `fix/voice-input-runtime-brand-hero`
- Base: `main@148bdf9`
- Status: implementation in progress
- Merge gate: Vercel Preview review by owner

## 1. Voice input runtime fix

Observed risk in the previous implementation:

- recognition result assumed `event.results[0][0]` only
- start/stop state was not tracked, so repeated taps could throw an invalid-state error
- no interim text feedback was shown
- permission / no-speech / audio-capture / network failures shared one generic fallback
- the input value changed without an explicit input event
- unsupported browsers disabled the button but did not provide a detailed fallback message

Implemented on this branch:

- support both `SpeechRecognition` and `webkitSpeechRecognition`
- explicit start / stop state
- final + interim transcript handling
- input-event dispatch after transcript reflection
- clear error-specific fallback copy
- accessible live status note
- text input remains the canonical fallback

Runtime validation still required:

1. iPhone Safari: permission → recognition → textarea reflection → submit
2. Android Chrome: permission → recognition → textarea reflection → submit
3. denied permission: clear text fallback
4. unsupported browser: disabled voice action + usable textarea

## 2. Service Worker freshness

Changed shell behavior from cache-first to online network-first for same-origin shell assets, while retaining cached fallback offline.

Purpose:

- new JS / CSS / onboarding assets should appear without being trapped behind an old cache
- emergency bundle remains cache-first for offline reliability
- cache version bumped to `safecircle-shell-v12`

Validation:

- online reload receives current app shell
- onboarding replay uses current page/assets after reload
- offline reload still opens cached shell and emergency bundle

## 3. High-resolution brand hero

The current `brand-hero-v1.webp` is a small raster composition containing text and illustration together. It becomes visibly soft when used as a full-width onboarding hero.

Target structure:

- use the newly uploaded high-resolution source `prototype/assets/brand-keyvisual-v1.png`
- render only the people/community focal area through a dedicated hero crop, rather than showing the full concept board
- preserve the existing pastel blue/green/orange visual language
- keep the real `logo-mark.svg` and HTML brand text as an overlay so the SafeCircle mark and typography remain exact and sharp
- do not rely on the previous low-resolution `brand-hero-v1.webp` for onboarding
- keep the source PNG under a versioned filename so browser cache changes are explicit

Acceptance target:

- onboarding slide 1 stays sharp on 2x/3x mobile screens
- no baked-in Korean/English typography artifacts
- brand mark stays vector-sharp
- screenshot quality is sufficient for competition materials
- mobile crop does not cut faces or the central interaction

## 4. Non-regression checks

- TTS action remains user-triggered and text fallback remains available
- Pass the Phone resets to hand-over state on each entry
- onboarding replay opens slide 1
- offline emergency cache behavior is preserved
- no individual conversation text is exposed to organization insight UI
