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
import { DonationStatus } from '../../../../domain/enums/donation-status.enum';

// Interface que estende Donation com informações detalhadas para exibição
interface DonationWithDetails extends Donation {
  donorName: string; // Nome do doador
  donorEmail: string; // Email do doador
  productName?: string; // Nome do produto doado
  quantity?: number | string; // Quantidade do produto
  unit?: string; // Unidade de medida
  expiration_date?: Date; // Data de validade
}

/**
 * Componente responsável pelo gerenciamento de doações pendentes
 * Permite que administradores visualizem, aprovem ou rejeitem doações
 * Carrega informações detalhadas de doadores e produtos
 * Implementa funcionalidade de busca e filtragem
 */
@Component({
  selector: 'app-manage-donations',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, FormsModule],
  templateUrl: './manage-donations.component.html',
  styleUrl: './manage-donations.component.css'
})
export class ManageDonationsComponent implements OnInit {
  allDonations: DonationWithDetails[] = []; // Lista completa de doações
  donations: DonationWithDetails[] = []; // Lista filtrada para exibição
  selectedDonation: DonationWithDetails | null = null; // Doação selecionada para detalhes
  showDonationDetails = false; // Controla exibição do modal de detalhes
  searchTerm = ''; // Termo de busca para filtrar doações

  constructor(
    private donationReadService: DonationReadService,
    private donationUpdateService: DonationUpdateService,
    private donationProductReadService: DonationProductReadService,
    private userReadService: UserReadService,
    private productReadService: ProductReadService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    // Carrega doações pendentes na inicialização do componente
    await this.loadPendingDonations();
  }

  async loadPendingDonations() {
    try {
      // Usar endpoint existente e filtrar doações pendentes
      const allDonations = await this.donationReadService.findAll();
      console.log('Todas as doações:', allDonations);
      console.log('Estrutura da primeira doação:', allDonations[0]);
      
      // Filtrar doações pendentes (donationStatus = "Pendente")
      const pendingDonations = allDonations.filter(d => {
        const donationStatus = (d as any).donationStatus;
        console.log(`Doação ${d.id}: donationStatus = ${donationStatus}`);
        return donationStatus === DonationStatus.PENDENTE;
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
          
          const productUnit = firstProduct ? await this.getProductUnitType(firstProduct.productId || (firstProduct as any).product_id) : 'un';
          
          return {
            ...donation,
            donorName: user.name || `Usuário ${userId}`,
            donorEmail: user.email || `usuario${userId}@email.com`,
            productName: productName,
            quantity: firstProduct ? this.formatQuantityDisplay(firstProduct, productUnit) : '0',
            unit: productUnit,
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
          donation_status: DonationStatus.PENDENTE,
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

  /**
   * Seleciona uma doação para exibir detalhes
   * @param donation - Doação a ser selecionada
   */
  selectDonation(donation: DonationWithDetails) {
    this.selectedDonation = donation;
    this.showDonationDetails = true;
  }

  /**
   * Confirma uma doação pendente
   * Atualiza status no backend e remove da lista de pendentes
   * Adiciona produtos ao estoque automaticamente
   */
  async confirmDonation() {
    if (!this.selectedDonation) return;

    try {
      await this.donationUpdateService.confirmDonation(this.selectedDonation.id!);
      this.toastr.success('Doação confirmada com sucesso!');
      
      // Remove da lista de pendentes
      this.allDonations = this.allDonations.filter(d => d.id !== this.selectedDonation!.id);
      this.applyFilters();
      this.closeDonationDetails();
    } catch (error) {
      console.error('Erro ao confirmar doação:', error);
      this.toastr.error('Erro ao confirmar doação. Tente novamente.');
    }
  }

  /**
   * Rejeita uma doação pendente
   * Solicita confirmação do usuário antes de proceder
   * Remove a doação do sistema permanentemente
   */
  async rejectDonation() {
    if (!this.selectedDonation) return;

    const confirmed = confirm('Tem certeza que deseja excluir essa doação?');
    if (!confirmed) return;

    try {
      await this.donationUpdateService.rejectDonation(this.selectedDonation.id!);
      this.toastr.success('Doação rejeitada.');
      
      // Remove da lista de pendentes
      this.allDonations = this.allDonations.filter(d => d.id !== this.selectedDonation!.id);
      this.applyFilters();
      this.closeDonationDetails();
    } catch (error) {
      console.error('Erro ao rejeitar doação:', error);
      this.toastr.error('Erro ao rejeitar doação. Tente novamente.');
    }
  }

  /**
   * Aplica filtros de busca na lista de doações
   * Filtra por nome do doador baseado no termo de busca
   */
  applyFilters() {
    let filtered = [...this.allDonations];
    console.log('Aplicando filtros. Doações antes do filtro:', filtered.length);

    // Aplica filtro de pesquisa por nome do doador
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(donation => 
        donation.donorName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.donations = filtered;
    console.log('Doações após filtros:', this.donations.length);
  }

  /**
   * Manipula mudanças no campo de busca
   * Reaplica filtros automaticamente
   */
  onSearchChange() {
    this.applyFilters();
  }

  /**
   * Fecha o modal de detalhes da doação
   * Limpa a seleção atual
   */
  closeDonationDetails() {
    this.showDonationDetails = false;
    this.selectedDonation = null;
  }

  /**
   * Formata data para exibição no padrão brasileiro
   * @param date - Data a ser formatada
   * @returns String formatada no padrão dd/mm/aaaa
   */
  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }

  /**
   * Obtém e formata a data da doação
   * Trata diferentes formatos de propriedade de data
   * @param donation - Doação da qual extrair a data
   * @returns Data formatada da doação
   */
  getDonationDate(donation: DonationWithDetails): string {
    const date = (donation as any).donationDate || donation.donation_date;
    return this.formatDate(date);
  }

  /**
   * Obtém o tipo de unidade de medida de um produto
   * @param productId - ID do produto
   * @returns Tipo de unidade (kg, un, etc.) ou 'un' como padrão
   */
  private async getProductUnitType(productId: number): Promise<string> {
    try {
      const product = await this.productReadService.findById(productId.toString());
      return product.measure_type || 'un';
    } catch (error) {
      return 'un';
    }
  }

  /**
   * Formata a exibição de quantidade do produto doado
   * Adapta formato baseado no tipo de unidade de medida
   * @param donationProduct - Produto da doação
   * @param unitType - Tipo de unidade de medida
   * @returns String formatada da quantidade
   */
  private formatQuantityDisplay(donationProduct: any, unitType: string): string {
    const units = parseInt(donationProduct.unit || '1');
    const quantity = donationProduct.quantity || 1;
    
    if (unitType === 'un') {
      return `${units} unidades`;
    } else {
      return `${units} unidades de ${quantity}${unitType}`;
    }
  }
}