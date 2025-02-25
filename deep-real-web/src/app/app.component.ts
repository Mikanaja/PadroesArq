import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { setProvider } from './core/providers/global.providers';
import { RouterOutlet } from '@angular/router';
import { DeepRealPageComponent } from './shared/components/containers/deep-real-page/deep-real-page.component';
import { SplashScreenComponent } from './shared/components/splash-screen/splash-screen.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DeepRealPageComponent,
    SplashScreenComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'deep-real-web';

  constructor(
  ) {
    this.createGlobalProviders();
  }

  private createGlobalProviders(): void {
    setProvider(FormBuilder, inject(FormBuilder));
  }
}
