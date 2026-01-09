import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsSellerComponent } from './reservations-seller.component';

describe('ReservationsSellerComponent', () => {
  let component: ReservationsSellerComponent;
  let fixture: ComponentFixture<ReservationsSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationsSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
