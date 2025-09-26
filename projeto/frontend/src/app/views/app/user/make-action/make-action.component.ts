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
import { DonationStatus } from '../../../../domain/enums/donation-status.enum';
import { DonationStatusService } from '../../../../services/donation/donation-status.service';
import { DonationProduct } from '../../../../domain/model/donation-product';
import { Product } from '../../../../domain/model/product';
import { DonationCreateService } from '../../../../services/donation/donation-create.service';
import { DonationProductCreateService } from '../../../../services/donation-product/donation-product-create.service';
import { DonationValidationService } from '../../../../services/donation-product/donation-validation.service';
import { ProductUpdateService } from '../../../../services/product/product-update.service';
import { ProductReadService } from '../../../../services/product/product-read.service';
import { StockUpdateService } from '../../../../services/stock/stock-update.service';

import { BasketItem } from '../../../../domain/model/basket-item';
import { UnitConverterService } from '../../../../services/utils/unit-converter.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


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
  lowStockProducts: string[] = [];
  showLowStockWarning: boolean = false;

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
    private stockUpdateService: StockUpdateService,
    private unitConverterService: UnitConverterService,
    private http: HttpClient,
    private toastr: ToastrService,
    private donationStatusService: DonationStatusService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
  this.userType = this.user.userType as 'donor' | 'beneficiary';
      if (this.userType === 'beneficiary') {
        await this.checkRequestAvailability();
      }
    }
    await this.loadProducts();
    await this.checkLowStockProducts();
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
      console.log('Selected product:', this.selectedProduct);
      console.log('Options donation:', this.selectedProduct.optionsDonation);
      console.log('Measure type:', this.selectedProduct.measureType);
      this.selectedUnit = this.getDefaultUnit();
    }
  }

  getDefaultUnit(): string {
  if (!this.selectedProduct) return '';
  return this.selectedProduct.measureType;
  }

  isWeightProduct(): boolean {
  if (!this.selectedProduct) return false;
  return this.selectedProduct.measureType === 'kg' || this.selectedProduct.measureType === 'g';
  }

  isVolumeProduct(): boolean {
  if (!this.selectedProduct) return false;
  return this.selectedProduct.measureType === 'l' || this.selectedProduct.measureType === 'ml';
  }

  onUnitChange(newUnit: string): void {
    this.selectedUnit = newUnit;
  }

  getConvertedQuantity(quantityValue: string): string {
    if (!quantityValue || !this.selectedProduct || !this.selectedUnit) return '';
    
    const quantity = parseFloat(quantityValue);
    if (isNaN(quantity)) return '';
    
  const baseUnit = this.selectedProduct.measureType;
    
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
    
    // Não validar data para produtos não perecíveis
    if (this.isToyProduct() || this.isNonPerishableProduct()) {
      return false;
    }
    
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
    
    // Não validar data para produtos não perecíveis
    if (this.isToyProduct() || this.isNonPerishableProduct()) {
      return '';
    }
    
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
    // Para produtos com measure_type 'un', usar o valor do campo quantity como unidades
  const measureType = this.selectedProduct?.measureType || this.selectedProduct?.unitType;
    if (measureType === 'un') {
      const quantityValue = this.getQuantityValue();
      console.log('Produto unitário - measureType:', measureType);
      console.log('Produto unitário - usando quantity como units:', quantityValue);
      return quantityValue || '1';
    }
    
    // Para outros produtos, usar o campo units separado
    const value = this.unitsRef?.nativeElement?.value || '1';
    console.log('Produto não unitário - measureType:', measureType);
    console.log('getUnitsValue() - value:', value);
    return value;
  }

  isToyProduct(): boolean {
    return this.selectedProduct?.name === 'Brinquedo';
  }

  isNonPerishableProduct(): boolean {
    if (!this.selectedProduct) return false;
    const nonPerishableProducts = ['Brinquedo', 'Papel-toalha', 'Papel-higiênico', 'Sabonete', 'Creme Dental', 'Escova de Dentes', 'Absorvente Higiênico', 'Desodorante'];
    return nonPerishableProducts.includes(this.selectedProduct.name);
  }

  getExpirationDateValue(): string {
    if (this.isToyProduct() || this.isNonPerishableProduct()) {
      return '';
    }
    return this.expirationDateRef?.nativeElement?.value || '';
  }

  async registerDonation(productId: string, expirationDate: string, quantity: string, units?: string): Promise<void> {
    if (!this.user || !productId || !quantity || !this.selectedProduct) {
      this.toastr.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.isToyProduct() && !this.isNonPerishableProduct() && !expirationDate) {
      this.toastr.error('Por favor, preencha a data de validade.');
      return;
    }

    if (this.selectedProduct.optionsDonation && !this.selectedProduct.optionsDonation.includes(parseFloat(quantity))) {
      this.toastr.error('Quantidade inválida. Selecione uma das opções disponíveis.');
      return;
    }

  if (this.selectedProduct.measureType !== 'un' && (!units || parseInt(units) <= 0)) {
      this.toastr.error('Por favor, informe o número de unidades a serem doadas.');
      return;
    }
    
    // Para produtos unitários, validar se quantity é um número válido
  const measureType = this.selectedProduct.measureType || this.selectedProduct.unitType;
    if (measureType === 'un' && (!quantity || parseInt(quantity) <= 0)) {
      this.toastr.error('Por favor, informe o número de unidades a serem doadas.');
      return;
    }

    if (!this.isToyProduct() && !this.isNonPerishableProduct() && expirationDate && this.isDateInvalid(expirationDate)) {
      this.toastr.error('A data de validade não pode ser anterior à data atual.');
      return;
    }

    const quantityNum = parseFloat(quantity);
    const unitsNum = units ? parseInt(units) : 1;
    
    if (!this.unitConverterService.validateQuantityInput(quantityNum, this.selectedProduct.measureType)) {
      this.toastr.error(`Quantidade inválida para a unidade ${this.selectedProduct.measureType}. Verifique o valor inserido.`);
      return;
    }

  const unit = this.selectedProduct.measureType;

    try {
      console.log('=== INICIANDO REGISTRO DE DOAÇÃO ===');
      console.log('ProductId:', productId);
      console.log('Quantity:', quantity);
      console.log('Units:', units);
      console.log('ExpirationDate:', expirationDate);
      
      // Criar doação com status "Pendente"
      const donation: Donation = {
  donationDate: new Date(),
  userId: this.user.id!.toString(),
  donationStatus: DonationStatus.PENDENTE
      };
      
      console.log('Criando doação:', donation);
      const createdDonation = await this.donationCreateService.create(donation);
      console.log('Doação criada:', createdDonation);
      
      if (!createdDonation || !createdDonation.id) {
        console.error('Erro: Doação não foi criada corretamente');
        throw new Error('Erro ao criar doação');
      }
      
      // Formatar data de expiração para string (yyyy-mm-dd)
  let formattedExpirationDate: Date | null = null;
      if (!this.isToyProduct() && !this.isNonPerishableProduct() && expirationDate) {
        // Aceita formatos 'dd/MM/yyyy' ou 'yyyy-MM-dd'
        if (expirationDate.includes('/')) {
          const parts = expirationDate.split('/');
          if (parts.length === 3) {
            // dd/MM/yyyy
            formattedExpirationDate = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
          }
        } else {
          // yyyy-MM-dd
          formattedExpirationDate = new Date(expirationDate);
        }
      }
      
      // Validar e garantir que unit não seja null
  const validUnit = unit || this.selectedProduct?.measureType || 'un';
      
      // Para produtos unitários, usar quantity como unidades e definir donation_option como 1
  const measureType = this.selectedProduct.measureType || this.selectedProduct.unitType;
      let finalQuantity: number, finalUnit: number;
      if (measureType === 'un') {
        finalQuantity = 1; // donation_option padrão
        finalUnit = quantityNum; // usar quantity como número de unidades
      } else {
        finalQuantity = quantityNum; // donation_option
        finalUnit = unitsNum; // número de unidades
      }
      
      // Criar produto da doação
      const donationProduct: any = {
  quantity: finalQuantity,
  unit: finalUnit,
  donationId: createdDonation.id,
  productId: parseInt(productId)
      };
      
      // Só adicionar data de expiração se não for produto não perecível
      if (!this.isToyProduct() && !this.isNonPerishableProduct()) {
        donationProduct.expirationDate = formattedExpirationDate ?? new Date();
      }
      
      console.log('Produto final a ser salvo:', {
  measureType: measureType,
        quantity: finalQuantity,
        unit: finalUnit,
        originalQuantity: quantityNum,
        originalUnits: unitsNum
      });
      
      console.log('Criando produto da doação:', donationProduct);
      const createdDonationProduct = await this.donationProductCreateService.create(donationProduct);
      console.log('Produto da doação criado:', createdDonationProduct);

      // NÃO processar para estoque - aguardar aprovação do admin
      console.log('Doação criada com status pendente - aguardando aprovação');

      this.toastr.success('Doação registrada com sucesso! Aguarde a aprovação de um administrador.');
      this.router.navigate(['/main']);
      
      console.log('=== DOAÇÃO REGISTRADA COM SUCESSO ===');
    } catch (error) {
      console.error('=== ERRO AO REGISTRAR DOAÇÃO ===');
      console.error('Erro completo:', error);
      this.toastr.error('Erro ao registrar doação. Tente novamente.');
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
        this.toastr.warning('Você já solicitou uma cesta básica neste mês. Aguarde o próximo mês para fazer uma nova solicitação.');
        return;
      }

    const peopleQuantity = this.user.peopleQuantity ?? 1;
    const hasChildren = this.user.hasChildren ?? false;
      
      const calculatedBasket = this.calculateBasketLocally(peopleQuantity, hasChildren);
      await this.processBasketRequest(calculatedBasket, peopleQuantity, hasChildren);

      
    } catch (error) {
      console.error('Erro ao solicitar cesta básica:', error);
      this.toastr.error('Erro ao solicitar cesta básica. Tente novamente.');
    } finally {
      this.isProcessingRequest = false;
    }
  }

  async requestHygieneBasket(): Promise<void> {
    if (!this.user) {
      this.toastr.error('Usuário não encontrado.');
      return;
    }

    try {
      const hasRequestedThisMonth = await this.checkMonthlyBasketRequest('hygiene');
      if (hasRequestedThisMonth) {
        this.toastr.warning('Você já solicitou uma cesta de higiene neste mês. Aguarde o próximo mês para fazer uma nova solicitação.');
        return;
      }

      const hygieneBasket = this.calculateHygieneBasket();
      await this.processHygieneBasketRequest(hygieneBasket);
      
    } catch (error) {
      console.error('Erro ao solicitar cesta de higiene:', error);
      this.toastr.error('Erro ao solicitar cesta de higiene. Tente novamente.');
    }
  }

  private async checkMonthlyBasketRequest(basketType: string): Promise<boolean> {
    if (!this.user?.id) return false;

    try {
      const requests = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/basket_request?user_id=${this.user.id}`)
      );
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      return requests.some((request: any) => {
        const requestDate = new Date(request.requestDate || request.request_date);
        const basketTypeField = request.basketType || request.basket_type;
        const status = request.status;
        return basketTypeField === basketType && 
               requestDate.getMonth() === currentMonth && 
               requestDate.getFullYear() === currentYear &&
               status !== 'cancelled';
      });
    } catch (error) {
      console.error('Erro ao verificar solicitações mensais:', error);
      return false;
    }
  }

  private async checkRequestAvailability(): Promise<void> {
    if (!this.user?.id) return;

    try {
      const requests = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/basket_request?user_id=${this.user.id}`)
      );
      
      const basicRequests = requests.filter((r: any) => (r.basketType || r.basket_type) === 'basic' && r.status !== 'cancelled');
      const hygieneRequests = requests.filter((r: any) => (r.basketType || r.basket_type) === 'hygiene' && r.status !== 'cancelled');
      
      if (basicRequests.length > 0) {
        this.lastBasicRequest = new Date(Math.max(...basicRequests.map((r: any) => new Date(r.requestDate || r.request_date).getTime())));
      }
      
      if (hygieneRequests.length > 0) {
        this.lastHygieneRequest = new Date(Math.max(...hygieneRequests.map((r: any) => new Date(r.requestDate || r.request_date).getTime())));
      }
      
      this.updateRequestAvailability();
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
      this.toastr.error('Usuário não encontrado.');
      return;
    }

  const peopleQuantity = this.user.peopleQuantity ?? 1;
  const hasChildren = this.user.hasChildren ?? false;
    
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
          unitType: product.measureType || product.unitType || 'un'
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
            unitType: product.measureType || product.unitType || 'un'
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
  unitType: product.measureType || product.unitType || 'un'
    }));
  }

  private async processHygieneBasketRequest(hygieneBasket: BasketItem[]): Promise<void> {
    // Check stock availability first
    for (const basketItem of hygieneBasket) {
      const hasStock = await this.checkStockAvailability(basketItem.productId.toString(), basketItem.quantity);
      if (!hasStock) {
        this.toastr.error(`Estoque insuficiente para ${basketItem.productName}. Solicitação cancelada.`);
        return;
      }
    }

    // Update stock
    for (const basketItem of hygieneBasket) {
      await this.updateStockForHygiene(basketItem.productId.toString(), basketItem.quantity);
    }

    const basketRequest = {
      userId: this.user?.id || '',
      requestDate: new Date().toISOString(),
      basketType: 'hygiene',
      status: 'pending',
      calculatedItems: JSON.stringify(hygieneBasket)
    };

    await firstValueFrom(
      this.http.post(`${environment.api_endpoint}/basket_request`, basketRequest)
    );

    // Update availability after successful request
    this.lastHygieneRequest = new Date();
    this.updateRequestAvailability();

    this.toastr.success('Solicitação de cesta de higiene registrada com sucesso!');
    this.router.navigate(['/main']);
  }

  private async checkStockAvailability(productId: string, requiredQuantity: number): Promise<boolean> {
    try {
      const stock = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/stock`)
      );
      console.log('All stock:', stock);
      const productStock = stock.filter(item => {
  const itemProductId = item.productId;
        console.log(`Comparing ${itemProductId} with ${productId}`);
        return itemProductId == productId;
      });
      console.log(`Filtered stock for product ${productId}:`, productStock);
      const totalStock = productStock.reduce((sum, item) => {
  const actualStock = item.actualStock || 0;
        return sum + actualStock;
      }, 0);
      console.log(`Product ${productId}: Required ${requiredQuantity}, Available ${totalStock}`);
      return totalStock >= requiredQuantity;
    } catch (error) {
      console.error('Erro ao verificar estoque:', error);
      return false;
    }
  }

  private async updateStockForHygiene(productId: string, quantity: number): Promise<void> {
    try {
      const stocks = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/stock/product/${productId}`)
      );
      
      if (stocks.length > 0) {
        const stock = stocks[0];
        const updatedStock = {
          ...stock,
          actualStock: stock.actualStock - quantity,
          usedStock: (stock.usedStock || 0) + quantity
        };
        
        await firstValueFrom(
          this.http.put(`${environment.api_endpoint}/stock/${stock.id}`, updatedStock)
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque de higiene:', error);
    }
  }

  private async updateStockForBasket(productId: string, quantity: number): Promise<void> {
    try {
      const stocks = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/stock/product/${productId}`)
      );
      
      if (stocks.length > 0) {
        // Find the best matching donation option for the required quantity
        const product = this.products.find(p => p.id == productId);
        let targetStock = stocks[0];
        
        if (product && product.optionsDonation && product.optionsDonation.length > 0) {
          const donationOption = product.optionsDonation.find(option => option >= quantity) || product.optionsDonation[0];
          targetStock = stocks.find(s => s.donationOption === donationOption) || stocks[0];
        }
        
        const updatedStock = {
          ...targetStock,
          actualStock: targetStock.actualStock - quantity,
          usedStock: (targetStock.usedStock || 0) + quantity
        };
        
        await firstValueFrom(
          this.http.put(`${environment.api_endpoint}/stock/${targetStock.id}`, updatedStock)
        );
        
        // Marcar doações relacionadas como "Utilizada"
        await this.donationStatusService.markDonationsAsUsed(productId, quantity);
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
    }
  }



  private async processBasketRequest(calculatedBasket: BasketItem[], peopleQuantity: number, hasChildren: boolean): Promise<void> {
    this.calculatedBasket = calculatedBasket;
    
    // Check stock availability first
    for (const basketItem of calculatedBasket) {
      const hasStock = await this.checkStockAvailability(basketItem.productId.toString(), basketItem.quantity);
      if (!hasStock) {
        this.toastr.error(`Estoque insuficiente para ${basketItem.productName}. Solicitação cancelada.`);
        return;
      }
    }
    
    // Update stock
    for (const basketItem of calculatedBasket) {
      await this.updateStockForBasket(basketItem.productId.toString(), basketItem.quantity);
    }

    const basketRequest = {
      userId: this.user?.id || '',
      requestDate: new Date().toISOString(),
      basketType: 'basic',
      status: 'pending',
      peopleQuantity: peopleQuantity,
      hasChildren: hasChildren,
      calculatedItems: JSON.stringify(calculatedBasket)
    };

    await firstValueFrom(
      this.http.post(`${environment.api_endpoint}/basket_request`, basketRequest)
    );

    // Update availability after successful request
    this.lastBasicRequest = new Date();
    this.updateRequestAvailability();

    this.toastr.success(`Solicitação de cesta básica registrada com sucesso! Sua cesta foi calculada para ${peopleQuantity} pessoa(s)${hasChildren ? ' incluindo itens para crianças' : ''}.`);
    this.router.navigate(['/main']);
  }

  async checkLowStockProducts(): Promise<void> {
    try {
      const stocks = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/stock`)
      );
      
      const lowStockItems: string[] = [];
      const stockThreshold = 5; // Limite para considerar estoque baixo
      
      // Agrupar estoque por produto
      const productStocks = new Map<number, number>();
      
      stocks.forEach(stock => {
        const productId = stock.productId || stock.product_id;
        const actualStock = stock.actualStock || stock.actual_stock || 0;
        const currentTotal = productStocks.get(productId) || 0;
        productStocks.set(productId, currentTotal + actualStock);
      });
      
      // Verificar quais produtos estão com estoque baixo
      productStocks.forEach((totalStock, productId) => {
        if (totalStock <= stockThreshold) {
          const product = this.products.find(p => parseInt(p.id!) === productId);
          if (product) {
            lowStockItems.push(`${product.name} (${totalStock} unidades)`);
          }
        }
      });
      
      this.lowStockProducts = lowStockItems;
      this.showLowStockWarning = lowStockItems.length > 0;
      
      console.log('Produtos com estoque baixo:', this.lowStockProducts);
    } catch (error) {
      console.error('Erro ao verificar estoque baixo:', error);
    }
  }

  dismissLowStockWarning(): void {
    this.showLowStockWarning = false;
  }

  isProductLowStock(productId: string): boolean {
    const productIdNum = parseInt(productId);
    return this.lowStockProducts.some(item => {
      const product = this.products.find(p => parseInt(p.id!) === productIdNum);
      return product && item.includes(product.name);
    });
  }

  getProductStockInfo(productId: string): string {
    const productIdNum = parseInt(productId);
    const stockItem = this.lowStockProducts.find(item => {
      const product = this.products.find(p => parseInt(p.id!) === productIdNum);
      return product && item.includes(product.name);
    });
    return stockItem ? stockItem.match(/\((\d+) unidades\)/)?.[1] || '0' : '';
  }

  updateDonationSummary(): void {
    // This method is called when quantity or units change to trigger summary update
  }

  getDonationSummary(): string {
    if (!this.selectedProduct) return '';
    
    const quantityValue = this.getQuantityValue();
    const unitsValue = this.getUnitsValue();
    
    if (!quantityValue || !unitsValue) return '';
    
    const quantity = parseFloat(quantityValue);
    const units = parseInt(unitsValue);
    
    if (isNaN(quantity) || isNaN(units) || quantity <= 0 || units <= 0) return '';
    
  const measureType = this.selectedProduct.measureType || this.selectedProduct.unitType;
    
    if (measureType === 'un') {
      const unitText = quantity === 1 ? 'unidade' : 'unidades';
      return `Total: ${quantity} ${unitText}`;
    } else {
      const total = quantity * units;
      const unitText = units === 1 ? 'unidade' : 'unidades';
      return `Total: ${units} ${unitText} de ${quantity}${measureType} = ${total}${measureType}`;
    }
  }



}
