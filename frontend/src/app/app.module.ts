import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoansComponent } from './pages/loans/loans.component';
import { RatingsComponent } from './pages/ratings/ratings.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BookComponent } from './components/book/book.component';
import { UserLoansComponent } from './pages/user-loans/user-loans.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthService } from './services/auth.service';
import { LoanComponent } from './components/loan/loan.component';
import { LoanListComponent } from './pages/loan-list/loan-list.component';
import { RatingComponent } from './components/rating/rating.component';
import { AccountInfoComponent } from './pages/account-info/account-info.component';
import { EditAccountComponent } from './pages/edit-account/edit-account.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ExtendLoanDialogComponent } from './components/extend-loan-dialog/extend-loan-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    RatingsComponent,
    HomeComponent,
    SearchComponent,
    SettingsComponent,
    UserLoansComponent,
    LoginComponent,
    SignupComponent,
    LoanComponent,
    LoanListComponent,
    RatingComponent,
    AccountInfoComponent,
    EditAccountComponent,
    ExtendLoanDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NavigationComponent,
    LoansComponent,
    BookComponent,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService], // Add AuthService to providers
  bootstrap: [AppComponent]
})
export class AppModule { }