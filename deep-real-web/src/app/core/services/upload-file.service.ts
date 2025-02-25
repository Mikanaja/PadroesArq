import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { Video } from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private readonly UPLOAD_PATH: string = 'upload';
  private uploadApiUrl: string = '';

  constructor(
    private http: HttpClient
  ) {
    this.uploadApiUrl = `${environment.apiUrl}/${this.UPLOAD_PATH}`;
  }

  public uploadFile(userId: string, file: FormData): Observable<HttpEvent<Video>> {
    return this.http.post<Video>(`${this.uploadApiUrl}/${userId}`, file, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
