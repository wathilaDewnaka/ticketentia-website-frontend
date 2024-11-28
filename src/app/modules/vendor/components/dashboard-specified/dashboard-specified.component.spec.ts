import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSpecifiedComponent } from './dashboard-specified.component';

describe('DashboardSpecifiedComponent', () => {
  let component: DashboardSpecifiedComponent;
  let fixture: ComponentFixture<DashboardSpecifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSpecifiedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSpecifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
