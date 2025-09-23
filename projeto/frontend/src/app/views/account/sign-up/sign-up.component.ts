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
import { MunicipalityCreateService } from '../../../services/municipality/municipality-create.service';
import { environment } from '../../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';


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

  phoneMinlength: number = 14;
  phoneMaxlength: number = 15;

  nameMinLength: number = 5;
  nameMaxLength: number = 50;

  passwordMinLength: number = 6;
  passwordMaxLength: number = 18;

  repeatPasswordMinLength: number = 6;
  repeatPasswordMaxLength: number = 18;

  peopleQuantityMinLenght: number = 1;

  familyIncomeMinLenght: number = 0;

  incomeError: string = '';
  
  uploadedDocuments: { name: string, data: string }[] = [];
  
  showTooltip: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private userCreateService: UserCreateService,
    private municipalityCreateService: MunicipalityCreateService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
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

      hasChildren: [false],

      termsAccepted: [false]

    });

    // Adicionar listeners para validação em tempo real
    this.signUpForm.get('familyIncome')?.valueChanges.subscribe(() => {
      this.validateIncomePerCapita();
    });
    
    this.signUpForm.get('peopleQuantity')?.valueChanges.subscribe(() => {
      this.validateIncomePerCapita();
    });
    
    // Listener para adicionar validação required nos termos quando beneficiário for selecionado
    this.signUpForm.get('userType')?.valueChanges.subscribe((userType) => {
      const termsControl = this.signUpForm.get('termsAccepted');
      if (userType === 'beneficiary') {
        termsControl?.setValidators([Validators.requiredTrue]);
      } else {
        termsControl?.clearValidators();
      }
      termsControl?.updateValueAndValidity();
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedDocuments.push({
            name: file.name,
            data: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeDocument(index: number): void {
    this.uploadedDocuments.splice(index, 1);
  }

  openDocument(document: { name: string, data: string }): void {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>${document.name}</title></head>
          <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;">
            <img src="${document.data}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="${document.name}">
          </body>
        </html>
      `);
    }
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

    if (userTypeValue === 'beneficiary' && this.uploadedDocuments.length === 0) {
      return false;
    }

    let isTermsAccepted = this.signUpForm.controls['termsAccepted'].valid;

    if (userTypeValue === 'beneficiary') {
      return isNameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid && isPhoneValid && isUserType && addressValid && isPeopleQuantity && isFamilyIncome && this.validateIncomePerCapita() && isTermsAccepted;
    }
    
    return isNameValid && isEmailValid && isPasswordValid && isRepeatPasswordValid && isPhoneValid && isUserType && addressValid;
  }

  validateIncomePerCapita(): boolean {
    const userType = this.signUpForm.controls['userType'].value;
    if (userType !== 'beneficiary') {
      this.incomeError = '';
      return true;
    }

    const familyIncome = this.signUpForm.controls['familyIncome'].value;
    const peopleQuantity = this.signUpForm.controls['peopleQuantity'].value;

    if (!familyIncome || !peopleQuantity || peopleQuantity <= 0) {
      this.incomeError = '';
      return true;
    }

    const incomePerCapita = familyIncome / peopleQuantity;
    
    if (incomePerCapita > 1518) {
      this.incomeError = 'Renda per capita acima de R$ 1.518,00. Você não está apto para receber auxílios.';
      return false;
    }

    this.incomeError = '';
    return true;
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
      if (value.length <= 2) {
        formattedValue = `(${value}`;
      } else if (value.length <= 6) {
        formattedValue = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      } else if (value.length <= 10) {
        formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
      } else {
        formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
      }
    }
    
    this.signUpForm.get('phone')?.setValue(formattedValue, { emitEvent: false });
  }

  formatZipCode(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
      if (value.length <= 5) {
        formattedValue = value;
      } else {
        formattedValue = `${value.substring(0, 5)}-${value.substring(5, 8)}`;
      }
    }
    
    this.signUpForm.get('zipCode')?.setValue(formattedValue, { emitEvent: false });
  }

  formatFamilyIncome(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    let numericValue = parseFloat(value) / 100;
    let formattedValue = '';
    
    if (value.length > 0) {
      formattedValue = `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
    }
    
    this.signUpForm.get('familyIncome')?.setValue(formattedValue, { emitEvent: false });
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
      const createdMunicipality = await this.municipalityCreateService.create(newMunicipality);
      console.log("municipality criado com sucesso: ", createdMunicipality);

      // Como o backend não retorna o objeto criado, usar municipalityId = 1 como padrão
      const municipalityId = createdMunicipality?.id ? parseInt(createdMunicipality.id.toString()) : 1;

      // Criar usuário com municipality_id
      const newUser: User = {
        name: formDataSignUp.name,
        email: formDataSignUp.email,
        password: formDataSignUp.password,
        phone: formDataSignUp.phone,
        userType: formDataSignUp.userType,
        familyIncome: 0,
        peopleQuantity: 0,
        municipalityId: municipalityId,
        hasChildren: false
      };

      if (newUser.userType === 'beneficiary') {
        newUser.familyIncome = formDataSignUp.familyIncome;
        newUser.peopleQuantity = formDataSignUp.peopleQuantity;
        newUser.hasChildren = formDataSignUp.hasChildren;
        newUser.documents = this.uploadedDocuments.map(doc => doc.data);
      }

      const createdUser = await this.userCreateService.create(newUser);
      console.log("usuario criado com sucesso: ", createdUser);

      if (createdUser.userType === 'beneficiary') {
        this.toastr.success('Conta criada com sucesso! Sua aptidão será validada por um administrador. Você poderá fazer login após a aprovação.');
        this.router.navigate(['/account/sign-in']);
      } else {
        this.authenticationService.addDataToLocalStorage(createdUser);
        if (createdUser.userType === 'admin') {
          this.router.navigate(['/main/admin/dashboard']);
        } else {
          this.router.navigate(['/main']);
        }
      }
    }catch(error){
      console.error("erro ao criar usuario ou municipality:", error);
    }
  }
}