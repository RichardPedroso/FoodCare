import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  
  selectedType: 'donor' | 'beneficiary' = 'donor';
  userName = 'nome do usuário';

  alternate(type: 'donor' | 'beneficiary'): void {
    this.selectedType = type;
  }

  constructor(private authService: AuthenticationService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/account/sign-in']);
  }

}