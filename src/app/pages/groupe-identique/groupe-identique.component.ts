import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupeIdentiqueService } from '../../services/groupe-identique.service'; // chemin corrigé

@Component({
  selector: 'app-groupe-identique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './groupe-identique.component.html',
  styleUrls: ['./groupe-identique.component.scss']
})
export class GroupeIdentiqueComponent implements OnInit {
  groupesIdentiques: any[] = [];
  organes: any[] = [];
  caracteristiques: any[] = [];
  searchTerm: string = '';
  sortBy: string = 'idgroupe';
  ascending: boolean = true;
  showForm: boolean = false;
  formData: any = { id: null, designation: '', selectedOrganes: [], selectedCaracteristiques: [] };

  profileOpen = false;
  username = 'Utilisateur';
  isDropdownOpen = false;

  constructor(private groupeIdentiqueService: GroupeIdentiqueService) {}

  ngOnInit(): void {
    this.loadGroupesIdentiques();
    this.loadOrganes();
    this.loadCaracteristiques();
  }

  loadGroupesIdentiques() {
    this.groupeIdentiqueService.getAll(this.searchTerm, this.sortBy, this.ascending)
      .subscribe((data: any[]) => {
        this.groupesIdentiques = data;
      });
  }

  loadOrganes() {
    this.groupeIdentiqueService.getAllOrganes()
      .subscribe((data: any[]) => {
        this.organes = data;
      });
  }

  loadCaracteristiques() {
    this.groupeIdentiqueService.getAllCaracteristiques()
      .subscribe((data: any[]) => {
        this.caracteristiques = data;
      });
  }

  search() {
    this.loadGroupesIdentiques();
  }

  toggleSort(field: string) {
    this.ascending = !this.ascending;
    this.loadGroupesIdentiques();
  }

  openForm(groupe: any) {
    this.formData = { 
      id: groupe.id,
      designation: groupe.designation,
      selectedOrganes: groupe.organes.map((organe: any) => organe.id),
      selectedCaracteristiques: groupe.caracteristiques.map((carac: any) => carac.id)
    };
    this.showForm = true;
  }
  
  closeForm() {
    this.showForm = false;
  }

  updateGroupeIdentique() {
    if (!this.formData.designation || this.formData.selectedOrganes.length === 0 || this.formData.selectedCaracteristiques.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const updatedData = {
      designation: this.formData.designation,
      organes: this.formData.selectedOrganes,
      caracteristiques: this.formData.selectedCaracteristiques
    };
    this.groupeIdentiqueService.update(this.formData.id, updatedData).subscribe(() => {
      this.closeForm();
      this.loadGroupesIdentiques();
    });
  }
  

  deleteGroupe(groupe: any) {
    this.groupeIdentiqueService.canDelete(groupe.id).subscribe(can => {
      if (!can) {
        alert("Impossible de supprimer ce groupe, il est utilisé par un équipement.");
        return;
      }
      if (confirm("Voulez-vous vraiment supprimer ce groupe ?")) {
        this.groupeIdentiqueService.delete(groupe.id).subscribe(() => this.loadGroupesIdentiques());
      }
    });
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

  logout() {
    alert("Déconnexion !");
  }
}
