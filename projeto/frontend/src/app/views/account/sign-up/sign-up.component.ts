import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
    MatInputModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  userType: 'donor' | 'beneficiary' = 'donor'; // Pode setar via algum botão externo

  // Definição dos FormControls para o template
  fullname = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);

  cellphone = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\+?\d{10,15}$/)
  ]);

  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20)
  ]);

  amountPeople = new FormControl(null, [
    // Só obrigatório se for beneficiary, pode validar depois na função validateFields
  ]);

  familyIncome = new FormControl('', [
    // Igual acima, validação condicional
  ]);

  cep = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{5}-?\d{3}$/)
  ]);

  city = new FormControl('', [
    Validators.required
  ]);

  publicPlace = new FormControl('', [
    Validators.required
  ]);

  number = new FormControl('', [
    Validators.required
  ]);

  neighborhood = new FormControl('', [
    Validators.required
  ]);

  constructor() {}

  ngOnInit(): void {}

  // Função que retorna true se todos os campos obrigatórios forem válidos
  validateFields(): boolean {
    const requiredValid =
      this.fullname.valid &&
      this.cellphone.valid &&
      this.email.valid &&
      this.password.valid &&
      this.cep.valid &&
      this.city.valid &&
      this.publicPlace.valid &&
      this.number.valid &&
      this.neighborhood.valid;

    // Se for beneficiary, esses campos também são obrigatórios e validados
    if (this.userType === 'beneficiary') {
      return requiredValid &&
        this.amountPeople.valid &&
        this.familyIncome.valid;
    }

    return requiredValid;
  }

  create() {
    if (!this.validateFields()) {
      // Pode adicionar feedback visual aqui
      console.warn('Formulário inválido');
      return;
    }

    const formData = {
      fullname: this.fullname.value,
      cellphone: this.cellphone.value,
      email: this.email.value,
      password: this.password.value,
      amountPeople: this.userType === 'beneficiary' ? this.amountPeople.value : null,
      familyIncome: this.userType === 'beneficiary' ? this.familyIncome.value : null,
      cep: this.cep.value,
      city: this.city.value,
      publicPlace: this.publicPlace.value,
      number: this.number.value,
      neighborhood: this.neighborhood.value,
      userType: this.userType
    };

    console.log('Criando usuário com dados:', formData);
    // Aqui chama sua API ou qualquer lógica para cadastro
  }

  // Exemplo de método para mudar o tipo do usuário
  setUserType(type: 'donor' | 'beneficiary') {
    this.userType = type;

    // Se quiser, pode resetar os controles opcionais
    if (type === 'donor') {
      this.amountPeople.reset();
      this.familyIncome.reset();
    }
  }
}