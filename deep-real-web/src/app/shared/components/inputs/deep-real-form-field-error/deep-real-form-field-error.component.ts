import { Component } from '@angular/core';

@Component({
  selector: 'deep-real-form-field-error',
  standalone: false,
  template: `
    <span class="deep-real-form-field-error">
      <ng-content></ng-content>
    </span>
  `,
  styleUrl: './deep-real-form-field-error.component.scss'
})
export class DeepRealFormFieldErrorComponent {

}
