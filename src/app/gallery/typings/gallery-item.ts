export class GalleryItem {
  public readonly imageUrl: string = 'https://random.imagecdn.app/500/150'
  public readonly title: string

  constructor(public readonly id: number) {
    this.title = `Image number ${id}`
  }
}
