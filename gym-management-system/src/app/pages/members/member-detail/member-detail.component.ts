import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="text-center py-12 text-dark-400">
        <span class="material-icons text-4xl mb-2">person</span>
        <p>صفحة تفاصيل العضو</p>
      </div>
    </div>
  `,
})
export class MemberDetailComponent {}
