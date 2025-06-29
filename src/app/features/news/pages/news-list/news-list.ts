import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Spinner } from '../../../../shared/components/spinner/spinner';
import { NewsService } from '../../../../core/services/news';
import { NewsCard } from '../../components/news-card/news-card';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { New } from '../../../../core/models/new';
import { LucideIconsModule } from '../../../../shared/modules/lucide-icons.module';
import { FeaturedNews } from '../../components/featured-news/featured-news';

@Component({
  selector: 'app-news-list',
  imports: [CommonModule, Spinner, NewsCard, LucideIconsModule, FeaturedNews],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
})
export class NewsList implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  success$: Observable<string | null>;
  displayed$: Observable<New[]>;
  searchQuery$: Observable<string>;
  hasMore$: Observable<boolean>;
  featured$: Observable<New | null>;
  others$: Observable<New[]>;

  private loading = false;
  private hasMoreFlag = false;
  private subscriptions = new Subscription();

  constructor(public newsService: NewsService) {
    this.loading$ = this.newsService.loading$;
    this.error$ = this.newsService.error$;
    this.success$ = this.newsService.success$;
    this.displayed$ = this.newsService.combinedNews$;
    this.searchQuery$ = this.newsService.search$;
    this.hasMore$ = this.newsService.hasMore$;

    this.featured$ = combineLatest([this.searchQuery$, this.displayed$]).pipe(
      map(([search, list]) => (!search && list.length > 0 ? list[0] : null))
    );
    this.others$ = combineLatest([this.searchQuery$, this.displayed$]).pipe(
      map(([search, list]) =>
        !search && list.length > 0 ? list.slice(1) : list
      )
    );
  }

  ngOnInit(): void {
    this.newsService.fetchNews();
    this.subscriptions.add(
      this.loading$.subscribe((val) => (this.loading = val))
    );
    this.subscriptions.add(
      this.hasMore$.subscribe((val) => (this.hasMoreFlag = val))
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.loading || !this.hasMoreFlag) return;
    const threshold = 200;
    const position = window.innerHeight + window.scrollY;
    const height = document.documentElement.scrollHeight;
    if (position >= height - threshold) {
      this.loadMore();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  retry() {
    this.newsService.fetchNews();
  }

  loadMore(): void {
    this.newsService.loadMore();
  }
}
