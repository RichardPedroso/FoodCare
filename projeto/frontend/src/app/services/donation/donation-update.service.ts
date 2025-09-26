import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { DonationStatus } from '../../domain/enums/donation-status.enum';

/**
 * Serviço para atualização de doações.
 * Gerencia aprovação, rejeição e processamento de doações para estoque.
 */
@Injectable({
  providedIn: 'root'
})
export class DonationUpdateService {

  constructor(private http: HttpClient) { }

  /**
   * Confirma uma doação e a processa para o estoque.
   * Atualiza status para "Em estoque" e integra com sistema de estoque.
   */
  async confirmDonation(donationId: string): Promise<any> {
    // Buscar dados da doação atual
    const donation = await firstValueFrom(this.http.get(`${environment.api_endpoint}/donation/${donationId}`));
    
    // Atualizar com donation_status = "Em estoque"
    await firstValueFrom(this.http.put(`${environment.api_endpoint}/donation/${donationId}`, {
      id: parseInt(donationId),
      donationDate: (donation as any).donationDate,
      userId: (donation as any).userId,
      donationStatus: DonationStatus.EM_ESTOQUE
    }));
    
    // Processar para estoque automaticamente
    return firstValueFrom(this.http.post(`${environment.api_endpoint}/donation/${donationId}/process-to-stock`, {}));
  }

  /**
   * Rejeita uma doação.
   * Atualiza status para "Rejeitada" sem processar para estoque.
   */
  async rejectDonation(donationId: string): Promise<any> {
    // Buscar dados da doação atual
    const donation = await firstValueFrom(this.http.get(`${environment.api_endpoint}/donation/${donationId}`));
    
    // Atualizar com donation_status = "Rejeitada"
    return firstValueFrom(this.http.put(`${environment.api_endpoint}/donation/${donationId}`, {
      id: parseInt(donationId),
      donationDate: (donation as any).donationDate,
      userId: (donation as any).userId,
      donationStatus: DonationStatus.REJEITADA
    }));
  }

  /** Atualiza status genérico de uma doação */
  updateDonationStatus(donationId: string, status: boolean): Promise<any> {
  return firstValueFrom(this.http.put(`${environment.api_endpoint}/donation/${donationId}/status`, { donationStatus: status }));
  }
}