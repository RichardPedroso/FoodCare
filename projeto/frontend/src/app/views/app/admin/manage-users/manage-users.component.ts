import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../domain/model/user';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, MatSelectModule, FormsModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {
  allBeneficiaries: User[] = [];
  beneficiaries: User[] = [];
  selectedUser: User | null = null;
  showDocuments = false;
  searchTerm = '';
  selectedFilter = 'recentes';

  async ngOnInit() {
    await this.loadBeneficiaries();
  }

  async loadBeneficiaries() {
    try {
      const response = await fetch('http://localhost:3000/user');
      const users = await response.json();
      this.allBeneficiaries = users.filter((user: User) => 
        user.user_type === 'beneficiary' && 
        user.documents && 
        user.documents.length > 0
      );
      this.applyFilters();
    } catch (error) {
      console.error('Erro ao carregar beneficiários:', error);
    }
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.showDocuments = true;
  }

  async updateUserStatus(able: boolean) {
    if (!this.selectedUser) return;

    try {
      const updatedUser = { ...this.selectedUser, able };
      const response = await fetch(`http://localhost:3000/user/${this.selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      if (response.ok) {
        this.selectedUser.able = able;
        await this.loadBeneficiaries();
        this.closeDocuments();
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  }

  applyFilters() {
    let filtered = [...this.allBeneficiaries];

    // Aplicar filtro por status
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
        // Manter todos, ordenar por ID (mais recentes primeiro)
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
    }

    // Aplicar filtro de pesquisa
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.beneficiaries = filtered;
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  revokePermission() {
    this.updateUserStatus(false);
  }

  grantPermission() {
    this.updateUserStatus(true);
  }

  confirmUser() {
    this.updateUserStatus(true);
  }

  denyUser() {
    this.updateUserStatus(false);
  }

  closeDocuments() {
    this.showDocuments = false;
    this.selectedUser = null;
  }

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

  getStatusText(user: User): string {
    if (user.able === undefined) return 'Pendente';
    return user.able ? 'Aprovado' : 'Negado';
  }

  getStatusClass(user: User): string {
    if (user.able === undefined) return 'status-pending';
    return user.able ? 'status-approved' : 'status-denied';
  }
}