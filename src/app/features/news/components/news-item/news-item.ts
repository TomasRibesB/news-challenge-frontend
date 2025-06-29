import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { New } from '../../../../core/models/new';

@Component({
  selector: 'app-news-item',
  imports: [CommonModule, RouterLink],
  templateUrl: './news-item.html',
  styleUrl: './news-item.css'
})
export class NewsItem {
  @Input() news!: New;

  get formattedDate(): string {
    return new Date(this.news.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'images/default-news-image.svg';
  }
}
