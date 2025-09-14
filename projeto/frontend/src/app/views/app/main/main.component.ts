import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { User } from '../../../domain/model/user';
import { filter } from 'rxjs/operators';

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
  isChildRouteActive: boolean = false;

  ngOnInit(): void {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userName = this.user.name;
      const rawUserType = this.user.userType || this.user.user_type;
      this.userType = rawUserType?.toLowerCase() as 'donor' | 'beneficiary';
    }
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isChildRouteActive = event.url !== '/main' && event.url !== '/main/';
    });
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