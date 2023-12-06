import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsToMyDocComponent } from './news-to-my-doc.component';

describe('NewsToMyDocComponent', () => {
  let component: NewsToMyDocComponent;
  let fixture: ComponentFixture<NewsToMyDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsToMyDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsToMyDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
