import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryFormComponent } from './components/entry-form/entry-form.component';
import { EntryListComponent } from './components/entry-list/entry-list.component';
import { StatsBarComponent } from './components/stats-bar/stats-bar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ToastComponent } from './components/toast/toast.component';
import { GuestEntryService } from './services/guest-entry.service';
import { ToastService } from './services/toast.service';
import { GuestEntry, GuestBookStats } from './models/guest-entry.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, EntryFormComponent, EntryListComponent,
    StatsBarComponent, SearchBarComponent, ToastComponent
  ],
  template: `
    <app-toast></app-toast>
    <div class="app" [class.dark]="darkMode">
      <div class="container">
        <header>
          <div class="header-top">
            <button class="theme-toggle" (click)="toggleDarkMode()" title="Toggle dark mode">
              <span class="material-icons">{{ darkMode ? 'light_mode' : 'dark_mode' }}</span>
            </button>
          </div>
          <span class="material-icons header-icon">auto_stories</span>
          <h1>Guestbook</h1>
          <p class="subtitle">Share your thoughts, leave your mark ✨</p>
        </header>

        <app-stats-bar [stats]="stats"></app-stats-bar>
        <app-entry-form (entryCreated)="onEntryCreated()"></app-entry-form>
        <app-search-bar (searchChanged)="onSearch($event)"></app-search-bar>
        <app-entry-list
          [entries]="entries"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          (entryDeleted)="onDelete($event)"
          (entryLiked)="onLike($event)"
          (entryPinned)="onPin($event)"
          (entryUpdated)="onUpdate($event)"
          (pageChanged)="onPageChange($event)">
        </app-entry-list>
      </div>
      <footer>
        <p>Built with ❤️ using Spring Boot & Angular</p>
      </footer>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: background 0.3s;
    }
    .app.dark {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }
    .container {
      max-width: 760px;
      margin: 0 auto;
      padding: 40px 20px 20px;
    }
    header {
      text-align: center;
      color: #fff;
      margin-bottom: 32px;
      position: relative;
    }
    .header-top {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }
    .theme-toggle {
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.25);
      color: #fff;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .theme-toggle:hover {
      background: rgba(255,255,255,0.25);
      transform: rotate(20deg);
    }
    .header-icon {
      font-size: 56px;
      margin-bottom: 8px;
      display: block;
      animation: float 3s ease-in-out infinite;
    }
    header h1 {
      font-size: 2.8rem;
      font-weight: 800;
      margin-bottom: 6px;
      letter-spacing: -1px;
    }
    .subtitle {
      font-size: 1.1rem;
      opacity: 0.85;
      font-weight: 300;
    }
    footer {
      text-align: center;
      padding: 32px 20px;
      color: rgba(255,255,255,0.5);
      font-size: 0.85rem;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @media (max-width: 600px) {
      header h1 { font-size: 2rem; }
      .container { padding: 20px 12px; }
    }
  `]
})
export class AppComponent implements OnInit {
  entries: GuestEntry[] = [];
  stats: GuestBookStats | null = null;
  currentPage = 0;
  totalPages = 0;
  searchQuery = '';
  darkMode = false;

  constructor(
    private service: GuestEntryService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadEntries();
    this.loadStats();
  }

  loadEntries() {
    this.service.getAll(this.currentPage, 10, this.searchQuery || undefined).subscribe(page => {
      this.entries = page.content;
      this.totalPages = page.totalPages;
      this.currentPage = page.number;
    });
  }

  loadStats() {
    this.service.getStats().subscribe(s => this.stats = s);
  }

  onEntryCreated() {
    this.currentPage = 0;
    this.loadEntries();
    this.loadStats();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 0;
    this.loadEntries();
  }

  onDelete(id: number) {
    this.service.delete(id).subscribe(() => {
      this.toast.show('Message deleted');
      this.loadEntries();
      this.loadStats();
    });
  }

  onLike(id: number) {
    this.service.like(id).subscribe(updated => {
      const idx = this.entries.findIndex(e => e.id === id);
      if (idx >= 0) this.entries[idx] = updated;
      this.loadStats();
    });
  }

  onPin(id: number) {
    this.service.pin(id).subscribe(() => {
      this.toast.show('Pin toggled');
      this.loadEntries();
    });
  }

  onUpdate(entry: GuestEntry) {
    this.service.update(entry.id!, entry).subscribe(() => {
      this.toast.show('Message updated');
      this.loadEntries();
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadEntries();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
}
