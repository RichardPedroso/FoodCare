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
import { ToastrService } from 'ngx-toastr';

interface DonationDisplay {
  productName: string;
  quantity: number;
  unit: string;
  donationDate: Date | null;
  status: string;
  calculatedWeight: number;
  measureType: string;
}

interface BasketItem {
  productId: number;
  productName: string;
  quantity: number;
  unitQuantity: number;
  unitType: string;
}

interface BasketRequest {
  id?: string;
  user_id: string;
  request_date: Date | null;
  basket_type: string;
  status: string;
  calculated_items?: string;
  parsedItems?: BasketItem[];
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
  userType: 'donor' | 'beneficiary' | 'admin' = 'donor';
  donations: DonationDisplay[] = [];
  basketRequests: BasketRequest[] = [];
  loading = false;
  thisMonthCount = 0;
  totalCount = 0;
  availableCount = 0;
  usedCount = 0;
  totalDonatedWeight = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private donationReadService: DonationReadService,
    private productReadService: ProductReadService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userType = (this.user.userType || this.user.user_type) as 'donor' | 'beneficiary' | 'admin';
      if (this.userType === 'donor' || this.userType === 'admin') {
        await this.loadDonations();
      }
      if (this.userType === 'beneficiary' || this.userType === 'admin') {
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
      
      const validDonations = userDonations.map(donation => {
        const donationProduct = donationProducts.find(dp => {
          const dpDonationId = dp.donation_id || (dp as any).donationId;
          return dpDonationId == donation.id;
        });
        
        // Se não há donation_product, pular esta doação
        if (!donationProduct) {
          console.log(`Doação ${donation.id} não tem produtos associados - pulando`);
          return null;
        }
        
        console.log(`Doação ${donation.id}:`, {
          donation,
          donationProduct,
          donationStatus: (donation as any).donationStatus || donation.donation_status
        });
        
        const productId = donationProduct?.product_id || (donationProduct as any)?.productId;
        console.log(`Debug follow-actions - doação ${donation.id}:`, {
          donationProduct,
          productId,
          availableProducts: products.slice(0, 3).map(p => ({ id: p.id, name: p.name }))
        });
        
        const product = products.find(p => {
          return p.id == productId;
        });
        
        if (!product && donationProduct) {
          console.warn(`Produto não encontrado para donation_product:`, {
            donationProduct,
            productId,
            availableProducts: products.slice(0, 5).map(p => ({ id: p.id, name: p.name }))
          });
        }
        
        const dateValue = donation.donation_date || (donation as any).donationDate;
        const donationDate = dateValue ? new Date(dateValue) : null;
        
        const unitsCount = Number(donationProduct?.unit) || 0; // Número de unidades doadas
        const donationOption = Number(donationProduct?.quantity) || 1; // Peso por unidade (kg)
        const calculatedWeight = unitsCount * donationOption; // Peso total
        
        console.log(`Cálculo peso doação ${donation.id}:`, {
          unitsCount,
          donationOption,
          calculatedWeight,
          donationProduct
        });
        const measureType = (product as any)?.unitType || product?.measure_type || (product as any)?.measureType || '';
        
        // Determinar status baseado em donation_status e uso
        const donationStatus = (donation as any).donationStatus ?? donation.donation_status;
        let status = 'Estocado';
        if (donationStatus === false) {
          status = 'Pendente';
        } else if (donationStatus === null) {
          status = 'Negado';
        }
        
        // Verificar se foi utilizada (simulação simples)
        // Para teste: doações de Arroz e Feijão com ID <= 10 são consideradas utilizadas
        const donationId = parseInt(donation.id?.toString() || '0');
        if (donationStatus === true && (productId == 1 || productId == 2) && donationId <= 10) {
          status = 'Utilizado';
        }
        
        return {
          productName: product?.name || 'Produto não encontrado',
          quantity: unitsCount,
          unit: donationProduct?.unit || '',
          donationDate: donationDate && !isNaN(donationDate.getTime()) ? donationDate : null,
          status,
          calculatedWeight,
          measureType
        };
      }).filter(donation => donation !== null);
      
      this.donations = validDonations;
      
      this.calculateTotalDonatedWeight(donationProducts, products);
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
        this.http.get<BasketRequest[]>(`${environment.api_endpoint}/basket_request/user/${this.user.id}`)
      );
      this.basketRequests = this.basketRequests.map(request => {
        const dateValue = request.request_date || (request as any).requestDate;
        const requestDate = dateValue ? new Date(dateValue) : null;
        
        let parsedItems: BasketItem[] = [];
        if (request.calculated_items && typeof request.calculated_items === 'string') {
          try {
            parsedItems = JSON.parse(request.calculated_items);
          } catch (e) {
            console.error('Erro ao parsear calculated_items:', e);
          }
        }
        
        return {
          ...request,
          request_date: requestDate && !isNaN(requestDate.getTime()) ? requestDate : null,
          parsedItems
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
      const dateValue = donation.donation_date || (donation as any).donationDate;
      if (!dateValue) return false;
      const donationDate = new Date(dateValue);
      return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
    }).length;
    
    // Contar doações disponíveis (donation_status = true) e pendentes (donation_status = false)
    this.availableCount = donations.filter(donation => {
      const donationStatus = (donation as any).donationStatus ?? donation.donation_status;
      return donationStatus === true;
    }).length;
    
    this.usedCount = donations.filter(donation => {
      const donationStatus = (donation as any).donationStatus ?? donation.donation_status;
      return donationStatus === false;
    }).length;
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
    this.usedCount = requests.filter(request => request.status === 'approved').length;
  }

  private calculateTotalDonatedWeight(donationProducts: DonationProduct[], products: Product[]): void {
    this.totalDonatedWeight = donationProducts.reduce((total, donationProduct) => {
      const product = products.find(p => {
        const productId = donationProduct.product_id || (donationProduct as any).productId;
        return p.id == productId;
      });
      
      if (product && product.optionsDonation) {
        const quantity = donationProduct.quantity || 0;
        const optionsDonation = Array.isArray(product.optionsDonation) 
          ? product.optionsDonation[0] 
          : product.optionsDonation;
        return total + (quantity * optionsDonation);
      }
      
      return total;
    }, 0);
  }

  getBasketStatus(status: string): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Coletada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  }

  async showBasketProducts(request: BasketRequest, event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }
    const basketType = request.basket_type === 'basic' ? 'Cesta Básica' : 'Cesta de Higiene';
    
    if (request.parsedItems && request.parsedItems.length > 0) {
      const products = await this.productReadService.findAll();
      const basketProducts = request.parsedItems.map((item: BasketItem) => {
        const product = products.find(p => p.id == item.productId.toString());
        const measureType = (product as any)?.unitType || product?.measure_type || (product as any)?.measureType || '';
        return `<div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee;"><span style="font-weight: 500;">${item.productName} - ${item.quantity}${measureType}</span></div>`;
      });
      
      const htmlContent = `
        <div style="max-height: 300px; overflow-y: auto;">
          <div style="margin-bottom: 12px; font-weight: 600; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px;">${basketType}</div>
          <div style="font-size: 14px;">
            ${basketProducts.join('')}
          </div>
        </div>
      `;
      
      this.toastr.info(htmlContent, '', {
        enableHtml: true,
        timeOut: 8000,
        extendedTimeOut: 3000,
        closeButton: true,
        progressBar: true
      });
    } else {
      this.toastr.warning(`Produtos não encontrados para esta cesta.`, basketType);
    }
  }

}