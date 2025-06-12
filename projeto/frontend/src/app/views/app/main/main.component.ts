import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  selectedType: 'donor' | 'beneficiary' = 'donor';
  userName = 'nome do usuário';

  alternate(type: 'donor' | 'beneficiary'): void {
    this.selectedType = type;
  }
}