import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductReadService } from './product-read.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Product } from '../../domain/model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductUpdateService {

  constructor(private http: HttpClient, private productReadService: ProductReadService) { }

  async updateStock(id: string, quantity: number): Promise<Product>{
    console.log('ProductUpdateService.updateStock chamado com:', { id, quantity });
    
    const productToUpdate: Product = await this.productReadService.findById(id);
    console.log('Produto encontrado:', productToUpdate);
    
    if(!productToUpdate){
      throw new Error('Produto não encontrado');
    }

    const oldStock = productToUpdate.stock;
    productToUpdate.stock += quantity;
    console.log(`Atualizando stock de ${oldStock} para ${productToUpdate.stock}`);

    const result = await firstValueFrom(this.http.put<Product>(`${environment.api_endpoint}/product/${id}`, productToUpdate));
    console.log('Produto atualizado:', result);
    
    return result;
  }

}