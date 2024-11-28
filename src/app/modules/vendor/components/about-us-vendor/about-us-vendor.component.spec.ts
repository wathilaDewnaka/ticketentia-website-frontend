import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsVendorComponent } from './about-us-vendor.component';

describe('AboutUsVendorComponent', () => {
  let component: AboutUsVendorComponent;
  let fixture: ComponentFixture<AboutUsVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsVendorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
