import { Component, OnInit } from '@angular/core';
import { DeepRealPageComponent } from "../../shared/components/containers/deep-real-page/deep-real-page.component";
import { DeepRealFilesModule } from '../../shared/components/deep-real-files/deep-real-files.module';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { User } from '../../core/models/user.model';
import { FormGroup } from '@angular/forms';
import { AccessService } from '../../core/services/access.service';
import { LoadingService } from '../../shared/components/splash-screen/loading.service';
import { createUserForm } from '../../core/utils/forms';

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

  public user$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(new FormGroup({}));

  private destroy$ = new Subject<void>();

  constructor(
    private accessService: AccessService,
    private loadingService: LoadingService
  ) { }

  public get userForm(): FormGroup {
    return this.user$.value;
  }

  ngOnInit(): void {
    this.loadingService.stop();
    this.accessService.currentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onUserChange);
  }

  private onUserChange = (user: User): void => {
    this.user$.next(createUserForm(user));
  };

}
