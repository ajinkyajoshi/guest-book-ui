import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsDashboard } from '../models/guest-entry.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  trackPageView(page: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/pageview`, { page });
  }

  trackEvent(entryId: number, eventType: string, mood?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/event`, { entryId, eventType, mood });
  }

  getDashboard(): Observable<AnalyticsDashboard> {
    return this.http.get<AnalyticsDashboard>(`${this.apiUrl}/dashboard`);
  }

  getMoodDistribution(): Observable<{ mood: string; count: number }[]> {
    return this.http.get<{ mood: string; count: number }[]>(`${this.apiUrl}/moods`);
  }
}
