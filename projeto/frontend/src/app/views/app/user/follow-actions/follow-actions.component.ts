import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { User } from '../../../../domain/model/user';

@Component({
  selector: 'app-follow-actions',
  imports: [],
  templateUrl: './follow-actions.component.html',
  styleUrl: './follow-actions.component.css'
})

export class FollowActionsComponent implements OnInit {

  user: User | null = null;
  userType: 'donor' | 'beneficiary' = 'donor';

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userType = this.user.user_type as 'donor' | 'beneficiary';
    }
  }

}
