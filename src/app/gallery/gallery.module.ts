import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './components/gallery/gallery.component';
import { GalleryDataStorageService } from './services/gallery-data-storage.service';
import { SpinnerModule } from '../shared/spinner/spinner.module';

@NgModule({
  declarations: [
    GalleryComponent
  ],
  providers: [
    GalleryDataStorageService,
  ],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    SpinnerModule
  ]
})
export class GalleryModule { }
