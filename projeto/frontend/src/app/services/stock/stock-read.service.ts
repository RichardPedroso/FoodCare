import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

export interface Stock {
  id: number;
  productId: number;
  donationOption: number;
  actualStock: number;
}

/**
 * Serviço para leitura de estoque.
 * Consulta quantidades disponíveis de produtos no estoque.
 */
@Injectable({
  providedIn: 'root'
})
export class StockReadService {

  constructor(private http: HttpClient) { }

  /** Busca todo o estoque disponível */
  findAll(): Promise<Stock[]> {
    return firstValueFrom(this.http.get<Stock[]>(`${environment.api_endpoint}/stock`));
  }

  /** Busca estoque de um produto específico */
  findByProductId(productId: number): Promise<Stock[]> {
    return firstValueFrom(this.http.get<Stock[]>(`${environment.api_endpoint}/stock/product/${productId}`));
  }
}