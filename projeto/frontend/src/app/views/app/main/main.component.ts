import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {
  
  selectedType: 'donor' | 'beneficiary' = 'donor';
  userName = 'nome do usuário';

  alternate(type: 'donor' | 'beneficiary'): void {
    this.selectedType = type;
  }

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/account/sign-in']);
  }

}