import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDemoComponent } from './map-demo.component';

describe('MapDemoComponent', () => {
  let component: MapDemoComponent;
  let fixture: ComponentFixture<MapDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapDemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
