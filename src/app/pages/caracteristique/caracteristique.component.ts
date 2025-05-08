import { Component, OnInit,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaracteristiqueService } from '../../services/caracteristique.service';
import { Caracteristique } from '../../models/caracteristique.model';

@Component({
  selector: 'app-caracteristique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caracteristique.component.html',
  styleUrls: ['./caracteristique.component.scss']
})
export class CaracteristiqueComponent implements OnInit {
  caracteristiques: Caracteristique[] = [];
  selectedCar: Caracteristique | null = null;
  libelle_input = '';
  searchTerm = '';
  sortBy = 'id_caracteristique';
  ascending = true;
  showForm = false;
  profileOpen = false;
  username = 'Utilisateur';
 isDropdownOpen = false;
showDeleteConfirm = false;
categorieToDelete: Caracteristique | null = null;
caracteristiqueCount: number = 0;
showLogoutConfirm = false;

  constructor(private carService: CaracteristiqueService) {}

  ngOnInit(): void {
    this.loadCaracteristiques();
    
    this.getCaracteristiqueCount();
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


  loadCaracteristiques() {
    this.carService.getAll(this.searchTerm, this.sortBy, this.ascending)
      .subscribe((data: Caracteristique[]) => {
        this.caracteristiques = data;
        console.log("Caractéristiques chargées :", data); // debug
      });
  }
  

  search() {
    this.loadCaracteristiques();
  }

  openForm(car?: Caracteristique): void {
    this.selectedCar = car || null;
    this.libelle_input = car ? car.libelle : '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedCar = null;
    this.libelle_input = '';
  }

  saveCaracteristique(): void {
     if (!this.libelle_input ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const data: Caracteristique = {
      id_caracteristique: this.selectedCar?.id_caracteristique || 0,
      libelle: this.libelle_input
    };

    if (this.selectedCar) {
      this.carService.update(this.selectedCar.id_caracteristique, data).subscribe(() => {
        this.loadCaracteristiques();
        this.closeForm();
      });
    } else {
      this.carService.add(data).subscribe(() => {
        this.loadCaracteristiques();
        this.closeForm();
      });
    }
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
 
  // Supprimer l'ancienne mauvaise méthode deleteCaracteristique
deleteCaracteristique(car: Caracteristique): void {
  this.carService.canDelete(car.id_caracteristique).subscribe(canDelete => {
    if (!canDelete) {
      alert("Cette caractéristique est utilisée dans un équipement. Suppression impossible.");
      return;
    }
    this.categorieToDelete = car;
    this.showDeleteConfirm = true;
  });
}

confirmDeleteCaracteristique(): void {
  if (this.categorieToDelete) {
    this.carService.delete(this.categorieToDelete.id_caracteristique).subscribe(() => {
      this.loadCaracteristiques();
      this.categorieToDelete = null;
      this.showDeleteConfirm = false;
    });
  }
}

cancelDeleteCaracteristique(): void {
  this.categorieToDelete = null;
  this.showDeleteConfirm = false;
}

  
   logout() {
     this.showLogoutConfirm = true;
   }
   
   confirmLogout() {
     this.showLogoutConfirm = false;
     // redirige vers login ou autre action
     window.location.href = "/login"; // ou un appel à AuthService.logout()
   }
   
   cancelLogout() {
     this.showLogoutConfirm = false;
   }
   getCaracteristiqueCount() {
    this.carService.getCaracteristiqueCount().subscribe(count => {
    this.caracteristiqueCount = count;
  });
}

}
