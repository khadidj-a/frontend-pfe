import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PretService } from '../../services/pret.service';
import { Pret, CreatePretDTO } from '../../models/pret.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { log } from 'console';

@Component({
  selector: 'app-pret',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pret-management.component.html',
  styleUrls: ['./pret-management.component.scss']
})
export class PretManagementComponent implements OnInit {
  prets: Pret[] = [];
  pretCount = 0;

  newPret: CreatePretDTO = {
    ideqpt: 0,
    idunite: 0,
    duree: 0,
    datepret: '',
    motif: ''
  };

  selectedPret: Pret | null = null;
  equipements: { idEqpt: number; design: string }[] = [];
  allEquipements: { idEqpt: number; design: string; codeEqp?: string }[] = [];
  unites: { idunite: number; designation: string }[] = [];
  uniteActuelle: { idunite: number; designation: string } | null = null;

  showForm = false;
  searchTerm = '';
  sortBy = 'equipement';
  order: 'asc' | 'desc' = 'asc';

  profileOpen = false;
  isDropdownOpen = false;
  username = 'Admin';
  showLogoutConfirm = false;

  user: any = {};
  role: string | null = null;
  idunite:any={};
  constructor(
    private pretService: PretService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  
    this.user = this.authService.getUser(); // assure-toi que c’est la bonne méthode
    this.role = this.authService.getUserRole();
    this.idunite = this.authService.getUserUniteId();
  
    console.log('Rôle utilisateur :', this.role);
    console.log('ID unité utilisateur :', this.idunite);
  
    
    this.loadPrets(); // appelé après récupération correcte des infos
  this.loadPretCount();
    this.loadEquipements();
    this.loadAllEquipements();
    this.loadUnites();
  }
  
  loadPrets(): void {
    if (this.isResponsableUnite) {
    

      this.pretService.getByUnite(this.idunite, this.searchTerm, this.sortBy, this.order).subscribe({
        next: (data) => this.prets = data,
        error: (err) => console.error('Erreur chargement prêts unité', err)
      });
    } else {
      this.pretService.getAll(this.searchTerm, this.sortBy, this.order).subscribe({
        next: (data) => this.prets = data,
        error: (err) => console.error('Erreur chargement prêts', err)
      });
    }
  }

  loadEquipements(): void {
    this.pretService.getEquipementsNonReformes().subscribe({
      next: (data) => this.equipements = data,
      error: (err) => console.error('Erreur chargement équipements non réformés', err)
    });
  }

  loadAllEquipements(): void {
    this.pretService.getAllEquipements().subscribe({
      next: (data) => this.allEquipements = data,
      error: (err) => console.error('Erreur chargement tous équipements', err)
    });
  }

  loadUnites(): void {
    this.pretService.getAllUnites().subscribe({
      next: (data) => this.unites = data,
      error: (err) => console.error('Erreur chargement unités', err)
    });
  }

  loadPretCount(): void {
    if (this.isResponsableUnite) {
      this.pretService.getpretCountByUnite(this.idunite).subscribe(count => {
        this.pretCount = count;
        console.log('🔢 Nombre de réformes pour l’unité :', count);
      });
    } else {
    this.pretService.getPretCount().subscribe({
      next: (count) => this.pretCount = count,
      error: (err) => console.error('Erreur chargement compteur', err)
    });}
  }

  toggleSort(col: string): void {
    this.sortBy = col;
    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.search();
  }

