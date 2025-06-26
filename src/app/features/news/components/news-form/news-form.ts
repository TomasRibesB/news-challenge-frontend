import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { New } from '../../../../core/models/new';
import { Spinner } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-news-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Spinner],
  templateUrl: './news-form.html',
  styleUrl: './news-form.css'
})
export class NewsForm {
  @Input() news: New | null = null;
  @Output() success = new EventEmitter<New>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      image_url: [''],
      author: ['', Validators.required]
    });
  }

  ngOnChanges() {
    if (this.news) {
      this.form.patchValue({
        title: this.news.title,
        body: this.news.body,
        image_url: this.news.image_url,
        author: this.news.author
      });
    } else {
      this.form.reset();
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const value = this.form.value;
    const data = new New({
      ...this.news,
      ...value,
      date: this.news?.date || new Date()
    });
    this.success.emit(data);
  }

  onCancel() {
    this.cancel.emit();
  }
}
