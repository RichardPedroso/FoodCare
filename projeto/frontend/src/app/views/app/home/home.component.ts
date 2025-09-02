import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Router } from '@angular/router';
import { UserReadService } from '../../../services/user/user-read.service';
import { User } from '../../../domain/model/user';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  
  user: User | null = null;
  userName: string | undefined;
  selectedType: 'donor' | 'beneficiary' = 'donor';

  constructor(
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getCurrentUser();
    this.userName = this.user?.name;
  }

  alternate(type: 'donor' | 'beneficiary'): void {
    this.selectedType = type;
  }

}