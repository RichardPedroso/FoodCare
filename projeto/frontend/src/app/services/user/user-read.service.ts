import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { User } from '../../domain/model/user';

/**
 * Serviço para leitura de usuários.
 * Consulta informações de usuários cadastrados no sistema.
 */
@Injectable({
  providedIn: 'root'
})
export class UserReadService {

  constructor(private http: HttpClient) { }

  /** Busca todos os usuários cadastrados */
  findAll(): Promise<any> {
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/user`));
  }

  /** Busca usuário por ID */
  findById(id: String): Promise<User>{
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/user/${id}`));
  }

  /** Busca usuário por email */
  findByEmail(email: String): Promise<User>{
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/user/?email=${email}`));
  }
}
