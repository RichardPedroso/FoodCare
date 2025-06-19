import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { User } from '../../domain/model/user';

@Injectable({
  providedIn: 'root'
})

export class UserReadService {

  constructor(private http: HttpClient) { }

  findAll(): Promise<any> {

    // para consumir este metodo, basta utilizar a palavra chave: await
    //exemplo:
    //let variavel = await user.ReadService.findAll();

    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/user`));
  }

  findById(id: String): Promise<User>{
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/user/${id}`));
  }

  findByEmail(email: String): Promise<User>{
    return firstValueFrom(this.http.get<any>(`${environment.api_endpoint}/user/?email=${email}`));
  }
  
}
