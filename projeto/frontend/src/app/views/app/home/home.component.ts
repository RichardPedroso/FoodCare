import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  
  selectedType: 'donor' | 'beneficiary' = 'donor';
  userName = 'nome do usuário';

  alternate(type: 'donor' | 'beneficiary'): void {
    this.selectedType = type;
  }

}