import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NewsDetail } from './news-detail';

describe('NewsDetail', () => {
  let component: NewsDetail;
  let fixture: ComponentFixture<NewsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDetail, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
