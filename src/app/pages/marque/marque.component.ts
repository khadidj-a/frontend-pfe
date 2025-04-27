import { Component, OnInit,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarqueService } from '../../services/marque.service';
import { Marque } from '../../models/marque.model';

@Component({
  selector: 'app-marque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marque.component.html',
  styleUrls: ['./marque.component.scss']
})
export class MarqueComponent implements OnInit {
  marques: Marque[] = [];
  searchTerm = '';
  sortBy = 'idmarque';
  ascending = true;
  selectedMarque: Marque | null = null;
  showForm = false;
  nom_fabriquant_input = '';
  profileOpen = false;
  username = 'Utilisateur';
 isDropdownOpen = false;


  constructor(private marqueService: MarqueService) {}

  ngOnInit(): void {
    this.loadMarques();
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
  loadMarques() {
    this.marqueService.getAll(this.searchTerm, this.sortBy, this.ascending)
      .subscribe(data => this.marques = data);
  }

  search() {
    this.loadMarques();
  }

  toggleSort(column: string) {
    if (this.sortBy === column) {
      this.ascending = !this.ascending;
    } else {
      this.sortBy = column;
      this.ascending = true;
    }
    this.loadMarques();
  }

  openForm(marque?: Marque) {
    this.selectedMarque = marque || null;
    this.nom_fabriquant_input = marque?.nom_fabriquant || '';
    this.showForm = true;
  }

  closeForm() {
    this.selectedMarque = null;
    this.nom_fabriquant_input = '';
    this.showForm = false;
  }

  saveMarque() {
    if (!this.selectedMarque ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (this.selectedMarque) {
      this.marqueService.update(this.selectedMarque.idmarque, {
        nom_fabriquant: this.nom_fabriquant_input
      }).subscribe(() => {
        this.loadMarques();
        this.closeForm();
      });
    } else {
      this.marqueService.create({
        nom_fabriquant: this.nom_fabriquant_input
      }).subscribe(() => {
        this.loadMarques();
        this.closeForm();
      });
    }
  }

  deleteMarque(marque: Marque) {
    this.marqueService.canDelete(marque.idmarque).subscribe(can => {
      if (!can) return alert("Impossible de supprimer cette marque, elle est utilisée.");
      if (confirm("Voulez-vous vraiment supprimer cette marque ?")) {
        this.marqueService.delete(marque.idmarque).subscribe(() => this.loadMarques());
      }
    });
  }

 // toggleProfileMenu() {
 //   this.profileOpen = !this.profileOpen;
 // }

  logout() {
    alert("Déconnexion !");
  }
 

}
