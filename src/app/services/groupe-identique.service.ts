import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupeIdentiqueService {
  private baseUrl = 'http://localhost:5186/api/groupeidentique';

  constructor(private http: HttpClient) {}

  getAll(searchTerm: string = '', sortBy: string = '', ascending: boolean = true): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?searchTerm=${searchTerm}&sortBy=${sortBy}&ascending=${ascending}`);
  }

  getAllOrganes(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5186/api/organe`);
  }

  getAllCaracteristiques(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5186/api/caracteristique`);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
    canDelete(id: number): Observable<boolean> {
      return this.http.get<boolean>(`${this.baseUrl}/CanDelete/${id}`);
     }
}
