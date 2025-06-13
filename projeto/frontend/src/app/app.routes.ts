import { Routes } from '@angular/router';
import { SignInComponent } from './views/account/sign-in/sign-in.component';
import { SignUpComponent } from './views/account/sign-up/sign-up.component';
import { HomeComponent } from './views/app/home/home.component';
import { authenticationGuard } from './services/security/guard/authentication.guard';
import { MyProfileComponent } from './views/account/my-profile/my-profile.component';
import { AboutUsComponent } from './views/about/about-us/about-us.component';
import { ResetPasswordComponent } from './views/account/reset-password/reset-password.component';
import { LandComponent } from './views/app/land/land.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { FollowActionsComponent } from './views/user/follow-actions/follow-actions.component';
import { MakeActionComponent } from './views/user/make-action/make-action.component';
import { GenerateReportComponent } from './views/user/generate-report/generate-report.component';
import { AppComponent } from './app.component';

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
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticationGuard],
    children: [
      {
        path: "my-profile",
        component: MyProfileComponent
      },
      {
        path: 'about-us',
        component: AboutUsComponent
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
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }

];