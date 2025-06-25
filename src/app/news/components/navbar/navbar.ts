import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewsModal } from '../news-modal/news-modal';
import { NewsService } from '../../../services/news';
import { New } from '../../../models/new';
import { LucideIconsModule } from '../../../shared/lucide-icons.module';
import { Spinner } from '../spinner/spinner';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    FormsModule,
    NewsModal,
    Spinner,
    LucideIconsModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  loading$: Observable<boolean>;
  searchQuery = '';
  modalOpen = false;
  modalMode: 'create' | 'edit' | 'delete' = 'create';
  isDetailPage = false;
  activeId: string | null = null;
  isSearchVisible = false; // Controlar visibilidad del campo de búsqueda en móvil
  currentArticle: New | null = null;
  private searchSubject = new Subject<string>();

  constructor(private router: Router, private newsService: NewsService) {
    this.loading$ = this.newsService.loading$;
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isDetailPage = /^\/news\/\d+/.test(e.urlAfterRedirects);
        if (!this.isDetailPage) {
          this.activeId = null;
          this.currentArticle = null;
        } else {
          const parts = e.urlAfterRedirects.split('/');
          this.activeId = parts[2] || null;
          if (this.activeId) {
            this.newsService.getNewsById(Number(this.activeId)).subscribe((article) => {
              this.currentArticle = article;
            });
          }
        }
      });

    // Suscripción debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(q => {
      this.searchQuery = q;
      this.newsService.setSearch(q);
      if (q) {
        this.newsService.searchNews(q).subscribe();
        this.router.navigate(['/news']);
      } else {
        this.newsService.fetchNews();
      }
    });
  }

  onSearchChange(q: string) {
    this.searchSubject.next(q);
  }

  clearSearch() {
    this.searchSubject.next('');
  }

  toggleSearchVisibility() {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) this.clearSearch();
  }

  openModal(mode: 'create' | 'edit' | 'delete') {
    if ((mode === 'edit' || mode === 'delete') && !this.activeId) return;
    this.modalMode = mode;
    this.modalOpen = true;
  }

  closeModal(open: boolean) {
    this.modalOpen = open;
  }

  navigateToRoot() {
    this.router.navigate(['/']);
  }

  // Handle modal success events for create, edit, and delete
  handleModalSuccess(payload: New | number): void {
    if (this.modalMode === 'create') {
      this.newsService.addNews(payload as New);
    } else if (this.modalMode === 'edit') {
      const updated = payload as New;
      this.newsService.updateNews(updated.id as number, updated);
    } else if (this.modalMode === 'delete') {
      // Confirm deletion, show spinner and navigate home on success
      this.newsService.deleteNews(payload as number).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
    // After operation, optionally navigate or refresh
  }
}
