import { Component, OnInit,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniteService } from '../../services/unite.service';
import { Unite, Region, Wilaya } from '../../models/unite.model';

@Component({
  selector: 'app-unite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unite.component.html',
  styleUrls: ['./unite.component.scss']
})
export class UniteComponent implements OnInit {
  unites: Unite[] = [];
  wilayas: Wilaya[] = [];
  regions: Region[] = [];

  selectedUnite: Unite | null = null;
  searchTerm = '';
  sortBy = 'idunite';
  ascending = true;
  showForm = false;
  profileOpen = false;
  isDropdownOpen = false;
  username = 'Admin';

  // Champs du formulaire
  designation_input = '';
  selectedWilaya: number | null = null;
  selectedRegion: number | null = null;

  constructor(private uniteService: UniteService) {}

  ngOnInit(): void {
    this.loadUnites();
    this.loadWilayas();
    this.loadRegions();
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event']) // Ajoutez ce décorateur
  closeDropdownOnClickOutside(event: MouseEvent): void {
    const dropdown = document.querySelector('.dropdown') as HTMLElement;
    const dropdownContent = document.querySelector('.dropdown-content') as HTMLElement;

    if (dropdown && !dropdown.contains(event.target as HTMLElement)) {
      this.isDropdownOpen = false;
    }
  }
  loadUnites() {
    this.uniteService.getUnites(this.searchTerm, this.sortBy, this.ascending)
      .subscribe(data => {
        console.log(data);  // Ajouter un log pour vérifier les données
        this.unites = data;
      });
}
  

  loadWilayas() {
    this.uniteService.getWilayas().subscribe(data => this.wilayas = data);
  }

  loadRegions() {
    this.uniteService.getRegions().subscribe(data => this.regions = data);
  }

  search() {
    this.loadUnites();
  }

  toggleSort(column: string) {
    if (this.sortBy === column) {
      this.ascending = !this.ascending;
    } else {
      this.sortBy = column;
      this.ascending = true;
    }
    this.loadUnites();
  }

  openForm(unite?: Unite) {
    this.selectedUnite = unite || null;
    this.designation_input = unite?.designation || '';
    this.selectedWilaya = unite?.idwilaya || null;
    this.selectedRegion = unite?.idregion || null;
    this.showForm = true;
  }

  closeForm() {
    this.selectedUnite = null;
    this.designation_input = '';
    this.selectedWilaya = null;
    this.selectedRegion = null;
    this.showForm = false;
  }

  saveUnite() {
    if (!this.designation_input || !this.selectedWilaya || !this.selectedRegion ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const dto = {
      designation: this.designation_input,
      idwilaya: this.selectedWilaya,
      idregion: this.selectedRegion
    };

    if (this.selectedUnite) {
      this.uniteService.updateUnite(this.selectedUnite.idunite, dto)
        .subscribe(() => {
          this.loadUnites();
          this.closeForm();
        });
    } else {
      this.uniteService.createUnite(dto)
        .subscribe(() => {
          this.loadUnites();
          this.closeForm();
        });
    }
  }

  deleteUnite(unite: Unite) {
    if (confirm("Voulez-vous vraiment supprimer cette unité ?")) {
      this.uniteService.deleteUnite(unite.idunite)
        .subscribe({
          next: () => this.loadUnites(),
          error: err => alert(err.error || "Erreur lors de la suppression.")
        });
    }
  }
  logout() {
    alert("Déconnexion !");
  }
}
