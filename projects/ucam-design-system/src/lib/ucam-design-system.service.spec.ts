import { TestBed } from '@angular/core/testing';

import { UcamDesignSystemService } from './ucam-design-system.service';

describe('UcamDesignSystemService', () => {
  let service: UcamDesignSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UcamDesignSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
