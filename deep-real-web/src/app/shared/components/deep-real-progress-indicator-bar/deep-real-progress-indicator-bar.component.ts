import { Component, Input } from '@angular/core';

@Component({
  selector: 'deep-real-progress-indicator-bar',
  imports: [],
  template: `
    <div class="progress-indicator-bar">
      <div class="progress-indicator-bar__progress" [style.width]="progress + '%'"></div>
    </div>
  `,
  styleUrl: './deep-real-progress-indicator-bar.component.scss'
})
export class DeepRealProgressIndicatorBarComponent {
  @Input()
  public progress: number = 0;
  
  constructor() {}
}
