import { Injectable } from '@angular/core';
import { User } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  private token = '';

  register(user: User): Observable<User> {
    return this.httpClient.post<User>('/api/auth/register', user);
  }

  login(user: User): Observable<{ token: string }> {
    return this.httpClient
      .post<{ token: string }>('/api/auth/login', user)
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('auth-token', token);
          this.setToken(token);
        })
      );
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
  }

  isAuthenticated(): boolean {
    return !!this.token; // !! convert value to boolean
  }

  logout() {
    this.setToken('');
    localStorage.clear();
  }
}
