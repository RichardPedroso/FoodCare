import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitConverterService {

  convertToProductUnit(quantity: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return quantity;
    
    if (fromUnit === 'kg' && toUnit === 'g') return quantity * 1000;
    if (fromUnit === 'g' && toUnit === 'kg') return quantity / 1000;
    if (fromUnit === 'l' && toUnit === 'ml') return quantity * 1000;
    if (fromUnit === 'ml' && toUnit === 'l') return quantity / 1000;
    
    return quantity;
  }

  formatQuantityWithUnit(quantity: number, unitType: string): string {
    return `${quantity} ${unitType}`;
  }

  validateQuantityInput(quantity: number, unitType: string): boolean {
    if (quantity < 1) return false;
    
    return true;
  }
}