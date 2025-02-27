import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AccessService } from '../../core/services/access.service';
import { CommonModule } from '@angular/common';
import { InputsModule } from '../../shared/components/inputs/inputs.module';
import { createUserForm } from '../../core/utils/forms';
import { DeepRealPageComponent } from "../../shared/components/containers/deep-real-page/deep-real-page.component";
import { DeepRealButtonComponent } from "../../shared/components/deep-real-button/deep-real-button.component";

@Component({
  selector: 'access',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    CommonModule,
    DeepRealPageComponent,
    DeepRealButtonComponent
],
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss',
  host: {
    class: 'access'
  }
})
export class AccessComponent implements OnInit {

  public userForm$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(new FormGroup({}));

  constructor(
    private accessService: AccessService
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
    const formGroup: FormGroup = this.userForm;
    if (formGroup.valid) {
      const email = this.userForm.value.email;
      this.accessService.loadUser(email);
    }
    else
      formGroup.markAllAsTouched();
  }

}
