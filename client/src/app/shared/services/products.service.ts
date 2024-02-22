import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductVariant } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = '/api/products'; // Замените на URL вашего API

  constructor(private http: HttpClient) {}

  createProduct(productData: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/`, productData);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/`);
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  updateProduct(
    productId: string,
    productData: Partial<Product>
  ): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, productData);
  }

  addVariant(
    productId: string,
    variantData: ProductVariant
  ): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiUrl}/${productId}/variants`,
      variantData
    );
  }

  updateVariant(
    productId: string,
    variantId: string,
    variantData: Partial<ProductVariant>
  ): Observable<ProductVariant> {
    return this.http.put<ProductVariant>(
      `${this.apiUrl}/${productId}/variants/${variantId}`,
      variantData
    );
  }

  deleteVariant(productId: string, variantId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${productId}/variants/${variantId}`
    );
  }

  getVariantById(
    productId: string,
    variantId: string
  ): Observable<ProductVariant> {
    return this.http.get<ProductVariant>(
      `${this.apiUrl}/${productId}/variants/${variantId}`
    );
  }
}
