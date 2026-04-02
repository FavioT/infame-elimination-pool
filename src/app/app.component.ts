import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotesService } from './services/notes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private notesService = inject(NotesService);
  private platformId    = inject(PLATFORM_ID);

  readonly searchQuery = this.notesService.searchQuery;
  readonly sidenavOpen = signal(false);
  readonly darkMode    = signal(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.add('dark');
    }
  }

  clearSearch(): void {
    this.notesService.searchQuery.set('');
  }

  toggleSidenav(): void {
    this.sidenavOpen.update(v => !v);
  }

  toggleDark(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const next = !this.darkMode();
    this.darkMode.set(next);
    document.documentElement.classList.toggle('dark', next);
  }
}

