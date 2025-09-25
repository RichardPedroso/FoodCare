import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductReadService } from '../../../../services/product/product-read.service';
import { StockReadService, Stock } from '../../../../services/stock/stock-read.service';
import { Product } from '../../../../domain/model/product';

/**
 * Componente principal do dashboard administrativo
 * Exibe gráficos de estoque por categoria de produtos
 * Permite navegação para áreas de gerenciamento (usuários, doações, solicitações)
 * Implementa visualização de dados com gráficos de barras personalizados
 */
@Component({
  selector: 'app-main-admin',
  imports: [CommonModule],
  templateUrl: './main-admin.component.html',
  styleUrl: './main-admin.component.css'
})
export class MainAdminComponent implements OnInit {
  basicProducts: (Product & { totalStock: number })[] = []; // Produtos básicos com estoque
  hygieneProducts: (Product & { totalStock: number })[] = []; // Produtos de higiene com estoque
  infantProducts: (Product & { totalStock: number })[] = []; // Produtos infantis com estoque
  maxStock = 0; // Valor máximo de estoque para escala dos gráficos
  showBasicChart = false; // Controla exibição do gráfico de produtos básicos
  showHygieneChart = false; // Controla exibição do gráfico de produtos de higiene
  showInfantChart = false; // Controla exibição do gráfico de produtos infantis
  loading = false; // Estado de carregamento dos dados

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
      // Carrega produtos e dados de estoque na inicialização
      await this.loadProducts();
    } catch (error) {
      console.error('Erro no ngOnInit:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Carrega produtos e dados de estoque do backend
   * Combina informações de produtos com seus respectivos estoques
   * Organiza produtos por categoria (básicos, higiene, infantis)
   * Implementa fallback com dados mock em caso de erro
   */
  async loadProducts() {
    try {
      console.log('Carregando produtos...');
      const products = await this.productService.findAll();
      console.log('Produtos carregados:', products);
      
      // Tenta carregar dados de estoque, usa dados mock se falhar
      let stocks: Stock[] = [];
      try {
        stocks = await this.stockService.findAll();
        console.log('Estoques carregados:', stocks);
      } catch (stockError) {
        console.warn('Erro ao carregar estoque, usando dados mock:', stockError);
        // Criar dados mock de estoque para demonstração
        stocks = products.map((product, index) => ({
          id: index + 1,
          productId: product.id ? parseInt(product.id) : 0,
          donationOption: 1,
          actualStock: Math.floor(Math.random() * 50) + 10
        }));
      }

      // Combina dados de produtos com seus estoques totais
      const productsWithStock = products.map(product => {
        const productId = product.id ? parseInt(product.id) : 0;
        const productStocks = stocks.filter(s => s.productId === productId);
        const totalStock = productStocks.reduce((sum, stock) => sum + stock.actualStock, 0);
        console.log(`Produto ${product.name}: ID=${productId}, Stock=${totalStock}`);
        return { ...product, totalStock };
      });

      // Organiza produtos por categoria e ordena alfabeticamente
      this.basicProducts = productsWithStock
        .filter(p => p.productType === 'basic')
        .sort((a, b) => a.name.localeCompare(b.name));
      this.hygieneProducts = productsWithStock
        .filter(p => p.productType === 'hygiene')
        .sort((a, b) => a.name.localeCompare(b.name));
      this.infantProducts = productsWithStock
        .filter(p => p.productType === 'infant')
        .sort((a, b) => a.name.localeCompare(b.name));
      
      // Calcula valor máximo para escala dos gráficos
      const allStocks = productsWithStock.map(p => p.totalStock).filter(stock => stock > 0);
      this.maxStock = allStocks.length > 0 ? Math.max(...allStocks) : 50;
      // Limita maxStock para evitar gráficos desproporcionais
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

  /**
   * Calcula altura da barra no gráfico baseada no estoque
   * Aplica escala proporcional com altura mínima e máxima
   * @param stock - Quantidade em estoque do produto
   * @returns String com altura em pixels para a barra
   */
  getBarHeight(stock: number): string {
    if (this.maxStock === 0 || stock === 0) return '10px';
    const percentage = (stock / this.maxStock) * 100;
    const minHeight = 20; // altura mínima em pixels
    const maxHeight = 300; // altura máxima em pixels
    const height = Math.max(minHeight, (percentage / 100) * maxHeight);
    console.log(`Stock: ${stock}, MaxStock: ${this.maxStock}, Height: ${height}px`);
    return `${height}px`;
  }

  /**
   * Exibe gráfico de produtos básicos
   * Oculta outros gráficos para exibir apenas um por vez
   */
  showBasicProducts() {
    if (this.loading) return;
    this.showBasicChart = true;
    this.showHygieneChart = false;
    this.showInfantChart = false;
  }

  /**
   * Exibe gráfico de produtos infantis
   * Oculta outros gráficos para exibir apenas um por vez
   */
  showInfantProducts() {
    if (this.loading) return;
    this.showInfantChart = true;
    this.showBasicChart = false;
    this.showHygieneChart = false;
  }

  /**
   * Exibe gráfico de produtos de higiene
   * Oculta outros gráficos para exibir apenas um por vez
   */
  showHygieneProducts() {
    if (this.loading) return;
    this.showHygieneChart = true;
    this.showBasicChart = false;
    this.showInfantChart = false;
  }

  /**
   * Gera rótulos para o eixo Y dos gráficos
   * Cria escala de 5 em 5 unidades até o valor máximo
   * @returns Array de números para os rótulos do eixo Y
   */
  getYAxisLabels(): number[] {
    const maxValue = Math.ceil(this.maxStock / 5) * 5;
    const labels = [];
    for (let i = 0; i <= maxValue; i += 5) {
      labels.push(i);
    }
    return labels.reverse();
  }

  /**
   * Navega para a página de gerenciamento de usuários
   */
  navigateToManageUsers() {
    this.router.navigate(['/main/admin/manage-users']);
  }

  /**
   * Navega para a página de gerenciamento de doações
   */
  navigateToManageDonations() {
    this.router.navigate(['/main/admin/manage-donations']);
  }

  /**
   * Navega para a página de gerenciamento de solicitações
   */
  navigateToManageRequests() {
    this.router.navigate(['/main/admin/manage-requests']);
  }
}
