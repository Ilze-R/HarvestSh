import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImadeComponent } from './imade.component';

describe('ImadeComponent', () => {
  let component: ImadeComponent;
  let fixture: ComponentFixture<ImadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
