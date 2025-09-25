import { Injectable } from '@angular/core';
import { UserCredentialDto } from '../../domain/dto/user-credential-dto';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { User } from '../../domain/model/user';

/**
 * Serviço de autenticação do frontend.
 * Gerencia login, logout e persistência de sessão no localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  /**
   * Autentica usuário no backend Spring Boot.
   * Valida credenciais e retorna dados do usuário autenticado.
   */
  authenticate(credentials: UserCredentialDto): Observable<any> {
    console.log("Autenticando o usuario");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const urlCredentials = `${environment.authentication_api_endpoint}/authenticate`;

    return this.http.post<any>(urlCredentials, credentials, {headers}).pipe(
      map(response => {
        console.log('Resposta completa do backend:', response);
        if(response && response.user){
          console.log('Usuário extraido da resposta:', response.user);
          return response.user;
        }else{
          throw new Error('Credenciais inválidas')
        }
      })
    )
  }

  /** Armazena dados do usuário no localStorage para persistência de sessão */
  addDataToLocalStorage(user: User): void {
    console.log('Armazenando dados completos do usuário no localStorage...');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  /** Verifica se o usuário está autenticado */
  isAuthenticated(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return localStorage.getItem('user') !== null;
  }

  /** Recupera dados do usuário atual do localStorage */
  getCurrentUser(): User | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) as User : null;
  }

  /** Remove dados do usuário e encerra sessão */
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

}
