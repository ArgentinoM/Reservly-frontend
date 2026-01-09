import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoByServiceComponent } from './info-by-service.component';

describe('InfoByServiceComponent', () => {
  let component: InfoByServiceComponent;
  let fixture: ComponentFixture<InfoByServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoByServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoByServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
