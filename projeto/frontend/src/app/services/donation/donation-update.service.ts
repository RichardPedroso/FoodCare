import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonationUpdateService {

  constructor(private http: HttpClient) { }

  async confirmDonation(donationId: string): Promise<any> {
    // Buscar dados da doação atual
    const donation = await firstValueFrom(this.http.get(`${environment.api_endpoint}/donation/${donationId}`));
    
    // Atualizar com donation_status = true
    await firstValueFrom(this.http.put(`${environment.api_endpoint}/donation/${donationId}`, {
      id: parseInt(donationId),
      donationDate: (donation as any).donationDate,
      userId: (donation as any).userId,
      donationStatus: true
    }));
    
    // Processar para estoque
    return firstValueFrom(this.http.post(`${environment.api_endpoint}/donation/${donationId}/process-to-stock`, {}));
  }

  async rejectDonation(donationId: string): Promise<any> {
    // Buscar dados da doação atual
    const donation = await firstValueFrom(this.http.get(`${environment.api_endpoint}/donation/${donationId}`));
    
    // Atualizar com donation_status = null (rejeitada)
    return firstValueFrom(this.http.put(`${environment.api_endpoint}/donation/${donationId}`, {
      id: parseInt(donationId),
      donationDate: (donation as any).donationDate,
      userId: (donation as any).userId,
      donationStatus: null
    }));
  }

  updateDonationStatus(donationId: string, status: boolean): Promise<any> {
    return firstValueFrom(this.http.put(`${environment.api_endpoint}/donation/${donationId}/status`, { donation_status: status }));
  }
}