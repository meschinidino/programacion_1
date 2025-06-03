import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'app_biblioteca';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.logout(); // Esto limpiará el token al iniciar la app
  }
}
