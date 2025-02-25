import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Video } from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_PATH: string = 'user';
  private userApiUrl: string = '';

  constructor(
    private http: HttpClient,
  ) {
    this.userApiUrl = `${environment.apiUrl}/${this.USER_PATH}`;
  }

  public createUser(email: string): Observable<User> {
    return this.http.post<User>(this.userApiUrl, email);
  }

  public findUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.userApiUrl}/email/${email}`);
  }

  public findUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.userApiUrl}/id/${userId}`);
  }

  public findUserVideos(userId: string): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.userApiUrl}/videos/${userId}`);
  }

}
