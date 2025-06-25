import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  get sizeClass() {
    return { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[this.size];
  }
}
