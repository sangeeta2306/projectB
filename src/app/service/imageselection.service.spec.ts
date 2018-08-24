import { TestBed, inject } from '@angular/core/testing';

import { ImageselectionService } from './imageselection.service';

describe('ImageselectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageselectionService]
    });
  });

  it('should be created', inject([ImageselectionService], (service: ImageselectionService) => {
    expect(service).toBeTruthy();
  }));
});
