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
  searchTerm: string = '';
  filteredUsers$: Observable<User[]> = new Observable<User[]>();
  page: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  roles: string[] = ['User', 'Admin', 'Librarian', 'Guest'];
  suspensionFilter: string = 'all';  // Agregar esta propiedad

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
    if (confirm('Are you sure you want to delete this user?')) {
        this.userService.deleteUser(user.user_id).subscribe(() => {
            alert('User deleted successfully');
            this.loadUsers(this.page);
        });
    }
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
    
    if (!this.selectedRole && !this.searchTerm && this.suspensionFilter === 'all') {
        this.loadUsers(this.page);
        return;
    }

    this.userService.getAllUsers().pipe(
        map((response: any) => {
            const allUsers = response.users || response;
            console.log('Total usuarios:', allUsers.length);
            
            const filtered = allUsers.filter((user: any) => {
                const userRole = user.role.toUpperCase().trim();
                const selectedRole = this.selectedRole.toUpperCase().trim();
                const nameMatch = !this.searchTerm || 
                    user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    user.last_name.toLowerCase().includes(this.searchTerm.toLowerCase());
                const suspensionMatch = this.suspensionFilter === 'all' || 
                    (this.suspensionFilter === 'suspended' ? user.is_suspended : !user.is_suspended);
                
                return (!this.selectedRole || userRole === selectedRole) && 
                       nameMatch && 
                       suspensionMatch;
            });
            
            this.totalItems = filtered.length;
            console.log('Usuarios filtrados:', filtered.length);
            
            const startIndex = (this.page - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filtered.slice(startIndex, endIndex);
        })
    ).subscribe(filteredUsers => {
        this.filteredUsers$ = of(filteredUsers);
    });
  }

  suspendUser(user: User): void {
    if (confirm('¿Está seguro que desea suspender a este usuario?')) {
      this.userService.suspendUser(user.user_id).subscribe(() => {
        this.loadUsers(this.page);
      });
    }
  }

  toggleUserSuspension(user: User): void {
    const action = user.is_suspended ? 'reactivar' : 'suspender';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      if (user.is_suspended) {
        this.userService.unsuspendUser(user.user_id).subscribe(() => {
          this.loadUsers(this.page);
        });
      } else {
        this.userService.suspendUser(user.user_id).subscribe(() => {
          this.loadUsers(this.page);
        });
      }
    }
  }
}