import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { LoansComponent } from './pages/loans/loans.component';
import { RatingsComponent } from './pages/ratings/ratings.component';
import { SearchComponent } from './pages/search/search.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UsersComponent } from './pages/users/users.component';
import { UserLoansComponent } from './pages/user-loans/user-loans.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { LoanListComponent } from './pages/loan-list/loan-list.component';
import { AccountInfoComponent } from './pages/account-info/account-info.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'loans', component: LoansComponent, canActivate: [authGuard], data: { role: 'User' } },
  { path: 'loan-list', component: LoanListComponent, canActivate: [authGuard], data: { role: 'User' } },
  { path: 'ratings', component: RatingsComponent, canActivate: [authGuard], data: { role: 'User' } },
  { path: 'search', component: SearchComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [roleGuard], data: { expectedRole: 'Admin' } },
  { path: 'user-loans/:userId', component: UserLoansComponent, canActivate: [authGuard], data: { role: 'User' } },
  { path: 'account-info', component: AccountInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }