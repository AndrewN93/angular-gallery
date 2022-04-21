import { TestBed } from '@angular/core/testing';

import { GalleryDataStorageService } from './gallery-data-storage.service';

describe('GalleryDataStorageService', () => {
  let service: GalleryDataStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalleryDataStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
