import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Video } from '../../../../core/models/video.model';

@Component({
  selector: 'deep-real-files-lists',
  standalone: false,
  templateUrl: './deep-real-files-lists.component.html',
  styleUrl: './deep-real-files-lists.component.scss'
})
export class DeepRealFilesListsComponent {
  
  public videos$: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>([]);

  @Input()
  public set videos(videos: Video[]) {
    this.videos$.next(videos);
  }

  public inProgress: boolean = false;

  @Output()
  public onRemove: EventEmitter<File> = new EventEmitter<File>();

  public get iconPath(): string {
    return './../../../../../assets/icons/upload-file-24.svg';
  }

  constructor() { }
}
