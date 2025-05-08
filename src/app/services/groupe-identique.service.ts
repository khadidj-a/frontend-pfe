import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupeIdentiqueDTO, UpdateGroupeIdentiqueDTO,GroupeCaracteristique,GroupeOrgane } from '../models/groupe-identique.model';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class GroupeIdentiqueService {
  private baseUrl = 'http://localhost:5186/api/GroupeIdentique';

  constructor(private http: HttpClient) {}

  GetAll(searchTerm = '', sortBy = 'id', ascending = true): Observable<GroupeIdentiqueDTO[]> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('sortBy', sortBy)
      .set('ascending', ascending);

    return this.http.get<GroupeIdentiqueDTO[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<GroupeIdentiqueDTO> {
    return this.http.get<GroupeIdentiqueDTO>(`${this.baseUrl}/${id}`);
  }

  update(id: number, dto: UpdateGroupeIdentiqueDTO): Observable<GroupeIdentiqueDTO> {
    return this.http.put<GroupeIdentiqueDTO>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  canDelete(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/canDelete/${id}`);
  }
  getOrganesByMarqueEtType(marqueId: number, typeId: number): Observable<GroupeOrgane[]> {
    return this.http.get<GroupeOrgane[]>(
      `http://localhost:5186/api/organe/type/${typeId}/marque/${marqueId}`
    );
  }

  //  Obtenir les caractéristiques liées à une marque et un type d'équipement
  getCaracteristiquesByMarqueEtType(marqueId: number, typeId: number): Observable<GroupeCaracteristique[]> {
    return this.http.get<GroupeCaracteristique[]>(
      `http://localhost:5186/api/caracteristique/type/${typeId}/marque/${marqueId}`
    );
  }
  getGroupeCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }
}
