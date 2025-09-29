import { DonationProduct } from '../../domain/model/donation-product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

/**
 * Serviço para leitura de produtos de doação.
 * Consulta produtos associados a doações específicas.
 */
@Injectable({
  providedIn: 'root'
})
export class DonationProductReadService {

  constructor(private http: HttpClient) { }

  /** Busca todos os produtos associados a uma doação específica */
  findByDonationId(donationId: number): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${environment.api_endpoint}/donation_product/donation/${donationId}`));
  }
}