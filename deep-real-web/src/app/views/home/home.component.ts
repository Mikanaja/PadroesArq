import { Component } from '@angular/core';
import { DeepRealUploadFileComponent } from '../../shared/components/deep-real-upload-file/deep-real-upload-file.component';
import { DeepRealPageComponent } from "../../shared/components/containers/deep-real-page/deep-real-page.component";

@Component({
  selector: 'deep-real-home',
  standalone: true,
  imports: [
    DeepRealUploadFileComponent,
    DeepRealPageComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
