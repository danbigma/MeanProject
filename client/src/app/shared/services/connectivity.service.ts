import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectivityService {
  private onlineStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    navigator.onLine
  );

  constructor() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  get isOnline(): Observable<boolean> {
    return this.onlineStatus.asObservable();
  }

  private updateOnlineStatus(isOnline: boolean) {
    this.onlineStatus.next(isOnline);
  }
}
