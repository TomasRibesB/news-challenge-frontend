import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { NewsService } from './core/services/news';
import { of } from 'rxjs';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let newsServiceSpy: jasmine.SpyObj<NewsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('NewsService', ['clearError', 'clearSuccess'], {
      error$: of(null),
      success$: of(null)
    });

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: NewsService, useValue: spy }]
    }).compileComponents();

    newsServiceSpy = TestBed.inject(NewsService) as jasmine.SpyObj<NewsService>;
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('clearError should call newsService.clearError', () => {
    component.clearError();
    expect(newsServiceSpy.clearError).toHaveBeenCalled();
  });

  it('clearSuccess should call newsService.clearSuccess', () => {
    component.clearSuccess();
    expect(newsServiceSpy.clearSuccess).toHaveBeenCalled();
  });
});
