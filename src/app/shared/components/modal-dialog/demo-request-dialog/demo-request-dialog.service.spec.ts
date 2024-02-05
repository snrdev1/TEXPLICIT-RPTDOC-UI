import { TestBed } from '@angular/core/testing';

import { DemoRequestDialogService } from './demo-request-dialog.service';

describe('DemoRequestDialogService', () => {
  let service: DemoRequestDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoRequestDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
