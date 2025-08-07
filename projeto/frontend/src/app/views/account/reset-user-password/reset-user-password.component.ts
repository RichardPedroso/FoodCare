import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UserUpdateService } from '../../../services/user/user-update.service';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { User } from '../../../domain/model/user';


@Component({
  selector: 'app-reset-user-password',
  templateUrl: './reset-user-password.component.html',
  styleUrls: ['./reset-user-password.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatError,
  ],
})
export class ResetUserPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  showNewPasswordFields = false;
  isOldPasswordInvalid = false;
  passwordMismatch = false;
  currentUser: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userUpdateService: UserUpdateService,
    private authenticationService: AuthenticationService,

  ) {}

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/account/sign-in']);
      return;
    }
    this.initializeForm();
  }

  initializeForm() {
    this.resetForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  checkOldPassword(): void {
    const oldPassword = this.resetForm.controls['oldPassword'].value;
    
    if (this.currentUser && oldPassword === this.currentUser.password) {
      this.isOldPasswordInvalid = false;
      this.showNewPasswordFields = true;
    } else {
      this.isOldPasswordInvalid = true;
      this.showNewPasswordFields = false;
    }
  }

  arePasswordsMatching(): boolean {
    const newPassword = this.resetForm.controls['newPassword'].value;
    const confirmPassword = this.resetForm.controls['confirmPassword'].value;
    return newPassword === confirmPassword;
  }

  async savePassword(): Promise<void> {
    if (!this.resetForm.valid || !this.currentUser?.id) return;

    if (!this.arePasswordsMatching()) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;
    const newPassword = this.resetForm.controls['newPassword'].value;

    try {
      console.log('Atualizando senha para usuário ID:', this.currentUser.id);
      console.log('Nova senha:', newPassword);
      
      await this.userUpdateService.updatePassword(this.currentUser.id, newPassword);
      
      console.log('Senha atualizada com sucesso!');
      alert('Senha alterada com sucesso!');
      this.authenticationService.logout();
      this.router.navigate(['/account/sign-in']);
    } catch (error: any) {
      console.error('Erro ao atualizar a senha:', error);
      alert('Erro ao atualizar a senha. Tente novamente.');
    }
  }
}