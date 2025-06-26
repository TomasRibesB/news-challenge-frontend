import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { New } from '../../../../core/models/new';
import { NewsItem } from './news-item';

describe('NewsItem', () => {
  let component: NewsItem;
  let fixture: ComponentFixture<NewsItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsItem, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsItem);
    component = fixture.componentInstance;
    component.news = new New({ id: 1, title: 'Test', body: 'Body', image_url: 'img.png', author: 'Author', date: new Date() });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
