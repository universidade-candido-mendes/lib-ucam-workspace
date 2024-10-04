import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcamDesignSystemComponent } from './ucam-design-system.component';

describe('UcamDesignSystemComponent', () => {
  let component: UcamDesignSystemComponent;
  let fixture: ComponentFixture<UcamDesignSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcamDesignSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcamDesignSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
