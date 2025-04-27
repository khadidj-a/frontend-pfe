import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../models/categorie.model';

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent implements OnInit {
  categories: Categorie[] = [];
  selectedCategorie: Categorie | null = null;
  categorie_input: any = {
    categorie_principale: '',
    designation: ''
  };
  searchTerm = '';
  sortBy = 'idcategorie';
  ascending = true;
  showForm = false;
  profileOpen = false;
  username = 'Utilisateur';
  isDropdownOpen = false;

  // Options de Catégorie Principale (à remplir dynamiquement ou en dur)
  categoriePrincipaleOptions: string[] = ['Roulants', 'Fixes', 'Soutien'];

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.loadCategories();
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

  loadCategories() {
    this.categorieService.getAll(this.searchTerm, this.sortBy, this.ascending)
      .subscribe((data: Categorie[]) => {
        this.categories = data;
        console.log("Catégories chargées :", data);
      });
  }

  search() {
    this.loadCategories();
  }

  openForm(categorie?: Categorie): void {
    this.selectedCategorie = categorie || null;
    this.categorie_input = {
      categorie_principale: categorie ? categorie.categorie_principale : '',
      designation: categorie ? categorie.designation : ''
    };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedCategorie = null;
    this.categorie_input = {
      categorie_principale: '',
      designation: ''
    };
  }

  saveCategorie(): void {
    if (!this.selectedCategorie ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const data: Categorie = {
      idcategorie: this.selectedCategorie?.idcategorie || 0,
      categorie_principale: this.categorie_input.categorie_principale,
      codecategorie: '', // Géré automatiquement côté backend ?
      designation: this.categorie_input.designation
    };

    if (this.selectedCategorie) {
      this.categorieService.update(this.selectedCategorie.idcategorie, data).subscribe(() => {
        this.loadCategories();
        this.closeForm();
      });
    } else {
      this.categorieService.create(data).subscribe(() => {
        this.loadCategories();
        this.closeForm();
      });
    }
  }

  deleteCategorie(categorie: Categorie): void {
    this.categorieService.canDelete(categorie.idcategorie).subscribe(canDelete => {
      if (!canDelete) {
        alert("Cette catégorie est utilisée dans un équipement. Suppression impossible.");
        return;
      }
  
      if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
        this.categorieService.delete(categorie.idcategorie).subscribe(() => {
          this.loadCategories();
        });
      }
    });
  }

  toggleSort(col: string): void {
    if (this.sortBy === col) {
      this.ascending = !this.ascending;
    } else {
      this.sortBy = col;
      this.ascending = true;
    }
    this.search();
  }

  logout() {
    alert("Déconnexion !");
  }
}
