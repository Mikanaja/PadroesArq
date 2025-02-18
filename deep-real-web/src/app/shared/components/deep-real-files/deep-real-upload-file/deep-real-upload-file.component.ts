import { Component } from '@angular/core';

@Component({
  selector: 'deep-real-upload-file',
  standalone: false,
  templateUrl: './deep-real-upload-file.component.html',
  styleUrl: './deep-real-upload-file.component.scss',
  host: {
    class: 'deep-real-upload-file'
  }
})
export class DeepRealUploadFileComponent {

  // public file: File[] = new File([], '');
  public files: File[] = [];
  public fileUrl: string = '';

  constructor() { }

  public onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.files = event.target.files;
      this.fileUrl = URL.createObjectURL(this.files[0]);
    }
  }

  public sendFiles(): void {
    console.log('file', this.files);
    console.log('fileUrl', this.fileUrl);
  }

  public onRemove(file: File): void {
    this.files = this.files.filter((f: File) => f !== file);
  }

}
