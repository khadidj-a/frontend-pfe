import { TestBed } from '@angular/core/testing';

import { TypeeqService } from './typeeq.service';

describe('TypeeqService', () => {
  let service: TypeeqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeeqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
