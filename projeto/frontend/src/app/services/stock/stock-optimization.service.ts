import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { DonationProduct } from '../../domain/model/donation_product';
import { Stock } from '../../domain/model/stock';
import { environment } from '../../../environments/environment';

export interface OptimizedProduct {
  donationProductId: string;
  productId: string;
  quantity: number;
  expirationDate: Date | null;
  donationOption: string;
}

/**
 * Serviço para otimização de seleção de estoque.
 * Implementa algoritmos para seleção inteligente de produtos baseado em validade e disponibilidade.
 */
@Injectable({
  providedIn: 'root'
})
export class StockOptimizationService {
  private apiUrl = environment.api_endpoint;

  constructor(private http: HttpClient) { }

  /**
   * Otimiza seleção de produtos para uma quantidade requerida.
   * Prioriza produtos com vencimento mais próximo (FIFO).
   */
  optimizeProductSelection(productId: string, requiredQuantity: number): Observable<OptimizedProduct[]> {
    return forkJoin({
      donationProducts: this.http.get<DonationProduct[]>(`${this.apiUrl}/donation_product`),
      stock: this.http.get<Stock[]>(`${this.apiUrl}/stock`)
    }).pipe(
      map(({ donationProducts, stock }) => {
        return this.selectOptimalProducts(productId, requiredQuantity, donationProducts, stock);
      })
    );
  }

  /**
   * Algoritmo de seleção otimizada de produtos.
   * Filtra produtos válidos, ordena por vencimento e seleciona quantidades necessárias.
   */
  private selectOptimalProducts(
    productId: string, 
    requiredQuantity: number, 
    donationProducts: DonationProduct[], 
    stock: Stock[]
  ): OptimizedProduct[] {
    const currentDate = new Date();
    const minExpirationDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 dias mínimo

    // Filtra produtos disponíveis e válidos
    const availableProducts = donationProducts
  .filter(dp => dp.productId === productId)
      .map(dp => {
        const stockItem = stock.find(s => s.productId === productId && s.donationOption === dp.quantity.toString());
        return {
          ...dp,
          stockQuantity: stockItem?.actualStock || 0,
          donationOption: dp.quantity.toString()
        };
      })
      .filter(p => p.stockQuantity > 0) // Apenas com estoque
      .filter(p => !p.expirationDate || new Date(p.expirationDate) >= minExpirationDate); // Validade adequada

    // Ordena por data de vencimento (FIFO - primeiro a vencer, primeiro a sair)
    availableProducts.sort((a, b) => {
      if (!a.expirationDate && !b.expirationDate) return 0;
      if (!a.expirationDate) return 1; // Sem validade vai por último
      if (!b.expirationDate) return -1;
      return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    });

    // Seleciona produtos até completar quantidade necessária
    const selectedProducts: OptimizedProduct[] = [];
    let remainingQuantity = requiredQuantity;

    for (const product of availableProducts) {
      if (remainingQuantity <= 0) break;

      const quantityToTake = Math.min(remainingQuantity, product.stockQuantity);
      
      selectedProducts.push({
  donationProductId: product.id!,
  productId: product.productId,
  quantity: quantityToTake,
  expirationDate: product.expirationDate,
  donationOption: product.donationOption
      });

      remainingQuantity -= quantityToTake;
    }

    return selectedProducts;
  }

  /**
   * Otimiza seleção para múltiplos produtos de uma cesta.
   * Processa todos os itens em paralelo e retorna mapa otimizado.
   */
  optimizeBasketProducts(basketItems: { productId: string, requiredQuantity: number }[]): Observable<Map<string, OptimizedProduct[]>> {
    const optimizations = basketItems.map(item => 
      this.optimizeProductSelection(item.productId, item.requiredQuantity).pipe(
        map(products => ({ productId: item.productId, products }))
      )
    );

    return forkJoin(optimizations).pipe(
      map(results => {
        const optimizedMap = new Map<string, OptimizedProduct[]>();
        results.forEach(result => {
          optimizedMap.set(result.productId, result.products);
        });
        return optimizedMap;
      })
    );
  }
}