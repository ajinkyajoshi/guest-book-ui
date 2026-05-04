import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, PageResponse } from '../models/guest-entry.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  register(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/register`, profile);
  }

  getByUsername(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${username}`);
  }

  updateProfile(id: number, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, profile);
  }

  getLeaderboard(page = 0, size = 10): Observable<PageResponse<UserProfile>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<UserProfile>>(`${this.apiUrl}/leaderboard`, { params });
  }

  searchUsers(q: string, page = 0, size = 10): Observable<PageResponse<UserProfile>> {
    const params = new HttpParams().set('q', q).set('page', page).set('size', size);
    return this.http.get<PageResponse<UserProfile>>(`${this.apiUrl}/search`, { params });
  }
}
