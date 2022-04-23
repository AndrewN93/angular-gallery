import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppResponseFailed, AppResponseSuccess } from 'src/app/core/typings/app-api.types';

import { GalleryDataStorageService } from './gallery-data-storage.service';

describe('GalleryDataStorageService', () => {
  let service: GalleryDataStorageService;
  let store: { [key: string]: string };

  const mockLocalStorage = {
    getItem: (key: string): string | null => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalleryDataStorageService);
    store = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should respond with delay of 200-500ms', (done) => {
    const timeStart = new Date().getTime();
    service.responseWithDelay([]).subscribe(() => {
      const timeEnd = new Date().getTime();
      expect(timeEnd - timeStart).toBeGreaterThanOrEqual(200);
      expect(timeEnd - timeStart).toBeLessThanOrEqual(500);
      done();
    });
  });

  describe('Favourites: ', () => {

    const setAsFavourites = (service: GalleryDataStorageService, ids: number[]) => {
      service.galleryItemsStorage.forEach(item => {
        if (ids.includes(item.id)) {
          item.isFavourite = true;
        }
      });
    };

    beforeEach(() => {
      service = TestBed.inject(GalleryDataStorageService);
      store = {};

      spyOn(localStorage, 'getItem')
        .and.callFake(mockLocalStorage.getItem);
      spyOn(localStorage, 'setItem')
        .and.callFake(mockLocalStorage.setItem);
    });

    it('should update favourites from LS', () => {
      const itemId = 1;
      store[service.storageKey] = JSON.stringify([itemId]);
      const serviceInstance = new GalleryDataStorageService();
      const galleryItem = serviceInstance.galleryItemsStorage.find(item => item.id === itemId);

      expect(localStorage.getItem).toHaveBeenCalled();
      expect(galleryItem?.isFavourite).toBeTrue();
    });

    it('should save favourite items to LS', () => {
      const favourites = [1, 2, 3];
      const serviceInstance = new GalleryDataStorageService();

      setAsFavourites(serviceInstance, favourites);
      serviceInstance.persistFavourites();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        serviceInstance.storageKey,
        JSON.stringify(favourites)
      );
    });

    it('should return success response on update favourite statu if item exists', (done) => {
      const testId = 1;
      spyOn(service, 'setFavouriteStatus').and.callThrough();
      service.setFavouriteStatus(testId).subscribe((response) => {
        expect(response).toBeInstanceOf(AppResponseSuccess);
        done();
      });
    });

    it('should return error response on update favourite statu if item NOT exists', (done) => {
      const testId = 11892;
      spyOn(service, 'setFavouriteStatus').and.callThrough();
      service.setFavouriteStatus(testId).subscribe((response) => {
        expect(response).toBeInstanceOf(AppResponseFailed);
        done();
      });
    });

    it('shold return all favourites', (done) => {
      const favourites = [1,2,3,4,5];
      setAsFavourites(service, favourites);

      service.getFavouriteImages().subscribe((response) => {
        expect(response.data.length).toEqual(favourites.length);
        done();
      });

    });

    
    it('should return with delay', () => {
      spyOn(service, 'responseWithDelay').and.callFake((data) => of(data));

      service.getFavouriteImages();
      service.setFavouriteStatus(11);
      expect(service.responseWithDelay).toHaveBeenCalledTimes(2);
    });

  });

  describe('Gallery', () => {
    beforeEach(() => {
      service = TestBed.inject(GalleryDataStorageService);
      store = {};
    });
    it('should return correct range', () => {
      const elementsToFetch = 15;
      const requested = service.getRange(0, elementsToFetch);
      expect(requested.length).toEqual(elementsToFetch);
    });

    it('should return max amount if requested more than exist', () => {
      const overflowedEnd = service.galleryItemsStorage.length + 100;
      const requested = service.getRange(0, overflowedEnd);
      expect(requested.length).toEqual(service.galleryItemsStorage.length);
    });

    it('should return success response on item request if item exists', (done) => {
      const testId = 1;
      service.getGalleryImage(testId).subscribe((response) => {
        expect(response).toBeInstanceOf(AppResponseSuccess);
        done();
      });
    });

    it('should return failed response on item request if item NOT exists', (done) => {
      const testId = service.galleryLength + 100;
      service.getGalleryImage(testId).subscribe((response) => {
        expect(response).toBeInstanceOf(AppResponseFailed);
        done();
      });
    });

    it('should return with delay', () => {
      spyOn(service, 'responseWithDelay').and.callFake((data) => of(data));
      service.getGalleryImages(0, 15);
      service.getGalleryImage(1);

      expect(service.responseWithDelay).toHaveBeenCalledTimes(2);
    });
  })
});
