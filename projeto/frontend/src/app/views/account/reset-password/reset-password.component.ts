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

  resetPasswordForm!: FormGroup;

  showPasswordFields = false;
  isEmailInvalid = false;
  passwordMismatch = false;

  userIdToUpdate: string | null = null;
  
  passwordMinLength: number = 6;
  passwordMaxLength: number = 18;

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

  checkEmail(): void {
    const email = this.resetPasswordForm.controls['email'].value;

    this.http.get<any[]>(`${environment.authentication_api_endpoint}/user?email=${email}`)
      .subscribe(users => {
        if (users.length > 0) {
          this.isEmailInvalid = false;
          this.showPasswordFields = true;
          this.userIdToUpdate = users[0].id;
        } else {
          this.isEmailInvalid = true;
          this.showPasswordFields = false;
        }
      });
  }

  arePasswordsValid() {
    return this.resetPasswordForm.controls['newPassword'].value === this.resetPasswordForm.controls['repeatPassword'].value;
  }


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
      await this.userUpdateService.updatePassword(this.userIdToUpdate, newPassword);
      this.toastr.success('Senha alterada com sucesso!');
      this.router.navigate(['account/sign-in']);
    } catch (error: any) {
      console.error('Erro ao atualizar a senha:', error);
      this.toastr.error('Ocorreu um erro ao atualizar a senha. Tente novamente.');
    }
  }

}
