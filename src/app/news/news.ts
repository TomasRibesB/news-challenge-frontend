import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Spinner } from './components/spinner/spinner';
import { NewsService } from '../services/news';
import { NewsCard } from './components/news-card/news-card';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { New } from '../models/new';
import { LucideIconsModule } from '../shared/lucide-icons.module';
import { FeaturedNews } from './components/featured-news/featured-news';

@Component({
  selector: 'app-news',
  imports: [CommonModule, Spinner, NewsCard, LucideIconsModule, FeaturedNews],
  templateUrl: './news.html',
  styleUrls: ['./news.css'],
})
export class News {
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  displayed$: Observable<New[]>;
  searchQuery$: Observable<string>;
  hasMore$: Observable<boolean>;
  featured$: Observable<New | null>;
  others$: Observable<New[]>;

  constructor(public newsService: NewsService) {
    this.loading$ = this.newsService.loading$;
    this.error$ = this.newsService.error$;
    this.displayed$ = this.newsService.combinedNews$;
    this.searchQuery$ = this.newsService.search$;
    this.hasMore$ = this.newsService.hasMore$;

    // Separate featured and other news when not searching
    this.featured$ = combineLatest([this.searchQuery$, this.displayed$]).pipe(
      map(([search, list]) => !search && list.length > 0 ? list[0] : null)
    );
    this.others$ = combineLatest([this.searchQuery$, this.displayed$]).pipe(
      map(([search, list]) => !search && list.length > 0 ? list.slice(1) : list)
    );
  }

  retry() {
    this.newsService.fetchNews();
  }

  loadMore(): void {
    this.newsService.loadMore();
  }
}
