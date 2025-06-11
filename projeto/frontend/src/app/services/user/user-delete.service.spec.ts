import { TestBed } from '@angular/core/testing';

import { UserDeleteService } from './user-delete.service';

describe('UserDeleteService', () => {
  let service: UserDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
