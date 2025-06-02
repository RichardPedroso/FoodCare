import { Injectable } from '@angular/core';
import { UserCredentialDto } from '../../domain/dto/user-credential';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }


  authenticate(credentials: UserCredentialDto) : Observable<any> {
    console.log('autenticando o usuario');

    const headers = new HttpHeaders({
      'content-Type': 'application/json'
    });

    const body = {
      email: credentials.email,
      password: credentials.password,
    }

    return this.http.post<any>('',body, {headers} )
  }
}
