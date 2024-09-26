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
import { BookComponent } from './book/book.component';
import { LoanViewComponent } from './pages/loan-view/loan-view.component';
import { UserLoansComponent } from './pages/user-loans/user-loans.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './services/auth.service'; // Import AuthService

@NgModule({
  declarations: [
    AppComponent,
    RatingsComponent,
    HomeComponent,
    SearchComponent,
    SettingsComponent,
    LoanViewComponent,
    UserLoansComponent,
    LoginComponent,
    SignupComponent
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
    // HttpClientModule is already imported
  ],
  providers: [AuthService], // Add AuthService to providers
  bootstrap: [AppComponent]
})
export class AppModule { }