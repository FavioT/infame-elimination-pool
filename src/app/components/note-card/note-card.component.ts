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
  editItems        = signal<string[]>(['']);

  readonly colors    = NOTE_COLORS;
  readonly MAX_ITEMS = 20;

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
    const lines = this.note().body ? this.note().body.split('\n') : [''];
    this.editItems.set(lines.length ? lines : ['']);
    this.editing.set(true);
  }

  saveEdit(): void {
    const body = this.editItems().filter(i => i.trim()).join('\n');
    this.saved.emit({ id: this.note().id, title: this.editTitle(), body });
    this.editing.set(false);
  }

  updateEditItem(index: number, value: string): void {
    const arr = [...this.editItems()];
    arr[index] = value;
    this.editItems.set(arr);
  }

  onEditItemKeydown(event: KeyboardEvent, index: number): void {
    const arr = this.editItems();
    if (event.key === 'Enter') {
      event.preventDefault();
      if (arr.length < this.MAX_ITEMS) {
        const newArr = [...arr.slice(0, index + 1), '', ...arr.slice(index + 1)];
        this.editItems.set(newArr);
        setTimeout(() => {
          const inputs = (this.elRef.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('.list-edit .list-item-input');
          inputs[index + 1]?.focus();
        });
      }
    } else if (event.key === 'Backspace' && arr[index] === '' && arr.length > 1) {
      event.preventDefault();
      const newArr = [...arr];
      newArr.splice(index, 1);
      this.editItems.set(newArr);
      setTimeout(() => {
        const inputs = (this.elRef.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('.list-edit .list-item-input');
        inputs[Math.max(0, index - 1)]?.focus();
      });
    }
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
