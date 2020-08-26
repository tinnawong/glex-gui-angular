import { TestBed } from '@angular/core/testing';

import { ServiceApiService } from './service-api.service';

describe('ServiceApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceApiService = TestBed.get(ServiceApiService);
    expect(service).toBeTruthy();
  });
});
