import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UGardeningpostComponent } from './u-gardeningpost.component';

describe('UGardeningpostComponent', () => {
  let component: UGardeningpostComponent;
  let fixture: ComponentFixture<UGardeningpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UGardeningpostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UGardeningpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
