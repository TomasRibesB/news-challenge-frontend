import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideIconsModule } from '../../../../shared/modules/lucide-icons.module';
import { New } from '../../../../core/models/new';

@Component({
  standalone: true,
  selector: 'app-featured-news',
  imports: [CommonModule, RouterLink, LucideIconsModule],
  templateUrl: './featured-news.html',
  styleUrls: ['./featured-news.css'],
})
export class FeaturedNews {
  @Input() news!: New;

  get contentSnippet(): string {
    const max = 200;
    const body = this.news.body || '';
    return body.length > max ? body.substring(0, max) + '…' : body;
  }

  get formattedDate(): string {
    return new Date(this.news.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
