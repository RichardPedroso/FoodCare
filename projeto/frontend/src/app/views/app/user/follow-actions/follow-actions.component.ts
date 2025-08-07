import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { DonationReadService } from '../../../../services/donation/donation-read.service';
import { ProductReadService } from '../../../../services/product/product-read.service';
import { User } from '../../../../domain/model/user';
import { Donation } from '../../../../domain/model/donation';
import { DonationProduct } from '../../../../domain/model/donation_product';
import { Product } from '../../../../domain/model/product';

interface DonationDisplay {
  productName: string;
  quantity: number;
  unit: string;
  donationDate: Date;
  status: string;
}

@Component({
  selector: 'app-follow-actions',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './follow-actions.component.html',
  styleUrl: './follow-actions.component.css'
})
export class FollowActionsComponent implements OnInit {

  user: User | null = null;
  userType: 'donor' | 'beneficiary' = 'donor';
  donations: DonationDisplay[] = [];
  loading = false;
  thisMonthCount = 0;
  totalCount = 0;
  availableCount = 0;
  usedCount = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private donationReadService: DonationReadService,
    private productReadService: ProductReadService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userType = this.user.user_type as 'donor' | 'beneficiary';
      if (this.userType === 'donor') {
        await this.loadDonations();
      }
    }
  }

  private async loadDonations(): Promise<void> {
    if (!this.user?.id) return;
    
    this.loading = true;
    try {
      const userDonations = await this.donationReadService.findByUserId(this.user.id);
      const donationProducts = await this.donationReadService.findDonationProducts();
      const products = await this.productReadService.findAll();
      
      this.donations = userDonations.map(donation => {
        const donationProduct = donationProducts.find(dp => dp.donation_id === donation.id);
        const product = products.find(p => p.id === donationProduct?.product_id);
        
        return {
          productName: product?.name || 'Produto não encontrado',
          quantity: donationProduct?.quantity || 0,
          unit: donationProduct?.unit || '',
          donationDate: new Date(donation.donation_date),
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

}
