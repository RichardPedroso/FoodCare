import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { User } from '../../../../domain/model/user';
import { Donation } from '../../../../domain/model/donation';
import { DonationProduct } from '../../../../domain/model/donation_product';
import { Product } from '../../../../domain/model/product';
import { DonationCreateService } from '../../../../services/donation/donation-create.service';
import { DonationProductCreateService } from '../../../../services/donation-product/donation-product-create.service';
import { DonationValidationService } from '../../../../services/donation-product/donation-validation.service';
import { ProductUpdateService } from '../../../../services/product/product-update.service';
import { ProductReadService } from '../../../../services/product/product-read.service';

import { BasketItem } from '../../../../domain/model/basket-item';
import { UnitConverterService } from '../../../../services/utils/unit-converter.service';


@Component({
  selector: 'app-make-action',
  imports: [
    NgClass,
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
  canRequestBasic: boolean = true;
  canRequestHygiene: boolean = true;
  lastBasicRequest: Date | null = null;
  lastHygieneRequest: Date | null = null;
  calculatedBasket: BasketItem[] = [];
  showBasketPreview: boolean = false;
  selectedUnit: string = '';
  isProcessingRequest: boolean = false;

  @ViewChild('quantity') quantityRef!: MatSelect | ElementRef;
  @ViewChild('units') unitsRef!: ElementRef;
  @ViewChild('expirationDate') expirationDateRef!: ElementRef;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private donationCreateService: DonationCreateService,
    private donationProductCreateService: DonationProductCreateService,
    private donationValidationService: DonationValidationService,
    private productUpdateService: ProductUpdateService,
    private productReadService: ProductReadService,

    private unitConverterService: UnitConverterService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userType = this.user.user_type as 'donor' | 'beneficiary';
      if (this.userType === 'beneficiary') {
        await this.checkRequestAvailability();
      }
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
      this.filteredProducts = this.products
        .filter(product => product.productType === productType)
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.filteredProducts = [];
    }
    this.selectedProduct = null;
  }

  onProductChange(productId: string): void {
    this.selectedProduct = this.products.find(product => product.id === productId) || null;
    if (this.selectedProduct) {
      this.selectedUnit = this.getDefaultUnit();
    }
  }

  getDefaultUnit(): string {
    if (!this.selectedProduct) return '';
    return this.selectedProduct.measure_type;
  }

  isWeightProduct(): boolean {
    if (!this.selectedProduct) return false;
    return this.selectedProduct.measure_type === 'kg' || this.selectedProduct.measure_type === 'g';
  }

  isVolumeProduct(): boolean {
    if (!this.selectedProduct) return false;
    return this.selectedProduct.measure_type === 'l' || this.selectedProduct.measure_type === 'ml';
  }

  onUnitChange(newUnit: string): void {
    this.selectedUnit = newUnit;
  }

  getConvertedQuantity(quantityValue: string): string {
    if (!quantityValue || !this.selectedProduct || !this.selectedUnit) return '';
    
    const quantity = parseFloat(quantityValue);
    if (isNaN(quantity)) return '';
    
    const baseUnit = this.selectedProduct.measure_type;
    
    if (this.selectedUnit === baseUnit) {
      return `${quantity} ${baseUnit} (unidade base)`;
    }
    
    const converted = this.unitConverterService.convertToProductUnit(quantity, this.selectedUnit, baseUnit);
    return `${converted} ${baseUnit}`;
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getCurrentDateFormatted(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
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
    
    const validation = this.donationValidationService.validateExpirationDate(parsedDate);
    return !validation.valid;
  }

  getDateValidationMessage(dateValue: any): string {
    if (!dateValue) return '';
    
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
    
    const validation = this.donationValidationService.validateExpirationDate(parsedDate);
    return validation.message || '';
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
  }

  onUnitsInput(event: any): void {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    event.target.value = numericValue;
    
    const num = parseInt(numericValue);
    if (num <= 0 && numericValue !== '') {
      event.target.value = '';
    }
  }

  onRegisterDonation(productId: string, expirationDate: string): void {
    const quantityValue = this.getQuantityValue();
    const unitsValue = this.getUnitsValue();
    this.registerDonation(productId, expirationDate, quantityValue, unitsValue);
  }

  private getQuantityValue(): string {
    if (this.quantityRef) {
      if ('value' in this.quantityRef) {
        return this.quantityRef.value || '';
      } else {
        return this.quantityRef.nativeElement.value || '';
      }
    }
    return '';
  }

  private getUnitsValue(): string {
    return this.unitsRef?.nativeElement?.value || '1';
  }

  isToyProduct(): boolean {
    return this.selectedProduct?.name === 'Brinquedo';
  }

  getExpirationDateValue(): string {
    if (this.isToyProduct()) {
      return '';
    }
    return this.expirationDateRef?.nativeElement?.value || '';
  }

  async registerDonation(productId: string, expirationDate: string, quantity: string, units?: string): Promise<void> {
    if (!this.user || !productId || !quantity || !this.selectedProduct) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.isToyProduct() && !expirationDate) {
      alert('Por favor, preencha a data de validade.');
      return;
    }

    if (this.selectedProduct.options_donation && !this.selectedProduct.options_donation.includes(quantity)) {
      alert('Quantidade inválida. Selecione uma das opções disponíveis.');
      return;
    }

    if (this.selectedProduct.measure_type !== 'un' && (!units || parseInt(units) <= 0)) {
      alert('Por favor, informe o número de unidades a serem doadas.');
      return;
    }

    if (!this.isToyProduct() && this.isDateInvalid(expirationDate)) {
      alert('A data de validade não pode ser anterior à data atual.');
      return;
    }

    const quantityNum = parseFloat(quantity);
    const unitsNum = units ? parseInt(units) : 1;
    
    if (!this.unitConverterService.validateQuantityInput(quantityNum, this.selectedProduct.measure_type)) {
      alert(`Quantidade inválida para a unidade ${this.selectedProduct.measure_type}. Verifique o valor inserido.`);
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
        quantity: quantityNum,
        expirationDate: this.isToyProduct() ? null : new Date(expirationDate),
        unit: unit,
        donation_id: donationResponse.id!,
        product_id: productId
      };

      await this.donationProductCreateService.create(donationProduct);

      await this.updateStock(productId, quantity, unitsNum);

      alert('Doação registrada com sucesso!');
      this.router.navigate(['/main']);
      
    } catch (error) {
      console.error('Erro ao registrar doação:', error);
      alert('Erro ao registrar doação. Tente novamente.');
    }
  }

  private async updateStock(productId: string, donationOption: string, units: number): Promise<void> {
    try {
      const effectiveDonationOption = this.selectedProduct?.options_donation ? donationOption : "1";
      
      const stockResponse = await fetch(`http://localhost:3000/stock?product_id=${productId}&donation_option=${effectiveDonationOption}`);
      const stockRecords = await stockResponse.json();
      
      if (stockRecords.length > 0) {
        // Atualizar estoque existente
        const stockRecord = stockRecords[0];
        const newStock = stockRecord.actual_stock + units;
        
        await fetch(`http://localhost:3000/stock/${stockRecord.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actual_stock: newStock })
        });
      } else {
        const newStockRecord = {
          product_id: productId,
          donation_option: effectiveDonationOption,
          actual_stock: units
        };
        
        await fetch('http://localhost:3000/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStockRecord)
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  }

  async requestBasicBasket(): Promise<void> {
    if (this.isProcessingRequest || !this.user) {
      return;
    }

    this.isProcessingRequest = true;

    try {
      const hasRequestedThisMonth = await this.checkMonthlyBasketRequest('basic');
      if (hasRequestedThisMonth) {
        alert('Você já solicitou uma cesta básica neste mês. Aguarde o próximo mês para fazer uma nova solicitação.');
        return;
      }

      const peopleQuantity = parseInt(this.user.people_quantity || '1');
      const hasChildren = this.user.has_children || false;
      
      const calculatedBasket = this.calculateBasketLocally(peopleQuantity, hasChildren);
      await this.processBasketRequest(calculatedBasket, peopleQuantity, hasChildren);

      
    } catch (error) {
      console.error('Erro ao solicitar cesta básica:', error);
      alert('Erro ao solicitar cesta básica. Tente novamente.');
    } finally {
      this.isProcessingRequest = false;
    }
  }

  async requestHygieneBasket(): Promise<void> {
    if (!this.user) {
      alert('Usuário não encontrado.');
      return;
    }

    try {
      const hasRequestedThisMonth = await this.checkMonthlyBasketRequest('hygiene');
      if (hasRequestedThisMonth) {
        alert('Você já solicitou uma cesta de higiene neste mês. Aguarde o próximo mês para fazer uma nova solicitação.');
        return;
      }

      const hygieneBasket = this.calculateHygieneBasket();
      await this.processHygieneBasketRequest(hygieneBasket);
      
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

  private async checkRequestAvailability(): Promise<void> {
    if (!this.user?.id) return;

    try {
      const response = await fetch(`http://localhost:3000/basket_request?user_id=${this.user.id}`);
      if (response.ok) {
        const requests = await response.json();
        
        const basicRequests = requests.filter((r: any) => r.basket_type === 'basic');
        const hygieneRequests = requests.filter((r: any) => r.basket_type === 'hygiene');
        
        if (basicRequests.length > 0) {
          this.lastBasicRequest = new Date(Math.max(...basicRequests.map((r: any) => new Date(r.request_date).getTime())));
        }
        
        if (hygieneRequests.length > 0) {
          this.lastHygieneRequest = new Date(Math.max(...hygieneRequests.map((r: any) => new Date(r.request_date).getTime())));
        }
        
        this.updateRequestAvailability();
      }
    } catch (error) {
      console.error('Erro ao verificar disponibilidade de solicitações:', error);
    }
  }

  private updateRequestAvailability(): void {
    const now = new Date();
    
    if (this.lastBasicRequest) {
      const nextBasicDate = new Date(this.lastBasicRequest);
      nextBasicDate.setMonth(nextBasicDate.getMonth() + 1);
      this.canRequestBasic = now >= nextBasicDate;
    }
    
    if (this.lastHygieneRequest) {
      const nextHygieneDate = new Date(this.lastHygieneRequest);
      nextHygieneDate.setMonth(nextHygieneDate.getMonth() + 1);
      this.canRequestHygiene = now >= nextHygieneDate;
    }
  }

  getBasicBasketStatus(): string {
    if (this.canRequestBasic) {
      return 'Solicitação de cesta básica disponível';
    }
    
    if (this.lastBasicRequest) {
      const nextDate = new Date(this.lastBasicRequest);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return `Próxima solicitação de cesta básica estará disponível em ${nextDate.toLocaleDateString('pt-BR')}`;
    }
    
    return 'Solicitação de cesta básica disponível';
  }

  getHygieneBasketStatus(): string {
    if (this.canRequestHygiene) {
      return 'Solicitação de cesta de higiene disponível';
    }
    
    if (this.lastHygieneRequest) {
      const nextDate = new Date(this.lastHygieneRequest);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return `Próxima solicitação de cesta de higiene estará disponível em ${nextDate.toLocaleDateString('pt-BR')}`;
    }
    
    return 'Solicitação de cesta de higiene disponível';
  }

  private parseRequestDate(dateValue: any): Date {
    if (!dateValue) return new Date();
    
    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      const parts = dateValue.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
    }
    
    return new Date(dateValue);
  }

  async previewBasket(): Promise<void> {
    if (!this.user) {
      alert('Usuário não encontrado.');
      return;
    }

    const peopleQuantity = parseInt(this.user.people_quantity || '1');
    const hasChildren = this.user.has_children || false;
    
    this.calculatedBasket = this.calculateBasketLocally(peopleQuantity, hasChildren);
    this.showBasketPreview = true;
  }

  closeBasketPreview(): void {
    this.showBasketPreview = false;
    this.calculatedBasket = [];
  }

  private calculateBasketLocally(peopleQuantity: number, hasChildren: boolean): BasketItem[] {
    const basicProducts = this.products.filter(p => p.productType === 'basic');
    const basket: BasketItem[] = [];

    basicProducts.forEach(product => {
      const baseQuantity = this.getBaseQuantity(product.name);
      const totalQuantity = baseQuantity * peopleQuantity;
      
      if (baseQuantity > 0) {
        basket.push({
          productId: parseInt(product.id!),
          productName: product.name,
          quantity: totalQuantity,
          unitQuantity: baseQuantity,
          unitType: product.measure_type
        });
      }
    });

    if (hasChildren) {
      const infantProducts = this.products.filter(p => p.productType === 'infant');
      infantProducts.forEach(product => {
        const baseQuantity = this.getInfantQuantity(product.name);
        if (baseQuantity > 0) {
          basket.push({
            productId: parseInt(product.id!),
            productName: product.name,
            quantity: baseQuantity,
            unitQuantity: baseQuantity,
            unitType: product.measure_type
          });
        }
      });
    }

    return basket;
  }

  private getBaseQuantity(productName: string): number {
    const quantities: { [key: string]: number } = {
      'Arroz': 2,
      'Feijão': 1,
      'Óleo de Soja': 1,
      'Açúcar': 1,
      'Sal': 1,
      'Farinha de Trigo': 1,
      'Café em Pó': 250,
      'Leite': 1,
      'Carne': 500,
      'Batata': 1,
      'Tomate': 1,
      'Banana': 1,
      'Manteiga': 200
    };
    return quantities[productName] || 0;
  }

  private getInfantQuantity(productName: string): number {
    const quantities: { [key: string]: number } = {
      'Bolacha': 200,
      'Gelatina': 85,
      'Biscoitinho': 150,
      'Brinquedo': 1
    };
    return quantities[productName] || 0;
  }

  private calculateHygieneBasket(): BasketItem[] {
    const hygieneProducts = this.products.filter(p => p.productType === 'hygiene');
    return hygieneProducts.map(product => ({
      productId: parseInt(product.id!),
      productName: product.name,
      quantity: 1,
      unitQuantity: 1,
      unitType: product.measure_type
    }));
  }

  private async processHygieneBasketRequest(hygieneBasket: BasketItem[]): Promise<void> {
    for (const basketItem of hygieneBasket) {
      await this.updateStockForHygiene(basketItem.productId.toString(), basketItem.quantity);
    }

    const basketRequest = {
      user_id: this.user?.id || '',
      request_date: new Date(),
      basket_type: 'hygiene',
      status: 'pending',
      calculated_items: hygieneBasket
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
  }

  private async updateStockForHygiene(productId: string, quantity: number): Promise<void> {
    try {
      const stockResponse = await fetch(`http://localhost:3000/stock?product_id=${productId}&donation_option=1`);
      const stockRecords = await stockResponse.json();
      
      if (stockRecords.length > 0) {
        const stockRecord = stockRecords[0];
        const newStock = Math.max(0, stockRecord.actual_stock - quantity);
        
        await fetch(`http://localhost:3000/stock/${stockRecord.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actual_stock: newStock })
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque de higiene:', error);
    }
  }

  private async processBasketRequest(calculatedBasket: BasketItem[], peopleQuantity: number, hasChildren: boolean): Promise<void> {
    this.calculatedBasket = calculatedBasket;
    
    for (const basketItem of calculatedBasket) {
      await this.productUpdateService.updateStock(basketItem.productId.toString(), -basketItem.quantity);
    }

    const basketRequest = {
      user_id: this.user?.id || '',
      request_date: new Date(),
      basket_type: 'basic',
      status: 'pending',
      people_quantity: peopleQuantity,
      has_children: hasChildren,
      calculated_items: calculatedBasket
    };

    const response = await fetch('http://localhost:3000/basket_request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(basketRequest)
    });

    if (response.ok) {
      alert(`Solicitação de cesta básica registrada com sucesso! Sua cesta foi calculada para ${peopleQuantity} pessoa(s)${hasChildren ? ' incluindo itens para crianças' : ''}.`);
      this.router.navigate(['/main']);
    } else {
      throw new Error('Erro ao registrar solicitação');
    }
  }

}
