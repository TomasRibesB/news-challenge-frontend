import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FeaturedNews } from './featured-news';
import { New } from '../../../../core/models/new';

describe('FeaturedNews', () => {
  let component: FeaturedNews;
  let fixture: ComponentFixture<FeaturedNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedNews, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedNews);
    component = fixture.componentInstance;
    component.news = new New({ id: 1, title: 'Test', body: 'Body', image_url: 'img.png', author: 'Author', date: new Date() });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
