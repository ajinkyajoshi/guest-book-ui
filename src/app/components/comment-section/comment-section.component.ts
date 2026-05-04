import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestEntryService } from '../../services/guest-entry.service';
import { ToastService } from '../../services/toast.service';
import { Comment } from '../../models/guest-entry.model';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comments-section" *ngIf="visible">
      <div class="comment" *ngFor="let c of comments">
        <strong>{{ c.authorName }}</strong>
        <span class="comment-date">{{ c.createdAt | date:'MMM d, h:mm a' }}</span>
        <p>{{ c.content }}</p>
      </div>
      <div class="comment-form">
        <input [(ngModel)]="authorName" placeholder="Your name" class="c-input" />
        <div class="c-row">
          <input [(ngModel)]="content" placeholder="Write a reply..." class="c-input c-flex"
                 (keyup.enter)="submit()" />
          <button class="c-btn" (click)="submit()" [disabled]="!authorName || !content">
            <span class="material-icons">send</span>
          </button>
        </div>
      </div>
      <p class="no-comments" *ngIf="comments.length === 0">No replies yet. Be the first!</p>
    </div>
  `,
  styles: [`
    .comments-section {
      margin-top: 12px; margin-left: 60px; padding-top: 12px;
      border-top: 1px solid #edf2f7;
    }
    .comment { margin-bottom: 10px; }
    .comment strong { font-size: 0.85rem; color: #4a5568; }
    .comment-date { font-size: 0.7rem; color: #a0aec0; margin-left: 8px; }
    .comment p { font-size: 0.88rem; color: #718096; margin: 2px 0 0; }
    .comment-form { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
    .c-row { display: flex; gap: 8px; }
    .c-input {
      padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px;
      font-family: inherit; font-size: 0.85rem;
    }
    .c-flex { flex: 1; }
    .c-btn {
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff; border: none; border-radius: 8px; padding: 8px 12px; cursor: pointer;
    }
    .c-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .c-btn .material-icons { font-size: 16px; }
    .no-comments { font-size: 0.8rem; color: #a0aec0; font-style: italic; }
  `]
})
export class CommentSectionComponent {
  @Input() entryId!: number;
  visible = false;
  comments: Comment[] = [];
  authorName = '';
  content = '';

  constructor(private service: GuestEntryService, private toast: ToastService) {}

  toggle() {
    this.visible = !this.visible;
    if (this.visible && this.comments.length === 0) {
      this.loadComments();
    }
  }

  loadComments() {
    this.service.getComments(this.entryId).subscribe(c => this.comments = c);
  }

  submit() {
    if (!this.authorName || !this.content) return;
    this.service.addComment(this.entryId, {
      authorName: this.authorName,
      content: this.content
    }).subscribe({
      next: () => {
        this.content = '';
        this.loadComments();
        this.toast.show('Reply posted!');
      },
      error: () => this.toast.show('Failed to post reply', 'error')
    });
  }
}
