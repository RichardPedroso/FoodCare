import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterModule  } from '@angular/router';
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
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

import * as fontawesome from '@fortawesome/free-solid-svg-icons'
import { AuthenticationService } from '../../../services/security/authentication.service';
import { User } from '../../../domain/model/user';
import { UserCreateService } from '../../../services/user/user-create.service';


@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
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
    MatSelectModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export class SignUpComponent implements OnInit {

  signUpForm!: FormGroup;

  phoneMinlength: number = 11;
  phoneMaxlength: number = 11;

  nameMinLength: number = 5;
  nameMaxLength: number = 50;

  passwordMinLength: number = 6;
  passwordMaxLength: number = 18;

  repeatPasswordMinLength: number = 6;
  repeatPasswordMaxLength: number = 18;

  peopleQuantityMinLenght: number = 1;

  familyIncomeMinLenght: number = 0;

  constructor(
    private formbuilder: FormBuilder,
    private userCreateService: UserCreateService,

    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeSignUpForm();
  }

  initializeSignUpForm() {
    console.log('formulario de sign-up inicializado');
    this.signUpForm = this.formbuilder.group({

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

      phone: ['', [
        Validators.required,
        Validators.minLength(this.phoneMinlength),
        Validators.maxLength(this.phoneMaxlength),
      ]],

      userType: ['', [
        Validators.required
      ]],

      peopleQuantity: ['', [
        Validators.required,
        Validators.minLength(this.peopleQuantityMinLenght),
      ]],

      street: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]],

      number: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
      ]],

      neighborhood: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]],

      city: ['', [
        Validators.required,
      ]],

      zipCode: [''],

      familyIncome: ['', [
        Validators.required,
        Validators.minLength(this.familyIncomeMinLenght),
      ]],

    })
  }

  validateFields(): boolean {
    let isNameValid = this.signUpForm.controls['name'].valid;
    let isEmailValid = this.signUpForm.controls['email'].valid;
    let isPasswordValid = this.signUpForm.controls['password'].valid;
    let isRepeatPasswordValid = this.signUpForm.controls['repeatPassword'].valid;
    let isPhoneValid = this.signUpForm.controls['phone'].valid;
    let isUserType = this.signUpForm.controls['userType'].valid;
    let isStreet = this.signUpForm.controls['street'].valid;
    let isNumber = this.signUpForm.controls['number'].valid;
    let isNeighborhood = this.signUpForm.controls['neighborhood'].valid;
    let isCity = this.signUpForm.controls['city'].valid;

    let userTypeValue = this.signUpForm.controls['userType'].value;

    let isPeopleQuantity = this.signUpForm.controls['peopleQuantity'].valid;
    let isFamilyIncome = this.signUpForm.controls['familyIncome'].valid;

    if (!this.arePasswordsValid()) {
      return false;
    }
    
    let addressValid = isStreet && isNumber && isNeighborhood && isCity;

    if (userTypeValue === 'donor'){
      return isNameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid && isPhoneValid && isUserType && addressValid;
    }

    return isNameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid && isPhoneValid && isUserType && addressValid && isPeopleQuantity && isFamilyIncome;
  }

  arePasswordsValid() {
    return this.signUpForm.controls['password'].value === this.signUpForm.controls['repeatPassword'].value;
  }
  
  async signUp() {
    if (!this.validateFields()){
      return;
    }
  
    const formDataSignUp = this.signUpForm.value;
  
    // Criar novo municipality com dados do usuário
    const newMunicipality = {
      street: formDataSignUp.street,
      number: formDataSignUp.number,
      neighborhood: formDataSignUp.neighborhood,
      city: formDataSignUp.city,
      zip_code: formDataSignUp.zipCode || ''
    };

    try{
      // Criar municipality primeiro
      const municipalityResponse = await fetch('http://localhost:3000/municipality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMunicipality)
      });
      
      const createdMunicipality = await municipalityResponse.json();
      console.log("municipality criado com sucesso: ", createdMunicipality);

      // Criar usuário com municipality_id
      const newUser: User = {
        name: formDataSignUp.name,
        email: formDataSignUp.email,
        password: formDataSignUp.password,
        phone: formDataSignUp.phone,
        user_type: formDataSignUp.userType,
        is_admin: false,
        family_income: '',
        people_quantity: '',
        municipality_id: createdMunicipality.id
      };

      if (newUser.user_type === 'beneficiary') {
        newUser.family_income = formDataSignUp.familyIncome;
        newUser.people_quantity = formDataSignUp.peopleQuantity;
      }

      const createdUser = await this.userCreateService.create(newUser);
      console.log("usuario criado com sucesso: ", createdUser);

      this.authenticationService.addDataToLocalStorage(createdUser);
      this.router.navigate(['/main']);
    }catch(error){
      console.error("erro ao criar usuario ou municipality:", error);
    }
  }
}