import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  MaterialInstance,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { Role, User } from 'src/app/shared/interfaces';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit {
  @ViewChild('modal') modalRef!: ElementRef;
  modal!: MaterialInstance;

  roleKeys = Object.keys(Role);

  oSub!: Subscription;

  form!: FormGroup;

  users: User[] = [];

  loading = false;
  reloading = false;

  constructor(private usersService: UsersService) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.reloading = true;
    this.fetch();
  }

  private fetch() {
    this.oSub = this.usersService.fetch().subscribe((user) => {
      this.users = this.users.concat(user);
      this.loading = false;
      this.reloading = false;
    });
  }

onSubmit() {
  this.form.disable();
  this.loading = true;
  this.usersService.createUser(this.form.value.email, this.form.value.password, this.form.value.role).subscribe({
    next: (user) => {
      console.log('Usuario creado:', user);
      this.users = this.users.concat(user);
      this.form.reset();
      this.modal.close();
      this.loading = false;
    },
    error: (error) => {
      console.error('Error creando el usuario:', error);
      this.form.enable();
      this.loading = false;
    }
  });
}

  ngAfterViewInit(): void {
    const selects = document.querySelectorAll('select');
    selects.forEach((select) => {
      MaterialService.initSelect(select as HTMLElement); // Asegúrate de hacer un cast a HTMLElement
    });
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  open() {
    this.modal.open();
  }

  close() {
    this.form.reset();
    this.modal.close();
  }
}
