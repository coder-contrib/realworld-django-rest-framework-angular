import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">التغذية والتدريب</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nutrition Plans -->
        <div class="card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <span class="material-icons text-2xl text-green-500">restaurant</span>
            </div>
            <div>
              <h3 class="font-bold text-white">الخطط الغذائية</h3>
              <p class="text-dark-400 text-sm">إدارة البرامج الغذائية للأعضاء</p>
            </div>
          </div>
          <button class="btn-primary w-full flex items-center justify-center gap-2">
            <span class="material-icons">add</span>
            إنشاء خطة غذائية
          </button>
        </div>

        <!-- Workout Plans -->
        <div class="card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <span class="material-icons text-2xl text-blue-500">fitness_center</span>
            </div>
            <div>
              <h3 class="font-bold text-white">برامج التدريب</h3>
              <p class="text-dark-400 text-sm">إدارة البرامج التدريبية للأعضاء</p>
            </div>
          </div>
          <button class="btn-primary w-full flex items-center justify-center gap-2">
            <span class="material-icons">add</span>
            إنشاء برنامج تدريب
          </button>
        </div>

        <!-- Weight Tracking -->
        <div class="card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <span class="material-icons text-2xl text-purple-500">monitor_weight</span>
            </div>
            <div>
              <h3 class="font-bold text-white">متابعة الوزن</h3>
              <p class="text-dark-400 text-sm">تتبع قياسات وأوزان الأعضاء</p>
            </div>
          </div>
          <button class="btn-secondary w-full flex items-center justify-center gap-2">
            <span class="material-icons">trending_up</span>
            عرض التقارير
          </button>
        </div>

        <!-- Progress Photos -->
        <div class="card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <span class="material-icons text-2xl text-yellow-500">photo_camera</span>
            </div>
            <div>
              <h3 class="font-bold text-white">صور التطور</h3>
              <p class="text-dark-400 text-sm">توثيق التقدم بالصور</p>
            </div>
          </div>
          <button class="btn-secondary w-full flex items-center justify-center gap-2">
            <span class="material-icons">collections</span>
            عرض المعرض
          </button>
        </div>
      </div>
    </div>
  `,
})
export class NutritionComponent {}
