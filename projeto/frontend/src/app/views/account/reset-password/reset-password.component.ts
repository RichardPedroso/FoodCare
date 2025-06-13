import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card'; 


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [
    CommonModule,
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

export class ResetPasswordComponent {
  resetForm: FormGroup;
  showPasswordFields = false;
  isEmailInvalid = false;
  passwordMismatch = false;
  userIdToUpdate: string | null = null;
  

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetForm = this.formBuilder.group({
      email: ['', [
        Validators.required, Validators.email
      ]],
      newPassword: ['', [
        Validators.required, Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required,
      ]]
    });
  }

  get email() {
    return this.resetForm.get('email');
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  checkEmail(): void {
    const email = this.email?.value;
    this.http
      .get<any[]>(`${environment.authentication_api_endpoint}/user?email=${email}`)
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

  updatePassword(): void {
    if (!this.resetForm.valid || !this.userIdToUpdate) return;

    if (this.newPassword?.value !== this.confirmPassword?.value) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;

    this.http.patch(`${environment.authentication_api_endpoint}/user/${this.userIdToUpdate}`, {
      password: this.newPassword?.value
    }).subscribe(() => {
      alert('Senha alterada com sucesso!');
      this.router.navigate(['account/sign-in']);
    });
  }
}
