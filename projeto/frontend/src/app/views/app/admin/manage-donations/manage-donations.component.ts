import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Donation } from '../../../../domain/model/donation';
import { DonationReadService } from '../../../../services/donation/donation-read.service';
import { DonationUpdateService } from '../../../../services/donation/donation-update.service';
import { DonationProductReadService } from '../../../../services/donation-product/donation-product-read.service';
import { UserReadService } from '../../../../services/user/user-read.service';
import { ProductReadService } from '../../../../services/product/product-read.service';
import { ToastrService } from 'ngx-toastr';

interface DonationWithDetails extends Donation {
  donorName: string;
  donorEmail: string;
  productName?: string;
  quantity?: number | string;
  unit?: string;
  expiration_date?: Date;
}

@Component({
  selector: 'app-manage-donations',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, FormsModule],
  templateUrl: './manage-donations.component.html',
  styleUrl: './manage-donations.component.css'
})
export class ManageDonationsComponent implements OnInit {
  allDonations: DonationWithDetails[] = [];
  donations: DonationWithDetails[] = [];
  selectedDonation: DonationWithDetails | null = null;
  showDonationDetails = false;
  searchTerm = '';

  constructor(
    private donationReadService: DonationReadService,
    private donationUpdateService: DonationUpdateService,
    private donationProductReadService: DonationProductReadService,
    private userReadService: UserReadService,
    private productReadService: ProductReadService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    await this.loadPendingDonations();
  }

  async loadPendingDonations() {
    try {
      // Usar endpoint existente e filtrar doações pendentes
      const allDonations = await this.donationReadService.findAll();
      console.log('Todas as doações:', allDonations);
      console.log('Estrutura da primeira doação:', allDonations[0]);
      
      // Filtrar doações pendentes (donationStatus = false)
      const pendingDonations = allDonations.filter(d => {
        const donationStatus = (d as any).donationStatus;
        console.log(`Doação ${d.id}: donationStatus = ${donationStatus}`);
        return donationStatus === false;
      });
      
      console.log('Doações pendentes filtradas:', pendingDonations);
      
      // Buscar dados reais dos usuários e produtos
      this.allDonations = await Promise.all(pendingDonations.map(async donation => {
        const userId = (donation as any).userId || donation.user_id;
        const donationId = donation.id;
        
        try {
          const [user, products] = await Promise.all([
            this.userReadService.findById(userId.toString()),
            donationId ? this.donationProductReadService.findByDonationId(parseInt(donationId.toString())) : Promise.resolve([])
          ]);
          
          const firstProduct = products && products.length > 0 ? products[0] : null;
          let productName = 'Aguardando produto';
          
          console.log(`Debug doação ${donationId}:`, {
            products,
            firstProduct,
            productId: firstProduct?.productId,
            product_id: firstProduct?.product_id,
            unit: firstProduct?.unit,
            quantity: firstProduct?.quantity,
            unitType: typeof firstProduct?.unit,
            quantityType: typeof firstProduct?.quantity
          });
          
          if (firstProduct) {
            const productId = firstProduct.productId || (firstProduct as any).product_id;
            console.log(`Tentando buscar produto com ID: ${productId}`);
            
            if (productId) {
              try {
                const product = await this.productReadService.findById(productId.toString());
                productName = product.name || 'Produto';
                console.log(`Produto encontrado: ${productName}`);
              } catch (error) {
                console.error(`Erro ao buscar produto ID ${productId}:`, error);
                productName = `Produto ID ${productId} não encontrado`;
              }
            } else {
              console.warn('ProductId não encontrado no firstProduct:', firstProduct);
            }
          }
          
          return {
            ...donation,
            donorName: user.name || `Usuário ${userId}`,
            donorEmail: user.email || `usuario${userId}@email.com`,
            productName: productName,
            quantity: firstProduct ? `${firstProduct.unit} unidades de ${firstProduct.quantity}kg` : '0',
            unit: firstProduct ? this.getProductUnit(firstProduct.productId || (firstProduct as any).product_id) : 'un',
            expiration_date: firstProduct ? firstProduct.expirationDate : null
          };
        } catch (error) {
          console.error(`Erro ao buscar dados da doação ${donationId}:`, error);
          return {
            ...donation,
            donorName: `Usuário ${userId}`,
            donorEmail: `usuario${userId}@email.com`,
            productName: 'Aguardando produto',
            quantity: 0,
            unit: 'un'
          };
        }
      }));
      
      console.log('Doações processadas:', this.allDonations);
      this.applyFilters();
    } catch (error) {
      console.error('Erro ao carregar doações:', error);
      // Fallback para dados mock
      this.allDonations = [
        {
          id: '1',
          donation_date: new Date('2025-01-15'),
          user_id: 1,
          donation_status: false,
          donorName: 'João Silva',
          donorEmail: 'joao@email.com',
          productName: 'Arroz',
          quantity: 5,
          unit: 'kg',
          expiration_date: new Date('2025-12-31')
        }
      ];
      this.applyFilters();
    }
  }

  selectDonation(donation: DonationWithDetails) {
    this.selectedDonation = donation;
    this.showDonationDetails = true;
  }

  async confirmDonation() {
    if (!this.selectedDonation) return;

    try {
      await this.donationUpdateService.confirmDonation(this.selectedDonation.id!);
      this.toastr.success('Doação confirmada com sucesso!');
      
      // Remover da lista de pendentes
      this.allDonations = this.allDonations.filter(d => d.id !== this.selectedDonation!.id);
      this.applyFilters();
      this.closeDonationDetails();
    } catch (error) {
      console.error('Erro ao confirmar doação:', error);
      this.toastr.error('Erro ao confirmar doação. Tente novamente.');
    }
  }

  async rejectDonation() {
    if (!this.selectedDonation) return;

    const confirmed = confirm('Tem certeza que deseja excluir essa doação?');
    if (!confirmed) return;

    try {
      await this.donationUpdateService.rejectDonation(this.selectedDonation.id!);
      this.toastr.success('Doação rejeitada.');
      
      // Remover da lista de pendentes
      this.allDonations = this.allDonations.filter(d => d.id !== this.selectedDonation!.id);
      this.applyFilters();
      this.closeDonationDetails();
    } catch (error) {
      console.error('Erro ao rejeitar doação:', error);
      this.toastr.error('Erro ao rejeitar doação. Tente novamente.');
    }
  }

  applyFilters() {
    let filtered = [...this.allDonations];
    console.log('Aplicando filtros. Doações antes do filtro:', filtered.length);

    // Aplicar filtro de pesquisa
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(donation => 
        donation.donorName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.donations = filtered;
    console.log('Doações após filtros:', this.donations.length);
  }

  onSearchChange() {
    this.applyFilters();
  }

  closeDonationDetails() {
    this.showDonationDetails = false;
    this.selectedDonation = null;
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }

  getDonationDate(donation: DonationWithDetails): string {
    const date = (donation as any).donationDate || donation.donation_date;
    return this.formatDate(date);
  }

  private getProductUnit(productId: number): string {
    // Mapear unidades baseado no produto - simplificado
    const unitMap: {[key: number]: string} = {
      1: 'kg', 2: 'kg', 3: 'g', 4: 'un', 5: 'un', 6: 'un', 7: 'ml'
    };
    return unitMap[productId] || 'un';
  }
}