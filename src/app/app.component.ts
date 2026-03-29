import { Component, inject, signal } from '@angular/core';
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

  readonly searchQuery = this.notesService.searchQuery;
  readonly sidenavOpen = signal(false);

  clearSearch(): void {
    this.notesService.searchQuery.set('');
  }

  toggleSidenav(): void {
    this.sidenavOpen.update(v => !v);
  }
}

