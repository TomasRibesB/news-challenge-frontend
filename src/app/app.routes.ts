import { Routes } from '@angular/router';
import { News } from './news/news';
import { NewsDetail } from './news/news-detail/news-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'news', pathMatch: 'full' },
  {
    path: 'news',
    component: News
  },
  {
    path: 'news/:id',
    component: NewsDetail
  },
  { path: '**', redirectTo: 'news' }
];
