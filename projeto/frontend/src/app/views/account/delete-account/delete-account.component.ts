import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { UserDeleteService } from '../../../services/user/user-delete.service';

/**
 * Componente responsável pela exclusão de conta do usuário
 * Permite que usuários autenticados excluam permanentemente suas contas
 * Requer confirmação de senha para segurança
 */
@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent implements OnInit {
  deleteForm!: FormGroup; // Formulário reativo para confirmação de senha
  user: any; // Dados do usuário atual obtidos do serviço de autenticação
  errorMessage: string = ''; // Mensagem de erro para exibição ao usuário
  successMessage: string = ''; // Mensagem de sucesso para exibição ao usuário

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userDeleteService: UserDeleteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtém os dados do usuário atual do localStorage
    this.user = this.authenticationService.getCurrentUser();
    this.initializeForm();
  }

  /**
   * Inicializa o formulário de confirmação de exclusão
   * Requer apenas a senha atual do usuário para confirmar a operação
   */
  initializeForm(): void {
    this.deleteForm = this.formBuilder.group({
      password: ['', [Validators.required]]
    });
  }

  /**
   * Executa a exclusão da conta do usuário
   * Valida a senha antes de proceder com a exclusão
   * Realiza logout automático e redirecionamento após sucesso
   */
  async deleteAccount(): Promise<void> {
    if (!this.deleteForm.valid) {
      return;
    }

    const password = this.deleteForm.get('password')?.value;

    // Verifica se a senha informada corresponde à senha do usuário
    if (password !== this.user.password) {
      this.errorMessage = 'Senha incorreta. A conta não foi excluída.';
      this.successMessage = '';
      return;
    }

    try {
      // Chama o serviço para excluir a conta do usuário
      await this.userDeleteService.delete(this.user.id);
      this.successMessage = 'Conta excluída com sucesso! Redirecionando...';
      this.errorMessage = '';
      
      // Aguarda 2 segundos antes de fazer logout e redirecionar
      setTimeout(() => {
        this.authenticationService.logout();
        this.router.navigate(['/']);
      }, 2000);
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      this.errorMessage = 'Erro ao excluir conta. Tente novamente.';
      this.successMessage = '';
    }
  }
}