  addPret(): void {
    if (this.newPret.ideqpt && this.newPret.idunite && this.newPret.duree && this.newPret.datepret) {
      this.pretService.getEtatEquipement(this.newPret.ideqpt).subscribe({
        next: (etat) => {
          if (etat.toLowerCase() === 'rforme') {
            alert("Cet équipement est déjà en état 'réformé'.");
            return;
          }
          this.pretService.createPret(this.newPret).subscribe({
            next: () => {
              this.loadPrets();
              this.resetForm();
            },
            error: (err) => alert(err.error || 'Erreur inconnue')
          });
        },
        error: () => alert("Erreur lors de la vérification de l'état")
      });
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }

  resetForm(): void {
    this.newPret = { ideqpt: 0, idunite: 0, duree: 0, datepret: '', motif: '' };
    this.showForm = false;
    this.selectedPret = null;
  }

  openForm(pret?: Pret): void {
    this.selectedPret = pret || null;
    this.newPret = {
      ideqpt: pret?.ideqpt || 0,
      idunite: pret?.idunite || 0,
      duree: pret?.duree || 0,
      datepret: pret ? pret.datepret.substring(0, 10) : new Date().toISOString().substring(0, 10),
      motif: pret?.motif || ''
    };
    this.showForm = true;
  }

  closeForm(): void {
    this.resetForm();
  }

  search(): void {
    if (this.role === 'Responsable Unité') {
      this.pretService.getByUnite(this.idunite, this.searchTerm, this.sortBy, this.order).subscribe({
        next: (data) => {
          this.prets = data;
          this.pretCount = data.length;
        },
        error: (err) => console.error('Erreur recherche unité', err)
      });
    } else {
      this.pretService.getAll(this.searchTerm, this.sortBy, this.order).subscribe({
        next: (data) => {
          this.prets = data;
          this.pretCount = data.length;
        },
        error: (err) => console.error('Erreur recherche globale', err)
      });
    }
  }

  toggleSortOrder(): void {
    this.order = this.order === 'asc' ? 'desc' : 'asc';
    this.search();
  }

  getEquipementName(id: number): string {
    const eq = this.equipements.find(e => e.idEqpt === id);
    return eq ? eq.design : 'Inconnu';
  }

  getUniteName(id: number): string {
    const unite = this.unites.find(u => u.idunite === id);
    return unite ? unite.designation : 'Inconnu';
  }

  getDesignation(id: number): string {
    const eqpt = this.allEquipements.find(e => e.idEqpt === id);
    return eqpt ? eqpt.design : 'Équipement introuvable';
  }

  getCodeEqp(ideqpt: number): string {
    const eqpt = this.allEquipements.find(e => e.idEqpt === ideqpt);
    return eqpt ? (eqpt.codeEqp ?? '---') : '---';
  }

  getUniteEmissionName(iduniteemt: number): string {
    const unite = this.unites.find(u => u.idunite === iduniteemt);
    return unite ? unite.designation : 'Unité d’émission introuvable';
  }

  logout(): void {
    this.showLogoutConfirm = true;
  }

  confirmLogout(): void {
    this.showLogoutConfirm = false;
    this.authService.logout(); // optionnel : nettoie localStorage
    this.router.navigate(['/login']);
  }

  cancelLogout(): void {
    this.showLogoutConfirm = false;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToUserManagement(): void {
    this.router.navigate(['/user-management']);
  }

  get isAdminIT(): boolean {
    return this.role === 'Admin IT';
  }

  get isAdminMetier(): boolean {
    return this.role === 'Admin Métier';
  }
  get isResponsableUnite(): boolean { 
    return this.role === 'Responsable Unité';
   
  }
  onEquipementChange(): void {
    const ideqpt = Number(this.newPret.ideqpt);
    console.log('🔄 Changement d\'équipement sélectionné :', ideqpt, typeof ideqpt);
    console.log('Liste des idEqpt dans équipements:', this.equipements.map(e => e.idEqpt));
  
    let equipementSelectionne = this.equipements.find(eq => eq.idEqpt === ideqpt);
  
    if (!equipementSelectionne) {
      console.warn('⚠️ Non trouvé dans équipements non réformés, je cherche dans tous les équipements...');
      equipementSelectionne = this.allEquipements.find(eq => eq.idEqpt === ideqpt);
    }
  
    if (!equipementSelectionne) {
      console.warn('⚠️ Équipement sélectionné non trouvé dans aucune liste.');
      this.uniteActuelle = null;
      return;
    }
  
    console.log('🔍 Équipement trouvé :', equipementSelectionne);
  
    let idunite = (equipementSelectionne as any).idunite;
  
    if (!idunite) {
      const equipAll = this.allEquipements.find(e => e.idEqpt === ideqpt);
      idunite = equipAll ? (equipAll as any).idunite : null;
    }
  
    if (idunite != null) {
      const unite = this.unites.find(u => u.idunite === idunite);
      if (unite) {
        console.log('🔗 Unité actuelle trouvée :', unite);
        this.uniteActuelle = { idunite: unite.idunite, designation: unite.designation };
      } else {
        console.warn('⚠️ Unité non trouvée dans la liste locale.');
        this.uniteActuelle = null;
      }
    } else {
      console.log('ℹ️ Aucune unité associée à cet équipement.');
      this.uniteActuelle = null;
    }
  }
  
  
}
