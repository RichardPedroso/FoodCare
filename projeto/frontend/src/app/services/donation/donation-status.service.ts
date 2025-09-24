import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { DonationStatus } from '../../domain/enums/donation-status.enum';

@Injectable({
  providedIn: 'root'
})
export class DonationStatusService {

  constructor(private http: HttpClient) { }

  async markDonationsAsUsed(productId: string, quantityUsed: number): Promise<void> {
    try {
      // Buscar doações em estoque para este produto
      const donations = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/donation`)
      );
      
      const donationProducts = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/donation_product`)
      );
      
      // Filtrar doações em estoque do produto específico
      const relevantDonations = donations.filter(d => d.donationStatus === DonationStatus.EM_ESTOQUE);
      
      let remainingQuantity = quantityUsed;
      
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