import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupeIdentiqueDTO, UpdateGroupeIdentiqueDTO } from '../../models/groupe-identique.model';
import { GroupeIdentiqueService } from '../../services/groupe-identique.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groupe-identique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groupe-identique.component.html',
  styleUrls: ['./groupe-identique.component.scss']
})
export class GroupeIdentiqueComponent implements OnInit {
  groupes: GroupeIdentiqueDTO[] = [];
  searchTerm: string = '';
  sortBy: string = 'designation';
  ascending: boolean = true;
  showForm: boolean = false;
  profileOpen: boolean = false;
  isDropdownOpen: boolean = false;
  username: string = 'Admin';
  selectedGroupeId!: number;
  showDeleteConfirm = false;
groupeToDelete: GroupeIdentiqueDTO | null = null;

showLogoutConfirm = false;

  groupe = {
    designation: '',
    idType: 0,
    idMarque: 0,
    caracteristiques: [] as number[],
    organes: [] as number[]
  };

  marques: any[] = [];
  types: any[] = [];
  caracteristiques: any[] = [];
  organes: any[] = [];

  constructor(private service: GroupeIdentiqueService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
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
 
  loadData() {
    this.service.GetAll().subscribe({
      next: data => {
        console.log("Groupe Identique chargées :", data);
        this.groupes = data;
      },
      error: err => console.error("Erreur chargement caractéristiques :", err)
    });
  }
  
  
  loadCaracteristiquesEtOrganes() {
    if (this.groupe.idType && this.groupe.idMarque) {
      // Charger les caractéristiques et organes en fonction de la marque et du type
      this.service.getCaracteristiquesByMarqueEtType(this.groupe.idMarque, this.groupe.idType)
        .subscribe(data => {
          this.caracteristiques = data;
          console.log('Caractéristiques chargées:', data);
        });
      this.service.getOrganesByMarqueEtType(this.groupe.idMarque, this.groupe.idType)
        .subscribe(data => {
          this.organes = data;
          console.log('Organes chargés:', data);
        });
    }
  }
  

  toggleCarac(id: number) {
    const index = this.groupe.caracteristiques.indexOf(id);
    if (index > -1) this.groupe.caracteristiques.splice(index, 1);
    else this.groupe.caracteristiques.push(id);
  }

  toggleOrgane(id: number) {
    const index = this.groupe.organes.indexOf(id);
    if (index > -1) this.groupe.organes.splice(index, 1);
    else this.groupe.organes.push(id);
  }

  onSearch() {
    this.loadData();
  }

  toggleSort(column: string) {
    if (this.sortBy === column) {
      this.ascending = !this.ascending;
    } else {
      this.sortBy = column;
      this.ascending = true;
    }
    this.loadData();
  }
  save() {
    const dto: UpdateGroupeIdentiqueDTO = {
      designation: this.groupe.designation,
      id_caracteristiques: this.groupe.caracteristiques,
      id_organes: this.groupe.organes
    };
  
    const id = this.selectedGroupeId || 0;
  
    this.service.update(id, dto).subscribe(() => {
      alert("Groupe enregistré avec succès !");
      this.loadData();
      this.showForm = false;
    }, error => {
      alert("Une erreur s'est produite lors de l'enregistrement.");
    });
  }
  

  openForm() {
    this.showForm = true;
  }
  closeForm() {
    this.showForm = false;// <==== ajoute ça !
  }
  edit(id: number) {
    this.selectedGroupeId = id;
    this.service.getById(id).subscribe((groupe: any) => {
      this.groupe = {
        designation: groupe.designation,
        idType: groupe.idType,
        idMarque: groupe.idMarque,
        caracteristiques: groupe.id_caracteristiques || [],
        organes: groupe.id_organes || []
      };
      this.loadCaracteristiquesEtOrganes();
      this.showForm = true;
    });
  }

  delete(id: number) {
    this.service.canDelete(id).subscribe((canDelete: boolean) => {
      if (!canDelete) {
        alert('Impossible de supprimer ce groupe : il est utilisé.');
        return;
      }
      if (confirm('Supprimer ce groupe ?')) {
        this.service.delete(id).subscribe(() => this.loadData());
      }
    });
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

}
