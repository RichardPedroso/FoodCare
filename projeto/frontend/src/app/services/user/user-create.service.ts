import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../domain/model/user';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserCreateService {

  constructor(private http: HttpClient) {}

  async create(user: User): Promise<User>{
    console.log(user);
    return await firstValueFrom(this.http.post<User>(`${environment.api_endpoint}/user`, user));
  }
}
