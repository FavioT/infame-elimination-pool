import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Note } from '../models/note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'gkeep_notes';

  private readonly _notes = signal<Note[]>(
    isPlatformBrowser(this.platformId) ? this.loadFromStorage() : []
  );

  readonly searchQuery = signal('');

  readonly notes = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return this._notes()
      .filter(n => !n.archived)
      .filter(n =>
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q)
      );
  });

  readonly pinned  = computed(() => this.notes().filter(n =>  n.pinned));
  readonly others  = computed(() => this.notes().filter(n => !n.pinned));
  readonly archived = computed(() => this._notes().filter(n => n.archived));

  // ── persistence ───────────────────────────────────────────────

  private loadFromStorage(): Note[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Note[]) : this.defaultNotes();
    } catch {
      return this.defaultNotes();
    }
  }

  private persist(notes: Note[]): void {
    this._notes.set(notes);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    }
  }

  private defaultNotes(): Note[] {
    const now = new Date().toISOString();
    return [
      {
        id: crypto.randomUUID(),
        title: 'Bienvenido a Keep',
        body: 'Haz clic en "Tomar una nota..." para crear tu primera nota. Puedes fijar, archivar y darle color a cada tarjeta.',
        color: '#aecbfa',
        pinned: true,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        title: 'Lista de compras',
        body: 'Leche\nHuevos\nPan\nCafé\nFrutas',
        color: '#ccff90',
        pinned: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        title: '',
        body: 'Recordar llamar al médico el lunes.',
        color: '#fbbc04',
        pinned: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  // ── mutations ─────────────────────────────────────────────────

  add(partial: Pick<Note, 'title' | 'body' | 'color'> & { pinned?: boolean }): void {
    const now = new Date().toISOString();
    const note: Note = {
      id: crypto.randomUUID(),
      title: partial.title,
      body: partial.body,
      color: partial.color,
      pinned: partial.pinned ?? false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };
    this.persist([note, ...this._notes()]);
  }

  update(id: string, changes: Partial<Omit<Note, 'id' | 'createdAt'>>): void {
    this.persist(
      this._notes().map(n =>
        n.id === id
          ? { ...n, ...changes, updatedAt: new Date().toISOString() }
          : n
      )
    );
  }

  delete(id: string): void {
    this.persist(this._notes().filter(n => n.id !== id));
  }

  togglePin(id: string): void {
    const note = this._notes().find(n => n.id === id);
    if (note) this.update(id, { pinned: !note.pinned });
  }

  toggleArchive(id: string): void {
    const note = this._notes().find(n => n.id === id);
    if (note) this.update(id, { archived: !note.archived });
  }
}
