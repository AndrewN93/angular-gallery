import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallaryFavouritesListComponent } from './gallary-favourites-list.component';

describe('GallaryFavouritesListComponent', () => {
  let component: GallaryFavouritesListComponent;
  let fixture: ComponentFixture<GallaryFavouritesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallaryFavouritesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallaryFavouritesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
