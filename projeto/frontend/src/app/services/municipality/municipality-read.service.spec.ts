import { TestBed } from '@angular/core/testing';

import { MunicipalityReadService } from './municipality-read.service';


describe('UserCreateService', () => {
  let service: MunicipalityReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MunicipalityReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
