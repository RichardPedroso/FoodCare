import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Donation } from '../../domain/model/donation';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DonationCreateService {

  constructor(private http: HttpClient) {}

  async create(donation: Donation): Promise<Donation>{
    return await firstValueFrom(this.http.post<Donation>(`${environment.api_endpoint}/donation`, donation));
  }
}