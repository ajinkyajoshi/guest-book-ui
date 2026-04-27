import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestBookStats } from '../../models/guest-entry.model';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-bar" *ngIf="stats">
      <div class="stat">
        <span class="material-icons">people</span>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalEntries }}</span>
          <span class="stat-label">Total Messages</span>
        </div>
      </div>
      <div class="stat">
        <span class="material-icons">today</span>
        <div class="stat-info">
          <span class="stat-value">{{ stats.todayEntries }}</span>
          <span class="stat-label">Today</span>
        </div>
      </div>
      <div class="stat">
        <span class="material-icons">favorite</span>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalLikes }}</span>
          <span class="stat-label">Total Likes</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 14px;
      padding: 16px 20px;
      color: #fff;
      transition: transform 0.2s;
    }
    .stat:hover { transform: translateY(-2px); }
    .stat .material-icons { font-size: 28px; opacity: 0.9; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.5rem; font-weight: 700; line-height: 1; }
    .stat-label { font-size: 0.75rem; opacity: 0.8; margin-top: 2px; }
    @media (max-width: 600px) {
      .stats-bar { flex-direction: column; }
    }
  `]
})
export class StatsBarComponent {
  @Input() stats: GuestBookStats | null = null;
}
