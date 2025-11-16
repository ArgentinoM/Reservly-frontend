import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCatalogComponent } from './info-catalog.component';

describe('InfoCatalogComponent', () => {
  let component: InfoCatalogComponent;
  let fixture: ComponentFixture<InfoCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCatalogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
