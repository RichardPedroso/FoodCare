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
import { User } from '../../../domain/model/user';
import { UserCreateService } from '../../../services/user/user-create.service';

@Component({
  selector: 'app-sign-up',
  imports: [
    RouterOutlet,
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

      familyIncome: ['', [
        Validators.required,
        Validators.minLength(this.familyIncomeMinLenght),
      ]],
      
      // municipality_id: ['', [
      //   Validators.required,
      // ]],

    })
  }

  validateFields(): boolean {
    let isNameValid = this.signUpForm.controls['name'].valid;
    let isEmailValid = this.signUpForm.controls['email'].valid;
    let isPasswordValid = this.signUpForm.controls['password'].valid;
    let isRepeatPasswordValid = this.signUpForm.controls['repeatPassword'].valid;
    let isPhoneValid = this.signUpForm.controls['phone'].valid;
    let isUserType = this.signUpForm.controls['userType'].valid;
    let isPeopleQuantity = this.signUpForm.controls['peopleQuantity'].valid;
    let isFamilyIncome = this.signUpForm.controls['familyIncome'].valid;
    // adicionar let isMunicipalityId = this.signUpForm.controls['municipalityId'].valid;

    if (!this.arePasswordsValid()) {
      return false;
    }

    return isNameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid && isPhoneValid && isUserType && isPeopleQuantity && isFamilyIncome;
  }

  arePasswordsValid() {
    return this.signUpForm.controls['password'].value === this.signUpForm.controls['repeatPassword'].value;
  }
  
  async signUp() {
    if (!this.validateFields()){
      return;
    }
  
    const formDataSignUp = this.signUpForm.value;
  
    const newUser: User = {
      name: formDataSignUp.name,
      email: formDataSignUp.email,
      password: formDataSignUp.password,
      phone: formDataSignUp.phone,
      user_type: formDataSignUp.userType,
      is_admin: false,
      family_income: '',
      people_quantity: '',
      municipality_id: ''
    };

    if (newUser.user_type === 'beneficiary') {
      newUser.family_income = formDataSignUp.familyIncome;
      newUser.people_quantity = formDataSignUp.peopleQuantity;
      // newUser.municipality_id = formDataSignUp.municipalityId;
    }

    try{
      const createdUser = await this.userCreateService.create(newUser);
      console.log("usuario criado com sucesso: ", createdUser);

      this.authenticationService.addDataToLocalStorage(createdUser);
      this.router.navigate(['/home']);
    }catch(errorCreateUser){
      console.error("erro ao criar usuario:", errorCreateUser);
    }
  }
}