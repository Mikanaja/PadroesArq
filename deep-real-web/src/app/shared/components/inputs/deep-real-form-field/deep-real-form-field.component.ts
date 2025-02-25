import { Component } from '@angular/core';

@Component({
  selector: 'deep-real-form-field',
  standalone: false,
  template: `
    <ng-content select="deep-real-form-field-label"></ng-content>
    <ng-content select="input"></ng-content>
    <ng-content select="deep-real-form-field-error"></ng-content>
  `,
  styleUrl: './deep-real-form-field.component.scss',
  host: {
    class: 'deep-real-form-field'
  }
})
export class DeepRealFormFieldComponent {

}
