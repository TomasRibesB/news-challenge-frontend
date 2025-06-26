import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsForm } from '../news-form/news-form';
import { New } from '../../../../core/models/new';

@Component({
  selector: 'app-news-modal',
  imports: [CommonModule, NewsForm],
  templateUrl: './news-modal.html',
  styleUrl: './news-modal.css',
})
export class NewsModal {
  @Input() isOpen = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Input() mode: 'create' | 'edit' | 'delete' = 'create';
  @Input() news: New | null = null;

  get title() {
    if (this.mode === 'create') return 'Create New Article';
    if (this.mode === 'edit') return 'Edit Article';
    return 'Confirm Deletion';
  }

  get description() {
    if (this.mode === 'create') return 'Fill below to add a new news.';
    if (this.mode === 'edit' && this.news)
      return `Editing "${this.news.title}".`;
    return `Are you sure to delete "${this.news?.title}"?`;
  }

  @Output() success = new EventEmitter<New | number>();

  onClose() {
    this.openChange.emit(false);
  }

  onSuccess(news: New) {
    this.success.emit(news);
    this.onClose();
  }

  onDelete() {
    this.success.emit(this.news?.id as number);
    this.onClose();
  }
}
