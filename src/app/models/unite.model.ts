export interface Wilaya {
    idwilaya: number;
    nomwilaya: string;
  }
  
  export interface Region {
    idregion: number;
    nomregion: string;
  }
  
  export interface Unite {
    idunite: number;
    codeunite: string;
    designation: string;
    idwilaya: number;
    nomwilaya: string; // ✅ Ajouté
    idregion: number;
    nomregion: string; // ✅ Ajouté
  }
  
  
  
  