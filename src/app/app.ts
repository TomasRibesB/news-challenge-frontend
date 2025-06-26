import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './features/news/components/navbar/navbar';
import { Notification } from './shared/components/notification/notification';
import { NewsService } from './core/services/news';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'news-challenge-frontend';
  error$: Observable<string | null>;
  success$: Observable<string | null>;

  constructor(private newsService: NewsService) {
    this.error$ = this.newsService.error$;
    this.success$ = this.newsService.success$;
  }

  clearError() {
    this.newsService.clearError();
  }

  clearSuccess() {
    this.newsService.clearSuccess();
  }
}
