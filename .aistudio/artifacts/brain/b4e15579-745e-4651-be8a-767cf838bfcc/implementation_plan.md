# Dual Theme Intensity System: Focus Mode vs. Fuller Theme Expansion

This implementation plan outlines the architecture and execution steps for introducing **Dual Theme Intensity Modes** across all 23 Atlauz living themes:
1. **Focus Mode (Current)**: Deep obsidian dark slate surfaces with muted focus-first accents for zero eye strain during prolonged studying/reading.
2. **Fuller Theme Mode (New)**: Rich, vibrant, solid theme-derived color fills that appeal to users wanting high visual expression, distinct view-level color identities, category-coded library shelves, section-colored Hub quadrants, and multi-colored workspace tabs.

---

## 1. Global Intensity Toggle & State Architecture

- **State Management**: Add `themeIntensityMode: 'focus' | 'fuller'` state to the global theme state (persisted in `localStorage`).
- **Control Placements**:
  - **Top Bar / Header**: Quick-toggle button next to the Theme Picker icon (e.g. `Focus` 🌙 vs `Fuller` 🎨 icon badge).
  - **Theme Picker Modal**: Segmented toggle switch at the top of the picker to preview and switch theme intensity globally.
- **CSS Token Orchestration**: Inject dynamic CSS variable mappings based on the active intensity mode:
  - `--theme-surface-bg`, `--theme-hub-bg`, `--theme-library-bg`, `--theme-workspace-bg`, `--theme-companion-bg`, `--theme-profile-bg`.

---

## 2. View-Specific Color Identity (Fuller Mode)

In Fuller Theme Mode, each main application view will adopt a distinct solid color personality derived from the active theme's palette family:

| View | Fuller Mode Primary Hue Shading | Visual Signature |
| :--- | :--- | :--- |
| **Hub View** | Active Theme Primary Accent (e.g., Crimson / Coral / Gold) | Vibrant command dashboard with distinct quadrant color codes |
| **Library View** | Theme Indigo / Violet / Sapphire secondary tone | Rich academic archive feel with distinct shelf color bands |
| **Workspace View** | Theme Emerald / Teal / Mint focus tone | High-visibility study workspace with multi-color tool tabs |
| **AI Companion View** | Theme Amethyst / Fuchsia / Lavender intelligence tone | Distinct assistant cockpit with vibrant chat & prompt cards |
| **Profile & Settings View** | Theme Gold / Ochre / Warm Amber identity tone | Deluxe personal portal with rich stats and badge surfaces |

---

## 3. Library Shelves & Category-Coded Resources

- **Shelf Color Coding**:
  - *Core Curriculum Shelf*: Deep Azure / Sapphire gradient fill.
  - *Electives & Modules*: Vibrant Amethyst / Violet tint.
  - *Reference & Archive*: Warm Amber / Ochre tint.
  - *Research & Labs*: Emerald / Jade tint.
- **Resource Content Color Coding**:
  - Every resource card is dynamically styled by its resource type or category badge:
    - **Book**: Sapphire Blue solid header / badge shade.
    - **Presentation**: Warm Amber solid header / badge shade.
    - **Notes**: Emerald Green solid header / badge shade.
    - **Code / Dev**: Electric Violet solid header / badge shade.
    - **Research Paper**: Rose / Crimson solid header / badge shade.
  - Sub-items and status tags (e.g. In Progress, Completed, Bookmarked) use distinct tonal shades of the category base color.

---

## 4. Hub Quadrants & Section Color Identities

The 4-quadrant Hub will feature distinct, color-coded sections in Fuller Mode with shaded sub-items:

1. **Pinned Quick Launch Cards**: Electric Cyan / Teal solid backdrop & accent borders.
2. **Focus Workspace Cards**: Royal Indigo / Deep Purple solid backdrop & accent borders.
3. **Due Activities & Urgent Tasks**: Crimson / Coral Amber alert backdrop & accent borders.
4. **To-Do Milestones & Goals**: Jade / Emerald Green success backdrop & accent borders.
- Content items inside each section receive matching 10%-20% opacity color fills with bold matching text badges.

---

## 5. Workspace Multi-Color Tool Tabs

In Fuller Mode, each tool tab in the Workspace header and bottom strip will feature a distinct tool-specific color identity:

- **Reader Tool Tab**: Sapphire Blue (`#2563eb`)
- **Editor & Notes Tab**: Emerald Green (`#059669`)
- **Flashcards Tab**: Amber Gold (`#d97706`)
- **Canvas / Board Tab**: Purple Velvet (`#7c3aed`)
- **Audio & TTS Tab**: Crimson Rose (`#e11d48`)
- **Quiz / Exam Tab**: Cyan Teal (`#0891b2`)
- **Synthesis / AI Tab**: Indigo Fuchsia (`#4f46e5`)

---

## 6. Implementation Steps

1. **Update `src/themes.ts` & `src/types.ts`**:
   - Add `ThemeIntensityMode` type (`'focus' | 'fuller'`).
   - Extend `ThemeDefinition` with Fuller Mode view palettes, shelf color rules, and quadrant color sets.
2. **Update `App.tsx` & Header**:
   - Add `themeIntensityMode` state and persistence.
   - Insert quick Focus/Fuller toggle button in `Header.tsx` and `ThemePickerModal.tsx`.
3. **Enhance `HubView.tsx`**:
   - Apply section-specific color identities for Pinned, Focus, Due, and To-Do quadrants under Fuller Mode.
4. **Enhance `LibraryView.tsx`**:
   - Apply distinct shelf background fills and category-coded resource card styling.
5. **Enhance `WorkspaceView.tsx`**:
   - Apply tool-specific tab colors and view background tinting.
6. **Enhance `SidebarDrawer.tsx` & `ProfileView.tsx`**:
   - Apply rich Fuller Mode surface fills for Profile, Companion, and Settings controls.
7. **Verify & Lint**:
   - Run `compile_applet` and `lint_applet` to ensure total code stability and flawless TypeScript compilation.
