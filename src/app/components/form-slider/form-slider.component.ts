import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-form-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-slider.component.html',
  styleUrls: ['./form-slider.component.scss'],
})
export class FormSliderComponent implements OnInit, OnDestroy {
  @Input() label = '';
  @Input() min = 0;
  @Input() max = 30;
  @Input() step = 1;
  @Input() unit = 'years';
  @Input() value: Observable<number> | number = 0;
  @Input() error: string | null = null;

  @Output() valueChange = new EventEmitter<number>();
  @Output() blur = new EventEmitter<void>();

  currentValue = 0;
  private subscription?: Subscription;

  ngOnInit() {
    if (this.value instanceof Observable) {
      this.subscription = this.value.subscribe(val => {
        this.currentValue = val || 0;
      });
    } else {
      this.currentValue = this.value;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onValueChange(event: Event) {
    const newValue = +(event.target as HTMLInputElement).value;
    this.currentValue = newValue;
    this.valueChange.emit(newValue);
  }
}