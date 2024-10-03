import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from '../../components/user/user.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [CommonModule, UserComponent, FormsModule],
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]> = new Observable<User[]>();
  selectedUser: User | null = null;
  isEditing: boolean = false;

  constructor(
      private modalService: NgbModal,
      private router: Router,
      private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users$ = this.userService.getUsers().pipe(
        map((response: any) => response.users)
    );
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
        this.loadUsers();
        modal.close();
      });

      this.selectedUser = null;
      this.isEditing = false;
    }
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user.user_id).subscribe(() => {
      this.loadUsers();
    });
  }

  viewLoanHistory(userId: number): void {
    this.router.navigate(['/user-loans', userId]);
  }
}