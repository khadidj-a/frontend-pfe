import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PretService } from '../../services/pret.service';
import { Router } from '@angular/router'; // ✅ import Router

@Component({
  selector: 'app-pret-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pret-management.component.html',
  styleUrls: ['./pret-management.component.scss']
})
export class PretManagementComponent implements OnInit {
  newPret: any = {
    ideqpt: 0,
    idunite: 0,
    duree: 0,
    datepret: ''
  };

  prets: any[] = [];
  message = '';
  error = '';

  constructor(
    private pretService: PretService,
    private router: Router // ✅ inject Router
  ) {}

  ngOnInit(): void {
    this.loadPrets();
  }

  createPret() {
    this.pretService.createPret(this.newPret).subscribe({
      next: () => {
        this.message = '✅ Prêt ajouté avec succès';
        this.error = '';
        this.loadPrets();
        this.newPret = { ideqpt: 0, idunite: 0, duree: 0, datepret: '' };
      },
      error: () => {
        this.error = '❌ Erreur lors de l’ajout du prêt';
        this.message = '';
      }
    });
  }

  loadPrets() {
    this.pretService.getAllPrets().subscribe({
      next: (data) => (this.prets = data),
      error: () => (this.error = '❌ Erreur de chargement des prêts')
    });
  }

  // ✅ navigation methods
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
