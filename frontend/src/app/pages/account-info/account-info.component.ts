import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  user: User | null = null; // Almacena la información del usuario

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const userId = this.authService.getUserId(); // Obtiene el ID del usuario logueado
    if (userId) {
      this.authService.getCurrentUser(userId).subscribe(
        (userData: User) => {
          this.user = userData; // Almacena la información del usuario
        },
        error => {
          console.error('Error al obtener la información del usuario:', error);
        }
      );
    }
  }
}
