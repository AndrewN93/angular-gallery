import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppResponseFailed } from 'src/app/core/typings/app-api.types';
import { GalleryItem } from '../typings/gallery-item';
import { GalleryDataStorageService } from './gallery-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  isLoading = new Subject();
  isLoading$ = this.isLoading.asObservable();
  isError = new Subject();
  isError$ = this.isError.asObservable();
  loadedImages = new BehaviorSubject<GalleryItem[]>([]);
  loadedImages$ = this.loadedImages.asObservable();

  page = 1;
  pageSize = 6;
  // maxPages: number;

  constructor(private galleryDataStorageService: GalleryDataStorageService) { }

  loadMore() {
    this.page++;
    const allLoaded = this.loadedImages.getValue();
    const start = allLoaded.length;
    const end = allLoaded.length + this.pageSize;

    this.isLoading.next(true);
    this.galleryDataStorageService.getGalleryImages(start, end)
      .subscribe((result) => {
        if (result instanceof AppResponseFailed) {
          this.isError.next('Something went wrong');
          return;
        }

        if (result?.data?.length) {
          this.loadedImages.next([...allLoaded, ...result.data]);
        }
        
        this.isLoading.next(false);
      });


  }


}
