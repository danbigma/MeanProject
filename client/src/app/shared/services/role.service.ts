import { Injectable } from '@angular/core';
import { CurrentUser, User } from '../interfaces';

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST'
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private currentUser!: CurrentUser;

  constructor() {}

  setCurrentUser(user: CurrentUser) {
    this.currentUser = user;
  }

  getCurrentUser(): CurrentUser {
    return this.currentUser;
  }

  isAdmin(user: CurrentUser): boolean {
    return user.role === UserRole.Admin;
  }

  isUser(user: CurrentUser): boolean {
    return user.role === UserRole.User;
  }

  isGuest(user: CurrentUser): boolean {
    return user.role === UserRole.Guest;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(convertToUserRole(this.currentUser.role));
  }
  // Otros métodos útiles relacionados con roles...
}

function convertToUserRole(roleStr: string): UserRole {
  return UserRole[roleStr as keyof typeof UserRole];
}
