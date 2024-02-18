import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit {
  oSub!: Subscription;
  form!: FormGroup;
  users: User[] = [];
  loading = false;

  userColumns = [
    { headerKey: 'Num.', field: 'index'},
    { headerKey: 'user.email', field: 'email' },
    { headerKey: 'user.role', field: 'role' },
  ];

  constructor(
    private usersService: UsersService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.fetch();
  }

  private fetch() {
    this.oSub = this.usersService.fetch().subscribe((user) => {
      this.users = this.users.concat(user);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  edit(user: User) {
    this.router.navigate([`/users/${user._id}`]);
  }

  view(user: User) {
    this.router.navigate([`/users/view/${user._id}`]);
  }

  delete($event: any) {
    throw new Error('Method not implemented.');
  }
}
