import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasketItem } from '../../domain/model/basket-item';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasketCalculationService {
  private apiUrl = `${environment.api_endpoint}/basket`;

  constructor(private http: HttpClient) { }

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
}