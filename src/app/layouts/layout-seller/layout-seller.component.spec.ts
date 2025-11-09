import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSellerComponent } from './layout-seller.component';

describe('LayoutSellerComponent', () => {
  let component: LayoutSellerComponent;
  let fixture: ComponentFixture<LayoutSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
