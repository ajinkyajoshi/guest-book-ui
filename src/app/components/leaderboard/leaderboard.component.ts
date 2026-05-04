import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/guest-entry.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2><span class="material-icons">emoji_events</span> Top Contributors</h2>

      <div class="loading" *ngIf="loading">
        <span class="material-icons spin">sync</span> Loading...
      </div>

      <div class="error-msg" *ngIf="error && !loading">
        <span class="material-icons">cloud_off</span>
        <p>User service unavailable</p>
      </div>

      <div class="leaderboard" *ngIf="!loading && !error && users.length > 0">
        <div *ngFor="let user of users; let i = index" class="leader-row">
          <span class="rank">
            {{ i < 3 ? ['🥇','🥈','🥉'][i] : '#' + (i+1) }}
          </span>
          <div class="leader-info">
            <strong>{{ user.displayName || user.username }}</strong>
            <span class="leader-stat">{{ user.totalEntries }} entries</span>
          </div>
        </div>
      </div>

      <div class="no-data" *ngIf="!loading && !error && users.length === 0">
        <p>No contributors yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      padding: 24px;
      margin-bottom: 24px;
    }
    h2 {
      display: flex; align-items: center; gap: 8px;
      font-size: 1.2rem; margin-bottom: 16px; color: #4c51bf;
    }
    .loading {
      display: flex; align-items: center; gap: 8px;
      color: #a0aec0; font-size: 0.85rem; padding: 8px 0;
    }
    .spin { animation: spin 1s linear infinite; font-size: 18px; }
    .error-msg {
      display: flex; align-items: center; gap: 8px;
      color: #e53e3e; font-size: 0.85rem;
    }
    .error-msg .material-icons { font-size: 20px; }
    .error-msg p { margin: 0; }
    .no-data p { color: #a0aec0; font-size: 0.85rem; margin: 0; }
    .leader-row {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 0; border-bottom: 1px solid #f0f0f0;
    }
    .leader-row:last-child { border-bottom: none; }
    .rank { font-size: 1.2rem; min-width: 36px; text-align: center; }
    .leader-info { display: flex; flex-direction: column; }
    .leader-info strong { font-size: 0.95rem; color: #2d3748; }
    .leader-stat { font-size: 0.8rem; color: #a0aec0; }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class LeaderboardComponent implements OnInit {
  users: UserProfile[] = [];
  loading = true;
  error = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getLeaderboard(0, 5).subscribe({
      next: page => {
        this.users = page.content;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
