import { TestBed } from '@angular/core/testing';

import { Breathing } from './breathing';

describe('Breathing', () => {
  let service: Breathing;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Breathing);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
