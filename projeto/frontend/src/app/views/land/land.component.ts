import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './land.component.html',
  styleUrl: './land.component.css'
})
export class LandComponent{
  
  constructor(){}

}
