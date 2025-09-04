import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductReadService } from '../../../../services/product/product-read.service';
import { Product } from '../../../../domain/model/product';

@Component({
  selector: 'app-main-admin',
  imports: [CommonModule],
  templateUrl: './main-admin.component.html',
  styleUrl: './main-admin.component.css'
})
export class MainAdminComponent implements OnInit {
  basicProducts: Product[] = [];
  hygieneProducts: Product[] = [];
  infantProducts: Product[] = [];
  maxStock = 0;
  showBasicChart = false;
  showHygieneChart = false;
  showInfantChart = false;

  constructor(private productService: ProductReadService) {}

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      const products = await this.productService.findAll();
      this.basicProducts = products
        .filter(p => p.productType === 'basic')
        .sort((a, b) => a.name.localeCompare(b.name));
      this.hygieneProducts = products
        .filter(p => p.productType === 'hygiene')
        .sort((a, b) => a.name.localeCompare(b.name));
      this.infantProducts = products
        .filter(p => p.productType === 'infant')
        .sort((a, b) => a.name.localeCompare(b.name));
      
      const allStocks = [10, 20, 30, 40, 50]; // Placeholder values
      this.maxStock = Math.max(...allStocks);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  getBarHeight(stock: number): string {
    if (this.maxStock === 0) return '0%';
    return `${(stock / this.maxStock) * 100}%`;
  }

  showBasicProducts() {
    this.showBasicChart = true;
    this.showHygieneChart = false;
    this.showInfantChart = false;
  }

  showInfantProducts() {
    this.showInfantChart = true;
    this.showBasicChart = false;
    this.showHygieneChart = false;
  }

  showHygieneProducts() {
    this.showHygieneChart = true;
    this.showBasicChart = false;
    this.showInfantChart = false;
  }

  getYAxisLabels(): number[] {
    const maxValue = Math.ceil(this.maxStock / 5) * 5;
    const labels = [];
    for (let i = 0; i <= maxValue; i += 5) {
      labels.push(i);
    }
    return labels.reverse();
  }
}
