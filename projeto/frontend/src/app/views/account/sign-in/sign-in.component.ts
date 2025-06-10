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
  imports: [RouterOutlet,
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
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  email: string = 'usuario@exemplo.com';

  fullname = new FormControl('');
  password = new FormControl('');
  repeatNewPassword = new FormControl('');

  passwordUpdateError: boolean = false;

  updateProfile() {
    console.log('Nome completo:', this.fullname.value);
    // Lógica de atualização de nome aqui
  }

  updatePassword() {
    if (this.password.value !== this.repeatNewPassword.value) {
      this.passwordUpdateError = true;
      return;
    }

    console.log('Atualizando senha:', this.password.value);
    // Lógica de atualização de senha aqui
    this.passwordUpdateError = false;
  }
}
