import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '../../modules/lucide-icons.module';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class Notification implements OnInit, OnDestroy {
  @Input() type: 'success' | 'error' = 'success';
  @Input() message: any = '';
  
  get displayMessage(): string {
    return typeof this.message === 'string' && this.message
      ? this.message
      : this.type === 'success'
        ? 'Action completed successfully.'
        : 'An error occurred.';
  }
  @Input() duration = 5000;
  @Output() dismissed = new EventEmitter<void>();

  visible = true;
  private timeoutId: any;

  ngOnInit() {
    this.timeoutId = setTimeout(() => this.close(), this.duration);
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }

  close() {
    this.visible = false;
    this.dismissed.emit();
  }
}
