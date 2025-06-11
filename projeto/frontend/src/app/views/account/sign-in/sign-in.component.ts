import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
      MatInputModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {

  email = new FormControl(null);

  password = new FormControl(null, [Validators.minLength(2), Validators.maxLength(4)]);

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
    console.log('botao de login clicado');

    let credentials: UserCredentialDto = {
      email: this.email.value!,
      password: this.password.value!,
    };

    console.log(credentials);

    this.authenticationService.authenticate(credentials)

      .subscribe({
        next: (value: any) => {
          console.log(value);

          let user: UserCredentialDto = {

            email: value.email,
            password: value.password

          }


          this.authenticationService.addDataToLocalStorage(user);

          this.router.navigate(['']);

        },
        error: (err) => {
          console.error('ocorreu um erro no servidor');
          console.error(err);
        }
      });
  }
}
