import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.scss'],
})
export class FormTextareaComponent {
  @Input() label!: string;
  @Input() value: string | null = null;
  @Input() error: string | null = null;
  @Input() touched = false;
  @Input() maxLength = 500;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  get characterCount() {
    return (this.value || '').length;
  }

  get isWarning() {
    return this.characterCount >= 450;
  }

  onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }

  onBlur() {
    this.blur.emit();
  }
}
