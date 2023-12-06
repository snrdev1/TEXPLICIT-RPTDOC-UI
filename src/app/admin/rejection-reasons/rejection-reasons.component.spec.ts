import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionReasonsComponent } from './rejection-reasons.component';

describe('RejectionReasonsComponent', () => {
  let component: RejectionReasonsComponent;
  let fixture: ComponentFixture<RejectionReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectionReasonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
