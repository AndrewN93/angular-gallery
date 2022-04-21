import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { AppResponseFailed, AppResponseSuccess } from 'src/app/core/typings/app-api.types';
import { GalleryItem } from '../typings/gallery-item';
import { generateGallaryItems } from '../utils/gallary.utils';

export type AppGalleryResponse<T = GalleryItem> = AppResponseSuccess<T> | AppResponseFailed;

@Injectable()
export class GalleryDataStorageService {
  galleryItemsStorage: GalleryItem[] = generateGallaryItems(100);

  get galleryLength() {
    return this.galleryItemsStorage.length;
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

  responseWithDelay<T>(response: T): Observable<T> {
    return of(response).pipe(delay(3000));
  }
}