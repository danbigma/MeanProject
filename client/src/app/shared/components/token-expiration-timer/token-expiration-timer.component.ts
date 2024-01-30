import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-token-expiration-timer',
  templateUrl: './token-expiration-timer.component.html',
  styleUrls: ['./token-expiration-timer.component.css'],
  providers: [DatePipe], // Add DatePipe to the component providers
})
export class TokenExpirationTimerComponent implements OnInit, OnDestroy {
  @Input() expirationDate!: Date | null;

  remainingTime: string | null = null;
  private intervalId?: number;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCountdown(): void {
    if (!this.expirationDate) {
      this.remainingTime = 'Expiration date is not set.';
      return;
    }

    const expiryDate = new Date(this.expirationDate);
    if (isNaN(expiryDate.getTime())) {
      this.remainingTime = 'Invalid expiration date.';
      return;
    }

    this.intervalId = window.setInterval(() => {
      const now = new Date();
      const distance = expiryDate.getTime() - now.getTime();

      if (distance < 0) {
        clearInterval(this.intervalId);
        this.remainingTime = 'Token has expired.';
        return;
      }

      this.updateRemainingTime(distance);
    }, 1000);
  }

  private updateRemainingTime(distance: number): void {
    // Using Angular's DatePipe for formatting
    const formattedTime = this.datePipe.transform(distance, 'HH:mm:ss', 'UTC');
    this.remainingTime = formattedTime
      ? `Token expires in: ${formattedTime}`
      : 'Calculating...';
  }
}
