import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Municipality } from '../../domain/model/municipality';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityCreateService {

  constructor(private http: HttpClient) { }

  async create(municipality: Municipality): Promise<Municipality> {
    return this.http.post<Municipality>(`${environment.authentication_api_endpoint}/municipality`, municipality).toPromise() as Promise<Municipality>;
  }
}