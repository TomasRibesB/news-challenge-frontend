import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { New } from '../models/new';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private _allNews = new BehaviorSubject<New[]>([]);
  private _search = new BehaviorSubject<string>('');
  private _loading = new BehaviorSubject<boolean>(false);
  private _error   = new BehaviorSubject<string| null>(null);

  allNews$    = this._allNews.asObservable();
  search$     = this._search.asObservable();
  loading$    = this._loading.asObservable();
  error$      = this._error.asObservable();

  constructor(private http: HttpClient) {
    this.fetchNews();
  }

  fetchNews() {
    this._loading.next(true);
    this._error.next(null);
    this.http.get<New[]>(`${environment.apiUrl}/News`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to fetch news');
          this._loading.next(false);
          return of([]);
        })
      )
      .subscribe(data => {
        this._allNews.next(data);
        this._loading.next(false);
      });
  }

  displayedNews$(): Observable<New[]> {
    return this.allNews$.pipe(
      map(list => {
        const term = this._search.value.toLowerCase();
        if (!term) return list;
        return list.filter(n =>
          n.title.toLowerCase().includes(term) ||
          n.body.toLowerCase().includes(term) ||
          n.author.toLowerCase().includes(term)
        );
      })
    );
  }

  setSearch(q: string) { this._search.next(q); }

  getNewsById(id: string): Observable<New> {
    this._loading.next(true);
    return this.http.get<New>(`${environment.apiUrl}/News/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to get New');
          return of(null as any);
        })
      );
  }

  addNews(New: Partial<New>) {
    this._loading.next(true);
    this.http.post<New>(`${environment.apiUrl}/News`, New)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to add New');
          this._loading.next(false);
          return of(null as any);
        })
      )
      .subscribe(newArt => {
        if (newArt) {
          this._allNews.next([newArt, ...this._allNews.value]);
        }
        this._loading.next(false);
      });
  }

  updateNews(updated: Partial<New> & { id: string }) {
    this._loading.next(true);
    this.http.put<New>(`${environment.apiUrl}/News/${updated.id}`, updated)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to update New');
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
        }
        this._loading.next(false);
      });
  }

  deleteNews(id: string) {
    this._loading.next(true);
    this.http.delete<void>(`${environment.apiUrl}/News/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._error.next(error.message || 'Failed to delete New');
          this._loading.next(false);
          return of(null as any);
        })
      )
      .subscribe(() => {
        this._allNews.next(this._allNews.value.filter(n => String(n.id) !== id));
        this._loading.next(false);
      });
  }
}
