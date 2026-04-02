import {
  Component,
  ElementRef,
  HostListener,
  output,
  signal,
} from '@angular/core';
import { NOTE_COLORS } from '../../models/note.model';

@Component({
  selector: 'app-create-note',
  standalone: true,
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.scss',
})
export class CreateNoteComponent {
  noteCreated = output<{ title: string; body: string; color: string; pinned: boolean }>();

  expanded        = signal(false);
  title           = signal('');
  items           = signal<string[]>(['']);
  color           = signal('#ffffff');
  pinned          = signal(false);
  showColorPicker = signal(false);

  readonly colors    = NOTE_COLORS;
  readonly MAX_ITEMS = 20;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget | null): void {
    if (this.expanded() && !this.elRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  expand(): void {
    this.expanded.set(true);
  }

  setColor(value: string): void {
    this.color.set(value);
    this.showColorPicker.set(false);
  }

  togglePin(): void {
    this.pinned.update(v => !v);
  }

  toggleColorPicker(): void {
    this.showColorPicker.update(v => !v);
  }

  updateItem(index: number, value: string): void {
    const arr = [...this.items()];
    arr[index] = value;
    this.items.set(arr);
  }

  onItemKeydown(event: KeyboardEvent, index: number): void {
    const arr = this.items();
    if (event.key === 'Enter') {
      event.preventDefault();
      if (arr.length < this.MAX_ITEMS) {
        const newArr = [...arr.slice(0, index + 1), '', ...arr.slice(index + 1)];
        this.items.set(newArr);
        setTimeout(() => {
          const inputs = (this.elRef.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('.list-create .list-item-input');
          inputs[index + 1]?.focus();
        });
      }
    } else if (event.key === 'Backspace' && arr[index] === '' && arr.length > 1) {
      event.preventDefault();
      const newArr = [...arr];
      newArr.splice(index, 1);
      this.items.set(newArr);
      setTimeout(() => {
        const inputs = (this.elRef.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('.list-create .list-item-input');
        inputs[Math.max(0, index - 1)]?.focus();
      });
    }
  }

  close(): void {
    const t = this.title().trim();
    const b = this.items().filter(i => i.trim()).join('\n');
    if (t || b) {
      this.noteCreated.emit({ title: t, body: b, color: this.color(), pinned: this.pinned() });
    }
    this.title.set('');
    this.items.set(['']);
    this.color.set('#ffffff');
    this.pinned.set(false);
    this.expanded.set(false);
    this.showColorPicker.set(false);
  }
}
