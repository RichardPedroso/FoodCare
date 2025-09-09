import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { BasketItem } from '../../domain/model/basket-item';
import { StockOptimizationService, OptimizedProduct } from '../stock/stock-optimization.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketCalculationService {
  private apiUrl = `${environment.api_endpoint}/basket`;

  constructor(
    private http: HttpClient,
    private stockOptimization: StockOptimizationService
  ) { }

  calculateBasket(userId: number, peopleQuantity: number, hasChildren: boolean): Observable<BasketItem[]> {
    const params = {
      userId: userId.toString(),
      peopleQuantity: peopleQuantity.toString(),
      hasChildren: hasChildren.toString()
    };
    
    return this.http.get<BasketItem[]>(`${this.apiUrl}/calculate`, { params });
  }

  getBasketForFamily(peopleQuantity: number, hasChildren: boolean): Observable<BasketItem[]> {
    const params = {
      peopleQuantity: peopleQuantity.toString(),
      hasChildren: hasChildren.toString()
    };
    
    return this.http.get<BasketItem[]>(`${this.apiUrl}/family`, { params });
  }

  generateOptimizedBasket(userId: number, peopleQuantity: number, hasChildren: boolean): Observable<{ basketItems: BasketItem[], optimizedProducts: Map<string, OptimizedProduct[]> }> {
    return this.calculateBasket(userId, peopleQuantity, hasChildren).pipe(
      switchMap(basketItems => {
        const basketRequests = basketItems.map(item => ({
          productId: item.productId.toString(),
          requiredQuantity: item.quantity
        }));
        
        return this.stockOptimization.optimizeBasketProducts(basketRequests).pipe(
          map(optimizedProducts => ({ basketItems, optimizedProducts }))
        );
      })
    );
  }
}