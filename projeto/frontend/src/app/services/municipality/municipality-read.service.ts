import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Municipality } from '../../domain/model/municipality';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityReadService {

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<Municipality> {
    return this.http.get<Municipality>(`${environment.authentication_api_endpoint}/municipality/${id}`);
  }
}