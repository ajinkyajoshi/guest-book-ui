import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsDashboard } from '../../models/guest-entry.model';

@Component({
  selector: 'app-analytics-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-wrapper">
      <h2><span class="material-icons">bar_chart</span> Analytics Dashboard</h2>

      <!-- Loading state -->
      <div class="loading" *ngIf="loading">
        <span class="material-icons spin">sync</span> Loading analytics...
      </div>

      <!-- Error state -->
      <div class="error-msg" *ngIf="error && !loading">
        <span class="material-icons">cloud_off</span>
        <p>Analytics service unavailable. Make sure the analytics-service is running.</p>
      </div>

      <!-- Dashboard stats -->
      <div class="analytics-bar" *ngIf="dashboard && !loading">
        <div class="a-stat">
          <span class="material-icons">visibility</span>
          <div class="a-info">
            <span class="a-value">{{ dashboard.totalPageViews }}</span>
            <span class="a-label">Page Views</span>
          </div>
        </div>
        <div class="a-stat">
          <span class="material-icons">today</span>
          <div class="a-info">
            <span class="a-value">{{ dashboard.todayPageViews }}</span>
            <span class="a-label">Views Today</span>
          </div>
        </div>
        <div class="a-stat">
          <span class="material-icons">person</span>
          <div class="a-info">
            <span class="a-value">{{ dashboard.uniqueVisitorsToday }}</span>
            <span class="a-label">Visitors Today</span>
          </div>
        </div>
        <div class="a-stat">
          <span class="material-icons">favorite</span>
          <div class="a-info">
            <span class="a-value">{{ dashboard.totalLikes }}</span>
            <span class="a-label">Total Likes</span>
          </div>
        </div>
      </div>

      <!-- Mood chart -->
      <div class="mood-chart" *ngIf="moods.length > 0 && !loading">
        <h3><span class="material-icons">mood</span> Mood Trends</h3>
        <div class="mood-bars">
          <div *ngFor="let m of moods" class="mood-bar-item">
            <span class="mood-emoji">{{ m.mood }}</span>
            <div class="bar-track">
              <div class="bar-fill" [style.width.%]="(m.count / maxMoodCount) * 100"></div>
            </div>
            <span class="mood-count">{{ m.count }}</span>
          </div>
        </div>
      </div>

      <!-- No mood data -->
      <div class="no-data" *ngIf="!loading && !error && dashboard && moods.length === 0">
        <span class="material-icons">sentiment_neutral</span>
        <p>No mood data yet. Moods will appear as entries are created.</p>
      </div>
    </div>
  `,
  styles: [`
    .analytics-wrapper {
      background: rgba(255,255,255,0.12);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      animation: fadeIn 0.3s ease-out;
    }
    h2 {
      display: flex; align-items: center; gap: 8px;
      font-size: 1.2rem; margin-bottom: 20px; color: #fff;
    }
    h2 .material-icons { font-size: 24px; }
    .loading {
      display: flex; align-items: center; gap: 8px;
      color: rgba(255,255,255,0.7); font-size: 0.9rem; padding: 16px 0;
    }
    .spin { animation: spin 1s linear infinite; font-size: 20px; }
    .error-msg {
      display: flex; align-items: center; gap: 10px;
      background: rgba(229,62,62,0.15); border: 1px solid rgba(229,62,62,0.3);
      border-radius: 12px; padding: 16px; color: rgba(255,255,255,0.85);
    }
    .error-msg .material-icons { font-size: 28px; opacity: 0.8; }
    .error-msg p { margin: 0; font-size: 0.88rem; }
    .no-data {
      display: flex; align-items: center; gap: 10px;
      color: rgba(255,255,255,0.6); font-size: 0.88rem; padding: 12px 0;
    }
    .no-data .material-icons { font-size: 24px; }
    .no-data p { margin: 0; }
    .analytics-bar {
      display: flex; gap: 12px; margin-bottom: 16px;
    }
    .a-stat {
      flex: 1; display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,0.15); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 14px; padding: 14px 16px; color: #fff;
    }
    .a-stat .material-icons { font-size: 24px; opacity: 0.9; }
    .a-info { display: flex; flex-direction: column; }
    .a-value { font-size: 1.3rem; font-weight: 700; line-height: 1; }
    .a-label { font-size: 0.7rem; opacity: 0.8; margin-top: 2px; }
    .mood-chart {
      background: rgba(255,255,255,0.95); border-radius: 14px;
      padding: 20px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    h3 {
      display: flex; align-items: center; gap: 6px;
      font-size: 1rem; margin-bottom: 14px; color: #4c51bf;
    }
    .mood-bars { display: flex; flex-direction: column; gap: 8px; }
    .mood-bar-item { display: flex; align-items: center; gap: 10px; }
    .mood-emoji { font-size: 1.3rem; min-width: 30px; text-align: center; }
    .bar-track {
      flex: 1; height: 20px; background: #edf2f7; border-radius: 10px; overflow: hidden;
    }
    .bar-fill {
      height: 100%; background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 10px; transition: width 0.5s ease;
    }
    .mood-count { font-size: 0.85rem; color: #718096; min-width: 30px; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (max-width: 600px) {
      .analytics-bar { flex-direction: column; }
      .analytics-wrapper { padding: 16px; }
    }
  `]
})
export class AnalyticsPanelComponent implements OnInit {
  dashboard: AnalyticsDashboard | null = null;
  moods: { mood: string; count: number }[] = [];
  maxMoodCount = 1;
  loading = true;
  error = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.analyticsService.trackPageView('/guestbook').subscribe({ error: () => {} });

    this.analyticsService.getDashboard().subscribe({
      next: d => {
        this.dashboard = d;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });

    this.analyticsService.getMoodDistribution().subscribe({
      next: m => {
        this.moods = m;
        this.maxMoodCount = Math.max(1, ...m.map(x => x.count));
      },
      error: () => {}
    });
  }
}
