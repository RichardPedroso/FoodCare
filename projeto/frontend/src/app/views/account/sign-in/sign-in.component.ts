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

  email = new FormControl(null, [Validators.required, Validators.email]);

  password = new FormControl(null, [Validators.required]);

  hidePassword: boolean = true;

  isLoginIncorrect: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    console.log('sign-in constructor');
  }

  ngOnInit(): void {
    console.log('sign-in ngOnInit');
    this.isLoginIncorrect = false;

    this.loginIfCredentialsIsValid();
  }

  loginIfCredentialsIsValid() {
    console.log('verificando as credenciais...');
    if (this.authenticationService.isAuthenticated()) {
      const user = this.authenticationService.getCurrentUser();
      const userType = user?.userType || user?.user_type;
      if (userType === 'ADMIN' || userType === 'admin') {
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

  validateFields(): boolean {
    return this.email.valid && this.password.valid;
  }

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
          console.log('Resultado da autenticação:', user);
          const userType = user.userType || user.user_type;
          console.log('Tipo de usuário:', userType);

          this.authenticationService.addDataToLocalStorage(user);
          
          if (userType === 'ADMIN' || userType === 'admin') {
            console.log('Usuário identificado como administrador');
            this.router.navigate(['/main/admin/dashboard']);
          } else {
            if (userType === 'DONOR' || userType === 'donor') {
              console.log('Usuário identificado como doador');
              this.router.navigate(['/main']);
            } else if (userType === 'BENEFICIARY' || userType === 'beneficiary') {
              console.log('Usuário identificado como beneficiário');
              if (user.able === false) {
                alert('Você não está apto a receber o auxílio.');
                return;
              }
              if (user.able === undefined || user.able === null) {
                alert('Estamos verificando sua elegibilidade.');
                return;
              }
              this.router.navigate(['/main']);
            } else {
              this.router.navigate(['/main']);
            }
          }
      },
      error: (err) => {
        console.error('Erro ao tentar autenticar no servidor:', err);
        this.isLoginIncorrect = true;
      }
    });
  }
}