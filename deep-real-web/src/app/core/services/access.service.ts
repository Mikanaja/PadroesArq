import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../shared/components/splash-screen/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  private readonly USER_KEY = 'user';

  private user$: BehaviorSubject<User> = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.USER_KEY) || '{}') as User);
  private accessToken: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService,
    private loadingService: LoadingService
  ) {
    this.verifyToken();
  }

  public currentUser = (): Observable<User> => {
    if (!this.user$.value) {
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser) {
          this.user$.next(JSON.parse(storedUser));
      } else {
        this.router.navigate(['/access']);
      }
    }
    return this.user$.asObservable();
  };

  public logout = (): void => {
    this.clearAccessContext();
    this.router.navigate(['/access']);
  }

  private clearAccessContext = (): void => {
    localStorage.removeItem(this.USER_KEY);
    this.user$.next({} as User);
  }

  public loadUser = (email: string): void => {
    this.loadingService.start();
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
      const token = localStorage.getItem(this.USER_KEY);
      if (token !== this.accessToken)
        this.router.navigate(['/access']);
    }
  }

  private handleUser = (user: User): void => {
    this.user$.next(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.loadingService.stop();
    this.router.navigate(['/home']);
  }

  private handleNewUser = (email: string): void => {
    this.userService.createUser(email).subscribe({
      next: (user: User) => {
        this.handleUser(user);
        this.toastrService.success('Usuário criado com sucesso');
      },
      error: () => this.toastrService.error('Erro ao criar usuário')
    });
  }

}
