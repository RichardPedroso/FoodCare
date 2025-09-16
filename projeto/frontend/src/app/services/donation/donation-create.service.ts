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