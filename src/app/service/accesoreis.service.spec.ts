import { TestBed } from '@angular/core/testing';

import { AccesoreisService } from './accesoreis.service';

describe('AccesoreisService', () => {
  let service: AccesoreisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesoreisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
