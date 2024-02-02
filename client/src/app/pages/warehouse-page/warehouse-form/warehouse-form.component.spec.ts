import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseFormComponent } from './warehouse-form.component';

describe('WarehouseFormComponent', () => {
  let component: WarehouseFormComponent;
  let fixture: ComponentFixture<WarehouseFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseFormComponent]
    });
    fixture = TestBed.createComponent(WarehouseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
