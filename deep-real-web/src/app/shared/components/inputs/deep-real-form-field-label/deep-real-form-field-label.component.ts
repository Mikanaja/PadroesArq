import { Component } from '@angular/core';

@Component({
  selector: 'deep-real-form-field-label',
  standalone: false,
  template: `
    <label class="deep-real-form-field-label">
      <ng-content></ng-content>
    </label>
  `,
  styleUrl: './deep-real-form-field-label.component.scss'
})
export class DeepRealFormFieldLabelComponent {

}
