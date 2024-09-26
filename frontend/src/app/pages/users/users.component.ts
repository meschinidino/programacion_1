import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from '../../user/user.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [CommonModule, UserComponent, FormsModule],
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users = [
    { name: 'John Doe', email: 'johndoe@example.com', memberSince: '2021' },
    { name: 'Jane Smith', email: 'janesmith@example.com', memberSince: '2020' }
  ];

  selectedUser: any = null;
  isEditing: boolean = false;

  constructor(private modalService: NgbModal) {}

  open(content: any, user: any = null) {
    this.selectedUser = user ? { ...user } : { name: '', email: '', memberSince: '' };
    this.isEditing = !!user;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveUser() {
    if (this.selectedUser) {
      const index = this.users.findIndex(user => user.email === this.selectedUser.email);
      if (index !== -1) {
        this.users[index] = this.selectedUser;
      } else {
        this.users.push(this.selectedUser);
      }
      this.selectedUser = null;
      this.isEditing = false;
    }
  }

  deleteUser(user: any) {
    this.users = this.users.filter(u => u.email !== user.email);
  }
}
