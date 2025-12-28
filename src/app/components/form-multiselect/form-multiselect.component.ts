import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MultiselectOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-form-multiselect',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-multiselect.component.html',
  styleUrls: ['./form-multiselect.component.scss'],
})
export class FormMultiselectComponent {
  @Input() label = '';
  @Input() placeholder = 'Search and select...';
  @Input() error: string | null = null;
  @Input() loading = false;
  @Input() options: MultiselectOption[] = [];
  @Input() selectedItems: MultiselectOption[] = [];
  @Input() maxSelections = 10;
  @Input() minChars = 2;

  @Output() selectionChange = new EventEmitter<MultiselectOption[]>();
  @Output() blur = new EventEmitter<void>();

  searchTerm = '';
  showDropdown = false;
  filteredOptions: MultiselectOption[] = [];

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;

    this.filteredOptions = this.options.filter(
      (option) =>
        option.name.toLowerCase().includes(value.toLowerCase()) &&
        !this.selectedItems.some((selected) => selected.id === option.id),
    );
    this.showDropdown = this.filteredOptions.length > 0;
  }

  onFocus() {
    this.filteredOptions = this.options.filter(
      (option) =>
        option.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        !this.selectedItems.some((selected) => selected.id === option.id),
    );
    this.showDropdown = this.filteredOptions.length > 0;
  }

  onBlur() {
    setTimeout(() => {
      this.showDropdown = false;
      this.blur.emit();
    }, 200);
  }

  selectOption(option: MultiselectOption) {
    if (this.selectedItems.length < this.maxSelections) {
      this.selectedItems = [...this.selectedItems, option];
      this.selectionChange.emit(this.selectedItems);
      this.searchTerm = '';
      this.showDropdown = false;
    }
  }

  removeItem(item: MultiselectOption) {
    this.selectedItems = this.selectedItems.filter((selected) => selected.id !== item.id);
    this.selectionChange.emit(this.selectedItems);
  }
}
