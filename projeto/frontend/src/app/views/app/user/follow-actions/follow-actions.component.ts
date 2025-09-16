import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { DonationReadService } from '../../../../services/donation/donation-read.service';
import { ProductReadService } from '../../../../services/product/product-read.service';
import { User } from '../../../../domain/model/user';
import { Donation } from '../../../../domain/model/donation';
import { DonationProduct } from '../../../../domain/model/donation_product';
import { Product } from '../../../../domain/model/product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

interface DonationDisplay {
  productName: string;
  quantity: number;
  unit: string;
  donationDate: Date | null;
  status: string;
}

interface BasketRequest {
  id?: string;
  user_id: string;
  request_date: Date | null;
  basket_type: string;
  status: string;
  calculated_items?: {
    productId: number;
    productName: string;
    quantity: number;
    unitQuantity: number;
    unitType: string;
  }[];
}

@Component({
  selector: 'app-follow-actions',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
    DatePipe
  ],
  templateUrl: './follow-actions.component.html',
  styleUrl: './follow-actions.component.css'
})
export class FollowActionsComponent implements OnInit {

  user: User | null = null;
  userType: 'donor' | 'beneficiary' = 'donor';
  donations: DonationDisplay[] = [];
  basketRequests: BasketRequest[] = [];
  loading = false;
  thisMonthCount = 0;
  totalCount = 0;
  availableCount = 0;
  usedCount = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private donationReadService: DonationReadService,
    private productReadService: ProductReadService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userType = (this.user.userType || this.user.user_type) as 'donor' | 'beneficiary';
      if (this.userType === 'donor') {
        await this.loadDonations();
      } else {
        await this.loadBasketRequests();
      }
    }
  }

  private async loadDonations(): Promise<void> {
    if (!this.user?.id) return;
    
    this.loading = true;
    try {
      const userDonations = await this.donationReadService.findByUserId(this.user.id!.toString());
      const donationProducts = await this.donationReadService.findDonationProducts();
      const products = await this.productReadService.findAll();
      

      
      this.donations = userDonations.map(donation => {
        const donationProduct = donationProducts.find(dp => {
          const dpDonationId = dp.donation_id || (dp as any).donationId;
          return dpDonationId == donation.id;
        });
        
        const product = products.find(p => {
          const productId = donationProduct?.product_id || (donationProduct as any)?.productId;
          return p.id == productId;
        });
        
        const dateValue = donation.donation_date || (donation as any).donationDate;
        const donationDate = dateValue ? new Date(dateValue) : null;
        return {
          productName: product?.name || 'Produto não encontrado',
          quantity: donationProduct?.quantity || 0,
          unit: donationProduct?.unit || '',
          donationDate: donationDate && !isNaN(donationDate.getTime()) ? donationDate : null,
          status: 'Disponível'
        };
      });
      
      this.calculateStats(userDonations);
    } catch (error) {
      console.error('Erro ao carregar doações:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadBasketRequests(): Promise<void> {
    if (!this.user?.id) return;
    
    this.loading = true;
    try {
      this.basketRequests = await firstValueFrom(
        this.http.get<BasketRequest[]>(`${environment.api_endpoint}/basket-request/user/${this.user.id}`)
      );
      this.basketRequests = this.basketRequests.map(request => {
        const dateValue = request.request_date || (request as any).requestDate;
        const requestDate = dateValue ? new Date(dateValue) : null;
        return {
          ...request,
          request_date: requestDate && !isNaN(requestDate.getTime()) ? requestDate : null
        };
      });
      this.calculateBasketStats(this.basketRequests);
    } catch (error) {
      console.error('Erro ao carregar solicitações de cestas:', error);
    } finally {
      this.loading = false;
    }
  }

  private calculateStats(donations: Donation[]): void {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    this.totalCount = donations.length;
    this.thisMonthCount = donations.filter(donation => {
      const donationDate = new Date(donation.donation_date);
      return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
    }).length;
    this.availableCount = donations.length; // Todas as doações são consideradas disponíveis
    this.usedCount = 0; // Nenhuma doação foi utilizada ainda
  }

  private calculateBasketStats(requests: BasketRequest[]): void {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    this.totalCount = requests.length;
    this.thisMonthCount = requests.filter(request => {
      if (!request.request_date) return false;
      const requestDate = new Date(request.request_date);
      return requestDate.getMonth() === currentMonth && requestDate.getFullYear() === currentYear;
    }).length;
    this.availableCount = requests.filter(request => request.status === 'pending').length;
    this.usedCount = requests.filter(request => request.status === 'collected').length;
  }

  showBasketProducts(request: BasketRequest, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const basketType = request.basket_type === 'basic' ? 'Cesta Básica' : 'Cesta de Higiene';
    
    if (request.calculated_items && request.calculated_items.length > 0) {
      const products = request.calculated_items.map(item => 
        `${item.productName} - ${item.quantity}${item.unitType}`
      );
      alert(`${basketType}:\n\n${products.join('\n')}`);
    } else {
      alert(`${basketType}:\n\nProdutos não encontrados para esta cesta.`);
    }
  }

}
