import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { Donation } from '../../domain/model/donation';
import { DonationProduct } from '../../domain/model/donation_product';

@Injectable({
  providedIn: 'root'
})
export class DonationReadService {

  constructor(private http: HttpClient) { }

  findAll(): Promise<Donation[]> {
    return firstValueFrom(this.http.get<Donation[]>(`${environment.api_endpoint}/donation`));
  }

  findByUserId(userId: string): Promise<Donation[]> {
    return firstValueFrom(this.http.get<Donation[]>(`${environment.api_endpoint}/donation/user/${userId}`));
  }

  findDonationProducts(): Promise<DonationProduct[]> {
    return firstValueFrom(this.http.get<DonationProduct[]>(`${environment.api_endpoint}/donation-product`));
  }
}