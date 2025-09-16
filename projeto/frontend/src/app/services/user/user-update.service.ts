import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserReadService } from './user-read.service';
import { first, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../../domain/model/user';
import { UpdateUserDto } from '../../domain/dto/update-user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserUpdateService {

  constructor(private http: HttpClient, private userReadService: UserReadService) { }

  async update(id: string, nameOrUser: string | User): Promise<any>{
    if (typeof nameOrUser === 'string') {
      // Comportamento original - atualizar apenas o nome
      let userToUpdate: User = await this.userReadService.findById(id);
      if(userToUpdate == null){
        throw new Error('Usuário não encontrado');
      }
      userToUpdate.name = nameOrUser;
      return firstValueFrom(this.http.put<any>(`${environment.api_endpoint}/user/${id}`, userToUpdate));
    } else {
      // Novo comportamento - atualizar com objeto User completo
      const updateUserDto = {
        id: parseInt(id),
        name: nameOrUser.name,
        email: nameOrUser.email,
        phone: nameOrUser.phone,
        userType: nameOrUser.userType,
        familyIncome: nameOrUser.familyIncome || 0,
        peopleQuantity: nameOrUser.peopleQuantity || 1,
        municipalityId: nameOrUser.municipalityId || 0,
        hasChildren: nameOrUser.hasChildren || false,
        able: nameOrUser.able
      };
      return firstValueFrom(this.http.put<any>(`${environment.api_endpoint}/user/${id}`, updateUserDto));
    }
  }

  async updatePassword(id: string, newPassword: string): Promise<any>{
    console.log('UserUpdateService: Buscando usuário com ID:', id);
    const userToUpdate: User | null = await this.userReadService.findById(id);
    
    console.log('UserUpdateService: Usuário encontrado:', userToUpdate);

    if(!userToUpdate){
      throw new Error('Usuário não encontrado');  
    }

    console.log('UserUpdateService: Senha atual:', userToUpdate.password);
    userToUpdate.password = newPassword;
    console.log('UserUpdateService: Nova senha:', userToUpdate.password);
    
    const updateUrl = `${environment.api_endpoint}/user/${id}`;
    console.log('UserUpdateService: URL de atualização:', updateUrl);
    console.log('UserUpdateService: Dados a serem enviados:', userToUpdate);

    const result = await firstValueFrom(this.http.put<User>(updateUrl, userToUpdate));
    console.log('UserUpdateService: Resultado da atualização:', result);
    
    return result;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const updateUrl = `${environment.api_endpoint}/user/${updateUserDto.id}`;
    return firstValueFrom(this.http.put<User>(updateUrl, updateUserDto));
  }

  async updateUserProfile(id: string, userData: Partial<User>): Promise<User> {
    const userToUpdate: User | null = await this.userReadService.findById(id);
    
    if(!userToUpdate){
      throw new Error('Usuário não encontrado');  
    }

    // Atualizar apenas os campos fornecidos
    Object.assign(userToUpdate, userData);
    
    const updateUrl = `${environment.api_endpoint}/user/${id}`;
    return firstValueFrom(this.http.put<User>(updateUrl, userToUpdate));
  }

}
