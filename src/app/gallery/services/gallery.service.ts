import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppResponseFailed } from 'src/app/core/typings/app-api.types';
import { GalleryItem } from '../typings/gallery-item';
import { GalleryDataStorageService } from './gallery-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private loadedImages = new BehaviorSubject<GalleryItem[]>([]);
  
  loadedImages$ = this.loadedImages.asObservable();
  page = 0;
  pageSize = 6;
  totalItems: number = 0;

  constructor(private galleryDataStorageService: GalleryDataStorageService) { }

  loadMore(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.page++;
      const [start, end] = this.resolvePagingParams();
      this.galleryDataStorageService.getGalleryImages(start, end)
        .subscribe((result) => {
          if (result instanceof AppResponseFailed) {
            reject(result.errorMessage);
            return;
          }

          if (result?.data?.length) {
            this.loadedImages.next([...this.loadedImages.getValue(), ...result.data]);
            resolve(false);
            this.totalItems = result?.totalLength!;
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
