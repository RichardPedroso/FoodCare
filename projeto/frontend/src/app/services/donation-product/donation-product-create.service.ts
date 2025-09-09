import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DonationProduct } from '../../domain/model/donation_product';
import { DonationValidationService } from './donation-validation.service';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DonationProductCreateService {

  constructor(
    private http: HttpClient,
    private validationService: DonationValidationService
  ) {}

  async create(donationProduct: DonationProduct): Promise<DonationProduct>{
    const validation = this.validationService.validateExpirationDate(donationProduct.expirationDate);
    
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    return await firstValueFrom(this.http.post<DonationProduct>(`${environment.api_endpoint}/donation_product`, donationProduct));
  }
}