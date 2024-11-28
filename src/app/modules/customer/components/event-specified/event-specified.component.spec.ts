import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSpecifiedComponent } from './event-specified.component';

describe('EventSpecifiedComponent', () => {
  let component: EventSpecifiedComponent;
  let fixture: ComponentFixture<EventSpecifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSpecifiedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSpecifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
