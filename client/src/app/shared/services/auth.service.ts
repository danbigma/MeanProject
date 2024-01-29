import { Injectable } from '@angular/core';
import { User, AuthResponse, CurrentUser } from '../interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, tap, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<CurrentUser | null>;
  private token = '';

  constructor(private httpClient: HttpClient, private roleSrv: RoleService) {
    const userData = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(
      userData ? JSON.parse(userData) : null
    );
    this.loadToken();
  }

  public get currentUserValue() {
    return this.currentUserSubject.asObservable();
  }

  register(user: User): Observable<User> {
    return this.httpClient
      .post<User>('/api/auth/register', user)
      .pipe(catchError(this.handleError));
  }

  login(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>('/api/auth/login', user).pipe(
      tap(({ token, currentUser }) => {
        this.handleAuthentication(token);
        this.currentUserSubject.next(currentUser);
        this.roleSrv.setCurrentUser(currentUser);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }),
      catchError(this.handleError)
    );
  }

  private handleAuthentication(token: string) {
    localStorage.setItem('auth-token', token);
    this.setToken(token);
  }

  private loadToken() {
    const token = localStorage.getItem('auth-token');
    if (token) {
      this.token = token;
    }
  }

  getToken(): string {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  isAuthenticated(): boolean {
    // Aquí podrías añadir lógica para verificar la validez del token
    return !!this.token;
  }

  logout(): void {
    this.setToken('');
    localStorage.removeItem('auth-token');
    // Remover los datos del usuario y actualizar el estado
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private handleError(error: HttpErrorResponse) {
    // Aquí podrías manejar diferentes tipos de errores HTTP
    return throwError(() => error);
  }
}
