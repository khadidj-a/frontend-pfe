export interface GroupeIdentique {
    id: number;
    designation: string;
    marqueNom: string;
    typeEquipNom: string;
    organes: number[];  // Changement de string[] à number[]
    caracteristiques: number[];  // Changement de string[] à number[]
  }
  
  // Interface UpdateGroupeIdentique
  export interface UpdateGroupeIdentique {
    designation: string;
    id_organes: number[];
    id_caracteristiques: number[];
  }
  