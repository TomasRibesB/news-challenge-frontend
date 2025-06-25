import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { New } from '../../../models/new';
import { LucideIconsModule } from '../../../shared/lucide-icons.module';

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
    return this.news.image_url || 'assets/images/default-news-image.jpg';
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
}
