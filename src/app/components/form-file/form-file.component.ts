import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-file.component.html',
  styleUrls: ['./form-file.component.scss'],
})
export class FormFileComponent {
  @Input() label!: string;
  @Input() value: string | null = null;
  @Input() error: string | null = null;
  @Input() touched = false;
  @Input() loading = false;

  @Output() fileSelected = new EventEmitter<{
    dataUrl: string | null;
    fileInfo?: { size: number; type: string } | null;
    error?: string | null;
  }>();
  @Output() blur = new EventEmitter<void>();

  readonly allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  readonly maxSize = 5 * 1024 * 1024; // 5MB

  onFileInput(files: FileList | null) {
    if (!files || files.length === 0) return;
    this.handleFile(files[0]);
  }

  onDragOver(evt: DragEvent) {
    evt.preventDefault();
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    const file = evt.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File) {
    if (file.size > this.maxSize) {
      this.fileSelected.emit({ dataUrl: null, fileInfo: { size: file.size, type: file.type }, error: 'File must be less than 5MB' });
      return;
    }

    if (!this.allowedTypes.includes(file.type)) {
      this.fileSelected.emit({ dataUrl: null, fileInfo: { size: file.size, type: file.type }, error: 'Invalid file format' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.fileSelected.emit({ dataUrl: reader.result as string, fileInfo: { size: file.size, type: file.type }, error: null });
    };
    reader.readAsDataURL(file);
  }
}
