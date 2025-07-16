import { TestBed } from '@angular/core/testing';

import { MunicipalityCreateService } from './municipality-create.service';


describe('UserCreateService', () => {
  let service: MunicipalityCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MunicipalityCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
