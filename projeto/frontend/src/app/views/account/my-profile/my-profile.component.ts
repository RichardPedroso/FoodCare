import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { MunicipalityReadService } from '../../../services/municipality/municipality-read.service';
import { UserReadService } from '../../../services/user/user-read.service';
import { Municipality } from '../../../domain/model/municipality';

/**
 * Componente responsável pela exibição do perfil do usuário
 * Mostra informações pessoais, de contato e endereço do usuário logado
 * Atualiza automaticamente os dados do localStorage com informações frescas do servidor
 */
@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  user: any; // Dados do usuário atual
  municipality: Municipality | null = null; // Dados do município do usuário

  constructor(
    private authenticationService: AuthenticationService,
    private municipalityReadService: MunicipalityReadService,
    private userReadService: UserReadService
  ) {}

  /**
   * Inicializa o componente carregando dados atualizados do usuário
   * Busca informações frescas do servidor e atualiza o localStorage
   * Carrega dados do município associado ao usuário
   */
  async ngOnInit(): Promise<void> {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser?.id) {
      try {
        // Busca dados atualizados do usuário no servidor
        this.user = await this.userReadService.findById(currentUser.id.toString());
        // Atualiza o localStorage com os dados mais recentes
        this.authenticationService.addDataToLocalStorage(this.user);
        
        // Busca dados do município do usuário
        const municipalityId = this.user?.municipalityId || this.user?.municipality_id;
        if (municipalityId) {
          this.municipalityReadService.getById(municipalityId.toString()).subscribe({
            next: (municipality) => {
              this.municipality = municipality;
            },
            error: (error) => {
              console.error('Erro ao buscar municipality:', error);
            }
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Fallback para dados do localStorage se a requisição falhar
        this.user = currentUser;
      }
    }
  }

  /**
   * Formata número de telefone para exibição
   * Aplica máscara (XX) XXXXX-XXXX para telefones de 11 dígitos
   * @param phone - Número de telefone sem formatação
   * @returns Número formatado ou string original se não for válido
   */
  formatPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    return phone;
  }

  /**
   * Formata CEP para exibição
   * Trata valores nulos, indefinidos ou strings inválidas
   * @param zipCode - Código postal do usuário
   * @returns CEP formatado ou mensagem padrão se não informado
   */
  formatZipCode(zipCode: string | undefined): string {
    if (!zipCode || zipCode === 'undefined' || zipCode === 'null') {
      return 'Não informado';
    }
    return zipCode;
  }


}