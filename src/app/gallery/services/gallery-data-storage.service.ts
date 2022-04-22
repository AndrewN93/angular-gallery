import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { AppResponseFailed, AppResponseSuccess } from 'src/app/core/typings/app-api.types';
import { GalleryItem } from '../typings/gallery-item';
import { generateGallaryItems } from '../utils/gallary.utils';

export type AppGalleryResponse<T = GalleryItem> = AppResponseSuccess<T> | AppResponseFailed;

@Injectable({ providedIn: 'root' })
export class GalleryDataStorageService {
  private readonly storageKey = '[App] Gallery'
  galleryItemsStorage: GalleryItem[];
  
  get galleryLength() {
    return this.galleryItemsStorage.length;
  }

  constructor() {
    this.galleryItemsStorage = generateGallaryItems(36);

    let favouritesIdsString = localStorage.getItem(this.storageKey);

    if (!favouritesIdsString) return;

    const favouritesIds = JSON.parse(favouritesIdsString);

    if (Array.isArray(favouritesIds) && favouritesIds.length) {
      this.galleryItemsStorage.forEach(item => {
        if (favouritesIds.includes(item.id)) {
          item.isFavourite = true;
        }
      })
    }
  }

  persistFavourites() {
    const keysArr: number[] = this.galleryItemsStorage.reduce((acc: number[], curr) => {
      if (curr.isFavourite) {
        acc.push(curr.id);
      }
      return acc;
    }, []);
    localStorage.setItem(this.storageKey, JSON.stringify(keysArr));
  }

  getRange(start: number, end: number): GalleryItem[] {
    return this.galleryItemsStorage.slice(start, Math.min(end, this.galleryLength));
  }

  getGalleryImages(start: number, end: number): Observable<AppGalleryResponse<GalleryItem[]>> {
    if (start >= this.galleryLength) {
      this.responseWithDelay(new AppResponseFailed('Gallery items length is less than it was required')).pipe(delay(3000));
    }

    const fetchedImages = this.getRange(start, end);
    return this.responseWithDelay(new AppResponseSuccess(fetchedImages, this.galleryLength));
  }

  getGalleryImage(id: number): Observable<AppGalleryResponse> {
    const image = this.galleryItemsStorage.find(item => item.id === id);
    const result = image ? new AppResponseSuccess(image) : new AppResponseFailed(`Not found with id - ${id}`);

    return this.responseWithDelay(result);
  }

  getFavouriteImages() {
    const response = this.galleryItemsStorage.filter(item => item.isFavourite);

    return this.responseWithDelay(new AppResponseSuccess(response));
  }

  setFavouriteStatus(id: number) {
    const candidate = this.galleryItemsStorage.find(item => item.id === id);
    let result;

    if (candidate) {
      candidate.isFavourite = !candidate.isFavourite;
      this.persistFavourites();
      result = new AppResponseSuccess(true);
    } else {
      result = new AppResponseFailed('Image with ${id} does\'t exist');
    }

    return this.responseWithDelay(result);
  }

  responseWithDelay<T>(response: T): Observable<T> {
    // a random delay of 200-500ms. 
    const randomDelay = 200 + Math.floor(Math.random() * 300);
    return of(response).pipe(delay(randomDelay));
  }
}