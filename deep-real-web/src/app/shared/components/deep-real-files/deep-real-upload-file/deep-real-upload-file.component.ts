import { Component } from '@angular/core';

@Component({
  selector: 'deep-real-upload-file',
  standalone: false,
  templateUrl: './deep-real-upload-file.component.html',
  styleUrl: './deep-real-upload-file.component.scss'
})
export class DeepRealUploadFileComponent {

  // public file: File[] = new File([], '');
  public files: File[] = [];
  public fileUrl: string = '';

  constructor() { }

  public get iconPath(): string {
    return './../../../../../assets/icons/upload-file-24.svg';
  }

  public onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.files = event.target.files;
      // this.fileUrl = URL.createObjectURL(this.files[0]);
      console.log('file', this.files);
    }
  }

  public sendFiles(): void {
    console.log('file', this.files);
    console.log('fileUrl', this.fileUrl);
  }

  public onRemove(file: File): void {
    this.files = this.files.filter((f: File) => f !== file);
  }

  public onDrop(event: any): void {
    event.preventDefault();
    this.files = event.dataTransfer.files;
    this.fileUrl = URL.createObjectURL(this.files[0]);
  }

  public onDragOver(event: any): void {
    event.preventDefault();
  }

}
