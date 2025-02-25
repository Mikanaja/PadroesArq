import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../shared/components/splash-screen/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  private user$: BehaviorSubject<User> = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') || '{}') as User);

  private readonly USER_PATH: string = 'user';
  private userApiUrl: string = '';
  private accessToken: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService,
    private loadingService: LoadingService
  ) {
    this.userApiUrl = `${environment.apiUrl}/${this.USER_PATH}`;
    this.verifyToken();
  }

  public currentUser = (): Observable<User> => {
    if (!this.user$.value) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          this.user$.next(JSON.parse(storedUser));
      } else {
        this.router.navigate(['/access']);
      }
    }
    return this.user$.asObservable();
  };

  public loadUser = (email: string): void => {
    console.log(email);
    this.userService.findUserByEmail(email)
      .subscribe({
        next: (user: User) => this.handleUser(user),
        error: (error: any) => {
          if (error.status === 404) {
            this.handleNewUser(email);
          } else {
            this.toastrService.error('Erro ao buscar usuário');
          }
          this.loadingService.stop();
        }
      });
  }

  public verifyToken(): void {
    if (this.accessToken.length > 0) {
      const token = localStorage.getItem('token');
      if (token !== this.accessToken)
        this.router.navigate(['/access']);
    }
  }

  private handleUser = (user: User): void => {
    this.user$.next(user);
    localStorage.setItem('user', JSON.stringify(user));

    this.router.navigate(['/home']);
  }

  private handleNewUser = (email: string): void => {
    this.userService.createUser(email).subscribe(this.handleUser);
  }

}
