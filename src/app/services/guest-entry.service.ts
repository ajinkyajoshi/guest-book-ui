import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GuestEntry, GuestBookStats, Comment, PageResponse } from '../models/guest-entry.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GuestEntryService {
  private apiUrl = `${environment.apiUrl}/entries`;

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10, search?: string): Observable<PageResponse<GuestEntry>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get<PageResponse<GuestEntry>>(this.apiUrl, { params });
  }

  getStats(): Observable<GuestBookStats> {
    return this.http.get<GuestBookStats>(`${this.apiUrl}/stats`);
  }

  create(entry: GuestEntry): Observable<GuestEntry> {
    return this.http.post<GuestEntry>(this.apiUrl, entry);
  }

  update(id: number, entry: GuestEntry): Observable<GuestEntry> {
    return this.http.put<GuestEntry>(`${this.apiUrl}/${id}`, entry);
  }

  like(id: number): Observable<GuestEntry> {
    return this.http.patch<GuestEntry>(`${this.apiUrl}/${id}/like`, {});
  }

  pin(id: number): Observable<GuestEntry> {
    return this.http.patch<GuestEntry>(`${this.apiUrl}/${id}/pin`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Comments
  getComments(entryId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${entryId}/comments`);
  }

  addComment(entryId: number, comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${entryId}/comments`, comment);
  }

  deleteComment(entryId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${entryId}/comments/${commentId}`);
  }

  // Export
  exportCsv(): void {
    window.open(`${environment.apiUrl}/export/csv`, '_blank');
  }
}
