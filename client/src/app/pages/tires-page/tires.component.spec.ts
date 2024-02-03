import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiresComponent } from './tires.component';

describe('TiresComponent', () => {
  let component: TiresComponent;
  let fixture: ComponentFixture<TiresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TiresComponent]
    });
    fixture = TestBed.createComponent(TiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
