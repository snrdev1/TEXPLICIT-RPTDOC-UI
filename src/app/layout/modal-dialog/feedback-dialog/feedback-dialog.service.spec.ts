import { TestBed } from '@angular/core/testing';

import { FeedbackDialogService } from './feedback-dialog.service';

describe('FeedbackDialogService', () => {
  let service: FeedbackDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
