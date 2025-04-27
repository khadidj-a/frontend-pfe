export interface Caracteristique {
    idcaracteristique: number;
    nomcaracteristique: string;
  }
  
  export interface Marque {
    idmarque: number;
    nommarque: string;
  }
  
  export interface Organe {
    id_organe: number;
    code_organe: string;
    libelle_organe: string;
    id_marque: number;
    nom_marque: string;
    caracteristiques: Caracteristique[];
  }
  