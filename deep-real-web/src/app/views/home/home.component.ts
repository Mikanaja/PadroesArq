import { Component } from '@angular/core';
import { DeepRealPageComponent } from "../../shared/components/containers/deep-real-page/deep-real-page.component";
import { DeepRealFilesModule } from '../../shared/components/deep-real-files/deep-real-files.module';

@Component({
  selector: 'deep-real-home',
  standalone: true,
  imports: [
    DeepRealFilesModule,
    DeepRealPageComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
