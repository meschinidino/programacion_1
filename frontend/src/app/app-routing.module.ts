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
import { EditAccountComponent } from './pages/edit-account/edit-account.component';
import { BooksComponent } from './pages/books/books.component';
import { BookInfoComponent } from './pages/book-info/book-info.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'loans', component: LoansComponent, canActivate: [authGuard], data: { role: 'User' } },
  { path: 'loan-list', component: LoanListComponent, canActivate: [authGuard], data: { role: 'User' } },
  { path: 'ratings', component: RatingsComponent, canActivate: [authGuard], data: { role: 'User' } },
  { path: 'search', component: SearchComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [roleGuard], data: { expectedRole: ['Admin', 'Librarian'] } },
  { path: 'user-loans/:userId', component: UserLoansComponent },
  { path: 'account-info', component: AccountInfoComponent },
  { path: 'edit-account', component: EditAccountComponent, canActivate: [authGuard] },
  { path: 'books', component: BooksComponent, canActivate: [roleGuard], data: { expectedRole: 'Admin' } },
  { path: 'book/:id', component: BookInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }