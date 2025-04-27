import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganeService } from '../../services/organe.service';
import { Organe, Marque, Caracteristique } from '../../models/organe.model';

@Component({
  selector: 'app-organe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organe.component.html',
  styleUrls: ['./organe.component.scss']
})
export class OrganeComponent implements OnInit {
  organes: Organe[] = [];
  selectedOrgane: Organe | null = null;
  marques: any[] = []; // à charger depuis ton service
caracteristiques: any[] = []; // à charger depuis ton service

selectedMarqueId: number | null = null;
selectedCaracteristiques: number[] = []; // tableau d'IDs sélectionnés

  searchTerm = '';
  sortBy = 'idorgane';
  ascending = true;
  showForm = false;
  profileOpen = false;
  isDropdownOpen = false;
  username = 'Admin';

  code_input = '';
  libelle_input = '';
  selectedMarque: number | null = null;

  constructor(private organeService: OrganeService) {}

  ngOnInit(): void {
    this.loadOrganes();
    this.loadMarques();
    this.loadCaracteristiques();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnClickOutside(event: MouseEvent): void {
    const dropdown = document.querySelector('.dropdown') as HTMLElement;
    if (dropdown && !dropdown.contains(event.target as HTMLElement)) {
      this.isDropdownOpen = false;
    }
  }

  loadOrganes() {
    this.organeService.getOrganes(this.searchTerm, this.sortBy, this.ascending)
      .subscribe({
        next: data => this.organes = data,
        error: err => console.error("Erreur chargement organes :", err)
      });
  }

  loadMarques() {
    this.organeService.getMarques().subscribe(data => this.marques = data);
  }

  loadCaracteristiques() {
    this.organeService.getCaracteristiques().subscribe(data => this.caracteristiques = data);
  }

  search() {
    this.loadOrganes();
  }

  toggleSort(column: string) {
    if (this.sortBy === column) {
      this.ascending = !this.ascending;
    } else {
      this.sortBy = column;
      this.ascending = true;
    }
    this.loadOrganes();
  }
  openForm(organe?: Organe) {
    this.selectedOrgane = organe || null;
    this.code_input = organe?.code_organe || '';
    this.libelle_input = organe?.libelle_organe || '';
    this.selectedMarque = organe?.id_marque || null;
    this.selectedCaracteristiques = organe?.caracteristiques.map(c => c.idcaracteristique) || [];
  
    // Mettre à jour l'état des checkboxes
    this.caracteristiques.forEach(carac => {
      carac.checked = this.selectedCaracteristiques.includes(carac.id);
    });
  
    this.showForm = true;
  }
  

  closeForm() {
    this.selectedOrgane = null;
    this.code_input = '';
    this.libelle_input = '';
    this.selectedMarque = null;
    this.selectedCaracteristiques = [];
    this.showForm = false;
  }
  onCheckboxChange(carac: any) {
    if (carac.checked) {
      this.selectedCaracteristiques.push(carac.id);
    } else {
      this.selectedCaracteristiques = this.selectedCaracteristiques.filter(id => id !== carac.id);
    }
  }
  
  saveOrgane() {
    if (!this.code_input || !this.libelle_input || !this.selectedMarque) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const dto = {
      code_organe: this.code_input,
      libelle_organe: this.libelle_input,
      id_marque: this.selectedMarque,
      id_caracteristiques: this.selectedCaracteristiques
    };

    if (this.selectedOrgane) {
      this.organeService.updateOrgane(this.selectedOrgane.id_organe, dto)
        .subscribe(() => {
          this.loadOrganes();
          this.closeForm();
        });
    } else {
      this.organeService.createOrgane(dto)
        .subscribe(() => {
          this.loadOrganes();
          this.closeForm();
        });
    }
  }

  deleteOrgane(organe: Organe) {
    this.organeService.canDelete(organe.id_organe).subscribe(canDelete => {
      if (!canDelete) {
        alert("Impossible de supprimer : cet organe est lié à un équipement.");
        return;
      }

      if (confirm("Voulez-vous vraiment supprimer cet organe ?")) {
        this.organeService.deleteOrgane(organe.id_organe)
          .subscribe({
            next: () => this.loadOrganes(),
            error: err => alert(err.error || "Erreur lors de la suppression.")
          });
      }
    });
  }

  logout() {
    alert("Déconnexion !");
  }
}
