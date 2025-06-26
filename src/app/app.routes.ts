import { Routes } from '@angular/router';
import { NewsList } from './features/news/pages/news-list/news-list';
import { NewsDetail } from './features/news/pages/news-detail/news-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'news', pathMatch: 'full' },
  {
    path: 'news',
    component: NewsList
  },
  {
    path: 'news/:id',
    component: NewsDetail
  },
  { path: '**', redirectTo: 'news' }
];
