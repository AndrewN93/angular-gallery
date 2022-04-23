import { InfiniteScrollDirective } from './infinite-scroll.directive';

describe('InfiniteScrollDirective', () => {
  const zoneSpy = jasmine.createSpyObj('zone', ['runOutsideAngular', 'run']);
  const directive = new InfiniteScrollDirective(zoneSpy);

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should not emit an event once scroll not in the bottom', () => {
    const scrollPostion = {
      height: 1000, 
      scrolledUntilNow: 500
    };
    spyOn(directive, 'resolveCurrentPosition').and.callFake(() => scrollPostion);
    spyOn(directive.scrolled, 'emit');
    directive.scrollHandler();
    expect(directive.scrolled.emit).not.toHaveBeenCalled();
  });

  it('should emit an event once scrolled to the bottom', () => {
    const scrollPostion = {
      height: 1000, 
      scrolledUntilNow: 980
    };
    spyOn(directive, 'resolveCurrentPosition').and.callFake(() => scrollPostion);
    spyOn(directive.scrolled, 'emit');
    directive.scrollHandler();
    expect(directive.scrolled.emit).toHaveBeenCalled();
  });
});
