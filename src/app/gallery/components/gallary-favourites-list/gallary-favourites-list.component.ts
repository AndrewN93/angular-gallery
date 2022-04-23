import { Component, OnInit } from '@angular/core';
import { AppResponseFailed, AppResponseSuccess } from 'src/app/core/typings/app-api.types';
import { GalleryDataStorageService } from '../../services/gallery-data-storage.service';
import { GalleryItem } from '../../typings/gallery-item';

@Component({
  selector: 'app-gallary-favourites-list',
  templateUrl: './gallary-favourites-list.component.html',
  styleUrls: ['./gallary-favourites-list.component.scss']
})
export class GallaryFavouritesListComponent implements OnInit {
  loadedImages: GalleryItem[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private galleryDataStorageService: GalleryDataStorageService) { }

  get isEmpty() {
    return !this.loadedImages.length && !this.errorMessage && !this.isLoading;
  }
  
  ngOnInit() {
    this.isLoading = true;
    this.galleryDataStorageService.getFavouriteImages().subscribe(response => {

      if (response instanceof AppResponseFailed) {
        this.errorMessage = 'Something went wrong';
      }

      if (response instanceof AppResponseSuccess) {
        this.loadedImages = response.data;
      }
      this.isLoading = false;
    })
  }
}
