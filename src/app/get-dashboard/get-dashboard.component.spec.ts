import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDashboardComponent } from './get-dashboard.component';

describe('GetDashboardComponent', () => {
  let component: GetDashboardComponent;
  let fixture: ComponentFixture<GetDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
