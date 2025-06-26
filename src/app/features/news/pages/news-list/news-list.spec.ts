import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsList } from './news-list';
import { NewsService } from '../../../../core/services/news';
import { of, Subject } from 'rxjs';

describe('NewsList', () => {
  let component: NewsList;
  let fixture: ComponentFixture<NewsList>;
  let newsServiceSpy: jasmine.SpyObj<NewsService>;
  let loadingSubject: Subject<boolean>;
  let hasMoreSubject: Subject<boolean>;

  beforeEach(async () => {
    loadingSubject = new Subject<boolean>();
    hasMoreSubject = new Subject<boolean>();
    const spy = jasmine.createSpyObj('NewsService', ['fetchNews', 'loadMore'], {
      loading$: loadingSubject.asObservable(),
      error$: of(null),
      success$: of(null),
      combinedNews$: of([]),
      search$: of(''),
      hasMore$: hasMoreSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [NewsList],
      providers: [{ provide: NewsService, useValue: spy }]
    }).compileComponents();

    newsServiceSpy = TestBed.inject(NewsService) as jasmine.SpyObj<NewsService>;
    fixture = TestBed.createComponent(NewsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchNews on init', () => {
    expect(newsServiceSpy.fetchNews).toHaveBeenCalled();
  });

  it('loadMore method should call newsService.loadMore', () => {
    component.loadMore();
    expect(newsServiceSpy.loadMore).toHaveBeenCalled();
  });

  it('should not load more when scrolling if loading or no more', () => {
    loadingSubject.next(true);
    hasMoreSubject.next(false);
    component.onWindowScroll();
    expect(newsServiceSpy.loadMore).not.toHaveBeenCalled();

    loadingSubject.next(false);
    hasMoreSubject.next(true);
    // Simular scroll reaching bottom
    spyOnProperty(window, 'innerHeight').and.returnValue(1000);
    spyOnProperty(window, 'scrollY').and.returnValue(1000);
    spyOnProperty(document.documentElement, 'scrollHeight').and.returnValue(1500);

    component.onWindowScroll();
    expect(newsServiceSpy.loadMore).toHaveBeenCalled();
  });
});
