import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { User } from '../../../../domain/model/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-generate-report',
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './generate-report.component.html',
  styleUrl: './generate-report.component.css'
})

export class GenerateReportComponent implements OnInit {

  user: User | null = null;
  userType: 'donor' | 'beneficiary' = 'donor';
  
  // Estatísticas
  totalDonations = 0;
  weeklyAverage = 0;
  peopleHelped = 0;
  weeklyRequests = 0;
  totalBaskets = 0;
  totalHygieneBaskets = 0;
  totalUnits = 0;

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user) {
      this.userType = this.user.user_type as 'donor' | 'beneficiary';
      await this.loadStatistics();
    }
  }

  async loadStatistics(): Promise<void> {
    if (!this.user?.id) return;

    try {
      if (this.userType === 'donor') {
        await this.loadDonorStatistics();
      } else {
        await this.loadBeneficiaryStatistics();
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  async loadDonorStatistics(): Promise<void> {
    // Total de doações
    const donations = await firstValueFrom(
      this.http.get<any[]>(`${environment.api_endpoint}/donation/user/${this.user!.id}`)
    );
    this.totalDonations = donations.length;

    // Média semanal (últimas 4 semanas)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const recentDonations = donations.filter(d => 
      new Date(d.donation_date || d.donationDate) >= fourWeeksAgo
    );
    this.weeklyAverage = Math.round(recentDonations.length / 4);

    // Pessoas ajudadas (baseado em cestas que ajudou a formar)
    const basketRequests = await firstValueFrom(
      this.http.get<any[]>(`${environment.api_endpoint}/basket_request`)
    );
    
    // Estimar pessoas ajudadas baseado no total de cestas no sistema
    const totalBaskets = basketRequests.length;
    const donorContribution = this.totalDonations / Math.max(donations.length, 1);
    this.peopleHelped = Math.round(totalBaskets * donorContribution * 3); // Média 3 pessoas por cesta
  }

  async loadBeneficiaryStatistics(): Promise<void> {
    // Cestas básicas e de higiene recebidas
    const basketRequests = await firstValueFrom(
      this.http.get<any[]>(`${environment.api_endpoint}/basket_request?user_id=${this.user!.id}`)
    );
    
    this.totalBaskets = basketRequests.filter(r => 
      (r.basket_type || r.basketType) === 'basic'
    ).length;
    
    this.totalHygieneBaskets = basketRequests.filter(r => 
      (r.basket_type || r.basketType) === 'hygiene'
    ).length;

    // Total de unidades de todas as cestas
    this.totalUnits = 0;
    for (const request of basketRequests) {
      if (request.calculated_items) {
        try {
          const items = JSON.parse(request.calculated_items);
          this.totalUnits += items.length;
        } catch (error) {
          console.error('Erro ao parsear calculated_items:', error);
        }
      }
    }

    // Solicitações por semana (últimas 4 semanas)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const recentRequests = basketRequests.filter(r => 
      new Date(r.request_date || r.requestDate) >= fourWeeksAgo
    );
    this.weeklyRequests = Math.round(recentRequests.length / 4);
  }

}
