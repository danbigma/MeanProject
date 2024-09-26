import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, Warehouse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = '/api/warehouse';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl);
  }

  getById(id: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.apiUrl}/${id}`);
  }

  create(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, warehouse);
  }

  update(id: string, warehouse: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.apiUrl}/${id}`, warehouse);
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/${id}`);
  }
}
