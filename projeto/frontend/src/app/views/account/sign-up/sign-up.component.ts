import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class SignUpComponent implements OnInit{

  form: FormGroup;
  
  fullnameMinlength: number = 2;
  fullnameMaxlength: number = 10;

  
  passwordMinlength: number = 2;
  passwordMaxlength: number = 10;

  repeatPasswordMinlength: number = 2;
  repeatPasswordMaxlength: number = 10;


  constructor(private formBuilder: FormBuilder){
    this.initializeForm();

  }


  ngOnInit(): void{}

  initializeForm(){
    console.log('formulario de sign-up sendo inicializado')
    this.form = this.formBuilder.group({
      fullname: ['', [
        Validators.required,
        Validators.minLength(this.fullnameMinlength),
        Validators.maxLength(this.fullnameMaxlength),
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(this.passwordMinlength),
        Validators.maxLength(this.passwordMaxlength)
      ]],
      repeatPassword: ['', [
        Validators.required,
        Validators.minLength(this.repeatPasswordMinlength),
        Validators.maxLength(this.repeatPasswordMaxlength)

      ]],
      
    });
  }


  validateFields() : boolean {
    let isFullnameValid = this.form.controls['fullname'].valid;
    let isEmailValid = this.form.controls['email'].valid;
    let isPasswordValid = this.form.controls['password'].valid;
    let isRepeatPasswordValid = this.form.controls['repeatPassword'].valid;

    if(!this.arePasswordValid){
      return false;
    }

    return isFullnameValid 
    && isEmailValid && isPasswordValid && isRepeatPasswordValid;
  }

  arePasswordValid(){
    return this.form.controls['repeatPassword'].value === this.form.controls['repeatPassword'].value;
  }



}
