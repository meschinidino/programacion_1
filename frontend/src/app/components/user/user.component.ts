import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @Input() user?: User;
}