import { TestBed } from '@angular/core/testing';

import { LoanService } from './loan-service.service';

describe('LoanServiceService', () => {
  let service: LoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
