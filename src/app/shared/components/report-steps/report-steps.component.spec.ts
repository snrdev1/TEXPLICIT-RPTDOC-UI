import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStepsComponent } from './report-steps.component';

describe('ReportStepsComponent', () => {
  let component: ReportStepsComponent;
  let fixture: ComponentFixture<ReportStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportStepsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
