import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-edit-account',
    templateUrl: './edit-account.component.html',
    styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
    user: any = {};
    userId!: number;

    constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        console.log('EditAccountComponent iniciado');
        this.getUserId();
        this.loadUserData();
    }

    getUserId() {
        this.userId = this.authService.getUserId();
    }

    loadUserData() {
        if (this.userId) {
            this.userService.getUserProfile(this.userId).subscribe(data => {
                this.user = data;
            }, error => {
                console.error('Error al cargar los datos del usuario', error);
            });
        } else {
            console.error('userId es undefined');
        }
    }

    onSubmit() {
        this.userService.updateUser(this.userId, this.user).subscribe(response => {
            console.log('Perfil actualizado con éxito', response);
            this.router.navigate(['/account-info']);
        });
    }
}
