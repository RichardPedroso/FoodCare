import { TestBed } from '@angular/core/testing';

import { DonationProductCreateService } from './donation-product-create.service';



describe('UserCreateService', () => {
  let service: DonationProductCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationProductCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

