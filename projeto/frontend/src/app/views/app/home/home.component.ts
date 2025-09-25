import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Router } from '@angular/router';
import { UserReadService } from '../../../services/user/user-read.service';
import { User } from '../../../domain/model/user';

/**
 * Componente responsável pela página inicial do sistema
 * Exibe dashboard personalizado baseado no tipo de usuário
 * Redireciona administradores automaticamente para o painel admin
 * Permite alternância entre visões de doador e beneficiário
 */
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  
  user: User | null = null; // Dados do usuário atual
  userName: string | undefined; // Nome do usuário para exibição
  selectedType: 'donor' | 'beneficiary' = 'donor'; // Tipo de visão selecionada

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtém dados do usuário atual do localStorage
    this.user = this.authenticationService.getCurrentUser();
    this.userName = this.user?.name;
    
    // Redireciona administradores para o dashboard administrativo
    if (this.user?.user_type === 'admin' || this.user?.userType === 'admin') {
      this.router.navigate(['/main/admin/dashboard']);
    }
  }

  /**
   * Alterna entre as visões de doador e beneficiário na página inicial
   * Permite que usuários vejam diferentes opções de ações disponíveis
   * @param type - Tipo de visão a ser exibida ('donor' ou 'beneficiary')
   */
  alternate(type: 'donor' | 'beneficiary'): void {
    this.selectedType = type;
  }

}