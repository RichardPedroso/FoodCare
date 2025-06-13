import { Injectable } from '@angular/core';
import { UserCredentialDto } from '../../domain/dto/user-credential';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  // Autentica o usuário no json-server
  authenticate(credentials: UserCredentialDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = `${environment.authentication_api_endpoint}/user?email=${credentials.email}&password=${credentials.password}`;

    console.log('Tentando autenticar usuário com:', credentials);

    return this.http.get<any>(url, { headers });
  }

  addDataToLocalStorage(user: any): void {
    console.log('Armazenando dados completos do usuário no localStorage...');
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  createUser(user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${environment.authentication_api_endpoint}/user`, user, { headers });
  }
}
