import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesSellerComponent } from './services-seller.component';

describe('ServicesSellerComponent', () => {
  let component: ServicesSellerComponent;
  let fixture: ComponentFixture<ServicesSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
