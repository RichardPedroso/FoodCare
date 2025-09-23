import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { MunicipalityReadService } from '../../../services/municipality/municipality-read.service';
import { UserReadService } from '../../../services/user/user-read.service';
import { Municipality } from '../../../domain/model/municipality';


@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  user: any;
  municipality: Municipality | null = null;

  constructor(
    private authenticationService: AuthenticationService,
    private municipalityReadService: MunicipalityReadService,
    private userReadService: UserReadService
  ) {}

  async ngOnInit(): Promise<void> {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser?.id) {
      try {
        // Fetch fresh user data from server
        this.user = await this.userReadService.findById(currentUser.id.toString());
        // Update localStorage with fresh data
        this.authenticationService.addDataToLocalStorage(this.user);
        
        const municipalityId = this.user?.municipalityId || this.user?.municipality_id;
        if (municipalityId) {
          this.municipalityReadService.getById(municipalityId.toString()).subscribe({
            next: (municipality) => {
              this.municipality = municipality;
            },
            error: (error) => {
              console.error('Erro ao buscar municipality:', error);
            }
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Fallback to localStorage data if server request fails
        this.user = currentUser;
      }
    }
  }

  formatPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    return phone;
  }

  formatZipCode(zipCode: string | undefined): string {
    if (!zipCode || zipCode === 'undefined' || zipCode === 'null') {
      return 'Não informado';
    }
    return zipCode;
  }


}