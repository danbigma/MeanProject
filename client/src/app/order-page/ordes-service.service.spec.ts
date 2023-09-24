import { TestBed } from '@angular/core/testing';

import { OrdesServiceService } from './ordes-service.service';

describe('OrdesServiceService', () => {
  let service: OrdesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
