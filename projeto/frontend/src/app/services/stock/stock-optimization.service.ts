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

@Injectable({
  providedIn: 'root'
})
export class StockOptimizationService {
  private apiUrl = environment.api_endpoint;

  constructor(private http: HttpClient) { }

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

  private selectOptimalProducts(
    productId: string, 
    requiredQuantity: number, 
    donationProducts: DonationProduct[], 
    stock: Stock[]
  ): OptimizedProduct[] {
    const currentDate = new Date();
    const minExpirationDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));

    const availableProducts = donationProducts
      .filter(dp => dp.product_id === productId)
      .map(dp => {
        const stockItem = stock.find(s => s.product_id === productId && s.donation_option === dp.quantity.toString());
        return {
          ...dp,
          stockQuantity: stockItem?.actual_stock || 0,
          donationOption: dp.quantity.toString()
        };
      })
      .filter(p => p.stockQuantity > 0)
      .filter(p => !p.expirationDate || new Date(p.expirationDate) >= minExpirationDate);

    availableProducts.sort((a, b) => {
      if (!a.expirationDate && !b.expirationDate) return 0;
      if (!a.expirationDate) return 1;
      if (!b.expirationDate) return -1;
      return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    });

    const selectedProducts: OptimizedProduct[] = [];
    let remainingQuantity = requiredQuantity;

    for (const product of availableProducts) {
      if (remainingQuantity <= 0) break;

      const quantityToTake = Math.min(remainingQuantity, product.stockQuantity);
      
      selectedProducts.push({
        donationProductId: product.id!,
        productId: product.product_id,
        quantity: quantityToTake,
        expirationDate: product.expirationDate,
        donationOption: product.donationOption
      });

      remainingQuantity -= quantityToTake;
    }

    return selectedProducts;
  }

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