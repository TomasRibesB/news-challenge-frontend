import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NewsCard } from './news-card';
import { New } from '../../../../core/models/new';

describe('NewsCard', () => {
  let component: NewsCard;
  let fixture: ComponentFixture<NewsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCard, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsCard);
    component = fixture.componentInstance;
    component.news = new New({ id: 1, title: 'Test', body: 'Body', image_url: 'img.png', author: 'Author', date: new Date() });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
