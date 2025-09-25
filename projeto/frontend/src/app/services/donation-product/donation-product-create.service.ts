import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DonationProduct } from '../../domain/model/donation_product';
import { DonationValidationService } from './donation-validation.service';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

/**
 * Serviço para criação de produtos de doação.
 * Gerencia a associação entre doações e produtos com validação de datas.
 */
@Injectable({
  providedIn: 'root'
})
export class DonationProductCreateService {

  constructor(
    private http: HttpClient,
    private validationService: DonationValidationService
  ) {}

  /**
   * Cria um produto de doação com validação de data de vencimento.
   * Verifica se a data de vencimento é adequada antes de criar.
   */
  async create(donationProduct: any): Promise<any>{
    // Validar data de vencimento se fornecida
    if (donationProduct.expirationDate) {
      const validation = this.validationService.validateExpirationDate(new Date(donationProduct.expirationDate));
      
      if (!validation.valid) {
        throw new Error(validation.message);
      }
    }

    return await firstValueFrom(this.http.post<any>(`${environment.api_endpoint}/donation-product`, donationProduct));
  }
}