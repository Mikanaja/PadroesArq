import { Component, Input, OnInit } from '@angular/core';
import { UploadFileService } from '../../../../core/services/upload-file.service';
import { Video } from '../../../../core/models/video.model';
import { BehaviorSubject } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { createVideoForm } from '../../../../core/utils/forms';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'deep-real-upload-file',
  standalone: false,
  templateUrl: './deep-real-upload-file.component.html',
  styleUrl: './deep-real-upload-file.component.scss',
  host: {
    class: 'deep-real-upload-file'
  }
})
export class DeepRealUploadFileComponent implements OnInit {

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

  ngOnInit(): void {
    this.loadExistingVideos();
  }

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
      // const selectedFiles: File[] = Array.from(input.files);
      // this.files = [...this.files, ...selectedFiles];
      // this.handleUploadMultipleFiles(selectedFiles);
      const formArray: FormArray = this.videosFormArray;

      Array.from(input.files).forEach((file: File) => {
        const video = new Video('', file.name, '', file.type, file.size);
        const videoForm = createVideoForm(video);
        formArray.push(videoForm);
        this.handleUploadSingleFile(file, videoForm);
      });

      this.videosFormArray$.next(new FormArray([...formArray.controls]) as FormArray);
    }

    input.value = '';
  }

  private handleUploadMultipleFiles(files: File[]): void {
    files.forEach((file: File) => {
      // this.handleUploadSingleFile(file);
    });
  }

  private handleUploadSingleFile(file: File, videoForm: FormGroup): void {
    const formData: FormData = new FormData();
    formData.append('file', file);

    this.uploadFileService.uploadFile('uiasi', formData)
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round(100 * event.loaded / (event.total ?? 1));
            videoForm.patchValue({ progress });
          } else if (event.type === HttpEventType.Response) {
            const video = event?.body;
            videoForm.patchValue({ id: video?.id, s3Url: video?.s3Url });
          }
          // console.log(video);
          // this.videos$.next([...this.videos, video]);
          // this.videosFormArray.push(createVideoForm(video));
        },
        error: () => videoForm.patchValue({ progress: -1 })
      });
  }

  public onRemove(file: File): void {
    this.files = this.files.filter((f: File) => f !== file);
  }

  private loadExistingVideos(): void {}

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
