import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductReadService } from '../../../../services/product/product-read.service';
import { StockReadService, Stock } from '../../../../services/stock/stock-read.service';
import { Product } from '../../../../domain/model/product';

@Component({
  selector: 'app-main-admin',
  imports: [CommonModule],
  templateUrl: './main-admin.component.html',
  styleUrl: './main-admin.component.css'
})
export class MainAdminComponent implements OnInit {
  basicProducts: (Product & { totalStock: number })[] = [];
  hygieneProducts: (Product & { totalStock: number })[] = [];
  infantProducts: (Product & { totalStock: number })[] = [];
  maxStock = 0;
  showBasicChart = false;
  showHygieneChart = false;
  showInfantChart = false;
  loading = false;

  constructor(
    private productService: ProductReadService, 
    private stockService: StockReadService,
    private router: Router
  ) {
    console.log('MainAdminComponent constructor executado');
  }

  async ngOnInit() {
    console.log('MainAdminComponent ngOnInit executado');
    this.loading = true;
    try {
      await this.loadProducts();
    } catch (error) {
      console.error('Erro no ngOnInit:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadProducts() {
    try {
      console.log('Carregando produtos...');
      const products = await this.productService.findAll();
      console.log('Produtos carregados:', products);
      
      // Usar dados mock se não conseguir carregar estoque
      let stocks: Stock[] = [];
      try {
        stocks = await this.stockService.findAll();
        console.log('Estoques carregados:', stocks);
      } catch (stockError) {
        console.warn('Erro ao carregar estoque, usando dados mock:', stockError);
        // Criar dados mock de estoque
        stocks = products.map((product, index) => ({
          id: index + 1,
          productId: product.id ? parseInt(product.id) : 0,
          donationOption: 1,
          actualStock: Math.floor(Math.random() * 50) + 10
        }));
      }

      const productsWithStock = products.map(product => {
        const productId = product.id ? parseInt(product.id) : 0;
        const productStocks = stocks.filter(s => s.productId === productId);
        const totalStock = productStocks.reduce((sum, stock) => sum + stock.actualStock, 0);
        console.log(`Produto ${product.name}: ID=${productId}, Stock=${totalStock}`);
        return { ...product, totalStock };
      });

      this.basicProducts = productsWithStock
        .filter(p => p.productType === 'basic')
        .sort((a, b) => a.name.localeCompare(b.name));
      this.hygieneProducts = productsWithStock
        .filter(p => p.productType === 'hygiene')
        .sort((a, b) => a.name.localeCompare(b.name));
      this.infantProducts = productsWithStock
        .filter(p => p.productType === 'infant')
        .sort((a, b) => a.name.localeCompare(b.name));
      
      const allStocks = productsWithStock.map(p => p.totalStock).filter(stock => stock > 0);
      this.maxStock = allStocks.length > 0 ? Math.max(...allStocks) : 50;
      // Limitar maxStock para evitar valores muito altos
      if (this.maxStock > 1000) {
        this.maxStock = Math.min(this.maxStock, 100);
        console.log('MaxStock muito alto, limitando para 100');
      }
      
      console.log('Produtos processados:', {
        basic: this.basicProducts.length,
        hygiene: this.hygieneProducts.length,
        infant: this.infantProducts.length,
        maxStock: this.maxStock
      });
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  getBarHeight(stock: number): string {
    if (this.maxStock === 0 || stock === 0) return '10px';
    const percentage = (stock / this.maxStock) * 100;
    const minHeight = 20; // altura mínima em pixels
    const maxHeight = 300; // altura máxima em pixels
    const height = Math.max(minHeight, (percentage / 100) * maxHeight);
    console.log(`Stock: ${stock}, MaxStock: ${this.maxStock}, Height: ${height}px`);
    return `${height}px`;
  }

  showBasicProducts() {
    if (this.loading) return;
    this.showBasicChart = true;
    this.showHygieneChart = false;
    this.showInfantChart = false;
  }

  showInfantProducts() {
    if (this.loading) return;
    this.showInfantChart = true;
    this.showBasicChart = false;
    this.showHygieneChart = false;
  }

  showHygieneProducts() {
    if (this.loading) return;
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

  navigateToManageUsers() {
    this.router.navigate(['/main/admin/manage-users']);
  }
}
