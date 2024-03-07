import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSourcesComponent } from './chat-sources.component';

describe('ChatSourcesComponent', () => {
  let component: ChatSourcesComponent;
  let fixture: ComponentFixture<ChatSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatSourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
