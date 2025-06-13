import { Injectable } from '@angular/core';
import { UserCredentialDto } from '../../domain/dto/user-credential';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

authenticate(credentials: UserCredentialDto): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  const body = {
    email: credentials.email,
    password: credentials.password
  };

  const url = `${environment.authentication_api_endpoint}/user?email=${body.email}&password=${body.password}`;

  console.log('Tentando autenticar usuário com:', body);
  console.log('Endpoint chamado:', url);

  return this.http.get<any>(url, { headers });
}

  isAuthenticated(): boolean {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    return email !== null && password !== null;
  }

  addDataToLocalStorage(user: UserCredentialDto) {
    console.log('adicionando dados no cache....')
    localStorage.setItem('email', user.email);
    localStorage.setItem('password', user.password);
  }

  logout() {
    localStorage.clear();
  }

createUser(user: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.post<any>(`${environment.authentication_api_endpoint}/user`, user, { headers });
}

} 
