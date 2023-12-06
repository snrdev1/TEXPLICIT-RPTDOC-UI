import { TestBed } from '@angular/core/testing';

import { PathAuthGuard } from './path-auth.guard';

describe('PathAuthGuard', () => {
  let guard: PathAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PathAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
