import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { DonationStatus } from '../../domain/enums/donation-status.enum';

/**
 * Serviço para gerenciamento de status de doações.
 * Controla o ciclo de vida das doações (em estoque, utilizada, rejeitada).
 */
@Injectable({
  providedIn: 'root'
})
export class DonationStatusService {

  constructor(private http: HttpClient) { }

  /**
   * Marca doações como utilizadas baseado no consumo de produtos.
   * Implementa algoritmo FIFO para consumir doações mais antigas primeiro.
   */
  async markDonationsAsUsed(productId: string, quantityUsed: number): Promise<void> {
    try {
      // Buscar doações em estoque para este produto
      const donations = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/donation`)
      );
      
      const donationProducts = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/donation_product/product/${productId}`)
      );
      
      // Filtrar doações em estoque do produto específico
      const relevantDonations = donations.filter(d => d.donationStatus === DonationStatus.EM_ESTOQUE);
      
      let remainingQuantity = quantityUsed;
      
      // Processar doações em ordem (FIFO)
      for (const donation of relevantDonations) {
        if (remainingQuantity <= 0) break;
        
        const donationProduct = donationProducts.find(dp => 
          dp.donationId === donation.id && dp.productId == productId
        );
        
        if (donationProduct) {
          const donationQuantity = parseInt(donationProduct.unit || '1');
          
          if (donationQuantity <= remainingQuantity) {
            // Marcar toda a doação como utilizada
            await firstValueFrom(
              this.http.put(`${environment.api_endpoint}/donation/${donation.id}`, {
                ...donation,
                donationStatus: DonationStatus.UTILIZADA
              })
            );
            remainingQuantity -= donationQuantity;
          }
        }
      }
    } catch (error) {
      console.error('Erro ao marcar doações como utilizadas:', error);
    }
  }

  /**
   * Atualiza o status de uma doação específica.
   * Mantém outros dados da doação inalterados.
   */
  async updateDonationStatus(donationId: string, status: string): Promise<void> {
    try {
      const donation = await firstValueFrom(
        this.http.get(`${environment.api_endpoint}/donation/${donationId}`)
      );
      
      await firstValueFrom(
        this.http.put(`${environment.api_endpoint}/donation/${donationId}`, {
          ...donation,
          donationStatus: status
        })
      );
    } catch (error) {
      console.error('Erro ao atualizar status da doação:', error);
      throw error;
    }
  }
}