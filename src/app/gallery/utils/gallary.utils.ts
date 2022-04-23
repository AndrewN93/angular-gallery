import { GalleryItem } from "../typings/gallery-item";

export const generateGallaryItems = (amount: number) => {
 return Array.from(Array(amount), (_i, ndx) => new GalleryItem(ndx));
}