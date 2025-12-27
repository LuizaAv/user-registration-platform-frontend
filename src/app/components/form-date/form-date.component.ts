import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-date',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-date.component.html',
  styleUrl: './form-date.component.scss',
})
export class FormDateComponent {
  @Input() label!: string;

  @Input() value: string | null = null;
  @Input() error: string | null = null;
  @Input() touched = false;

  @Input() minDate!: string;
  @Input() maxDate!: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
}
