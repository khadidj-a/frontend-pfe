import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { UserDialogComponent } from '../../user-dialog/user-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  searchTerm = '';
  users: any[] = [];
  filteredUsers: any[] = [];
  message: string = '';
  error: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  roleMap: { [key: number]: string } = {
    1: 'Admin IT',
    2: 'Admin Métier',
    3: 'Responsable Unité'
  };

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map((u: any) => ({
          ...u,
          role: this.roleMap[u.idrole] || 'Inconnu'
        }));
        this.filteredUsers = this.users;
      },
      error: () => this.error = "Erreur de chargement des utilisateurs."
    });
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.nom.toLowerCase().includes(term) ||
      user.prenom.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user: {}, mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((newUser) => {
      if (newUser) {
        this.handleAddUser(newUser);
      }
    });
  }

  editUser(user: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { user, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe((updatedUser) => {
      if (updatedUser) {
        this.updateUser(updatedUser);
      }
    });
  }

  handleAddUser(user: any) {
    this.userService.checkEmailExists(user.email).subscribe({
      next: (exists: boolean) => {
        if (exists) {
          this.showError("❌ Cet email est déjà utilisé.");
        } else {
          this.userService.createUser(user).subscribe({
            next: () => {
              this.loadUsers();
              this.showMessage("✅ Utilisateur ajouté avec succès.");
            },
            error: () => this.showError("❌ Erreur lors de l'ajout de l'utilisateur.")
          });
        }
      },
      error: () => this.showError("❌ Erreur lors de la vérification de l'email.")
    });
  }
  
  updateUser(user: any) {
    this.userService.updateUser(user.iduser, user).subscribe({
      next: () => {
        this.loadUsers();
        this.showMessage("✅ Utilisateur modifié avec succès.");
      },
      error: () => this.showError("❌ Erreur lors de la modification.")
    });
  }

  toggleUserStatus(user: any) {
    const action = user.actif === '1' ? 'désactiver' : 'activer';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmation',
        message: `Voulez-vous vraiment ${action} ${user.nom} ${user.prenom} ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const updatedStatus = user.actif === '1' ? '0' : '1';
        this.userService.toggleUserStatus(user.iduser, updatedStatus).subscribe({
          next: () => {
            this.loadUsers();
            this.showMessage(`✅ Utilisateur ${action} avec succès.`);
          },
          error: () => this.showError("❌ Erreur lors du changement de statut.")
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  showMessage(message: string) {
    this.message = message;
    this.error = '';
    setTimeout(() => this.message = '', 3000);
  }

  showError(error: string) {
    this.error = error;
    this.message = '';
    setTimeout(() => this.error = '', 3000);
  }

  clearMessages() {
    this.message = '';
    this.error = '';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
