import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DonationValidationService {

  validateExpirationDate(expirationDate: Date | null): { valid: boolean, message?: string } {
    if (!expirationDate) return { valid: true };

    const currentDate = new Date();
    const minValidDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));

    if (expirationDate <= currentDate) {
      return { valid: false, message: 'Data de validade não pode ser retroativa' };
    }

    if (expirationDate < minValidDate) {
      return { valid: false, message: 'Data de validade deve ser superior a 30 dias da data atual' };
    }

    return { valid: true };
  }
}