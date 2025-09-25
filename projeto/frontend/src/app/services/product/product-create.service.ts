import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../domain/model/product';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

/**
 * Serviço para criação de produtos.
 * Cadastra novos produtos no catálogo do sistema.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductCreateService {

  constructor(private http: HttpClient) {}

  /** Cria um novo produto no sistema */
  async create(product: Product): Promise<Product>{
    return await firstValueFrom(this.http.post<Product>(`${environment.api_endpoint}/product`, product));
  }
}
