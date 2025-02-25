import { Component, Input, OnInit } from '@angular/core';
import { DeepRealPageComponent } from "../../shared/components/containers/deep-real-page/deep-real-page.component";
import { DeepRealFilesModule } from '../../shared/components/deep-real-files/deep-real-files.module';
import { UserService } from '../../core/services/user.service';
import { Video } from '../../core/models/video.model';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { User } from '../../core/models/user.model';
import { FormArray, FormGroup } from '@angular/forms';
import { AccessService } from '../../core/services/access.service';
import { LoadingService } from '../../shared/components/splash-screen/loading.service';

@Component({
  selector: 'deep-real-home',
  imports: [
    DeepRealFilesModule,
    DeepRealPageComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public videos$: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>([]);
  public user$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(new FormGroup({}));

  private destroy$ = new Subject<void>();

  @Input()
  public userId: string = '';

  @Input()
  public set userForm(userForm: FormGroup) {
    this.user$.next(userForm);
  }

  constructor(
    private userService: UserService,
    private accessService: AccessService,
    private loadingService: LoadingService
  ) { }

  public get videosFormArray(): FormArray {
    return this.user$.value.get('videos') as FormArray;
  }

  ngOnInit(): void {
    this.loadingService.stop();
    this.accessService.currentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onUserChange);
  }

  private onUserChange = (user: User): void => {
    if (user) {
      this.loadUserVideos(user.id);
    }
  };
  

  private loadUserVideos(userId: string): void {
    this.userService.findUserVideos(userId)
      .subscribe((videos: Video[]) => this.videos$.next(videos));
  }

}
