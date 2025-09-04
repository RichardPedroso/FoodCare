import { Routes } from '@angular/router';
import { SignInComponent } from './views/account/sign-in/sign-in.component';
import { SignUpComponent } from './views/account/sign-up/sign-up.component';
import { HomeComponent } from './views/app/home/home.component';
import { authenticationGuard } from './services/security/guard/authentication.guard';
import { MyProfileComponent } from './views/account/my-profile/my-profile.component';
import { AboutUsComponent } from './views/app/about-us/about-us.component';
import { ResetPasswordComponent } from './views/account/reset-password/reset-password.component';
import { ResetUserPasswordComponent } from './views/account/reset-user-password/reset-user-password.component';
import { LandComponent } from './views/land/land.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

import { AppComponent } from './app.component';
import { MakeActionComponent } from './views/app/user/make-action/make-action.component';
import { FollowActionsComponent } from './views/app/user/follow-actions/follow-actions.component';
import { GenerateReportComponent } from './views/app/user/generate-report/generate-report.component';
import { MainComponent } from './views/app/main/main.component';
import { HelpComponent } from './views/app/help/help.component';
import { DeleteAccountComponent } from './views/account/delete-account/delete-account.component';
import { MainAdminComponent } from './views/app/admin/main-admin/main-admin.component';
import { ManageUsersComponent } from './views/app/admin/manage-users/manage-users.component';

export const routes: Routes = [

  {
    path: '',
    component: LandComponent
  },

  {
    path: 'account/sign-in',
    component: SignInComponent
  },
  {
    path: 'account/sign-up',
    component: SignUpComponent
  },
  {
    path: 'account/reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [authenticationGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: "account/my-profile",
        component: MyProfileComponent
      },
      {
        path: "account/reset-user-password",
        component: ResetUserPasswordComponent
      },
      {
        path: 'account/delete-account',
        component: DeleteAccountComponent
      },
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: 'help',
        component: HelpComponent
      },
      {
        path: 'user/make-action',
        component: MakeActionComponent
      },
      {
        path: 'user/follow-actions',
        component: FollowActionsComponent
      },
      {
        path: 'user/generate-report',
        component: GenerateReportComponent
      },
      {
        path: 'admin/dashboard',
        component: MainAdminComponent
      },
      {
        path: 'admin/manage-users',
        component: ManageUsersComponent
      },
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }

];