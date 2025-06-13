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
import { UserCredentialDto } from '../../../domain/dto/user-credential';

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

export class SignInComponent {

  email = new FormControl(null);

  password = new FormControl(null, [Validators.minLength(6), Validators.maxLength(18)]);

  hidePassword: boolean = true;

  isLoginIncorrect: boolean = false;

  constructor(private router: Router, private authenticationService: AuthenticationService,) {
    console.log('sign-in constructor');
  }

  ngOnInit(): void {
    console.log('sign-in ngOnInit');
    this.isLoginIncorrect = false;

    //this.loginIfCredentialsIsValid();
  }

  loginIfCredentialsIsValid() {
    console.log('verificando as credenciais...');
    if (this.authenticationService.isAuthenticated()) {
      console.log('credeciais validas, navegando para tela principal')
      this.router.navigate(['']);
      return;
    }

    console.log('credenciais invaidas ou nao existem no cache')
  }

  validateFields(): boolean {
    return this.email.valid && this.password.valid;
  }

login() {
  console.log('Botão de login clicado');

  let credentials: UserCredentialDto = {
    email: this.email.value!,
    password: this.password.value!,
  };

  console.log('Credenciais submetidas:', credentials);

  this.authenticationService.authenticate(credentials)
    .subscribe({
      next: (users: any[]) => {
        console.log('Resultado da busca no json-server:', users);

        if (users.length > 0) {
          const user = users[0];
          console.log('Login bem-sucedido. Usuário encontrado:', user);

          this.authenticationService.addDataToLocalStorage(user);
          this.router.navigate(['/home']);
        } else {
          console.warn('Login falhou. Nenhum usuário encontrado com essas credenciais.');
          this.isLoginIncorrect = true;
        }
      },
      error: (err) => {
        console.error('Erro ao tentar autenticar no servidor:', err);
        this.isLoginIncorrect = true;
      }
    });
}
}
