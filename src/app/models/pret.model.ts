
// === models/pret.model.ts ===
export interface Pret {
    idpret: number;
    ideqpt: number;
    idunite: number;
    duree: number;
    datepret: string;
    iduniteemt?: number;
  }
  export interface CreatePretDTO {
    ideqpt: number;
    idunite: number;
    duree: number;
    datepret: string;
  }
  