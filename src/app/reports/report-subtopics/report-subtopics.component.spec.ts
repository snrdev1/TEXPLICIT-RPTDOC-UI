import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSubtopicsComponent } from './report-subtopics.component';

describe('ReportSubtopicsComponent', () => {
  let component: ReportSubtopicsComponent;
  let fixture: ComponentFixture<ReportSubtopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSubtopicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSubtopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
