import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AppResponseSuccess } from 'src/app/core/typings/app-api.types';
import { GalleryDataStorageService } from '../../services/gallery-data-storage.service';
import { GalleryItem } from '../../typings/gallery-item';

@Component({
  selector: 'app-gallery-item',
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.scss']
})
export class GalleryItemComponent implements OnInit, OnDestroy {
  isError = false;
  isLoading = false;
  isSubmitting = false;
  currentItem: GalleryItem | undefined;
  destroy$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private galleryDataStorageService: GalleryDataStorageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        map(params => Number(params.get('id'))),
        tap(() => this.isLoading = true),
        switchMap(itemId => this.galleryDataStorageService.getGalleryImage(itemId)),
        takeUntil(this.destroy$),
      ).subscribe(response => {
        if (response instanceof AppResponseSuccess) {
          this.currentItem = response.data;
        } else {
          this.isError = true;
          this.currentItem = undefined;
        };
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  updateFavouriteStatus(id: number) {
    this.galleryDataStorageService.setFavouriteStatus(id).subscribe(() => {
      this.isSubmitting = false;
    });
  }
}
