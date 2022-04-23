import { Component, Input } from '@angular/core';
import { GalleryItem } from '../../typings/gallery-item';

@Component({
  selector: 'app-gallery-card',
  templateUrl: './gallery-card.component.html',
  styleUrls: ['./gallery-card.component.scss']
})
export class GalleryCardComponent {
  @Input() card!: GalleryItem;
}
