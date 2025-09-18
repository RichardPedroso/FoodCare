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

@Injectable({
  providedIn: 'root'
})
export class StockReadService {

  constructor(private http: HttpClient) { }

  findAll(): Promise<Stock[]> {
    return firstValueFrom(this.http.get<Stock[]>(`${environment.api_endpoint}/stock`));
  }

  findByProductId(productId: number): Promise<Stock[]> {
    return firstValueFrom(this.http.get<Stock[]>(`${environment.api_endpoint}/stock/product/${productId}`));
  }
}