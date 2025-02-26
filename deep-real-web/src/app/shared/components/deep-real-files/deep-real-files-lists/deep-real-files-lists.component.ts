import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Video } from '../../../../core/models/video.model';

@Component({
  selector: 'deep-real-files-lists',
  standalone: false,
  templateUrl: './deep-real-files-lists.component.html',
  styleUrl: './deep-real-files-lists.component.scss'
})
export class DeepRealFilesListsComponent implements OnInit {
  
  public videos$: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>([]);

  // private videosFormArray$: BehaviorSubject<FormArray<FormGroup>> = new BehaviorSubject<FormArray<FormGroup>>(new FormArray<FormGroup>([]));

  @Input()
  public set videos(videos: Video[]) {
    this.videos$.next(videos);
  }

  public get videosArray(): Video[] {
    return this.videos$.value;
  }

  public inProgress: boolean = false;

  @Output()
  public onRemove: EventEmitter<File> = new EventEmitter<File>();

  public get iconPath(): string {
    return './../../../../../assets/icons/upload-file-24.svg';
  }

  constructor() { }
  
  ngOnInit(): void {
    debugger;
    console.log('videosFormArray', this.videos.values);
  }
}
