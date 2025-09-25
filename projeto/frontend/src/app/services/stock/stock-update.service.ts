import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap, firstValueFrom } from 'rxjs';
import { Stock } from '../../domain/model/stock';
import { OptimizedProduct } from './stock-optimization.service';
import { environment } from '../../../environments/environment';

/**
 * Serviço para atualização de estoque.
 * Gerencia alterações nas quantidades disponíveis após geração de cestas.
 */
@Injectable({
  providedIn: 'root'
})
export class StockUpdateService {
  private apiUrl = environment.api_endpoint;

  constructor(private http: HttpClient) { }

  /**
   * Atualiza estoque após geração de cesta otimizada.
   * Reduz quantidades dos produtos selecionados no algoritmo de otimização.
   */
  updateStockAfterBasketGeneration(optimizedProducts: Map<string, OptimizedProduct[]>): Observable<any[]> {
    const updateRequests: Observable<any>[] = [];

    optimizedProducts.forEach((products) => {
      products.forEach(product => {
        const updateRequest = this.http.get<Stock[]>(`${this.apiUrl}/stock`).pipe(
          switchMap(stocks => {
            const stockItem = stocks.find(s => 
              s.product_id === product.productId && 
              s.donation_option === product.donationOption
            );
            
            if (stockItem) {
              const updatedStock = {
                ...stockItem,
                actual_stock: stockItem.actual_stock - product.quantity // Reduz quantidade
              };
              return this.http.put(`${this.apiUrl}/stock/${stockItem.id}`, updatedStock);
            }
            return [];
          })
        );
        updateRequests.push(updateRequest);
      });
    });

    return forkJoin(updateRequests);
  }

  /**
   * Atualiza estoque de um produto específico.
   * Cria novo registro se não existir, ou atualiza existente.
   */
  async updateStock(productId: string, donationOption: string, quantityChange: number): Promise<void> {
    try {
      const stocks = await firstValueFrom(
        this.http.get<Stock[]>(`${this.apiUrl}/stock?product_id=${productId}&donation_option=${donationOption}`)
      );
      
      if (stocks.length > 0) {
        // Atualizar estoque existente
        const stockRecord = stocks[0];
        const newStock = stockRecord.actual_stock + quantityChange;
        
        await firstValueFrom(
          this.http.put(`${this.apiUrl}/stock/${stockRecord.id}`, { ...stockRecord, actual_stock: newStock })
        );
      } else {
        // Criar novo registro de estoque
        const newStockRecord = {
          product_id: productId,
          donation_option: donationOption,
          actual_stock: Math.max(0, quantityChange) // Não permite estoque negativo
        };
        
        await firstValueFrom(
          this.http.post(`${this.apiUrl}/stock`, newStockRecord)
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  }
}