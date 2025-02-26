import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UploadFileService } from '../../../../core/services/upload-file.service';
import { Video } from '../../../../core/models/video.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { createVideoForm } from '../../../../core/utils/forms';
import { HttpEventType } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../splash-screen/loading.service';
import { ProgressStatus } from '../../deep-real-progress-bar/deep-real-progress-bar.component';

interface VideoUpload {
  file: File;
  progress: number; // De 0 a 100
}

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
  public progress: number = 0;
  public progressStatus: string = ProgressStatus.waiting;

  private user$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(new FormGroup({}));
  private files: File[] = [];


  @Input()
  public set userForm(userForm: FormGroup) {
    this.user$.next(userForm);
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private uploadFileService: UploadFileService
  ) { }

  ngOnInit(): void {
    this.loadUserVideos(this.user.id);
  }

  public get userForm(): FormGroup {
    return this.user$.value;
  }

  public get user(): User {
    return this.userForm?.value;
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
      const files: File[] = Array.from(input.files);
      this.videos$.next([...this.videos, ...files.map((file: File) => new Video('', file.name, '', file.type, file.size))]);
      this.handleUploadMultipleFiles(files);
    }

    input.value = '';
  }

  private handleUploadMultipleFiles(files: File[]): void {
    files.forEach((file: File) => {
        this.handleUploadSingleFile(file);
    });
}

  private handleUploadSingleFile(file: File): void {
    const formData: FormData = new FormData();
    formData.append('file', file);
    
    this.loadingService.start();
    this.uploadFileService.uploadFile(this.user.id, formData)
      .subscribe({
        next: (event: any) => {
          this.loadingService.stop();
          
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round(100 * event.loaded / (event.total ?? 1));
            console.log(progress);
            this.progress = progress;
          } else if (event.type === HttpEventType.Response) {
            this.progress = 100;
            this.progressStatus = ProgressStatus.success;
          }
        },
        error: (error: any) => {
          this.progressStatus = ProgressStatus.error;
          this.loadingService.stop();
          this.toastrService.error(error?.error?.message);
        }
      });
  }

  public onRemove(file: File): void {
    this.files = this.files.filter((f: File) => f !== file);
  }

  private loadUserVideos(userId: string): void {
    this.userService.findUserVideos(userId)
      .subscribe((videos: Video[]) => this.videos$.next(videos));
  }

}