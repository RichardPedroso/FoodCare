import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Municipality } from '../../domain/model/municipality';

/**
 * Serviço para leitura de municípios.
 * Consulta informações de localização e endereços.
 */
@Injectable({
  providedIn: 'root'
})
export class MunicipalityReadService {

  constructor(private http: HttpClient) { }

  /** Busca município por ID */
  getById(id: string): Observable<Municipality> {
    return this.http.get<Municipality>(`${environment.api_endpoint}/municipality/${id}`);
  }
}