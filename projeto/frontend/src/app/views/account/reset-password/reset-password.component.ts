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
import {MatCardModule} from '@angular/material/card'; 
import { UserUpdateService } from '../../../services/user/user-update.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente responsável pela recuperação de senha
 * Permite que usuários redefinam suas senhas fornecendo o email
 * Processo em duas etapas: verificação do email e definição da nova senha
 */
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
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

export class ResetPasswordComponent implements OnInit{

  resetPasswordForm!: FormGroup; // Formulário reativo para reset de senha

  showPasswordFields = false; // Controla exibição dos campos de senha após validação do email
  isEmailInvalid = false; // Flag para indicar se o email não foi encontrado
  passwordMismatch = false; // Flag para indicar se as senhas não coincidem

  userIdToUpdate: string | null = null; // ID do usuário encontrado pelo email
  
  passwordMinLength: number = 6; // Tamanho mínimo da senha
  passwordMaxLength: number = 18; // Tamanho máximo da senha

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userUpdateService: UserUpdateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeResetPasswordForm();
  }

  /**
   * Inicializa o formulário de reset de senha
   * Configura validações para email e campos de senha
   */
  initializeResetPasswordForm(){
    console.log('formulario de resetPassword inicializado');
    this.resetPasswordForm = this.formBuilder.group({

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      newPassword: ['', [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
        Validators.maxLength(this.passwordMaxLength),
      ]],

      repeatPassword: ['', [
        Validators.required,
      ]]

    });
  }

  /**
   * Verifica se o email existe no sistema
   * Se encontrado, exibe os campos para definição da nova senha
   * Armazena o ID do usuário para posterior atualização
   */
  checkEmail(): void {
    const email = this.resetPasswordForm.controls['email'].value;

    this.http.get<any>(`${environment.api_endpoint}/user/email/${email}`)
      .subscribe({
        next: (user) => {
          this.isEmailInvalid = false;
          this.showPasswordFields = true;
          this.userIdToUpdate = user.id;
        },
        error: (error) => {
          if (error.status === 404) {
            this.isEmailInvalid = true;
            this.showPasswordFields = false;
          } else {
            console.error('Erro ao verificar email:', error);
            this.toastr.error('Erro ao verificar email. Tente novamente.');
          }
        }
      });
  }

  /**
   * Valida se as senhas digitadas são idênticas
   * @returns true se as senhas coincidem, false caso contrário
   */
  arePasswordsValid() {
    return this.resetPasswordForm.controls['newPassword'].value === this.resetPasswordForm.controls['repeatPassword'].value;
  }


  /**
   * Atualiza a senha do usuário no sistema
   * Valida se as senhas coincidem antes de enviar para o servidor
   * Redireciona para tela de login após sucesso
   */
  async updatePassword(): Promise<void> {
    if (!this.resetPasswordForm.valid || !this.userIdToUpdate) return;

    if (!this.arePasswordsValid()) {
      this.passwordMismatch = true;
      console.log("Senhas nao coincidem")
      return;
    }

    this.passwordMismatch = false;

    const newPassword = this.resetPasswordForm.controls['newPassword'].value;

    try {
      // Chama o serviço para atualizar a senha no backend
      await this.userUpdateService.updatePassword(this.userIdToUpdate, newPassword);
      this.toastr.success('Senha alterada com sucesso!');
      this.router.navigate(['account/sign-in']);
    } catch (error: any) {
      console.error('Erro ao atualizar a senha:', error);
      this.toastr.error('Ocorreu um erro ao atualizar a senha. Tente novamente.');
    }
  }

}
