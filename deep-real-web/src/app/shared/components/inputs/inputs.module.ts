import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeepRealFormFieldComponent } from './deep-real-form-field/deep-real-form-field.component';
import { DeepRealFormFieldErrorComponent } from './deep-real-form-field-error/deep-real-form-field-error.component';
import { DeepRealFormFieldLabelComponent } from './deep-real-form-field-label/deep-real-form-field-label.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DeepRealFormFieldComponent,
    DeepRealFormFieldErrorComponent,
    DeepRealFormFieldLabelComponent
  ],
  exports: [
    DeepRealFormFieldComponent,
    DeepRealFormFieldErrorComponent,
    DeepRealFormFieldLabelComponent
  ]
})
export class InputsModule { }
