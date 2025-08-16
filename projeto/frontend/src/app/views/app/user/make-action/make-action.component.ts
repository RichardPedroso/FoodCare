import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { User } from '../../../../domain/model/user';
import { Donation } from '../../../../domain/model/donation';
import { DonationProduct } from '../../../../domain/model/donation_product';
import { Product } from '../../../../domain/model/product';
import { DonationCreateService } from '../../../../services/donation/donation-create.service';
import { DonationProductCreateService } from '../../../../services/donation-product/donation-product-create.service';
import { ProductUpdateService } from '../../../../services/product/product-update.service';
import { ProductReadService } from '../../../../services/product/product-read.service';

@Component({
  selector: 'app-make-action',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './make-action.component.html',
  styleUrl: './make-action.component.css'
})

export class MakeActionComponent implements OnInit {

  user: User | null = null;
  userType: 'donor' | 'beneficiary' = 'donor';
  minDate = new Date();
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private donationCreateService: DonationCreateService,
    private donationProductCreateService: DonationProductCreateService,
    private productUpdateService: ProductUpdateService,
    private productReadService: ProductReadService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userType = this.user.user_type as 'donor' | 'beneficiary';
    }
    await this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    try {
      this.products = await this.productReadService.findAll();
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  onProductTypeChange(productType: string): void {
    if (productType) {
      this.filteredProducts = this.products.filter(product => product.productType === productType);
    } else {
      this.filteredProducts = [];
    }
    this.selectedProduct = null;
  }

  onProductChange(productId: string): void {
    this.selectedProduct = this.products.find(product => product.id === productId) || null;
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  isDateInvalid(dateValue: any): boolean {
    if (!dateValue) return false;
    
    let parsedDate: Date;
    
    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      const parts = dateValue.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        parsedDate = new Date(year, month, day);
      } else {
        parsedDate = new Date(dateValue);
      }
    } else {
      parsedDate = new Date(dateValue);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);
    
    return parsedDate < today;
  }

  onDateFocus(event: any): void {
    if (!event.target.value) {
      event.target.placeholder = 'dd/mm/aaaa';
    }
  }

  formatDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length <= 2) {
      event.target.value = value;
    } else if (value.length <= 4) {
      event.target.value = value.substring(0, 2) + '/' + value.substring(2);
    } else {
      event.target.value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
    }
  }

  onDateChange(event: any): void {
    // Método não necessário - o datepicker já gerencia a data automaticamente
  }

  async registerDonation(productId: string, expirationDate: string, quantity: string): Promise<void> {
    if (!this.user || !productId || !expirationDate || !quantity || !this.selectedProduct) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (this.isDateInvalid(expirationDate)) {
      alert('A data de validade não pode ser anterior à data atual.');
      return;
    }

    const unit = this.selectedProduct.measure_type;

    try {
      
      const donation: Donation = {
        donation_date: new Date(),
        user_id: this.user.id!
      };

      const donationResponse = await this.donationCreateService.create(donation);
      
      const donationProduct: DonationProduct = {
        quantity: parseInt(quantity),
        expirationDate: new Date(expirationDate),
        unit: unit,
        donation_id: donationResponse.id!,
        product_id: productId
      };

      await this.donationProductCreateService.create(donationProduct);

      await this.productUpdateService.updateStock(productId, parseInt(quantity));

      alert('Doação registrada com sucesso!');
      this.router.navigate(['/main']);
      
    } catch (error) {
      console.error('Erro ao registrar doação:', error);
      alert('Erro ao registrar doação. Tente novamente.');
    }
  }

  async requestBasicBasket(requestDate: string): Promise<void> {
    if (!this.user || !requestDate) {
      alert('Por favor, preencha a data da solicitação.');
      return;
    }

    if (this.isDateInvalid(requestDate)) {
      alert('A data da solicitação não pode ser anterior à data atual.');
      return;
    }

    try {
      const hasRequestedThisMonth = await this.checkMonthlyBasketRequest('basic');
      if (hasRequestedThisMonth) {
        alert('Você já solicitou uma cesta básica neste mês. Aguarde o próximo mês para fazer uma nova solicitação.');
        return;
      }

      const basicProducts = this.products.filter(product => product.productType === 'basic');
      
      const insufficientStock = basicProducts.filter(product => product.stock < 1);
      if (insufficientStock.length > 0) {
        alert('Não há estoque suficiente para formar uma cesta básica. Produtos em falta: ' + 
              insufficientStock.map(p => p.name).join(', '));
        return;
      }

      for (const product of basicProducts) {
        await this.productUpdateService.updateStock(product.id!, -1);
      }

      const basketRequest = {
        user_id: this.user.id!,
        request_date: new Date(requestDate),
        basket_type: 'basic',
        status: 'pending'
      };

      const response = await fetch('http://localhost:3000/basket_request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basketRequest)
      });

      if (response.ok) {
        alert('Solicitação de cesta básica registrada com sucesso!');
        this.router.navigate(['/main']);
      } else {
        throw new Error('Erro ao registrar solicitação');
      }
      
    } catch (error) {
      console.error('Erro ao solicitar cesta básica:', error);
      alert('Erro ao solicitar cesta básica. Tente novamente.');
    }
  }

  async requestHygieneBasket(requestDate: string): Promise<void> {
    if (!this.user || !requestDate) {
      alert('Por favor, preencha a data da solicitação.');
      return;
    }

    if (this.isDateInvalid(requestDate)) {
      alert('A data da solicitação não pode ser anterior à data atual.');
      return;
    }

    try {
      const hasRequestedThisMonth = await this.checkMonthlyBasketRequest('hygiene');
      if (hasRequestedThisMonth) {
        alert('Você já solicitou uma cesta de higiene neste mês. Aguarde o próximo mês para fazer uma nova solicitação.');
        return;
      }

      const hygieneProducts = this.products.filter(product => product.productType === 'hygiene');
      
      const insufficientStock = hygieneProducts.filter(product => product.stock < 1);
      if (insufficientStock.length > 0) {
        alert('Não há estoque suficiente para formar uma cesta de higiene. Produtos em falta: ' + 
              insufficientStock.map(p => p.name).join(', '));
        return;
      }

      for (const product of hygieneProducts) {
        await this.productUpdateService.updateStock(product.id!, -1);
      }

      const basketRequest = {
        user_id: this.user.id!,
        request_date: new Date(requestDate),
        basket_type: 'hygiene',
        status: 'pending'
      };

      const response = await fetch('http://localhost:3000/basket_request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basketRequest)
      });

      if (response.ok) {
        alert('Solicitação de cesta de higiene registrada com sucesso!');
        this.router.navigate(['/main']);
      } else {
        throw new Error('Erro ao registrar solicitação');
      }
      
    } catch (error) {
      console.error('Erro ao solicitar cesta de higiene:', error);
      alert('Erro ao solicitar cesta de higiene. Tente novamente.');
    }
  }

  private async checkMonthlyBasketRequest(basketType: string): Promise<boolean> {
    if (!this.user?.id) return false;

    try {
      const response = await fetch(`http://localhost:3000/basket_request?user_id=${this.user.id}&basket_type=${basketType}`);
      if (response.ok) {
        const requests = await response.json();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return requests.some((request: any) => {
          const requestDate = new Date(request.request_date);
          return requestDate.getMonth() === currentMonth && requestDate.getFullYear() === currentYear;
        });
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar solicitações mensais:', error);
      return false;
    }
  }

}
