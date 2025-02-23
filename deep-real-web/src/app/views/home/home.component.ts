import { Component, Input, OnInit } from '@angular/core';
import { DeepRealPageComponent } from "../../shared/components/containers/deep-real-page/deep-real-page.component";
import { DeepRealFilesModule } from '../../shared/components/deep-real-files/deep-real-files.module';
import { UserService } from '../../core/services/user.service';
import { Video } from '../../core/models/video.model';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../core/models/user.model';
import { FormArray, FormGroup } from '@angular/forms';

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

  @Input()
  public userId: string = '';

  @Input()
  public set userForm(userForm: FormGroup) {
    this.user$.next(userForm);
  }

  constructor(
    private userService: UserService
  ) { }

  public get videosFormArray(): FormArray {
    return this.user$.value.get('videos') as FormArray;
  }

  ngOnInit(): void {
    this.loadUserVideos(this.userId);
  }

  private loadUserVideos(userId: string): void {
    // this.userService.getUserVideos(userId)
    //   .subscribe((videos: Video[]) => {
    //     console.log(videos);
    //   });
  }

}
