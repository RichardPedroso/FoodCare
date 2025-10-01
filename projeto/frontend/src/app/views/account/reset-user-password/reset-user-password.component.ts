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
import { ToastrService } from 'ngx-toastr';

/**
 * Componente responsável pela alteração de senha de usuários logados
 * Permite que usuários autenticados alterem suas senhas
 * Requer confirmação da senha atual antes de definir a nova
 * Realiza logout automático após alteração bem-sucedida
 */
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
  resetForm!: FormGroup; // Formulário reativo para alteração de senha
  showNewPasswordFields = false; // Controla exibição dos campos de nova senha
  isOldPasswordInvalid = false; // Flag para indicar senha atual incorreta
  passwordMismatch = false; // Flag para indicar se nova senha e confirmação não coincidem
  currentUser: User | null = null; // Dados do usuário atual logado

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userUpdateService: UserUpdateService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Obtém o usuário atual do serviço de autenticação
    this.currentUser = this.authenticationService.getCurrentUser();
    if (!this.currentUser) {
      // Redireciona para login se não houver usuário logado
      this.router.navigate(['/account/sign-in']);
      return;
    }
    this.initializeForm();
  }

  /**
   * Inicializa o formulário de alteração de senha
   * Configura validações para senha atual, nova senha e confirmação
   */
  initializeForm() {
    this.resetForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  /**
   * Verifica se a senha atual informada está correta
   * Usa o backend para validar senha criptografada
   * Exibe campos de nova senha apenas se a senha atual estiver correta
   */
  checkOldPassword(): void {
    const oldPassword = this.resetForm.controls['oldPassword'].value;
    
    if (!this.currentUser || !oldPassword) {
      this.isOldPasswordInvalid = true;
      this.showNewPasswordFields = false;
      return;
    }

    // Valida senha atual usando o serviço de autenticação
    const credentials = {
      email: this.currentUser.email,
      password: oldPassword
    };

    this.authenticationService.authenticate(credentials).subscribe({
      next: (user) => {
        this.isOldPasswordInvalid = false;
        this.showNewPasswordFields = true;
      },
      error: (err) => {
        this.isOldPasswordInvalid = true;
        this.showNewPasswordFields = false;
      }
    });
  }

  /**
   * Verifica se a nova senha e sua confirmação são idênticas
   * @returns true se as senhas coincidem, false caso contrário
   */
  arePasswordsMatching(): boolean {
    const newPassword = this.resetForm.controls['newPassword'].value;
    const confirmPassword = this.resetForm.controls['confirmPassword'].value;
    return newPassword === confirmPassword;
  }

  /**
   * Salva a nova senha do usuário no sistema
   * Valida se as senhas coincidem antes de enviar
   * Realiza logout automático e redireciona para login após sucesso
   */
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
      
      // Chama o serviço para atualizar a senha no backend
      await this.userUpdateService.updatePassword(this.currentUser.id!.toString(), newPassword);
      
      console.log('Senha atualizada com sucesso!');
      this.toastr.success('Senha alterada com sucesso!');
      // Realiza logout para forçar novo login com a nova senha
      this.authenticationService.logout();
      this.router.navigate(['/account/sign-in']);
    } catch (error: any) {
      console.error('Erro ao atualizar a senha:', error);
      this.toastr.error('Erro ao atualizar a senha. Tente novamente.');
    }
  }
}