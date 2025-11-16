import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageGlobalComponent } from './home-page-global.component';

describe('HomePageGlobalComponent', () => {
  let component: HomePageGlobalComponent;
  let fixture: ComponentFixture<HomePageGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageGlobalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
