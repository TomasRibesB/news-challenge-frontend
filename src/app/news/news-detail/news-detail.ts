import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../services/news';
import { New } from '../../models/new';
import { Spinner } from '../components/spinner/spinner';
import { NewsItem } from '../components/news-item/news-item';
import { LucideIconsModule } from '../../shared/lucide-icons.module';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-news-detail',
  imports: [CommonModule, Spinner, NewsItem, LucideIconsModule],
  templateUrl: './news-detail.html',
  styleUrls: ['./news-detail.css'],
})
export class NewsDetail implements OnInit, OnDestroy {
  news?: New;
  isLoading = false;
  error: string | null = null;
  recommended: New[] = [];
  private currentId = '';
  private currentNewsSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const newId = paramMap.get('id');
      if (newId && newId !== this.currentId) {
        this.currentId = newId;
        this.loadArticle(this.currentId);
      }
    });
    // Subscribe to real-time detail updates
    this.currentNewsSub = this.newsService.currentNews$.subscribe(article => {
      if (article && article.id === Number(this.currentId)) {
        this.news = article;
      }
    });
  }

  retry(): void {
    this.error = null;
    this.loadArticle(this.currentId);
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.currentNewsSub?.unsubscribe();
  }

  private loadArticle(id: string): void {
    this.isLoading = true;
    this.newsService.fetchNews();
    this.newsService.getNewsById(Number(id)).subscribe({
      next: (article) => {
        if (!article) {
          this.error = 'Article not found.';
        } else {
          this.setRecommended();
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error fetching article.';
        this.isLoading = false;
      }
    });
  }

  private setRecommended(): void {
    if (!this.news) return;
    this.newsService.allNews$.subscribe((all) => {
      const pool = all.filter(a => a.id !== this.news!.id);
      const uniquePool = pool.filter((item, index, arr) => arr.findIndex(i => i.id === item.id) === index);
      this.recommended = uniquePool.sort(() => 0.5 - Math.random()).slice(0, 4);
    });
  }

  get formattedDate(): string {
    return new Date(this.news?.date || '').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
