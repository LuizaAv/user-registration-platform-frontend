import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent {
  @Input() label!: string;
  @Input() type: 'text' | 'email' | 'tel' = 'text';

  @Input() value: string | null = null;
  @Input() error: string | null = null;
  @Input() touched = false;
  @Input() loading = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
}
