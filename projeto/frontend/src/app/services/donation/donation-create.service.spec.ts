import { TestBed } from '@angular/core/testing';

import { DonationCreateService } from './donation-create.service';


describe('UserCreateService', () => {
  let service: DonationCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
