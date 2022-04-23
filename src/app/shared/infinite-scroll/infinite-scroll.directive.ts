import { Directive, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { filter, fromEvent, Subject, takeUntil, throttleTime } from 'rxjs';

interface IPosition {
  height: number;
  scrolledUntilNow: number;
}

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Output() scrolled = new EventEmitter();
  @Input() appInfiniteScrollDisabled = false;

  private distanceDown = 50;
  private destroy$ = new Subject<void>();

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(window, 'scroll')
        .pipe(
          throttleTime(50),
          filter(() => !this.appInfiniteScrollDisabled),
          takeUntil(this.destroy$),
        ).subscribe(() => {
          this.zone.run(() =>  this.scrollHandler())
        });
    });
  }
    
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollHandler() {
    const currentPosition = this.resolveCurrentPosition()
    if (this.shouldScroll(currentPosition)) {
      this.scrolled.emit();
    }
  }

  resolveCurrentPosition(): IPosition {
    const height = document.documentElement.offsetHeight;
    const scrolledUntilNow = window.innerHeight + window.pageYOffset;

    return { height, scrolledUntilNow };
  }

  shouldScroll({ height, scrolledUntilNow }: IPosition) {
    const containerBreakpoint = height - this.distanceDown;
    const shouldScroll: boolean = scrolledUntilNow >= containerBreakpoint;

    return shouldScroll;
  }
}
