import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUpdateCardsComponent } from './report-update-cards.component';

describe('ReportUpdateCardsComponent', () => {
  let component: ReportUpdateCardsComponent;
  let fixture: ComponentFixture<ReportUpdateCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportUpdateCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportUpdateCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
