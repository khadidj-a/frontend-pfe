export interface GroupeIdentiqueDTO {
  id: number;
  CodeGrp:string;
  idmarque:number;
  idtype:number;
  marqueNom: string;
  typeEquipNom: string;
  organes: string[];
  caracteristiques: string[];
}

export interface UpdateGroupeIdentiqueDTO {
  designation: string;
  id_organes: number[];
  id_caracteristiques: number[];
}



export interface GroupeOrgane {
  id_organe: number;
  libelle_organe: string;
}

export interface GroupeCaracteristique {
  id_caracteristique: number;
  libelle: string;
}
