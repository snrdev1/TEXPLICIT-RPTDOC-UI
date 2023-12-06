import { TestBed } from '@angular/core/testing';

import { MydocumentsService } from './mydocuments.service';

describe('MydocumentsService', () => {
  let service: MydocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MydocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
