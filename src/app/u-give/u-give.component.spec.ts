import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UGiveComponent } from './u-give.component';

describe('UGiveComponent', () => {
  let component: UGiveComponent;
  let fixture: ComponentFixture<UGiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UGiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UGiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
