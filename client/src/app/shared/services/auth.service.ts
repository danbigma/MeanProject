import { Injectable } from '@angular/core';
import { User, AuthResponse } from '../interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = '';

  constructor(private httpClient: HttpClient) {
    this.loadToken();
  }

  register(user: User): Observable<User> {
    return this.httpClient
      .post<User>('/api/auth/register', user)
      .pipe(catchError(this.handleError));
  }

  login(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>('/api/auth/login', user).pipe(
      tap(({ token }) => this.handleAuthentication(token)),
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
  }

  private handleError(error: HttpErrorResponse) {
    // Aquí podrías manejar diferentes tipos de errores HTTP
    return throwError(() => error);
  }
}
