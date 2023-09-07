import { ComponentFixture, TestBed } from '@angular/core/testing';

import { URecipepostComponent } from './u-recipepost.component';

describe('URecipepostComponent', () => {
  let component: URecipepostComponent;
  let fixture: ComponentFixture<URecipepostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ URecipepostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(URecipepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
