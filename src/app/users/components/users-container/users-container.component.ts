import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UsersStoreService } from '../../services/users-store.service';
import { Observable, Subject, combineLatest, of, } from 'rxjs';
import { User, UserRole, ConfirmDialogModel } from '../../models';
import { take, takeUntil, tap, map, startWith, filter, } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-users-container',
  templateUrl: './users-container.component.html',
  styleUrls: ['./users-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersContainerComponent implements OnInit, OnDestroy {

  readonly filterForm = new FormGroup({
    keyword: new FormControl(''),
    role: new FormControl(''),
  });
  private readonly roles: UserRole[] = [UserRole.ARTIST, UserRole.ART_MANAGER, UserRole.DESIGNER];
  availableRoles: UserRole[];
  readonly isLoading$: Observable<boolean> = this.userStore.isLoading$;

  users$: Observable<User[]>;

  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private userStore: UsersStoreService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userStore.loadUsers().pipe(
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe();

    this.users$ = combineLatest([
      this.userStore.users$.pipe(
        tap((users: User[]) => {
          const isArtManagerAllowed = !(users.some((user: User) => user.role === UserRole.ART_MANAGER));
          if (!isArtManagerAllowed) {
            this.availableRoles = this.roles.filter(role => role !== UserRole.ART_MANAGER);
          } else {
            this.availableRoles = this.roles;
          }
        }),
      ),
      this.filterForm.valueChanges.pipe(
        startWith(this.filterForm.value),
      ),
    ]).pipe(
      map(([users, filters]) => {
        const keywordFilter = ({ firstName, lastName, email, }: Partial<User>) => ({ firstName, lastName, email, });
        return users.filter((user: User): boolean =>
          (!!filters.keyword ? Object.values(keywordFilter(user))
            .some((item: string) => item.toLocaleLowerCase()
              .includes(filters.keyword.toLocaleLowerCase())) : true) && (!!filters.role ? user.role === filters.role : true)
        );
      }),
    );
  }

  clearKeyword(): void {
    this.filterForm.patchValue({
      keyword: '',
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '20rem',
      data: { action: 'add', roles: this.availableRoles, }
    });

    dialogRef.afterClosed().pipe(
      filter(Boolean),
      takeUntil(this.onDestroy$),
    ).subscribe((newUser: User) => {
      this.userStore.addUser(newUser).pipe(
        filter(Boolean),
        takeUntil(this.onDestroy$),
      ).subscribe();
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '20rem',
      data: { action: 'edit', userData: user, roles: this.availableRoles, }
    });

    dialogRef.afterClosed().pipe(
      filter(Boolean),
      takeUntil(this.onDestroy$),
    ).subscribe((editedUser: User) => {
      this.userStore.editUser(user._id, editedUser).pipe(
        takeUntil(this.onDestroy$),
      ).subscribe();
    });
  }

  removeUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '20rem',
      data: new ConfirmDialogModel('Confirm Action', 'Are you sure you want to do this?'),
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.onDestroy$),
    ).subscribe((isConfirmed: boolean) => {
      if (!!isConfirmed) {
        this.userStore.removeUser(userId).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
