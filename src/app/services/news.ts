import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { New } from '../models/new';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private _allNews = new BehaviorSubject<New[]>([]);
  private _search = new BehaviorSubject<string>('');
  private _loading = new BehaviorSubject<boolean>(false);
  private _error   = new BehaviorSubject<string| null>(null);
  private _searchResults = new BehaviorSubject<New[]>([]);
  private _page = 1;
  private _limit = 5;
  private _hasMore = new BehaviorSubject<boolean>(true);

  // Para detalle en tiempo real
  private _currentNews = new BehaviorSubject<New | null>(null);

  allNews$    = this._allNews.asObservable();
  search$     = this._search.asObservable();
  loading$    = this._loading.asObservable();
  error$      = this._error.asObservable();
  searchResults$ = this._searchResults.asObservable();
  hasMore$    = this._hasMore.asObservable();
  currentNews$ = this._currentNews.asObservable();

  displayed$ = this.allNews$.pipe(
    map(news => news.filter(item =>
      item.title.toLowerCase().includes(this._search.value.toLowerCase())
    ))
  );

  // Observable que alterna entre todas las noticias y los resultados de búsqueda
  combinedNews$ = combineLatest([this.search$, this.allNews$, this.searchResults$]).pipe(
    map(([searchTerm, allNews, searchResults]) =>
      searchTerm ? searchResults : allNews
    )
  );

  constructor(private http: HttpClient) {
    this.fetchNews();
  }

  fetchNews(page: number = this._page, limit: number = this._limit, fields?: string) {
    const append = page > 1;
    this._loading.next(true);
    this._error.next(null);
    const params: any = { page, limit };
    if (fields) params.fields = fields;

    this.http.get<New[]>(`${environment.apiUrl}/news`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to fetch news');
          this._loading.next(false);
          return of([]);
        })
      )
      .subscribe(data => {
        if (append) {
          // Agregar nuevos datos al final
          this._allNews.next([...this._allNews.value, ...data]);
        } else {
          // Reemplazar en carga inicial
          this._allNews.next(data);
          this._page = page; // reset page
        }
        this._loading.next(false);
        // Si recibimos menos que el límite, no hay más páginas
        this._hasMore.next(data.length === limit);
      });
  }

  // Cargar siguiente página de noticias
  loadMore(): void {
    this._page++;
    this.fetchNews(this._page, this._limit);
  }

  searchNews(term: string): Observable<New[]> {
    this._loading.next(true);
    return this.http.get<New[]>(`${environment.apiUrl}/news/search`, { params: { term } })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to search news');
          this._loading.next(false);
          return of([]);
        })
      )
      .pipe(
        map((results) => {
          this._searchResults.next(results);
          this._loading.next(false);
          return results;
        })
      );
  }

  getNewsById(id: number): Observable<New> {
    this._loading.next(true);
    return this.http.get<New>(`${environment.apiUrl}/news/${id}`)
      .pipe(
        tap((article) => {
          this._currentNews.next(article);
          this._loading.next(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to get news');
          this._currentNews.next(null);
          this._loading.next(false);
          return of(null as any);
        })
      );
  }

  addNews(news: New): void {
    news.date = new Date();
    this._loading.next(true);
    this.http.post<New>(`${environment.apiUrl}/news`, news)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to add news');
          this._loading.next(false);
          return of(null as any);
        })
      )
      .subscribe(newArticle => {
        if (newArticle) {
          this._allNews.next([newArticle, ...this._allNews.value]);
        }
        this._loading.next(false);
      });
  }

  updateNews(id: number, updated: Partial<New>): void {
    this._loading.next(true);
    this.http.put<New>(`${environment.apiUrl}/news/${id}`, updated)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to update news');
          this._loading.next(false);
          return of(null as any);
        })
      )
      .subscribe(res => {
        if (res) {
          const arr = this._allNews.value.map(n =>
            n.id === res.id ? res : n
          );
          this._allNews.next(arr);
          // Emit updated article to currentNews for detail view
          this._currentNews.next(res);
        }
        this._loading.next(false);
      });
  }

  // Elimina una noticia y actualiza lista, devuelve observable para subscripción externa
  deleteNews(id: number): Observable<void> {
    this._loading.next(true);
    return this.http.delete<void>(`${environment.apiUrl}/news/${id}`)
      .pipe(
        tap(() => {
          this._allNews.next(this._allNews.value.filter(n => n.id !== id));
          this._currentNews.next(null);
          this._loading.next(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to delete news');
          this._loading.next(false);
          return of(undefined);
        })
      );
  }

  setSearch(q: string): void {
    this._search.next(q);
  }
}
