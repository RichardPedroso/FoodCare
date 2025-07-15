import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DonationProduct } from '../../domain/model/donation_product';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DonationProductCreateService {

  constructor(private http: HttpClient) {}

  async create(donationProduct: DonationProduct): Promise<DonationProduct>{
    return await firstValueFrom(this.http.post<DonationProduct>(`${environment.api_endpoint}/donation_product`, donationProduct));
  }
}