import { Injectable } from '@angular/core';
import { User } from '../interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  fetch(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  createUser(email: string, password: string, role: string): Observable<User> {
    const user = { email, password, role };
    return this.http.post<User>('/api/users', user);
  }
}
