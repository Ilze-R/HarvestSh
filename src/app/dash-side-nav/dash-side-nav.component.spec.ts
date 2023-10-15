import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSideNavComponent } from './dash-side-nav.component';

describe('DashSideNavComponent', () => {
  let component: DashSideNavComponent;
  let fixture: ComponentFixture<DashSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashSideNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
