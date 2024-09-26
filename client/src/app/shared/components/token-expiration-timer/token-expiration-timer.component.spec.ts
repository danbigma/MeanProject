import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenExpirationTimerComponent } from './token-expiration-timer.component';

describe('TokenExpirationTimerComponent', () => {
  let component: TokenExpirationTimerComponent;
  let fixture: ComponentFixture<TokenExpirationTimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenExpirationTimerComponent]
    });
    fixture = TestBed.createComponent(TokenExpirationTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
