import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { MunicipalityReadService } from '../../../services/municipality/municipality-read.service';
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
    private municipalityReadService: MunicipalityReadService
  ) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user?.municipality_id) {
      this.municipalityReadService.getById(this.user.municipality_id).subscribe({
        next: (municipality) => {
          this.municipality = municipality;
        },
        error: (error) => {
          console.error('Erro ao buscar municipality:', error);
        }
      });
    }
  }
}