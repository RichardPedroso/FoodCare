import { Injectable } from '@angular/core';

/**
 * Serviço para validação de doações.
 * Implementa regras de negócio para aceitação de produtos doados.
 */
@Injectable({
  providedIn: 'root'
})
export class DonationValidationService {

  /**
   * Valida data de vencimento de produtos doados.
   * Produtos devem ter pelo menos 15 dias de validade para serem aceitos.
   */
  validateExpirationDate(expirationDate: Date | null): { valid: boolean, message?: string } {
    if (!expirationDate) return { valid: true }; // Produtos sem validade são aceitos

    const currentDate = new Date();
    const minValidDate = new Date(currentDate.getTime() + (15 * 24 * 60 * 60 * 1000)); // 15 dias

    // Não aceitar produtos vencidos
    if (expirationDate <= currentDate) {
      return { valid: false, message: 'Data de validade não pode ser retroativa' };
    }

    // Não aceitar produtos com menos de 15 dias de validade
    if (expirationDate < minValidDate) {
      return { valid: false, message: 'Data de validade deve ser superior a 15 dias da data atual' };
    }

    return { valid: true };
  }
}