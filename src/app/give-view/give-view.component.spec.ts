import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveViewComponent } from './give-view.component';

describe('GiveViewComponent', () => {
  let component: GiveViewComponent;
  let fixture: ComponentFixture<GiveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiveViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
