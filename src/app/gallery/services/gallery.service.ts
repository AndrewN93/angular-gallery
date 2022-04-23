import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppResponseFailed } from 'src/app/core/typings/app-api.types';
import { GalleryItem } from '../typings/gallery-item';
import { GalleryDataStorageService } from './gallery-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private loadedImages = new BehaviorSubject<GalleryItem[]>([]);
  private isTotalItemsReached = new BehaviorSubject<boolean>(false);
  
  isTotalItemsReached$ = this.isTotalItemsReached.asObservable();
  loadedImages$ = this.loadedImages.asObservable();
  page = 0;
  pageSize = 6;

  constructor(private galleryDataStorageService: GalleryDataStorageService) { }

  loadMore(): Promise<void> {
    return new Promise((resolve, reject) => {
      const [start, end] = this.resolvePagingParams();
      this.galleryDataStorageService.getGalleryImages(start, end)
        .subscribe((result) => {
          if (result instanceof AppResponseFailed) {
            reject(result.errorMessage);
            return;
          }

          if (result?.data) {
            const allLoaded = [...this.loadedImages.getValue(), ...result.data]
            this.loadedImages.next(allLoaded);
            this.isTotalItemsReached.next(result?.totalLength! === allLoaded.length);
            this.page++;
            resolve();
          }
        });
    })
  }

  resolvePagingParams(): [number, number] {
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    return [start, end];
  }
}
