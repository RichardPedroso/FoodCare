import { TestBed } from '@angular/core/testing';

import { ProductCreateService } from './product-create.service';

describe('ProductCreateService', () => {
  let service: ProductCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
