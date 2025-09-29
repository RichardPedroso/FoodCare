import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { Donation } from '../../domain/model/donation';
import { DonationProduct } from '../../domain/model/donation-product';

/**
 * Serviço para leitura de doações.
 * Fornece métodos para consultar doações e produtos associados.
 */
@Injectable({
  providedIn: 'root'
})
export class DonationReadService {

  constructor(private http: HttpClient) { }

  /** Busca todas as doações cadastradas no sistema */
  findAll(): Promise<Donation[]> {
    return firstValueFrom(this.http.get<Donation[]>(`${environment.api_endpoint}/donation`));
  }

  /** Busca doações de um usuário específico */
  findByUserId(userId: string): Promise<Donation[]> {
    return firstValueFrom(this.http.get<Donation[]>(`${environment.api_endpoint}/donation/user/${userId}`));
  }

  /** Busca todos os produtos associados às doações */
  findDonationProducts(): Promise<DonationProduct[]> {
    return firstValueFrom(this.http.get<DonationProduct[]>(`${environment.api_endpoint}/donation_product`));
  }


}