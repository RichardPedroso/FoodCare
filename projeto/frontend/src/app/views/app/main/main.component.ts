import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../../domain/model/user';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent implements OnInit {
  
  user: User | null = null;
  userType: 'donor' | 'beneficiary' = 'donor';
  userName: string = '';

  ngOnInit(): void {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userName = this.user.name;
      this.userType = this.user.user_type as 'donor' | 'beneficiary';
    }
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