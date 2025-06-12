import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class UserDeleteService {

  constructor(private http: HttpClient) {}

    delete(id: string){
      return firstValueFrom(this.http.delete(`${environment.api_endpoint}/user/${id}`));
    }
   
}
