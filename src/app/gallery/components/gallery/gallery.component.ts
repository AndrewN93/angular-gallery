import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GalleryService } from '../../services/gallery.service';
import { GalleryItem } from '../../typings/gallery-item';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  isLoading$ = this.galleryService.isLoading$;
  isError$ = this.galleryService.isError$;
  loadedImages$: Observable<GalleryItem[]> = this.galleryService.loadedImages$;

  constructor(private galleryService: GalleryService) { }

  ngOnInit(): void {
    this.loadMore();
  }
  
  loadMore() {
    this.galleryService.loadMore();
  }
}
