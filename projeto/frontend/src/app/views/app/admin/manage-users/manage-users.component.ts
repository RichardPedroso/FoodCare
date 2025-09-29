import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../domain/model/user';
import { UserReadService } from '../../../../services/user/user-read.service';
import { UserUpdateService } from '../../../../services/user/user-update.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente responsável pelo gerenciamento de usuários beneficiários
 * Permite que administradores visualizem, aprovem ou neguem beneficiários
 * Exibe documentos enviados para verificação de elegibilidade
 * Implementa filtros por status e funcionalidade de busca
 */
@Component({
  selector: 'app-manage-users',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, MatSelectModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {
  allBeneficiaries: User[] = []; // Lista completa de beneficiários
  beneficiaries: User[] = []; // Lista filtrada para exibição
  selectedUser: User | null = null; // Usuário selecionado para análise
  showDocuments = false; // Controla exibição do modal de documentos
  searchTerm = ''; // Termo de busca para filtrar usuários
  selectedFilter = 'recentes'; // Filtro selecionado (recentes, pendentes, aprovados, reprovados)

  constructor(
    private userReadService: UserReadService,
    private userUpdateService: UserUpdateService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    // Carrega lista de beneficiários na inicialização
    await this.loadBeneficiaries();
  }

  /**
   * Carrega lista de beneficiários do backend
   * Filtra apenas usuários do tipo beneficiário que possuem documentos
   * Documentos são necessários para verificação de elegibilidade
   */
  async loadBeneficiaries() {
    try {
      const users = await this.userReadService.findAll();
      this.allBeneficiaries = users.filter((user: User) => 
        (user.userType === 'beneficiary' || user.userType === 'beneficiary') && 
        user.documents && 
        user.documents.length > 0
      );
      this.applyFilters();
    } catch (error) {
      console.error('Erro ao carregar beneficiários:', error);
    }
  }

  /**
   * Seleciona um usuário para visualizar documentos
   * @param user - Usuário a ser selecionado
   */
  selectUser(user: User) {
    this.selectedUser = user;
    this.showDocuments = true;
  }

  /**
   * Atualiza o status de elegibilidade do usuário
   * @param able - true para aprovar, false para negar
   */
  async updateUserStatus(able: boolean) {
    if (!this.selectedUser) return;

    try {
      await this.userUpdateService.updateUserStatus(this.selectedUser.id!.toString(), able);
      this.selectedUser.able = able;
      await this.loadBeneficiaries();
      this.closeDocuments();
      
      const action = able ? 'concedida' : 'revogada';
      this.toastr.success(`Permissão ${action} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      this.toastr.error('Erro ao atualizar status do usuário.');
    }
  }

  /**
   * Aplica filtros de status e busca na lista de beneficiários
   * Filtra por status de aprovação e termo de busca por nome
   */
  applyFilters() {
    let filtered = [...this.allBeneficiaries];

    // Aplica filtro por status de aprovação
    switch (this.selectedFilter) {
      case 'pendentes':
        filtered = filtered.filter(user => user.able === undefined);
        break;
      case 'aprovados':
        filtered = filtered.filter(user => user.able === true);
        break;
      case 'reprovados':
        filtered = filtered.filter(user => user.able === false);
        break;
      case 'recentes':
      default:
        // Mantém todos, ordena por ID (mais recentes primeiro)
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
    }

    // Aplica filtro de busca por nome
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.beneficiaries = filtered;
  }

  /**
   * Manipula mudanças no filtro de status
   */
  onFilterChange() {
    this.applyFilters();
  }

  /**
   * Manipula mudanças no campo de busca
   */
  onSearchChange() {
    this.applyFilters();
  }

  /**
   * Revoga permissão de usuário já aprovado
   */
  revokePermission() {
    this.updateUserStatus(false);
  }

  /**
   * Concede permissão para usuário negado
   */
  grantPermission() {
    this.updateUserStatus(true);
  }

  /**
   * Confirma/aprova usuário pendente
   */
  confirmUser() {
    this.updateUserStatus(true);
  }

  /**
   * Nega usuário pendente
   */
  denyUser() {
    this.updateUserStatus(false);
  }

  /**
   * Fecha o modal de documentos
   */
  closeDocuments() {
    this.showDocuments = false;
    this.selectedUser = null;
  }

  /**
   * Abre documento em nova janela para visualização
   * @param document - String base64 do documento
   */
  openDocument(document: string) {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Documento</title></head>
          <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;">
            <img src="${document}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Documento">
          </body>
        </html>
      `);
    }
  }

  /**
   * Obtém texto do status do usuário
   * @param user - Usuário para verificar status
   * @returns Texto do status (Pendente, Aprovado, Negado)
   */
  getStatusText(user: User): string {
    if (user.able === undefined) return 'Pendente';
    return user.able ? 'Aprovado' : 'Negado';
  }

  /**
   * Obtém classe CSS para estilização do status
   * @param user - Usuário para verificar status
   * @returns Classe CSS correspondente ao status
   */
  getStatusClass(user: User): string {
    if (user.able === undefined) return 'status-pending';
    return user.able ? 'status-approved' : 'status-denied';
  }
}