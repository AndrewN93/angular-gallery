import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { asyncScheduler, delay, of } from 'rxjs';
import { AppResponseFailed, AppResponseSuccess } from 'src/app/core/typings/app-api.types';
import { InfiniteScrollDirective } from 'src/app/shared/infinite-scroll/infinite-scroll.directive';
import { InfiniteScrollModule } from 'src/app/shared/infinite-scroll/infinite-scroll.module';
import { SpinnerComponent } from 'src/app/shared/spinner/components/spinner.component';
import { SpinnerModule } from 'src/app/shared/spinner/spinner.module';
import { GalleryDataStorageService } from '../../services/gallery-data-storage.service';
import { generateGallaryItems } from '../../utils/gallary.utils';
import { GallaryFavouritesListComponent } from './gallary-favourites-list.component';

describe('GallaryFavouritesListComponent', () => {
  let component: GallaryFavouritesListComponent;
  let service: any;
  let fixture: ComponentFixture<GallaryFavouritesListComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallaryFavouritesListComponent ],
      imports: [InfiniteScrollModule, SpinnerModule],
      providers: [
        { 
          provide: GalleryDataStorageService, 
          useValue: jasmine.createSpyObj('GalleryDataStorageService', ['getFavouriteImages']),
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents()

    fixture = TestBed.createComponent(GallaryFavouritesListComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    service = TestBed.inject(GalleryDataStorageService);
  });

  it('should call getFavouriteImages on gallery data service once component init', () => {
    service.getFavouriteImages.and.returnValue(of());
    component.ngOnInit();
    expect(service.getFavouriteImages).toHaveBeenCalled();
  });

  it('should show no results block message if no any favourites', () => {
    service.getFavouriteImages.and.returnValue(of(new AppResponseSuccess([])));
    component.ngOnInit();
    fixture.detectChanges();
    const noDataBlock = el.queryAll(By.css('.no-results'))
    expect(noDataBlock.length).toEqual(1);
  });

  it('should show right amount of fetched gallery cards', () => {
    const itemsCount = 5;
    const dumyItems = generateGallaryItems(itemsCount);
    service.getFavouriteImages.and.returnValue(of(new AppResponseSuccess(dumyItems)));
    component.ngOnInit();
    fixture.detectChanges();
    const cards = el.queryAll(By.css('.gallery-favourite-card'))
    expect(cards.length).toEqual(itemsCount);
  });

  it('should show error message block on failed response', () => {
    service.getFavouriteImages.and.returnValue(of(new AppResponseFailed('')));
    component.ngOnInit();
    fixture.detectChanges();
    const [erroBlock] = el.queryAll(By.css('.error-block'))
    expect(erroBlock).toBeDefined();
  });

  it('should show loading spinner while request processing', (done) => {
    service.getFavouriteImages.and.returnValue(of(new AppResponseFailed('')).pipe(delay(2000)));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.isLoading).toBeFalse();
      done();
    });
  });
});
