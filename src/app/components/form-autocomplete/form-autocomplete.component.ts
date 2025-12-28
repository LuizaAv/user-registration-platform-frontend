import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AutocompleteOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-form-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-autocomplete.component.html',
  styleUrls: ['./form-autocomplete.component.scss'],
})
export class FormAutocompleteComponent implements OnChanges {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() error: string | null = null;
  @Input() touched = false;
  @Input() loading = false;
  @Input() options: AutocompleteOption[] = [];
  @Input() minChars = 2;
  @Input() allowCustom = true;
  @Input() value = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  inputValue = '';
  showDropdown = false;
  filteredOptions: AutocompleteOption[] = [];
  inputId = 'autocomplete-' + Math.random().toString(36).substr(2, 9);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.inputValue = this.value;
    }
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue = value;
    this.valueChange.emit(value);

    this.filteredOptions = this.options.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase()),
    );
    this.showDropdown = this.filteredOptions.length > 0;
  }

  onFocus() {
    this.filteredOptions = this.options.filter((option) =>
      option.name.toLowerCase().includes(this.inputValue.toLowerCase()),
    );
    this.showDropdown = this.filteredOptions.length > 0;
  }

  onBlur() {
    // Delay to allow option selection
    setTimeout(() => {
      this.showDropdown = false;
      this.blur.emit();
    }, 200);
  }

  selectOption(option: AutocompleteOption) {
    this.inputValue = option.name;
    this.valueChange.emit(option.name);
    this.showDropdown = false;
  }
}
