import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AccessService } from '../../core/services/access.service';
import { CommonModule } from '@angular/common';
import { InputsModule } from '../../shared/components/inputs/inputs.module';
import { createUserForm } from '../../core/utils/forms';
import { DeepRealPageComponent } from "../../shared/components/containers/deep-real-page/deep-real-page.component";
import { User } from '../../core/models/user.model';
import { DeepRealButtonComponent } from "../../shared/components/deep-real-button/deep-real-button.component";
import { LoadingService } from '../../shared/components/splash-screen/loading.service';

@Component({
  selector: 'app-access',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    CommonModule,
    DeepRealPageComponent,
    DeepRealButtonComponent
],
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss'
})
export class AccessComponent implements OnInit {

  public userForm$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(new FormGroup({}));

  constructor(
    private accessService: AccessService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  public get userForm(): FormGroup {
    return this.userForm$.value;
  }

  private createForm(): void {
    this.userForm$.next(createUserForm());
  }

  public onSubmit(): void {
    this.loadingService.start();
    const formGroup: FormGroup = this.userForm;
    if (formGroup.valid) {
      const email = this.userForm.value.email;
      this.accessService.loadUser(email);
    }
    else
      formGroup.markAllAsTouched();
  }

}
