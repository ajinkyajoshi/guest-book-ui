import { Component, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestEntry } from '../../models/guest-entry.model';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

@Component({
  selector: 'app-entry-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentSectionComponent],
  template: `
    <div class="entries" *ngIf="entries.length > 0">
      <div *ngFor="let entry of entries; trackBy: trackById"
           class="entry-card" [class.pinned]="entry.pinned">
        <div class="pin-badge" *ngIf="entry.pinned">
          <span class="material-icons">push_pin</span> Pinned
        </div>

        <ng-container *ngIf="editingId !== entry.id">
          <div class="entry-header">
            <div class="avatar" [style.background]="getAvatarColor(entry.name!)">
              {{ entry.mood || entry.name!.charAt(0).toUpperCase() }}
            </div>
            <div class="entry-meta">
              <div class="name-row">
                <strong>{{ entry.name }}</strong>
                <span class="mood-badge" *ngIf="entry.mood">{{ entry.mood }}</span>
              </div>
              <span class="date">{{ entry.createdAt | date:'MMM d, y · h:mm a' }}</span>
              <span class="date" *ngIf="entry.email"> · {{ entry.email }}</span>
            </div>
          </div>
          <p class="entry-message">{{ entry.message }}</p>
          <div class="entry-actions">
            <button class="action-btn like-btn" (click)="entryLiked.emit(entry.id!)"
                    [class.liked]="(entry.likes || 0) > 0">
              <span class="material-icons">{{ (entry.likes || 0) > 0 ? 'favorite' : 'favorite_border' }}</span>
              <span *ngIf="entry.likes">{{ entry.likes }}</span>
            </button>
            <button class="action-btn" (click)="toggleComments(entry.id!)" title="Replies">
              <span class="material-icons">chat_bubble_outline</span>
            </button>
            <button class="action-btn" (click)="startEdit(entry)" title="Edit">
              <span class="material-icons">edit</span>
            </button>
            <button class="action-btn" (click)="entryPinned.emit(entry.id!)" title="Pin">
              <span class="material-icons">{{ entry.pinned ? 'push_pin' : 'outlined_flag' }}</span>
            </button>
            <button class="action-btn delete-btn" (click)="entryDeleted.emit(entry.id!)" title="Delete">
              <span class="material-icons">delete_outline</span>
            </button>
          </div>
          <app-comment-section [entryId]="entry.id!"></app-comment-section>
        </ng-container>

        <ng-container *ngIf="editingId === entry.id">
          <div class="edit-form">
            <input [(ngModel)]="editName" placeholder="Name" class="edit-input" />
            <input [(ngModel)]="editEmail" placeholder="Email" class="edit-input" />
            <textarea [(ngModel)]="editMessage" placeholder="Message" rows="3" class="edit-input"></textarea>
            <div class="mood-selector">
              <button type="button" *ngFor="let m of moods"
                      class="mood-btn" [class.active]="editMood === m"
                      (click)="editMood = m">{{ m }}</button>
            </div>
            <div class="edit-actions">
              <button class="save-btn" (click)="saveEdit(entry)">
                <span class="material-icons">check</span> Save
              </button>
              <button class="cancel-btn" (click)="cancelEdit()">
                <span class="material-icons">close</span> Cancel
              </button>
            </div>
          </div>
        </ng-container>
      </div>
    </div>

    <div class="empty-card" *ngIf="entries.length === 0">
      <span class="material-icons empty-icon">auto_stories</span>
      <h3>No messages yet</h3>
      <p>Be the first to sign the guestbook!</p>
    </div>

    <div class="pagination" *ngIf="totalPages > 1">
      <button class="page-btn" [disabled]="currentPage === 0" (click)="pageChanged.emit(currentPage - 1)">
        <span class="material-icons">chevron_left</span>
      </button>
      <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
      <button class="page-btn" [disabled]="currentPage >= totalPages - 1" (click)="pageChanged.emit(currentPage + 1)">
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
  `,
  styles: [`
    .entries { display: flex; flex-direction: column; gap: 16px; }
    .entry-card {
      background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.3); border-radius: 16px;
      padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      transition: all 0.3s ease; animation: fadeSlideIn 0.4s ease-out;
      position: relative; overflow: hidden;
    }
    .entry-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
    .entry-card.pinned { border-left: 4px solid #667eea; background: rgba(255,255,255,0.98); }
    .pin-badge {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.5px; color: #667eea; margin-bottom: 12px;
    }
    .pin-badge .material-icons { font-size: 14px; }
    .entry-header { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
    .avatar {
      width: 46px; height: 46px; border-radius: 14px; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.2rem; flex-shrink: 0;
    }
    .entry-meta { flex: 1; }
    .name-row { display: flex; align-items: center; gap: 8px; }
    .name-row strong { font-size: 1rem; color: #2d3748; }
    .mood-badge { font-size: 1.1rem; }
    .date { font-size: 0.78rem; color: #a0aec0; }
    .entry-message { margin-left: 60px; color: #4a5568; line-height: 1.6; font-size: 0.95rem; }
    .entry-actions { display: flex; gap: 4px; margin-left: 60px; margin-top: 12px; }
    .action-btn {
      display: inline-flex; align-items: center; gap: 4px; background: none;
      border: none; color: #a0aec0; cursor: pointer; padding: 6px 10px;
      border-radius: 8px; font-size: 0.85rem; transition: all 0.2s;
    }
    .action-btn:hover { background: #f7fafc; color: #4a5568; }
    .action-btn .material-icons { font-size: 18px; }
    .like-btn:hover, .like-btn.liked { color: #e53e3e; }
    .delete-btn:hover { color: #e53e3e; background: #fff5f5; }
    .edit-form { display: flex; flex-direction: column; gap: 12px; }
    .edit-input {
      width: 100%; padding: 10px 14px; border: 2px solid #e2e8f0;
      border-radius: 10px; font-family: inherit; font-size: 0.95rem;
    }
    .edit-input:focus { outline: none; border-color: #667eea; }
    .mood-selector { display: flex; gap: 6px; flex-wrap: wrap; }
    .mood-btn {
      font-size: 1.3rem; padding: 6px 10px; border: 2px solid #e2e8f0;
      border-radius: 8px; background: #fafafa; cursor: pointer;
    }
    .mood-btn:hover { border-color: #667eea; }
    .mood-btn.active { border-color: #667eea; background: #ebf4ff; }
    .edit-actions { display: flex; gap: 8px; }
    .save-btn, .cancel-btn {
      display: inline-flex; align-items: center; gap: 4px; padding: 8px 16px;
      border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer;
    }
    .save-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; }
    .cancel-btn { background: #edf2f7; color: #4a5568; }
    .save-btn .material-icons, .cancel-btn .material-icons { font-size: 16px; }
    .empty-card {
      text-align: center; padding: 60px 28px; background: rgba(255,255,255,0.9);
      backdrop-filter: blur(12px); border-radius: 16px; border: 2px dashed rgba(102,126,234,0.3);
    }
    .empty-icon { font-size: 56px; color: #cbd5e0; margin-bottom: 12px; }
    .empty-card h3 { color: #4a5568; margin-bottom: 4px; }
    .empty-card p { color: #a0aec0; }
    .pagination {
      display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 24px;
    }
    .page-btn {
      display: flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; border: none; border-radius: 10px;
      background: rgba(255,255,255,0.9); color: #4a5568; cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .page-btn:hover:not(:disabled) { background: #fff; transform: scale(1.05); }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-info { color: #fff; font-weight: 600; font-size: 0.9rem; }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class EntryListComponent {
  @Input() entries: GuestEntry[] = [];
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Output() entryDeleted = new EventEmitter<number>();
  @Output() entryLiked = new EventEmitter<number>();
  @Output() entryPinned = new EventEmitter<number>();
  @Output() entryUpdated = new EventEmitter<GuestEntry>();
  @Output() pageChanged = new EventEmitter<number>();

  @ViewChildren(CommentSectionComponent) commentSections!: QueryList<CommentSectionComponent>;

  editingId: number | null = null;
  editName = '';
  editEmail = '';
  editMessage = '';
  editMood = '😊';
  moods = ['😊', '😍', '🎉', '👋', '🔥', '🤔', '😎', '💡'];

  private colors = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #fccb90, #d57eeb)',
    'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
  ];

  getAvatarColor(name: string): string {
    return this.colors[name.charCodeAt(0) % this.colors.length];
  }

  trackById(_: number, entry: GuestEntry): number {
    return entry.id!;
  }

  toggleComments(entryId: number) {
    const section = this.commentSections.find(s => s.entryId === entryId);
    if (section) section.toggle();
  }

  startEdit(entry: GuestEntry) {
    this.editingId = entry.id!;
    this.editName = entry.name;
    this.editEmail = entry.email || '';
    this.editMessage = entry.message;
    this.editMood = entry.mood || '😊';
  }

  cancelEdit() { this.editingId = null; }

  saveEdit(entry: GuestEntry) {
    this.entryUpdated.emit({
      id: entry.id, name: this.editName,
      email: this.editEmail || undefined,
      message: this.editMessage, mood: this.editMood
    });
    this.editingId = null;
  }
}
