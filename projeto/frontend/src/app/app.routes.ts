import { Routes } from '@angular/router';
import { SignInComponent } from './views/account/sign-in/sign-in.component';
import { SignUpComponent } from './views/account/sign-up/sign-up.component';
import { MainComponent } from './views/app/main/main.component';
import { authenticationGuard } from './services/security/guard/authentication.guard';
import { MyProfileComponent } from './views/account/my-profile/my-profile.component';
import { AboutUsComponent } from './views/about/about-us/about-us.component';
import { ResetPasswordComponent } from './views/account/reset-password/reset-password.component';
import { HomeComponent } from './views/app/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { FollowActionsComponent } from './views/user/follow-actions/follow-actions.component';
import { MakeActionComponent } from './views/user/make-action/make-action.component';
import { GenerateReportComponent } from './views/user/generate-report/generate-report.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "account/sign-in",
        component: SignInComponent
    },
    {
        path: "account/sign-up",
        component: SignUpComponent
    },
    {
        path: "account/reset-password",
        component: ResetPasswordComponent
    },
    {
        path: "",
        component: MainComponent,
        canActivate: [authenticationGuard],
        children:[
            {
                path: "",
                component: MainComponent
            },
            {
                path: "account/my-profile",
                component: MyProfileComponent
            },
            {
                path: "about-us",
                component: AboutUsComponent
            },
            {
                path: "user",
                children: [
                    {
                        path: "make-action",
                        component: MakeActionComponent
                    },
                    {
                        path: "follow-actions",
                        component: FollowActionsComponent
                    },
                    {
                        path: "generate-report",
                        component: GenerateReportComponent
                    },
                ]
            },
            {
                path: '**',
                component: NotFoundComponent
            },
        ]
    },
];
