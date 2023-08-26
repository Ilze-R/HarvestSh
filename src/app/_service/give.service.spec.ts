import { TestBed } from '@angular/core/testing';

import { GiveService } from './give.service';

describe('GiveService', () => {
  let service: GiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
