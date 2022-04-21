import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GallaryFavouritesListComponent } from './components/gallary-favourites-list/gallary-favourites-list.component';
import { GalleryItemComponent } from './components/gallery-item/gallery-item.component';
import { GalleryComponent } from './components/gallery/gallery.component';

const routes: Routes = [
  {path: '', component: GalleryComponent},
  {path: 'photo/:id', component: GalleryItemComponent},
  {path: 'favourites', component: GallaryFavouritesListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
