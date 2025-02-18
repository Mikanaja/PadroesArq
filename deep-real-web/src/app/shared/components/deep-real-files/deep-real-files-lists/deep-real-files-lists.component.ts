import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'deep-real-files-lists',
  standalone: false,
  templateUrl: './deep-real-files-lists.component.html',
  styleUrl: './deep-real-files-lists.component.scss'
})
export class DeepRealFilesListsComponent {
  @Input()
  public files: File[] = [];

  @Output()
  public onRemove: EventEmitter<File> = new EventEmitter<File>();
}
