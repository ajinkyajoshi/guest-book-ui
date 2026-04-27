import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestEntryService } from '../../services/guest-entry.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2><span class="material-icons">edit_note</span> Sign the Guestbook</h2>
      <form (ngSubmit)="onSubmit()" #f="ngForm">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Name *</label>
            <input id="name" [(ngModel)]="name" name="name" required maxlength="100"
                   placeholder="Your name" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" [(ngModel)]="email" name="email" type="email" maxlength="150"
                   placeholder="your@email.com (optional)" />
          </div>
        </div>
        <div class="form-group">
          <label for="message">Message *</label>
          <textarea id="message" [(ngModel)]="message" name="message" required maxlength="500"
                    rows="3" placeholder="Write something nice..."></textarea>
          <span class="char-count">{{ message.length }}/500</span>
        </div>
        <div class="form-group">
          <label>How are you feeling?</label>
          <div class="mood-selector">
            <button type="button" *ngFor="let m of moods"
                    class="mood-btn" [class.active]="mood === m"
                    (click)="mood = m">{{ m }}</button>
          </div>
        </div>
        <button type="submit" class="submit-btn" [disabled]="!f.valid || submitting">
          <span class="material-icons">send</span>
          {{ submitting ? 'Posting...' : 'Post Message' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .card {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      padding: 28px;
      margin-bottom: 24px;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.3rem;
      margin-bottom: 20px;
      color: #4c51bf;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .form-row .form-group { flex: 1; }
    .form-group {
      margin-bottom: 16px;
      position: relative;
    }
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 6px;
      font-size: 0.85rem;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    input, textarea {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-family: inherit;
      font-size: 0.95rem;
      transition: all 0.2s;
      background: #fafafa;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(102,126,234,0.15);
    }
    .char-count {
      position: absolute;
      right: 12px;
      bottom: 8px;
      font-size: 0.75rem;
      color: #aaa;
    }
    .mood-selector {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .mood-btn {
      font-size: 1.5rem;
      padding: 8px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      background: #fafafa;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mood-btn:hover { border-color: #667eea; transform: scale(1.1); }
    .mood-btn.active {
      border-color: #667eea;
      background: #ebf4ff;
      transform: scale(1.15);
      box-shadow: 0 2px 8px rgba(102,126,234,0.3);
    }
    .submit-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      border: none;
      padding: 12px 28px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(102,126,234,0.4);
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(102,126,234,0.5);
    }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    @media (max-width: 600px) {
      .form-row { flex-direction: column; gap: 0; }
    }
  `]
})
export class EntryFormComponent {
  @Output() entryCreated = new EventEmitter<void>();
  name = '';
  email = '';
  message = '';
  mood = '😊';
  moods = ['😊', '😍', '🎉', '👋', '🔥', '🤔', '😎', '💡'];
  submitting = false;

  constructor(private service: GuestEntryService, private toast: ToastService) {}

  onSubmit() {
    this.submitting = true;
    this.service.create({
      name: this.name,
      email: this.email || undefined,
      message: this.message,
      mood: this.mood
    }).subscribe({
      next: () => {
        this.name = '';
        this.email = '';
        this.message = '';
        this.mood = '😊';
        this.submitting = false;
        this.toast.show('Message posted successfully!');
        this.entryCreated.emit();
      },
      error: () => {
        this.submitting = false;
        this.toast.show('Failed to post message', 'error');
      }
    });
  }
}
