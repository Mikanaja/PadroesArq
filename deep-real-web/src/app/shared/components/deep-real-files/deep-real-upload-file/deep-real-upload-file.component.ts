import { Component, Input, OnInit } from '@angular/core';
import { UploadFileService } from '../../../../core/services/upload-file.service';
import { Video } from '../../../../core/models/video.model';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../splash-screen/loading.service';
import { ProgressStatus } from '../../deep-real-progress-bar/deep-real-progress-bar.component';
import { Enum } from '../../../../core/types';
import { ApplicationService } from '../../../../core/services/application.service';
import { EnumsNames } from '../../../../core/data/enums';

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
  public analysisState$: BehaviorSubject<Enum[]> = new BehaviorSubject<Enum[]>([]);
  public progressStatus: string = ProgressStatus.waiting;
  public progress: number = 0;

  private user$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(new FormGroup({}));
  private files: File[] = [];


  @Input()
  public set userForm(userForm: FormGroup) {
    this.user$.next(userForm);
  }

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private appService: ApplicationService,
    private uploadFileService: UploadFileService
  ) { }

  ngOnInit(): void {
    this.loadUserVideos(this.user.id);
    this.loadEnums();
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
      this.videos$.next([...this.videos, ...files.map((file: File) => new Video('', file.name, '', file.type, file.size, ''))]);
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
          this.progress = 0;
          this.progressStatus = ProgressStatus.waiting;
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round(100 * event.loaded / (event.total ?? 1));
            console.log(progress);
            this.progress = progress;
          } else if (event.type === HttpEventType.Response) {
            this.progress = 100;
            this.progressStatus = ProgressStatus.success;
          }
          
          console.log(event?.body);
        },
        error: (error: any) => {
          this.progressStatus = ProgressStatus.error;
          this.loadingService.stop();
          this.toastrService.error(error?.error?.message);
        }
      });
  }

  public findAnalysisStateDescription(roomType: string): string {
    return this.analysisState$.value.find((enumValue: Enum) => enumValue.name === roomType)?.description ?? '';
  }

  public onRemove(file: File): void {
    this.files = this.files.filter((f: File) => f !== file);
  }

  private loadUserVideos(userId: string): void {
    this.userService.findUserVideos(userId)
      .subscribe((videos: Video[]) => this.videos$.next(videos));
  }

  private loadEnums(): void {
    this.appService.findEnumByName(EnumsNames.ANALYSIS_STATE)
      .subscribe((enums: Enum[]) => this.analysisState$.next(enums));
  }

}