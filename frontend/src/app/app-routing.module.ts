import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoansComponent } from './pages/loans/loans.component';
import { RatingsComponent } from './pages/ratings/ratings.component';
import { SearchComponent } from './pages/search/search.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UsersComponent } from './pages/users/users.component';
import { LoanViewComponent } from './pages/loan-view/loan-view.component';
import { roleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'loans', component: LoansComponent, canActivate: [roleGuard], data: { expectedRole: 'User' } },
  { path: 'ratings', component: RatingsComponent, canActivate: [roleGuard], data: { expectedRole: 'User' } },
  { path: 'search', component: SearchComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [roleGuard], data: { expectedRole: 'User' } },
  { path: 'users', component: UsersComponent, canActivate: [roleGuard], data: { expectedRole: 'User' } },
  { path: 'loan-view', component: LoanViewComponent, canActivate: [roleGuard], data: { expectedRole: 'User' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
