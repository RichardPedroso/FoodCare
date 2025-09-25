import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { BasketItem } from '../../domain/model/basket-item';
import { StockOptimizationService, OptimizedProduct } from '../stock/stock-optimization.service';
import { environment } from '../../../environments/environment';

/**
 * Serviço para cálculo de cestas básicas personalizadas.
 * Calcula cestas baseadas no perfil familiar e integra com otimização de estoque.
 */
@Injectable({
  providedIn: 'root'
})
export class BasketCalculationService {
  private apiUrl = `${environment.api_endpoint}/basket`;

  constructor(
    private http: HttpClient,
    private stockOptimization: StockOptimizationService
  ) { }

  /**
   * Calcula cesta personalizada para um usuário específico.
   * Considera perfil familiar (quantidade de pessoas e presença de crianças).
   */
  calculateBasket(userId: number, peopleQuantity: number, hasChildren: boolean): Observable<BasketItem[]> {
    const params = {
      userId: userId.toString(),
      peopleQuantity: peopleQuantity.toString(),
      hasChildren: hasChildren.toString()
    };
    
    return this.http.get<BasketItem[]>(`${this.apiUrl}/calculate`, { params });
  }

  /**
   * Gera cesta padrão para uma família sem usuário específico.
   * Útil para simulações e cálculos genéricos.
   */
  getBasketForFamily(peopleQuantity: number, hasChildren: boolean): Observable<BasketItem[]> {
    const params = {
      peopleQuantity: peopleQuantity.toString(),
      hasChildren: hasChildren.toString()
    };
    
    return this.http.get<BasketItem[]>(`${this.apiUrl}/family`, { params });
  }

  /**
   * Gera cesta otimizada com seleção inteligente de estoque.
   * Combina cálculo de cesta com otimização de produtos disponíveis.
   */
  generateOptimizedBasket(userId: number, peopleQuantity: number, hasChildren: boolean): Observable<{ basketItems: BasketItem[], optimizedProducts: Map<string, OptimizedProduct[]> }> {
    return this.calculateBasket(userId, peopleQuantity, hasChildren).pipe(
      switchMap(basketItems => {
        // Converte itens da cesta para formato de otimização
        const basketRequests = basketItems.map(item => ({
          productId: item.productId.toString(),
          requiredQuantity: item.quantity
        }));
        
        // Otimiza seleção de produtos no estoque
        return this.stockOptimization.optimizeBasketProducts(basketRequests).pipe(
          map(optimizedProducts => ({ basketItems, optimizedProducts }))
        );
      })
    );
  }
}