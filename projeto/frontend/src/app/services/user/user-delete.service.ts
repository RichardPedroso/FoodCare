import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';

/**
 * Serviço para deleção de usuários.
 * Remove usuários do sistema permanentemente.
 */
@Injectable({
  providedIn: 'root'
})
export class UserDeleteService {

  constructor(private http: HttpClient) {}

  /** Remove um usuário do sistema */
  delete(id: string){
    return firstValueFrom(this.http.delete(`${environment.api_endpoint}/user/${id}`));
  }
}
