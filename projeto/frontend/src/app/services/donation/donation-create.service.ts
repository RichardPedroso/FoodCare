import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Donation } from '../../domain/model/donation';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

/**
 * Serviço para criação de doações.
 * Gerencia o cadastro de novas doações simples e completas com produtos.
 */
@Injectable({
  providedIn: 'root'
})
export class DonationCreateService {

  constructor(private http: HttpClient) {}

  /**
   * Cria uma doação simples (apenas cabeçalho).
   * Converte dados do frontend para formato esperado pelo backend.
   */
  async create(donation: Donation): Promise<Donation>{
    // Converter para o formato esperado pelo backend
    const donationData = {
  donationDate: donation.donationDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
  userId: donation.userId,
  donationStatus: donation.donationStatus
    };
    return await firstValueFrom(this.http.post<Donation>(`${environment.api_endpoint}/donation`, donationData));
  }

  /**
   * Cria doação completa com produtos em uma única operação.
   * Processa automaticamente para o estoque após criação.
   */
  async createComplete(donation: any): Promise<boolean>{
    try {
      return await firstValueFrom(this.http.post<boolean>(`${environment.api_endpoint}/donation/complete`, donation));
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      if (error.error) {
        console.error('Resposta do servidor:', error.error);
      }
      throw error;
    }
  }
}