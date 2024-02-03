import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  MaterialInstance,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { User } from 'src/app/shared/interfaces';
import { format } from 'date-fns';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserListComponent implements OnInit {
  @ViewChild('modal') modalRef!: ElementRef;
  @Input() users!: User[];

  userColumns = [
    { headerKey: '№', field: 'index' },
    { headerKey: 'users.email', field: 'email' },
    { headerKey: 'users.role', field: 'role' },
    {
      headerKey: 'users.timeLogin',
      field: 'timeLogin',
      formatter: (value: string) => this.formatDate(value),
    },
    { headerKey: 'users.loginAttempts', field: 'loginAttempts' },
  ];

  modal!: MaterialInstance;

  selectedUser!: User;

  constructor() {}

  ngOnInit() {}

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return format(date, 'hh:mm:ss dd.MM.yyyy');
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.modal.open();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  close() {
    this.modal.close();
  }
}
