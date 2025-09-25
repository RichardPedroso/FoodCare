import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductReadService } from './product-read.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Product } from '../../domain/model/product';

/**
 * Serviço para atualização de produtos.
 * Gerencia modificações em produtos existentes.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductUpdateService {

  constructor(private http: HttpClient, private productReadService: ProductReadService) { }

  /**
   * Atualiza estoque de um produto.
   * Nota: Estoque agora é gerenciado em tabela separada.
   */
  async updateStock(id: string, quantity: number): Promise<Product>{
    console.log('ProductUpdateService.updateStock chamado com:', { id, quantity });
    
    const productToUpdate: Product = await this.productReadService.findById(id);
    console.log('Produto encontrado:', productToUpdate);
    
    if(!productToUpdate){
      throw new Error('Produto não encontrado');
    }

    // Stock agora é gerenciado na tabela stock separada
    console.log(`Atualizando stock para produto ${id} com quantidade ${quantity}`);

    const result = await firstValueFrom(this.http.put<Product>(`${environment.api_endpoint}/product/${id}`, productToUpdate));
    console.log('Produto atualizado:', result);
    
    return result;
  }

}