import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoRequestDialogComponent } from './demo-request-dialog.component';

describe('DemoRequestDialogComponent', () => {
  let component: DemoRequestDialogComponent;
  let fixture: ComponentFixture<DemoRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoRequestDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
