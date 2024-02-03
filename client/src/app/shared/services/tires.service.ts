import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, Tire } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TiresService {
  private apiUrl = '/api/tires'; // Asegúrate de reemplazar esto con la URL real de tu API

  constructor(private http: HttpClient) {}

  // Obtener todos los neumáticos
  getAll(): Observable<Tire[]> {
    return this.http.get<Tire[]>(this.apiUrl);
  }

  // Obtener un neumático por ID
  getById(id: string): Observable<Tire> {
    return this.http.get<Tire>(`${this.apiUrl}/${id}`);
  }

  // Añadir un nuevo neumático
  create(tire: Tire): Observable<Tire> {
    return this.http.post<Tire>(this.apiUrl, tire);
  }

  // Actualizar un neumático existente
  update(id: string, tire: any): Observable<Tire> {
    return this.http.put<Tire>(`${this.apiUrl}/${id}`, tire);
  }

  // Eliminar un neumático
  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/${id}`);
  }
}
