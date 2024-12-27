import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from '../../components/user/user.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { map, Observable, of } from 'rxjs';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    UserComponent, 
    FormsModule,
    NgbPagination
  ],
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]> = new Observable<User[]>();
  selectedUser: User | null = null;
  isEditing: boolean = false;
  selectedRole: string = '';
  filteredUsers$: Observable<User[]> = new Observable<User[]>();
  page: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(
      private modalService: NgbModal,
      private router: Router,
      private userService: UserService
  ) {
    this.loadUsers(this.page);
  }

  ngOnInit(): void {
    // this.loadUsers();
  }

  loadUsers(page: number) {
    this.users$ = this.userService.getUsers(page).pipe(
        map((response: any) => {
            console.log('Respuesta del servidor:', response);
            this.totalItems = response.total;
            this.page = response.page;
            return response.users;
        })
    );
    this.filteredUsers$ = this.users$;
  }

  open(content: any, user: User | null = null): void {
    this.selectedUser = user ? { ...user } : { user_id: 0, name: '', last_name: '', email: '', role: '', phone_number: 0, address: '' };
    this.isEditing = !!user;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveUser(modal: any): void {
    if (this.selectedUser) {
      const saveObservable = this.isEditing
          ? this.userService.updateUser(this.selectedUser.user_id, this.selectedUser)
          : this.userService.createUser(this.selectedUser);

      saveObservable.subscribe(() => {
        this.loadUsers(this.page);
        modal.close();
      });

      this.selectedUser = null;
      this.isEditing = false;
    }
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user.user_id).subscribe(() => {
      this.loadUsers(this.page);
    });
  }

  viewLoanHistory(userId: number): void {
    this.router.navigate(['/user-loans', userId]);
  }

  onPageChange(page: number) {
    console.log('Cambiando a página:', page);
    this.loadUsers(page);
  }

  filterUsers() {
    console.log('Filtrando por rol:', this.selectedRole);
    
    this.page = 1;
    
    if (!this.selectedRole) {
        this.loadUsers(this.page);
        return;
    }

    // Obtener todos los usuarios para filtrar
    this.userService.getAllUsers().pipe(
        map((response: any) => {
            const allUsers = response.users || response;
            console.log('Total usuarios:', allUsers.length);
            
            const filtered = allUsers.filter((user: any) => {
                const userRole = user.role.toUpperCase().trim();
                const selectedRole = this.selectedRole.toUpperCase().trim();
                return userRole === selectedRole;
            });
            
            this.totalItems = filtered.length;
            console.log('Usuarios filtrados:', filtered.length);
            
            // Aplicar paginación manual
            const startIndex = (this.page - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filtered.slice(startIndex, endIndex);
        })
    ).subscribe(filteredUsers => {
        this.filteredUsers$ = of(filteredUsers);
    });
  }
}