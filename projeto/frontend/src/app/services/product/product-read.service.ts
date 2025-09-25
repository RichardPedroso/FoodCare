import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../domain/model/product';

/**
 * Serviço para leitura de produtos.
 * Consulta informações do catálogo de produtos.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductReadService {

  constructor(private http: HttpClient) { }

  /** Busca todos os produtos cadastrados */
  findAll(): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(`${environment.api_endpoint}/product`));
  }

  /** Busca produto por ID */
  findById(id: string): Promise<Product>{
    return firstValueFrom(this.http.get<Product>(`${environment.api_endpoint}/product/${id}`));
  }
}