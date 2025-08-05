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
    return new Date(dateValue) < this.minDate;
  }

  onDateFocus(event: any): void {
    if (!event.target.value) {
      event.target.placeholder = 'dd/mm/aaaa';
    }
  }

  onDateInput(event: any): void {
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

}
