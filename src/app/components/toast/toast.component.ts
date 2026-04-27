import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toasts; let i = index"
           class="toast" [ngClass]="t.type"
           (click)="dismiss(i)">
        <span class="material-icons toast-icon">
          {{ t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : 'info' }}
        </span>
        {{ t.message }}
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 10px;
      color: #fff;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    .toast-icon { font-size: 20px; }
    .success { background: rgba(72, 187, 120, 0.95); }
    .error { background: rgba(229, 62, 62, 0.95); }
    .info { background: rgba(66, 153, 225, 0.95); }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => this.toasts.shift(), 3000);
    });
  }

  dismiss(index: number) {
    this.toasts.splice(index, 1);
  }
}
