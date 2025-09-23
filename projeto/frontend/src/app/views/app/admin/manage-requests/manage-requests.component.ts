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

interface BasketRequestWithDetails {
  id: string;
  user_id: number;
  request_date: string;
  basket_type: string;
  status: string;
  userName: string;
  userEmail: string;
  calculated_items?: string;
}

@Component({
  selector: 'app-manage-requests',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, FormsModule],
  templateUrl: './manage-requests.component.html',
  styleUrl: './manage-requests.component.css'
})
export class ManageRequestsComponent implements OnInit {
  allRequests: BasketRequestWithDetails[] = [];
  requests: BasketRequestWithDetails[] = [];
  selectedRequest: BasketRequestWithDetails | null = null;
  showRequestDetails = false;
  searchTerm = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
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

  selectRequest(request: BasketRequestWithDetails) {
    this.selectedRequest = request;
    this.showRequestDetails = true;
  }

  async confirmRequest() {
    if (!this.selectedRequest) return;

    try {
      await firstValueFrom(
        this.http.post(`${environment.api_endpoint}/basket_request/approve/${this.selectedRequest.id}`, {})
      );
      
      this.toastr.success('Solicitação confirmada com sucesso!');
      
      // Remover da lista de pendentes
      this.allRequests = this.allRequests.filter(r => r.id !== this.selectedRequest!.id);
      this.applyFilters();
      this.closeRequestDetails();
    } catch (error) {
      console.error('Erro ao confirmar solicitação:', error);
      this.toastr.error('Erro ao confirmar solicitação. Tente novamente.');
    }
  }

  async rejectRequest() {
    if (!this.selectedRequest) return;

    const confirmed = confirm('Tem certeza que deseja cancelar essa solicitação?');
    if (!confirmed) return;

    try {
      // Para cancelar, deletar a solicitação
      await firstValueFrom(
        this.http.post(`${environment.api_endpoint}/basket_request/reject/${this.selectedRequest.id}`, {})
      );
      
      this.toastr.success('Solicitação cancelada.');
      
      // Remover da lista de pendentes
      this.allRequests = this.allRequests.filter(r => r.id !== this.selectedRequest!.id);
      this.applyFilters();
      this.closeRequestDetails();
    } catch (error) {
      console.error('Erro ao cancelar solicitação:', error);
      this.toastr.error('Erro ao cancelar solicitação. Tente novamente.');
    }
  }

  applyFilters() {
    let filtered = [...this.allRequests];

    if (this.searchTerm.trim()) {
      filtered = filtered.filter(request => 
        request.userName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.requests = filtered;
  }

  onSearchChange() {
    this.applyFilters();
  }

  closeRequestDetails() {
    this.showRequestDetails = false;
    this.selectedRequest = null;
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getBasketTypeName(type: string): string {
    return type === 'basic' ? 'Cesta Básica' : 'Cesta de Higiene';
  }

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