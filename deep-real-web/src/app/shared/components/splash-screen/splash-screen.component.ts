import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { LoadingService } from './loading.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'deep-real-splash-screen',
  template: `
    <div 
      *ngIf="isLoading$ | async as isLoading" 
      [class]="'splash-screen ' + (isLoading ? 'show' : 'hide')"
    >
      <img src="./../../../../assets/images/logo.png" alt="Processando informações"/>
    </div>
  `,
  styleUrls: ['./splash-screen.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplashScreenComponent implements OnDestroy {

  public isLoading$: BehaviorSubject<boolean>;

  constructor(
    private loadingService: LoadingService
  ) {
    this.isLoading$ = this.loadingService.loading$;
  }

  ngOnDestroy(): void {
      this.isLoading$.unsubscribe();
  }

}
