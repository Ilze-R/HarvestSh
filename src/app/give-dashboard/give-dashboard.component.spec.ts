import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveDashboardComponent } from './give-dashboard.component';

describe('GiveDashboardComponent', () => {
  let component: GiveDashboardComponent;
  let fixture: ComponentFixture<GiveDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiveDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
