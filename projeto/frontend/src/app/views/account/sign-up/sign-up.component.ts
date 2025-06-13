import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router  } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-sign-up',
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
    MatInputModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent implements OnInit {

  form!: FormGroup;

  numberMinlength: number = 11;
  numberMaxlength: number = 11;

  nameMinLength: number = 5;
  nameMaxLength: number = 50;

  passwordMinLength: number = 6;
  passwordMaxLength: number = 18;

  repeatPasswordMinLength: number = 6;
  repeatPasswordMaxLength: number = 18;

  people_quantityMinLenght: number = 1;

  family_incomeMinLenght: number = 0;

  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    console.log('formulario de sign-up inicializado');
    this.form = this.formbuilder.group({

      name: ['', [
        Validators.required,
        Validators.minLength(this.nameMinLength),
        Validators.maxLength(this.nameMaxLength),
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
        Validators.maxLength(this.passwordMaxLength),
      ]],

      repeatPassword: ['', [
        Validators.required,
        Validators.minLength(this.repeatPasswordMinLength),
        Validators.maxLength(this.repeatPasswordMaxLength),
      ]],

      number: ['', [
        Validators.required,
        Validators.minLength(this.numberMinlength),
        Validators.maxLength(this.numberMaxlength),
      ]],

      user_type: ['standard'],

      people_quantity: ['', [
        Validators.required,
        Validators.minLength(this.people_quantityMinLenght),
      ]],
      family_income: ['', [
        Validators.required,
        Validators.minLength(this.family_incomeMinLenght),
      ]],
      
    })
  }

  validateFields(): boolean {
    let isNameValid = this.form.controls['name'].valid;
    let isEmailValid = this.form.controls['email'].valid;
    let isPasswordValid = this.form.controls['password'].valid;
    let isRepeatPasswordValid = this.form.controls['repeatPassword'].valid;
    let isNumberValid = this.form.controls['number'].valid;
    if (!this.arePasswordsValid()) {
      return false;
    }

    return isNameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid && isNumberValid;
  }

  arePasswordsValid() {
    return this.form.controls['password'].value === this.form.controls['repeatPassword'].value;
  }
  
  signUp() {
    if (!this.validateFields()){
      return;
    }
  
    const formData = this.form.value;
  
    const newUser: any = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      number: formData.number,
      user_type: formData.user_type || 'standard',
    };
  
    if (newUser.user_type === 'beneficiary') {
      newUser.family_income = formData.family_income;
      newUser.people_quantity = formData.people_quantity;
    
      if (!newUser.family_income || !newUser.people_quantity) {
        console.error("Campos obrigatórios faltando para beneficiário.");
        return;
      }
    }
  
    this.authService.createUser(newUser).subscribe({
      next: (createdUser) => {
        console.log("Usuário criado com sucesso:", createdUser);
        this.authService.addDataToLocalStorage(createdUser);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error("Erro ao criar usuário:", err);
      }
    });
  }

}