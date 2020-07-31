import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { User, UserRole } from '../../models';

@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersGridComponent implements OnInit {

  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'role', 'actions'];
  @Input() dataSource: User[];
  @Output() editUserEvent: EventEmitter<User> = new EventEmitter();
  @Output() removeUserEvent: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  editUser(user: User): void {
    this.editUserEvent.emit(user);
  }

  removeUser(userId: string): void {
    this.removeUserEvent.emit(userId);
  }

  renderRoleName(role: UserRole): string {
    switch (role) {
      case UserRole.ARTIST:
        return 'Artist';
      case UserRole.ART_MANAGER:
        return 'Art Manager';
      case UserRole.DESIGNER:
        return 'Designer';
      default:
        return '-';
    }
  }

}
