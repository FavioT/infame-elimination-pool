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
  body            = signal('');
  color           = signal('#ffffff');
  pinned          = signal(false);
  showColorPicker = signal(false);

  readonly colors = NOTE_COLORS;

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

  close(): void {
    const t = this.title().trim();
    const b = this.body().trim();
    if (t || b) {
      this.noteCreated.emit({ title: t, body: b, color: this.color(), pinned: this.pinned() });
    }
    this.title.set('');
    this.body.set('');
    this.color.set('#ffffff');
    this.pinned.set(false);
    this.expanded.set(false);
    this.showColorPicker.set(false);
  }
}
