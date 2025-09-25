import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { User } from '../../../domain/model/user';
import { filter } from 'rxjs/operators';

/**
 * Componente principal da área autenticada do sistema
 * Gerencia navegação, menu lateral e informações do usuário
 * Controla exibição de conteúdo baseado no tipo de usuário
 * Implementa funcionalidade de logout
 */
@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent implements OnInit {
  
  user: User | null = null; // Dados do usuário atual
  userType: 'donor' | 'beneficiary' = 'donor'; // Tipo do usuário para controle de menu
  userName: string = ''; // Nome do usuário para exibição
  isChildRouteActive: boolean = false; // Controla se uma rota filha está ativa

  ngOnInit(): void {
    // Carrega dados do usuário atual
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userName = this.user.name;
      const rawUserType = this.user.userType || this.user.user_type;
      this.userType = rawUserType?.toLowerCase() as 'donor' | 'beneficiary';
    }
    
    // Monitora mudanças de rota para controlar exibição do conteúdo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isChildRouteActive = event.url !== '/main' && event.url !== '/main/';
    });
  }

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  /**
   * Executa logout do usuário
   * Remove dados do localStorage e redireciona para tela de login
   */
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/account/sign-in']);
  }

}