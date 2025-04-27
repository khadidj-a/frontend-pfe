import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'marque',
    pathMatch: 'full'
  },
  {
    path: 'marque',
    loadComponent: () =>
      import('./pages/marque/marque.component').then((m) => m.MarqueComponent),
  },
  {
    path: 'typeeq',
    loadComponent: () =>
      import('./pages/typeeq/typeeq.component').then((m) => m.TypeEqptComponent),
  },
  {
    path: 'unite',
    loadComponent: () =>
      import('./pages/unite/unite.component').then((m) => m.UniteComponent),
  },
  {
    path: 'caracteristique',
    loadComponent: () =>
      import('./pages/caracteristique/caracteristique.component').then((m) => m.CaracteristiqueComponent),
  },
  {
    path: 'organe',
    loadComponent: () =>
      import('./pages/organe/organe.component').then((m) => m.OrganeComponent),
  },
  {
    path: 'categorie',
    loadComponent: () =>
      import('./pages/categorie/categorie.component').then((m) => m.CategorieComponent),
  },
  {
    path: 'groupeidentique',
    loadComponent: () =>
      import('./pages/groupe-identique/groupe-identique.component').then((m) => m.GroupeIdentiqueComponent),
  }
];
