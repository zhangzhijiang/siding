# Task: Apply a set of Android/React app upgrades

This is a **Capacitor + React + Vite + Tailwind (Play CDN) + framer-motion** mobile game project (TypeScript). Apply all of the following changes. Adapt package names, brand colors, and file paths to this project where noted. After each part, keep the app building (`vite build` and a Gradle debug build).

## 1. Bump Android target SDK to Android 16 (API 36)
Google Play now requires targeting API 36.
- In `android/variables.gradle` (or wherever `compileSdkVersion`/`targetSdkVersion` are defined): set both `compileSdkVersion` and `targetSdkVersion` to `36`.
- In `android/app/build.gradle`: increment `versionCode` by 1 (Play requires a higher code to publish) and bump `versionName` accordingly.
- Verify Android Gradle Plugin is ≥ 8.6 (needed for compileSdk 36); do NOT change it if already ≥ 8.6.

## 2. Add an animated launch splash screen
Create a `SplashScreen` React component using framer-motion (already a dependency; if not, add it) and show it once on app launch, fading into the game.
- Full-screen overlay matching the app's dark brand background, with animated ambient glow blobs.
- A themed launch animation appropriate to the game (e.g., the game's pieces/tokens animating in with a spring/bounce, then a gentle float), plus the app title and a subtitle fading in, and pulsing loading dots.
- Auto-dismiss after ~2.6s (via `setTimeout`) AND allow tap-to-skip; use an `onFinish` callback.
- Wire it into the root component: add a `showSplash` state (default `true`), render `<AnimatePresence>{showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}</AnimatePresence>` above the main UI, and give the splash an `exit` fade transition.

## 3. Redesign the app icon + logo to match the brand
Replace the existing launcher icon and logos with a cohesive, premium design.
- Design concept (adapt to this game's theme/brand colors): a dark diagonal gradient background (e.g., deep indigo → near-black) with a soft central glow, and the game's core visual motif rendered cleanly (glossy 3D tokens with radial-gradient shading + specular highlights, on subtle board grid-lines). No text in the icon — a pure symbol reads better at small sizes.
- Generate assets programmatically: write an SVG generator, then rasterize with `sharp` (install with `--no-save` if not present) to PNG at every density.
  - Legacy launcher icons `ic_launcher.png` (rounded-square, ~17% corner radius) and `ic_launcher_round.png` (circle-clipped) at: ldpi 36, mdpi 48, hdpi 72, xhdpi 96, xxhdpi 144, xxxhdpi 192.
  - Adaptive-icon `ic_launcher_foreground.png` (transparent) and `ic_launcher_background.png` at: ldpi 81, mdpi 108, hdpi 162, xhdpi 216, xxhdpi 324, xxxhdpi 432. Keep the existing `mipmap-anydpi-v26/ic_launcher.xml` config; only regenerate the PNGs it points to.
  - **Critical:** in the adaptive FOREGROUND, scale the artwork to ~74% and center it so it stays inside the safe zone (Android crops the outer ~17% and round masks clip corners). Verify by compositing background+foreground under a circular mask.
  - Also regenerate web logos (e.g. `logo.png` 1024, `logo-512x512.png` 512) and produce a **512×512 square** Play Store listing icon.
- Remove any temporary generator/preview scripts from the repo afterward.

## 4. Fix mismatched player color labels
Check how player pieces are actually rendered vs. how they're labeled in the UI. If labels (e.g. "You (Red)", "AI (Blue)") don't match the real piece colors (e.g. black/white stones), correct the label text to the true colors, and add a small colored swatch next to each player's name/chip so the color is unambiguous. Recolor the active-turn indicator chips to match the real piece colors.

## 5. Add a light/dark theme toggle
The app is currently hardcoded dark; add a user-switchable light/dark theme.
- Enable Tailwind class-based dark mode: in `index.html` after the Tailwind CDN script add `<script>tailwind.config = { darkMode: 'class' };</script>`.
- Add a no-flash init script in `<head>` that reads `localStorage.getItem('theme')` and applies/removes the `dark` class on `<html>` before first paint (default to dark when unset).
- Make `<body>` and the CSS `html/body` background theme-aware (light default + a `html.dark` override).
- In the root component: add `theme` state initialized from the `dark` class on `<html>`; a `useEffect` that toggles the class and persists to `localStorage`.
- Add a Sun/Moon toggle button (lucide-react icons) in the header.
- Convert all hardcoded dark color utilities throughout the UI (page, header, buttons, player chips, modals) to **light-default + `dark:` variant** pairs so both themes look correct. Keep any neutral game surfaces (e.g. a wooden board) and the branded splash constant across themes.

## 6. Make the color theme richer / higher-contrast (not flat gray)
Replace flat single-color backgrounds with depth:
- Page background: a diagonal **gradient** in both themes (e.g. light: soft violet→indigo→sky; dark: deep slate-950→indigo-950→violet-950).
- Ambient background: three larger, more saturated blurred glow blobs (e.g. fuchsia/indigo/sky) instead of muted ones.
- Title: a tri-color gradient sweep (e.g. indigo→purple→fuchsia) with a subtle drop shadow.
- Buttons: a **glassy** translucent style (`bg-white/60 backdrop-blur-sm border border-white/70 shadow-sm`, and translucent-white variants in dark mode) so they lift off the colorful background; make primary/active toggles a solid accent color for a clear "on" state.

## 7. Header layout
Right-align the theme toggle button to the far right edge of the header row (absolutely positioned, vertically centered), while keeping the title and any other header buttons centered.

## Build & verify
- `npm run build:android` (or the project's Vite build) must pass.
- Then sync + assemble a debug APK (`npx cap sync android` && Gradle `assembleDebug`).
- Note: pre-existing `import.meta.env` / `JSX.IntrinsicElements` TypeScript errors from a loose tsconfig may appear in `tsc` but do not affect the Vite build — don't be blocked by them.
