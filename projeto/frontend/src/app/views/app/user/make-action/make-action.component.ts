import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { User } from '../../../../domain/model/user';
import { Donation } from '../../../../domain/model/donation';
import { DonationProduct } from '../../../../domain/model/donation_product';
import { DonationCreateService } from '../../../../services/donation/donation-create.service';
import { DonationProductCreateService } from '../../../../services/donation-product/donation-product-create.service';
import { ProductUpdateService } from '../../../../services/product/product-update.service';

@Component({
  selector: 'app-make-action',
  imports: [],
  templateUrl: './make-action.component.html',
  styleUrl: './make-action.component.css'
})

export class MakeActionComponent implements OnInit {

  user: User | null = null;
  userType: 'donor' | 'beneficiary' = 'donor';

  constructor(
    private authenticationService: AuthenticationService,
    private donationCreateService: DonationCreateService,
    private donationProductCreateService: DonationProductCreateService,
    private productUpdateService: ProductUpdateService
  ) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userType = this.user.user_type as 'donor' | 'beneficiary';
    }
  }

  async registerDonation(productId: string, expirationDate: string, quantity: string, unit: string): Promise<void> {
    if (!this.user || !productId || !expirationDate || !quantity || !unit) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // 1. Criar doação
      const donation: Donation = {
        donation_date: new Date(),
        user_id: this.user.id!
      };

      const donationResponse = await this.donationCreateService.create(donation);
      
      // 2. Criar donation_product
      const donationProduct: DonationProduct = {
        quantity: parseInt(quantity),
        expirationDate: new Date(expirationDate),
        unit: unit,
        donation_id: donationResponse.id!,
        product_id: productId
      };

      await this.donationProductCreateService.create(donationProduct);

      // 3. Atualizar stock do produto
      await this.productUpdateService.updateStock(productId, parseInt(quantity));

      alert('Doação registrada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao registrar doação:', error);
      alert('Erro ao registrar doação. Tente novamente.');
    }
  }

}
