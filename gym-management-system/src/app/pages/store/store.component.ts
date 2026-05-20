import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">المتجر</h2>
        <button (click)="showAddModal = true" class="btn-primary flex items-center gap-2">
          <span class="material-icons text-xl">add_shopping_cart</span>
          إضافة منتج
        </button>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div *ngFor="let product of products" class="card">
          <div class="w-full h-32 bg-dark-700 rounded-lg flex items-center justify-center mb-4">
            <span class="material-icons text-4xl text-dark-500">inventory_2</span>
          </div>
          <h3 class="font-bold text-white mb-1">{{ product.name }}</h3>
          <p class="text-dark-400 text-xs mb-3">{{ product.category }}</p>
          <div class="flex items-center justify-between">
            <span class="text-primary-500 font-bold">{{ product.price }} ر.س</span>
            <span class="text-xs px-2 py-1 rounded" [class]="product.stock > product.minStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'">
              المخزون: {{ product.stock }}
            </span>
          </div>
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-dark-700">
            <button class="flex-1 btn-secondary text-sm py-1.5">تعديل</button>
            <button class="text-dark-400 hover:text-red-400">
              <span class="material-icons text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="products.length === 0" class="text-center py-12 text-dark-400">
        <span class="material-icons text-4xl mb-2">store</span>
        <p>لا يوجد منتجات</p>
      </div>

      <!-- Add Product Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-lg">
          <div class="p-6 border-b border-dark-700 flex items-center justify-between">
            <h3 class="text-xl font-bold">إضافة منتج جديد</h3>
            <button (click)="showAddModal = false" class="text-dark-400 hover:text-white">
              <span class="material-icons">close</span>
            </button>
          </div>
          <form (ngSubmit)="saveProduct()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm text-dark-300 mb-1">اسم المنتج *</label>
              <input [(ngModel)]="productForm.name" name="name" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-dark-300 mb-1">السعر *</label>
                <input [(ngModel)]="productForm.price" name="price" type="number" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500" required>
              </div>
              <div>
                <label class="block text-sm text-dark-300 mb-1">الكمية</label>
                <input [(ngModel)]="productForm.stock" name="stock" type="number" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-primary-500">
              </div>
            </div>
            <div>
              <label class="block text-sm text-dark-300 mb-1">التصنيف</label>
              <select [(ngModel)]="productForm.category" name="category" class="w-full bg-dark-700 border border-dark-600 rounded-lg py-2.5 px-4 text-white">
                <option value="مكملات">مكملات</option>
                <option value="معدات">معدات</option>
                <option value="ملابس">ملابس</option>
                <option value="مشروبات">مشروبات</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>
            <div class="flex gap-3 pt-4">
              <button type="submit" class="btn-primary flex-1">إضافة المنتج</button>
              <button type="button" (click)="showAddModal = false" class="btn-secondary">إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class StoreComponent implements OnInit {
  products: any[] = [];
  showAddModal = false;
  productForm = { name: '', price: 0, stock: 0, category: 'مكملات' };

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void { this.loadProducts(); }

  async loadProducts(): Promise<void> {
    const result = await this.electronService.getProducts();
    if (result?.success) this.products = result.data.products;
  }

  async saveProduct(): Promise<void> {
    await this.electronService.createProduct(this.productForm);
    this.showAddModal = false;
    this.productForm = { name: '', price: 0, stock: 0, category: 'مكملات' };
    this.loadProducts();
  }
}
