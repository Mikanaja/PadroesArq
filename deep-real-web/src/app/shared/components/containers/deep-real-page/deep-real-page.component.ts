import { Component } from '@angular/core';

@Component({
  selector: 'deep-real-page',
  standalone: true,
  imports: [],
  template: `
    <div class="deep-real-page-container">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './deep-real-page.component.scss'
})
export class DeepRealPageComponent {

}
