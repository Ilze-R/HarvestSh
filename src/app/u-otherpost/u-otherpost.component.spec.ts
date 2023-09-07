import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UOtherpostComponent } from './u-otherpost.component';

describe('UOtherpostComponent', () => {
  let component: UOtherpostComponent;
  let fixture: ComponentFixture<UOtherpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UOtherpostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UOtherpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
