import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  MaterialInstance,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { User } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserListComponent implements OnInit {
  @ViewChild('modal') modalRef!: ElementRef;
  @Input() users!: User[];

  modal!: MaterialInstance;

  selectedUser!: User;

  constructor() {}

  ngOnInit() {}

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
