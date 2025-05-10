// === services/pret.service.ts ===
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pret, CreatePretDTO } from '../models/pret.model';

@Injectable({ providedIn: 'root' })
export class PretService {
  private apiUrl = 'http://localhost:5186/api/Pret';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // ✅ utilisée dans pret-management.component.ts
  getAllPrets(): Observable<Pret[]> {
    return this.http.get<Pret[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createPret(dto: CreatePretDTO): Observable<Pret> {
    return this.http.post<Pret>(this.apiUrl, dto, { headers: this.getHeaders() });
  }

  getPretById(id: number): Observable<Pret> {
    return this.http.get<Pret>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
