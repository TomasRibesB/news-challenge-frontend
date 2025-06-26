import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { New } from '../../../../core/models/new';
import { LucideIconsModule } from '../../../../shared/modules/lucide-icons.module';

@Component({
  selector: 'app-news-card',
  imports: [CommonModule, RouterLink, LucideIconsModule],
  templateUrl: './news-card.html',
  styleUrl: './news-card.css',
})
export class NewsCard {
  @Input() news!: New;

  constructor() {}

  get image_url(): string {
    return this.news.image_url || 'images/default-news-image.svg';
  }

  get formattedDate(): string {
    const date = new Date(this.news.date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  get truncatedBody(): string {
    const maxLength = 100;
    return this.news.body.length > maxLength
      ? this.news.body.substring(0, maxLength) + '...'
      : this.news.body;
  }

  /** Fallback to default image on load error */
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'images/default-news-image.svg';
  }
}
