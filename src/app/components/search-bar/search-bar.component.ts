import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-bar">
      <span class="material-icons search-icon">search</span>
      <input type="text"
             [(ngModel)]="query"
             (ngModelChange)="onSearch($event)"
             placeholder="Search messages or names..." />
      <button *ngIf="query" class="clear-btn" (click)="clear()">
        <span class="material-icons">close</span>
      </button>
    </div>
  `,
  styles: [`
    .search-bar {
      position: relative;
      margin-bottom: 24px;
    }
    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      font-size: 22px;
    }
    input {
      width: 100%;
      padding: 14px 48px 14px 48px;
      border: none;
      border-radius: 14px;
      font-family: inherit;
      font-size: 1rem;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
      transition: box-shadow 0.2s;
    }
    input:focus {
      outline: none;
      box-shadow: 0 4px 32px rgba(102,126,234,0.3);
    }
    input::placeholder { color: #aaa; }
    .clear-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: flex;
    }
    .clear-btn:hover { color: #333; background: #f0f0f0; }
  `]
})
export class SearchBarComponent {
  @Output() searchChanged = new EventEmitter<string>();
  query = '';
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(q => this.searchChanged.emit(q));
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  clear() {
    this.query = '';
    this.searchChanged.emit('');
  }
}
