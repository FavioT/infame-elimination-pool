import {
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { Note, NOTE_COLORS } from '../../models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss',
})
export class NoteCardComponent {
  note = input.required<Note>();

  pinToggled   = output<string>();
  archived     = output<string>();
  deleted      = output<string>();
  colorChanged = output<{ id: string; color: string }>();
  saved        = output<{ id: string; title: string; body: string }>();

  editing          = signal(false);
  showColorPicker  = signal(false);
  editTitle        = signal('');
  editBody         = signal('');

  readonly colors = NOTE_COLORS;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget | null): void {
    if (!this.elRef.nativeElement.contains(target)) {
      if (this.editing()) this.saveEdit();
      if (this.showColorPicker()) this.showColorPicker.set(false);
    }
  }

  openEdit(event: MouseEvent): void {
    if (this.editing()) return;
    event.stopPropagation();
    this.editTitle.set(this.note().title);
    this.editBody.set(this.note().body);
    this.editing.set(true);
  }

  saveEdit(): void {
    this.saved.emit({ id: this.note().id, title: this.editTitle(), body: this.editBody() });
    this.editing.set(false);
  }

  toggleColorPicker(event: MouseEvent): void {
    event.stopPropagation();
    this.showColorPicker.update(v => !v);
  }

  pickColor(event: MouseEvent, color: string): void {
    event.stopPropagation();
    this.colorChanged.emit({ id: this.note().id, color });
    this.showColorPicker.set(false);
  }

  onPin(event: MouseEvent): void {
    event.stopPropagation();
    this.pinToggled.emit(this.note().id);
  }

  onArchive(event: MouseEvent): void {
    event.stopPropagation();
    this.archived.emit(this.note().id);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.deleted.emit(this.note().id);
  }
}
