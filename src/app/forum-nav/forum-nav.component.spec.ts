import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumNavComponent } from './forum-nav.component';

describe('ForumNavComponent', () => {
  let component: ForumNavComponent;
  let fixture: ComponentFixture<ForumNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
