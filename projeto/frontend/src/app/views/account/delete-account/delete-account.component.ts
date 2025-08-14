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
  deleteForm!: FormGroup;
  user: any;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userDeleteService: UserDeleteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getCurrentUser();
    this.initializeForm();
  }

  initializeForm(): void {
    this.deleteForm = this.formBuilder.group({
      password: ['', [Validators.required]]
    });
  }

  async deleteAccount(): Promise<void> {
    if (!this.deleteForm.valid) {
      return;
    }

    const password = this.deleteForm.get('password')?.value;

    if (password !== this.user.password) {
      this.errorMessage = 'Senha incorreta. A conta não foi excluída.';
      this.successMessage = '';
      return;
    }

    try {
      await this.userDeleteService.delete(this.user.id);
      this.successMessage = 'Conta excluída com sucesso! Redirecionando...';
      this.errorMessage = '';
      
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