import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  
  selectedType: 'donor' | 'beneficiary' = 'donor';
  userName = 'nome do usuário';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  alternate(type: 'donor' | 'beneficiary'): void {
    this.selectedType = type;
  }

}