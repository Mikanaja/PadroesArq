import { Component, Input } from '@angular/core';

export enum ProgressStatus {
  waiting = 'waiting',
  success = 'success',
  error = 'error'
}

@Component({
  selector: 'deep-real-progress-bar',
  imports: [],
  template: `
    <div class="progress-bar">
      <div class="progress-bar__progress" [style]="{ width: progress + '%', backgroundColor: color }"></div>
    </div>
  `,
  styleUrl: './deep-real-progress-bar.component.scss'
})
export class DeepRealProgressBarComponent {

  @Input()
  public progress: number = 0;

  @Input()
  public status: string = ProgressStatus.waiting;

  constructor() { }

  public get color(): string {
    switch (this.status) {
      case ProgressStatus.success:
        return 'var(--success-color)';
      case ProgressStatus.error:
        return 'var(--error-color)';
      default:
        return 'var(--secondary-color)';
    }
  }
}
