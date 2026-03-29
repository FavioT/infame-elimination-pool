import { Component, inject } from '@angular/core';
import { NotesService } from '../services/notes.service';
import { CreateNoteComponent } from '../components/create-note/create-note.component';
import { NoteCardComponent } from '../components/note-card/note-card.component';
import { Note } from '../models/note.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CreateNoteComponent, NoteCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private notesService = inject(NotesService);

  pinned  = this.notesService.pinned;
  others  = this.notesService.others;

  onNoteCreated(note: { title: string; body: string; color: string; pinned: boolean }): void {
    this.notesService.add(note);
  }

  onPinToggled(id: string): void {
    this.notesService.togglePin(id);
  }

  onArchived(id: string): void {
    this.notesService.toggleArchive(id);
  }

  onDeleted(id: string): void {
    this.notesService.delete(id);
  }

  onColorChanged(event: { id: string; color: string }): void {
    this.notesService.update(event.id, { color: event.color });
  }

  onSaved(event: { id: string; title: string; body: string }): void {
    this.notesService.update(event.id, { title: event.title, body: event.body });
  }
}
