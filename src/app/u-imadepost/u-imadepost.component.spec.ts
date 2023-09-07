import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UImadepostComponent } from './u-imadepost.component';

describe('UImadepostComponent', () => {
  let component: UImadepostComponent;
  let fixture: ComponentFixture<UImadepostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UImadepostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UImadepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
