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
- **Firebase Firestore** integration for real-time data storage

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 19 (standalone components, signals) |
| Styling | [PaperCSS 1.9.2](https://www.getpapercss.com/) + component SCSS |
| Icons | Google Material Icons |
| State | Angular Signals + `localStorage` |
| Rendering | Angular SSR (`@angular/ssr`) |
| Database | Firebase Firestore (`@angular/fire` 19) |

## Project structure

```
src/
  environments/
    environment.example.ts  # Template — copy to environment.ts and fill in credentials
    environment.prod.ts     # Production environment (no real credentials committed)
    environment.ts          # Development environment (git-ignored, add real credentials here)
  app/
    models/
      note.model.ts           # Note interface + color palette
    services/
      notes.service.ts        # Reactive service (signals, localStorage)
      firestore.service.ts    # Firestore CRUD service (real-time observables)
    components/
      create-note/            # Expandable "take a note" input card
      note-card/              # Individual note card with inline editing
    dashboard/                # Main view: masonry grid + sections
    app.component.*           # Shell: PaperCSS fixed navbar + search
    app.config.ts             # Application providers (Firebase initialized here)
```

## Getting started

```bash
npm install
npm start          # dev server → http://localhost:4200
npm run build      # production build → dist/
npm test           # unit tests with Karma
```

## Firebase / Firestore setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Cloud Firestore** in the Firebase Console.
3. Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`.
4. Replace the placeholder values with the credentials from your Firebase project settings:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

> **Note:** `src/environments/environment.ts` is git-ignored to prevent committing credentials.
> Always keep real API keys out of version control.

## Using FirestoreService

`FirestoreService` is a generic, injectable service that provides real-time CRUD operations against any Firestore collection.

```typescript
import { Component, inject } from '@angular/core';
import { FirestoreService } from './services/firestore.service';

@Component({ /* ... */ })
export class ExampleComponent {
  private firestoreService = inject(FirestoreService);

  // Read all documents from a collection (real-time)
  notes$ = this.firestoreService.getCollection<{ title: string }>('notes');

  // Read a single document (real-time)
  note$ = this.firestoreService.getDocument<{ title: string }>('notes', 'docId');

  // Add a document
  addNote() {
    this.firestoreService.addDocument('notes', { title: 'Hello', body: 'World' }).subscribe();
  }

  // Update a document
  updateNote(id: string) {
    this.firestoreService.updateDocument('notes', id, { title: 'Updated' }).subscribe();
  }

  // Delete a document
  deleteNote(id: string) {
    this.firestoreService.deleteDocument('notes', id).subscribe();
  }
}
```

## Notes behavior

- Clicking a card opens inline editing; clicking outside saves and closes it.
- Pinned notes appear in a separate **FIJADAS** section above the rest.
- Archived notes are hidden from the main view (no archive view yet).
- All notes are auto-saved to `localStorage` immediately on every change.

## Additional Resources

- [Angular Fire documentation](https://github.com/angular/angularfire)
- [Firebase documentation](https://firebase.google.com/docs)
- [Cloud Firestore documentation](https://firebase.google.com/docs/firestore)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
