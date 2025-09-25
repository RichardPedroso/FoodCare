import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

// Interface para solicitações de cesta com informações detalhadas
interface BasketRequestWithDetails {
  id: string; // ID da solicitação
  user_id: number; // ID do usuário solicitante
  request_date: string; // Data da solicitação
  basket_type: string; // Tipo de cesta (basic/hygiene)
  status: string; // Status da solicitação
  userName: string; // Nome do solicitante
  userEmail: string; // Email do solicitante
  calculated_items?: string; // Itens calculados da cesta (JSON)
}

/**
 * Componente responsável pelo gerenciamento de solicitações de cestas
 * Permite que administradores visualizem, aprovem ou rejeitem solicitações
 * Exibe detalhes dos itens calculados para cada cesta
 * Implementa funcionalidade de busca e filtragem
 */
@Component({
  selector: 'app-manage-requests',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, FormsModule],
  templateUrl: './manage-requests.component.html',
  styleUrl: './manage-requests.component.css'
})
export class ManageRequestsComponent implements OnInit {
  allRequests: BasketRequestWithDetails[] = []; // Lista completa de solicitações
  requests: BasketRequestWithDetails[] = []; // Lista filtrada para exibição
  selectedRequest: BasketRequestWithDetails | null = null; // Solicitação selecionada
  showRequestDetails = false; // Controla exibição do modal de detalhes
  searchTerm = ''; // Termo de busca para filtrar solicitações

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    // Carrega solicitações pendentes na inicialização
    await this.loadPendingRequests();
  }

  async loadPendingRequests() {
    try {
      const allRequests = await firstValueFrom(
        this.http.get<any[]>(`${environment.api_endpoint}/basket_request/all`)
      );
      
      // Filtrar solicitações pendentes (status = 'pending')
      const pendingRequests = allRequests.filter(r => r.status === 'pending');
      
      // Buscar dados dos usuários
      this.allRequests = await Promise.all(pendingRequests.map(async request => {
        try {
          const user = await firstValueFrom(
            this.http.get<any>(`${environment.api_endpoint}/user/${request.user_id}`)
          );
          
          return {
            ...request,
            userName: user.name || `Usuário ${request.user_id}`,
            userEmail: user.email || `usuario${request.user_id}@email.com`
          };
        } catch (error) {
          return {
            ...request,
            userName: `Usuário ${request.user_id}`,
            userEmail: `usuario${request.user_id}@email.com`
          };
        }
      }));
      
      this.applyFilters();
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      this.toastr.error('Erro ao carregar solicitações');
    }
  }

  /**
   * Seleciona uma solicitação para exibir detalhes
   * @param request - Solicitação a ser selecionada
   */
  selectRequest(request: BasketRequestWithDetails) {
    this.selectedRequest = request;
    this.showRequestDetails = true;
  }

  /**
   * Confirma uma solicitação de cesta
   * Aprova a solicitação e consome produtos do estoque
   * Remove da lista de pendentes após confirmação
   */
  async confirmRequest() {
    if (!this.selectedRequest) return;

    try {
      await firstValueFrom(
        this.http.post(`${environment.api_endpoint}/basket_request/approve/${this.selectedRequest.id}`, {})
      );
      
      this.toastr.success('Solicitação confirmada com sucesso!');
      
      // Remove da lista de pendentes
      this.allRequests = this.allRequests.filter(r => r.id !== this.selectedRequest!.id);
      this.applyFilters();
      this.closeRequestDetails();
    } catch (error) {
      console.error('Erro ao confirmar solicitação:', error);
      this.toastr.error('Erro ao confirmar solicitação. Tente novamente.');
    }
  }

  /**
   * Rejeita uma solicitação de cesta
   * Solicita confirmação antes de cancelar
   * Remove a solicitação do sistema
   */
  async rejectRequest() {
    if (!this.selectedRequest) return;

    const confirmed = confirm('Tem certeza que deseja cancelar essa solicitação?');
    if (!confirmed) return;

    try {
      // Cancela a solicitação no backend
      await firstValueFrom(
        this.http.post(`${environment.api_endpoint}/basket_request/reject/${this.selectedRequest.id}`, {})
      );
      
      this.toastr.success('Solicitação cancelada.');
      
      // Remove da lista de pendentes
      this.allRequests = this.allRequests.filter(r => r.id !== this.selectedRequest!.id);
      this.applyFilters();
      this.closeRequestDetails();
    } catch (error) {
      console.error('Erro ao cancelar solicitação:', error);
      this.toastr.error('Erro ao cancelar solicitação. Tente novamente.');
    }
  }

  /**
   * Aplica filtros de busca na lista de solicitações
   * Filtra por nome do solicitante
   */
  applyFilters() {
    let filtered = [...this.allRequests];

    if (this.searchTerm.trim()) {
      filtered = filtered.filter(request => 
        request.userName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.requests = filtered;
  }

  /**
   * Manipula mudanças no campo de busca
   */
  onSearchChange() {
    this.applyFilters();
  }

  /**
   * Fecha o modal de detalhes da solicitação
   */
  closeRequestDetails() {
    this.showRequestDetails = false;
    this.selectedRequest = null;
  }

  /**
   * Formata data para padrão brasileiro
   * @param date - Data em formato string
   * @returns Data formatada dd/mm/aaaa
   */
  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  /**
   * Converte tipo de cesta para nome amigável
   * @param type - Tipo da cesta (basic/hygiene)
   * @returns Nome formatado da cesta
   */
  getBasketTypeName(type: string): string {
    return type === 'basic' ? 'Cesta Básica' : 'Cesta de Higiene';
  }

  /**
   * Obtém e parseia os itens calculados da cesta
   * Converte JSON string em array de objetos
   * @returns Array de itens da cesta ou array vazio se houver erro
   */
  getCalculatedItems(): any[] {
    if (!this.selectedRequest?.calculated_items) {
      console.log('No calculated_items found for request:', this.selectedRequest);
      return [];
    }
    try {
      const items = JSON.parse(this.selectedRequest.calculated_items);
      console.log('Parsed calculated items:', items);
      return items;
    } catch (error) {
      console.error('Error parsing calculated_items:', error, this.selectedRequest.calculated_items);
      return [];
    }
  }
}