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
    console.log('autenticando usuario');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      email: credentials.email,
      password: credentials.password
    }

    //return this.http.post<any>('http://localhost:8080/authenticate', body, { headers });

    return this.http.get<any>(`${environment.authentication_api_endpoint}/user/1`);
  }

  isAuthenticated(): boolean {
    let email = localStorage.getItem('email');
    if (email != null && email === 'tiburcinhao@gmail.com') {
      console.log(`email encontrado: ${email}`);
      return true;
    }
    return false;
  }

  addDataToLocalStorage(user: UserCredentialDto) {
    console.log('adicionando dados no cache....')
    localStorage.setItem('email', user.email);
    localStorage.setItem('password', user.password);
  }

  logout() {
    localStorage.clear();
  }

} 
