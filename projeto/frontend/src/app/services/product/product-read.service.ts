import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../domain/model/product';

@Injectable({
  providedIn: 'root'
})

export class ProductReadService {

  constructor(private http: HttpClient) { }

  findAll(): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(`${environment.api_endpoint}/product`));
  }

  findById(id: string): Promise<Product>{
    return firstValueFrom(this.http.get<Product>(`${environment.api_endpoint}/product/${id}`));
  }
  
}