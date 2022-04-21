import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponseSuccess } from 'src/app/core/typings/app-api.types';
import { GalleryDataStorageService } from '../../services/gallery-data-storage.service';
import { GalleryService } from '../../services/gallery.service';
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
  
  ngOnInit() {
    this.isLoading = true;
    this.galleryDataStorageService.getFavouriteImages().subscribe(response => {
      if (response instanceof AppResponseSuccess) {
        this.loadedImages = response.data;
      }
      this.isLoading = false;
    })
  }
}
