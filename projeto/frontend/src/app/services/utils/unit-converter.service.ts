import { Injectable } from '@angular/core';

/**
 * Serviço utilitário para conversão de unidades de medida.
 * Converte entre diferentes unidades (kg/g, l/ml) e valida entradas.
 */
@Injectable({
  providedIn: 'root'
})
export class UnitConverterService {

  /**
   * Converte quantidade entre diferentes unidades de medida.
   * Suporta conversões entre kg/g e l/ml.
   */
  convertToProductUnit(quantity: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return quantity;
    
    // Conversões de peso
    if (fromUnit === 'kg' && toUnit === 'g') return quantity * 1000;
    if (fromUnit === 'g' && toUnit === 'kg') return quantity / 1000;
    
    // Conversões de volume
    if (fromUnit === 'l' && toUnit === 'ml') return quantity * 1000;
    if (fromUnit === 'ml' && toUnit === 'l') return quantity / 1000;
    
    return quantity; // Retorna original se conversão não suportada
  }

  /** Formata quantidade com unidade para exibição */
  formatQuantityWithUnit(quantity: number, unitType: string): string {
    return `${quantity} ${unitType}`;
  }

  /** Valida se a quantidade inserida é válida */
  validateQuantityInput(quantity: number, unitType: string): boolean {
    if (quantity < 1) return false; // Quantidade deve ser positiva
    
    return true;
  }
}