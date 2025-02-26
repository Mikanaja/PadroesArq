import { Component, OnInit } from '@angular/core';
import { DeepRealPageComponent } from "../../shared/components/containers/deep-real-page/deep-real-page.component";
import { DeepRealFilesModule } from '../../shared/components/deep-real-files/deep-real-files.module';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { User } from '../../core/models/user.model';
import { FormGroup } from '@angular/forms';
import { AccessService } from '../../core/services/access.service';
import { createUserForm } from '../../core/utils/forms';
import { DeepRealButtonComponent } from "../../shared/components/deep-real-button/deep-real-button.component";

@Component({
  selector: 'deep-real-home',
  imports: [
    DeepRealFilesModule,
    DeepRealPageComponent,
    DeepRealButtonComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public user$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(new FormGroup({}));

  private destroy$ = new Subject<void>();

  constructor(
    private accessService: AccessService
  ) { }

  public get userForm(): FormGroup {
    return this.user$.value;
  }

  ngOnInit(): void {
    this.accessService.currentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onUserChange);
  }

  public logout = (): void => {
    this.accessService.logout();
  }

  private onUserChange = (user: User): void => {
    this.user$.next(createUserForm(user));
  };

}
