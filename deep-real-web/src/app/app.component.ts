import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeepRealPageComponent } from "./shared/components/containers/deep-real-page/deep-real-page.component";
import { ApplicationService } from './core/services/application.service';
import { SplashScreenComponent } from "./shared/components/splash-screen/splash-screen.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DeepRealPageComponent,
    SplashScreenComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'deep-real-web';

  constructor(
    appService: ApplicationService
  ) { }
}
