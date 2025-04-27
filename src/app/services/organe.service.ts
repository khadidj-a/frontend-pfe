import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organe, Caracteristique, Marque } from '../models/organe.model';

@Injectable({
  providedIn: 'root'
})
export class OrganeService {
  private baseUrl = 'http://localhost:5186/api/organe';

  constructor(private http: HttpClient) {}

  getOrganes(search = '', sortBy = 'id_organe', ascending = true): Observable<Organe[]> {
    const params = new HttpParams()
      .set('search', search)
      .set('sortBy', sortBy)
      .set('ascending', ascending.toString());
    return this.http.get<Organe[]>(`${this.baseUrl}`, { params }); // PAS de /all
  }
  
  createOrgane(data: {
    code_organe: string;
    libelle_organe: string;
    id_marque: number;
    id_caracteristiques: number[];
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  updateOrgane(id: number, data: {
    code_organe: string;
    libelle_organe: string;
    id_marque: number;
    id_caracteristiques: number[];
  }): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data);
  }

  deleteOrgane(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  getCaracteristiques(): Observable<Caracteristique[]> {
    return this.http.get<Caracteristique[]>(`http://localhost:5186/api/caracteristique`);
  }

  getMarques(): Observable<Marque[]> {
    return this.http.get<Marque[]>(`http://localhost:5186/api/marque`);
  }
  canDelete(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/canDelete/${id}`);
  }
  
}
