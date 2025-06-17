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

  // Autentica o usuário no json-server
  authenticate(credentials: UserCredentialDto): Observable<any> {
    console.log("Autenticando o usuario");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const urlCredentials = `${environment.authentication_api_endpoint}/user?email=${credentials.email}&password=${credentials.password}`;

    return this.http.get<User[]>(urlCredentials, {headers}).pipe(
      map(users => {
        if(users.length > 0){
          return users[0];
        }else{
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
  }

}
