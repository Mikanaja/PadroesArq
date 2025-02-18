import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeepRealPageComponent } from "./shared/components/containers/deep-real-page/deep-real-page.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DeepRealPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'deep-real-web';
}
