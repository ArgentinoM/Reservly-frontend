import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteServicesPageComponent } from './favorite-services-page.component';

describe('FavoriteServicesPageComponent', () => {
  let component: FavoriteServicesPageComponent;
  let fixture: ComponentFixture<FavoriteServicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteServicesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteServicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
