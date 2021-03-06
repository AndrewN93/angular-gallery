import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './components/gallery/gallery.component';
import { SpinnerModule } from '../shared/spinner/spinner.module';
import { GalleryCardComponent } from './components/gallery-card/gallery-card.component';
import { GalleryItemComponent } from './components/gallery-item/gallery-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { GallaryFavouritesListComponent } from './components/gallary-favourites-list/gallary-favourites-list.component';
import { InfiniteScrollModule } from '../shared/infinite-scroll/infinite-scroll.module';

@NgModule({
  declarations: [
    GalleryComponent,
    GalleryCardComponent,
    GalleryItemComponent,
    GallaryFavouritesListComponent
  ],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    SpinnerModule,
    MatCardModule,
    MatButtonModule,
    InfiniteScrollModule,
  ]
})
export class GalleryModule { }
