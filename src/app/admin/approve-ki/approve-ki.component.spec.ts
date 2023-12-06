import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveKiComponent } from './approve-ki.component';

describe('ApproveKiComponent', () => {
  let component: ApproveKiComponent;
  let fixture: ComponentFixture<ApproveKiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveKiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveKiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
