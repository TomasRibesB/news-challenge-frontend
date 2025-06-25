import { NgModule } from '@angular/core';
import {
  LucideAngularModule,
  Newspaper,
  Search,
  X,
  PlusCircle,
  Edit3,
  Trash2,
  Rss,
  AlertTriangle,
  SearchX,
  UserCircle,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      Newspaper,
      Search,
      X,
      PlusCircle,
      Edit3,
      Trash2,
      Rss,
      AlertTriangle,
      SearchX,
      UserCircle,
      CalendarDays,
      ArrowRight,
      ArrowLeft,
      ChevronDown,
    }),
  ],
  exports: [LucideAngularModule],
})
export class LucideIconsModule {}
