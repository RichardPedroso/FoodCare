import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatInputModule } from '@angular/material/input';

import * as fontawesome from '@fortawesome/free-solid-svg-icons'
import { AuthenticationService } from '../../../services/security/authentication.service';
import { UserCredentialDto } from '../../../domain/dto/user-credential-dto';
import { User } from '../../../domain/model/user';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente responsável pela autenticação de usuários no sistema
 * Gerencia login com email e senha, validação de credenciais
 * Redireciona usuários para áreas específicas baseado no tipo (admin, donor, beneficiary)
 * Implementa verificações de elegibilidade para beneficiários
 */
@Component({
  selector: 'app-sign-in',
  imports: [
      RouterOutlet,
      RouterLink,
      MatToolbarModule,
      FormsModule,
      MatButtonModule,
      MatSidenavModule,
      MatMenuModule,
      MatIconModule,
      MatListModule,
      MatExpansionModule,
      MatTooltipModule,
      FontAwesomeModule,
      ReactiveFormsModule,
      MatInputModule,
    ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})

export class SignInComponent{

  email = new FormControl(null, [Validators.required, Validators.email]); // Campo de email com validação

  password = new FormControl(null, [Validators.required]); // Campo de senha obrigatório

  hidePassword: boolean = true; // Controla visibilidade da senha

  isLoginIncorrect: boolean = false; // Flag para indicar credenciais inválidas

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
    console.log('sign-in constructor');
  }

  ngOnInit(): void {
    console.log('sign-in ngOnInit');
    this.isLoginIncorrect = false;

    // Verifica se já existe usuário logado e redireciona automaticamente
    this.loginIfCredentialsIsValid();
  }

  /**
   * Verifica se existem credenciais válidas no localStorage
   * Redireciona automaticamente usuários já autenticados para suas áreas
   * Administradores vão para dashboard, outros usuários para tela principal
   */
  loginIfCredentialsIsValid() {
    console.log('verificando as credenciais...');
    if (this.authenticationService.isAuthenticated()) {
      const user = this.authenticationService.getCurrentUser();
      const userType = user?.userType;
      if (userType === 'admin' || user?.userType === 'admin') {
        console.log('credenciais validas, navegando para dashboard admin')
        this.router.navigate(['/main/admin/dashboard']);
      } else {
        console.log('credenciais validas, navegando para tela principal')
        this.router.navigate(['/main']);
      }
      return;
    }

    console.log('credenciais invalidas ou nao existem no cache')
  }

  /**
   * Valida se os campos de email e senha estão preenchidos corretamente
   * @returns true se ambos os campos são válidos, false caso contrário
   */
  validateFields(): boolean {
    return this.email.valid && this.password.valid;
  }

  /**
   * Executa o processo de autenticação do usuário
   * Valida credenciais no backend e redireciona baseado no tipo de usuário
   * Implementa verificações especiais para beneficiários (elegibilidade)
   * Armazena dados do usuário no localStorage após autenticação bem-sucedida
   */
  login() {
    console.log('Botão de login clicado');

    const credentials: UserCredentialDto = {
      email: this.email.value!,
      password: this.password.value!,
    };

    console.log('Credenciais submetidas:', credentials);

    this.authenticationService.authenticate(credentials)
      .subscribe({
        next: (user: User) => {
          console.log('Resultado da busca no backend:', user);
          console.log('user.userType:', user.userType);
          console.log('user.userType:', user.userType);
          console.log('Tipo de usuário final:', user.userType || user.userType);

          // Armazena dados do usuário no localStorage
          this.authenticationService.addDataToLocalStorage(user);
          
          const userType = user.userType;
          console.log('UserType processado:', userType);
          
          // Redireciona baseado no tipo de usuário
          if (userType === 'admin' || user.userType === 'admin') {
            console.log('Usuário identificado como administrador');
            this.router.navigate(['/main/admin/dashboard']);
          } else if (userType === 'donor') {
            console.log('Usuário identificado como doador');
            this.router.navigate(['/main']);
          } else if (userType === 'beneficiary') {
            console.log('Usuário identificado como beneficiário');
            // Verifica elegibilidade do beneficiário
            if (user.able === false) {
              this.toastr.warning('Você não está apto a receber o auxílio.');
              return;
            }
            if (user.able === undefined) {
              this.toastr.info('Estamos verificando sua elegibilidade.');
              return;
            }
            this.router.navigate(['/main']);
          } else {
            console.log('Tipo de usuário não reconhecido:', userType);
            this.router.navigate(['/main']);
          }
      },
      error: (err) => {
        console.error('Erro ao tentar autenticar no servidor:', err);
        console.log('Detalhes do erro:', err.error);
        
        if (err.status === 401) {
          // Para usuários não aptos, mostrar mensagem específica
          this.toastr.warning('Credenciais inválidas ou usuário não autorizado.');
          return;
        }
        
        this.isLoginIncorrect = true;
      }
    });
  }
}