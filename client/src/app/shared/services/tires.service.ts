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
  create(tire: Tire, image?: File): Observable<Tire> {
    const fd = new FormData();
    // Añadir propiedades simples directamente
    fd.append('brand', tire.brand);
    fd.append('model', tire.model);
    fd.append('size', tire.size);
    fd.append('type', tire.type);
    fd.append('manufactureDate', tire.manufactureDate.toISOString());
    fd.append('countryOfOrigin', tire.countryOfOrigin);
    fd.append('quantityInStock', tire.quantityInStock.toString());
    // Añadir propiedades anidadas como cadenas planas
    fd.append('price.amount', tire.price.amount.toString());
    fd.append('price.currency', tire.price.currency);
    // Añadir imagen si existe
    if (image) {
      fd.append('image', image, image.name);
    }
    return this.http.post<Tire>(this.apiUrl, fd);
  }

  // Actualizar un neumático existente
  update(id: string, tire: Tire, image?: File): Observable<Tire> {
    const fd = new FormData();
    // Añadir propiedades simples directamente
    fd.append('brand', tire.brand);
    fd.append('model', tire.model);
    fd.append('size', tire.size);
    fd.append('type', tire.type);
    fd.append('manufactureDate', tire.manufactureDate.toISOString());
    fd.append('countryOfOrigin', tire.countryOfOrigin);
    fd.append('quantityInStock', tire.quantityInStock.toString());
    // Añadir propiedades anidadas como cadenas planas
    fd.append('price.amount', tire.price.amount.toString());
    fd.append('price.currency', tire.price.currency);
    // Añadir imagen si existe
    if (image) {
      fd.append('image', image, image.name);
    }
    return this.http.put<Tire>(`${this.apiUrl}/${id}`, fd);
  }

  // Eliminar un neumático
  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/${id}`);
  }
}
