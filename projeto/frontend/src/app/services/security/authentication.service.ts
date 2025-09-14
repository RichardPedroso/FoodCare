import { Injectable } from '@angular/core';
import { UserCredentialDto } from '../../domain/dto/user-credential-dto';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { User } from '../../domain/model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  // Autentica o usuário no backend Spring Boot
  authenticate(credentials: UserCredentialDto): Observable<any> {
    console.log("Autenticando o usuario");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const authData = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post<any>(`${environment.authentication_api_endpoint}/authenticate`, authData, {headers}).pipe(
      map(response => {
        if(response && response.user){
          // Armazena o token JWT se fornecido
          if(response.token) {
            localStorage.setItem('token', response.token);
          }
          return response.user;
        } else {
          throw new Error('Credenciais inválidas')
        }
      })
    )
  }

  addDataToLocalStorage(user: User): void {
    console.log('Armazenando dados completos do usuário no localStorage...');
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) as User : null;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

}
