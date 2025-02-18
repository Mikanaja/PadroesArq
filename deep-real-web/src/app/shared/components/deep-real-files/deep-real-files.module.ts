import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeepRealButtonComponent } from '../deep-real-button/deep-real-button.component';
import { DeepRealUploadFileComponent } from './deep-real-upload-file/deep-real-upload-file.component';
import { DeepRealFilesListsComponent } from './deep-real-files-lists/deep-real-files-lists.component';

@NgModule({
  imports: [
    CommonModule,
    DeepRealButtonComponent
  ],
  declarations: [DeepRealFilesListsComponent, DeepRealUploadFileComponent],
  exports: [DeepRealFilesListsComponent, DeepRealUploadFileComponent]
})
export class DeepRealFilesModule { }
