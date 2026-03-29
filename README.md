# Infame Elimination Pool — Keep Dashboard

A Google Keep-style notes dashboard built with **Angular 19** and styled with **PaperCSS** — the less formal, hand-drawn CSS framework.

## Features

- Create, edit, archive and delete notes
- Pin notes to keep them at the top
- Color-code notes with 11 preset colors (via a color picker)
- Live search bar that filters notes by title or body
- Masonry grid layout (1–5 columns, responsive)
- Notes persisted in `localStorage` (survives page reloads)
- SSR-safe (Angular Universal / `@angular/ssr`)
- Responsive navbar with PaperCSS hamburger menu (no JavaScript)

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 19 (standalone components, signals) |
| Styling | [PaperCSS 1.9.2](https://www.getpapercss.com/) + component SCSS |
| Icons | Google Material Icons |
| State | Angular Signals + `localStorage` |
| Rendering | Angular SSR (`@angular/ssr`) |

## Project structure

```
src/app/
  models/
    note.model.ts           # Note interface + color palette
  services/
    notes.service.ts        # Reactive service (signals, localStorage)
  components/
    create-note/            # Expandable "take a note" input card
    note-card/              # Individual note card with inline editing
  dashboard/                # Main view: masonry grid + sections
  app.component.*           # Shell: PaperCSS fixed navbar + search
```

## Getting started

```bash
npm install
npm start          # dev server → http://localhost:4200
npm run build      # production build → dist/
npm test           # unit tests with Karma
```

## Notes behavior

- Clicking a card opens inline editing; clicking outside saves and closes it.
- Pinned notes appear in a separate **FIJADAS** section above the rest.
- Archived notes are hidden from the main view (no archive view yet).
- All notes are auto-saved to `localStorage` immediately on every change.


```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
