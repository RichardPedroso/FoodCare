import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { Stock } from '../../domain/model/stock';
import { OptimizedProduct } from './stock-optimization.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockUpdateService {
  private apiUrl = environment.api_endpoint;

  constructor(private http: HttpClient) { }

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
                actual_stock: stockItem.actual_stock - product.quantity
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
}