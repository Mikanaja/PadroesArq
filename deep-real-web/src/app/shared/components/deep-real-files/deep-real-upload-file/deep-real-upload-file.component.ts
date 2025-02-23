import { Component, Input } from '@angular/core';
import { UploadFileService } from '../../../../core/services/upload-file.service';
import { Video } from '../../../../core/models/video.model';
import { BehaviorSubject } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { createVideoForm } from '../../../../core/utils/forms';

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

  public videos$: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>([]);
  
  private videosFormArray$: BehaviorSubject<FormArray<FormGroup>> = new BehaviorSubject<FormArray<FormGroup>>(new FormArray<FormGroup>([]));

  private files: File[] = [];

  @Input()
  public set videosForm(videosFormArray: FormArray) {
    this.videosFormArray$.next(videosFormArray);
  }

  constructor(
    private uploadFileService: UploadFileService
  ) { }

  public get videosFormArray(): FormArray {
    return this.videosFormArray$.value;
  }

  public get videos(): Video[] {
    return this.videos$.value;
  }

  public get iconPath(): string {
    return './../../../../../assets/icons/upload-file-24.svg';
  }

  public onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const selectedFiles: File[] = Array.from(input.files);
      this.files = [...this.files, ...selectedFiles];
      this.handleUploadMultipleFiles(selectedFiles);
    }
  }

  private handleUploadMultipleFiles(files: File[]): void {
    files.forEach((file: File) => {
      this.handleUploadSingleFile(file);
    });
  }

  private handleUploadSingleFile(file: File): void {
    const formData: FormData = new FormData();
    formData.append('file', file);

    this.uploadFileService.uploadFile(formData)
      .subscribe((video: Video) => {
        console.log(video);
        this.videos$.next([...this.videos, video]);
        this.videosFormArray.push(createVideoForm(video));
      }
    );
  }

  public onRemove(file: File): void {
    this.files = this.files.filter((f: File) => f !== file);
  }

}

/**
 * if (this.files.length === 0) {
      this.files = event.target.files;
    } else {
      this.files = Array.from(this.files).concat(Array.from(event.target.files));
    }
    
    this.files = event.target.files;
    if (this.files.length > 0) {
      this.handleUploadMultipleFiles(this.files);
    }
 */
