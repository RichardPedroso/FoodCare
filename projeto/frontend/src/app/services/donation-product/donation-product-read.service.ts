import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonationProductReadService {

  constructor(private http: HttpClient) { }

  findByDonationId(donationId: number): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${environment.api_endpoint}/donation-product/donation/${donationId}`));
  }
}