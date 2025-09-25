import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Municipality } from '../../domain/model/municipality';

/**
 * Serviço para criação de municípios.
 * Cadastra novas informações de localização e endereços.
 */
@Injectable({
  providedIn: 'root'
})
export class MunicipalityCreateService {

  constructor(private http: HttpClient) { }

  /** Cria um novo município no sistema */
  async create(municipality: Municipality): Promise<Municipality> {
    return this.http.post<Municipality>(`${environment.api_endpoint}/municipality`, municipality).toPromise() as Promise<Municipality>;
  }
}